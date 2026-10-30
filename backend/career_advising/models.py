import django
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import F, Q

from .domain.appointment_rules import (
    ACTIVE_STATUSES, CANCELLED, COMPLETED, CONFIRMED, IN_PERSON, NO_SHOW, ONLINE, REJECTED, REQUESTED,
)

SLOT_MINUTES = 30
# Django 5.1 renamed CheckConstraint(check=...) to condition=...
_END_AFTER_START = ({"condition": Q(end__gt=F("start"))} if django.VERSION >= (5, 1)
                    else {"check": Q(end__gt=F("start"))})


class Department(models.Model):
    name = models.CharField(max_length=120, unique=True)

    def __str__(self):
        return self.name


class Keyword(models.Model):
    """Managed by the administrator; students/advisors can only pick from this list."""
    name = models.CharField(max_length=80, unique=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class AdvisorProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="advisor_profile")
    department = models.ForeignKey(Department, null=True, blank=True, on_delete=models.SET_NULL)
    keywords = models.ManyToManyField(Keyword, blank=True)
    served_years = models.JSONField(default=list, blank=True, help_text="Hizmet verilen sınıflar, örn. [1, 2, 3, 4]")
    quota = models.PositiveSmallIntegerField(default=30)  # [KARAR] default 30, administrator can change

    def __str__(self):
        return self.user.get_full_name() or self.user.get_username()


class StudentProfile(models.Model):
    NOT_PROFILED, WAITING, MATCHED = "NOT_PROFILED", "WAITING", "MATCHED"
    MATCH_STATUSES = [(NOT_PROFILED, "Profil eksik"), (WAITING, "Eşleşme bekliyor"), (MATCHED, "Eşleşti")]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="student_profile")
    class_year = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(4)])
    department = models.ForeignKey(Department, null=True, on_delete=models.SET_NULL)
    gpa = models.DecimalField(max_digits=3, decimal_places=2,
                              validators=[MinValueValidator(0), MaxValueValidator(4)])  # info only, never scored
    keywords = models.ManyToManyField(Keyword, blank=True)
    advisor = models.ForeignKey(AdvisorProfile, null=True, blank=True, on_delete=models.SET_NULL,
                                related_name="students")
    excluded_advisors = models.ManyToManyField(AdvisorProfile, blank=True, related_name="+")
    match_status = models.CharField(max_length=12, choices=MATCH_STATUSES, default=NOT_PROFILED)

    def __str__(self):
        return self.user.get_full_name() or self.user.get_username()


class OfficeHourSlot(models.Model):
    advisor = models.ForeignKey(AdvisorProfile, on_delete=models.CASCADE, related_name="slots")
    start = models.DateTimeField()
    end = models.DateTimeField()

    class Meta:
        ordering = ["start"]
        constraints = [
            models.CheckConstraint(name="slot_end_after_start", **_END_AFTER_START),
            models.UniqueConstraint(fields=["advisor", "start"], name="uniq_slot_per_advisor_start"),
        ]

    def clean(self):
        if self.start and self.end and (self.end - self.start).total_seconds() != SLOT_MINUTES * 60:
            raise ValidationError("Ofis saati dilimi tam 30 dakika olmalıdır.")


class Appointment(models.Model):
    STATUSES = [(s, s) for s in (REQUESTED, CONFIRMED, REJECTED, CANCELLED, COMPLETED, NO_SHOW)]
    MEETING_TYPES = [(ONLINE, "Online"), (IN_PERSON, "Yüz yüze")]

    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name="appointments")
    slot = models.ForeignKey(OfficeHourSlot, on_delete=models.PROTECT, related_name="appointments")
    status = models.CharField(max_length=10, choices=STATUSES, default=REQUESTED)
    meeting_type = models.CharField(max_length=10, choices=MEETING_TYPES)
    meeting_link = models.URLField(blank=True)
    location = models.CharField(max_length=200, blank=True)
    cancelled_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL,
                                     related_name="+")
    cancel_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    decided_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            # Database is the final arbiter of the 409 rules, even under concurrent requests (NFR-03):
            models.UniqueConstraint(fields=["slot"], condition=Q(status__in=list(ACTIVE_STATUSES)),
                                    name="uniq_active_appointment_per_slot"),
            models.UniqueConstraint(fields=["student"], condition=Q(status__in=list(ACTIVE_STATUSES)),
                                    name="uniq_active_appointment_per_student"),
        ]
