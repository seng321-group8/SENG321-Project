from django.http import HttpResponse
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from . import appointment_service as svc
from . import matching_service, notifications
from .domain.appointment_rules import CONFIRMED
from .domain.errors import InvalidTransition, NotFound
from .models import Appointment
from .serializers import ApproveIn, CancelIn, CreateAppointmentIn, appointment_to_dict

_RELATED = ("slot__advisor__user", "student__user")


class MatchingView(APIView):
    """POST /api/students/me/matching/  -> assigns the student's permanent advisor (FR-06..08)."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        result = matching_service.run_matching(request.user)
        return Response({"matched": result.matched, "advisor_id": result.advisor_id,
                        "status": "MATCHED" if result.matched else "WAITING"})


class OpenSlotsView(APIView):
    """GET /api/students/me/advisor/slots/  -> free office hours of the student's own advisor (FR-11)."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        slots = svc.list_open_slots(request.user)
        return Response([{"id": s.pk, "start": s.start.isoformat(), "end": s.end.isoformat()} for s in slots])


class AppointmentListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Appointment.objects.select_related(*_RELATED).order_by("-slot__start")
        if hasattr(request.user, "student_profile"):
            qs = qs.filter(student__user=request.user)
        elif hasattr(request.user, "advisor_profile"):
            qs = qs.filter(slot__advisor__user=request.user)
        else:
            qs = qs.none()
        return Response([appointment_to_dict(a) for a in qs])

    def post(self, request):
        data = CreateAppointmentIn(data=request.data)
        data.is_valid(raise_exception=True)
        appt = svc.request_appointment(request.user, **data.validated_data)
        appt = Appointment.objects.select_related(*_RELATED).get(pk=appt.pk)
        return Response(appointment_to_dict(appt), status=status.HTTP_201_CREATED)


class _ActionView(APIView):
    permission_classes = [IsAuthenticated]

    def _respond(self, appt):
        appt = Appointment.objects.select_related(*_RELATED).get(pk=appt.pk)
        return Response(appointment_to_dict(appt))


class ApproveView(_ActionView):
    def post(self, request, pk):
        data = ApproveIn(data=request.data)
        data.is_valid(raise_exception=True)
        return self._respond(svc.approve(request.user, pk, data.validated_data.get("meeting_link")))


class RejectView(_ActionView):
    def post(self, request, pk):
        return self._respond(svc.reject(request.user, pk))


class CancelView(_ActionView):
    def post(self, request, pk):
        data = CancelIn(data=request.data)
        data.is_valid(raise_exception=True)
        return self._respond(svc.cancel(request.user, pk, data.validated_data["reason"]))


class CompleteView(_ActionView):
    def post(self, request, pk):
        return self._respond(svc.mark(request.user, pk, "complete"))


class NoShowView(_ActionView):
    def post(self, request, pk):
        return self._respond(svc.mark(request.user, pk, "no_show"))


class IcsDownloadView(APIView):
    """GET /api/appointments/<id>/ics/  -> backs the "Takvime ekle" button. Only the two parties, only confirmed."""
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            appt = Appointment.objects.select_related(*_RELATED).get(pk=pk)
        except Appointment.DoesNotExist:
            raise NotFound()
        if request.user.id not in (appt.student.user_id, appt.slot.advisor.user_id):
            raise NotFound()
        if appt.status != CONFIRMED:
            raise InvalidTransition("Takvime yalnızca onaylanmış randevular eklenebilir.")
        resp = HttpResponse(notifications.appointment_ics(appt, method="PUBLISH"),
                            content_type="text/calendar; charset=utf-8")
        resp["Content-Disposition"] = f'attachment; filename="randevu-{appt.pk}.ics"'
        return resp
