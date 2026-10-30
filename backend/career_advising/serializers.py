from rest_framework import serializers

from .domain.appointment_rules import MEETING_TYPES


class CreateAppointmentIn(serializers.Serializer):
    slot_id = serializers.IntegerField()
    meeting_type = serializers.ChoiceField(choices=list(MEETING_TYPES))
    location = serializers.CharField(required=False, allow_blank=True, max_length=200)


class ApproveIn(serializers.Serializer):
    meeting_link = serializers.URLField(required=False, allow_blank=True)


class CancelIn(serializers.Serializer):
    # blank is accepted here on purpose: the domain rule answers with the standard `reason_required` error
    reason = serializers.CharField(required=False, allow_blank=True, default="")


def appointment_to_dict(appt):
    slot = appt.slot
    return {
        "id": appt.pk,
        "status": appt.status,
        "meeting_type": appt.meeting_type,
        "meeting_link": appt.meeting_link,
        "location": appt.location,
        "slot": {"id": slot.pk, "start": slot.start.isoformat(), "end": slot.end.isoformat()},
        "advisor_name": slot.advisor.user.get_full_name() or slot.advisor.user.get_username(),
        "student_name": appt.student.user.get_full_name() or appt.student.user.get_username(),
        "cancel_reason": appt.cancel_reason,   # endpoints only expose appointments to their two parties (SEC-04)
        "created_at": appt.created_at.isoformat(),
    }
