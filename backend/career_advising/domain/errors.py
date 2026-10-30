"""Domain errors. Each carries the HTTP status the API layer must return (NFR-06)."""


class DomainError(Exception):
    status_code = 400
    code = "bad_request"
    default_message = "Geçersiz istek."

    def __init__(self, message=None):
        self.message = message or self.default_message
        super().__init__(self.message)


class InvalidProfile(DomainError):
    status_code = 400
    code = "invalid_profile"
    default_message = "Profil bilgileri geçersiz."


class NotYourAdvisor(DomainError):
    status_code = 403
    code = "not_your_advisor"
    default_message = "Yalnızca kendi danışmanınızın ofis saatlerinden randevu alabilirsiniz."


class InvalidMeetingType(DomainError):
    status_code = 400
    code = "invalid_meeting_type"
    default_message = "Görüşme tipi ONLINE veya IN_PERSON olmalıdır."


class SlotInPast(DomainError):
    status_code = 400
    code = "slot_in_past"
    default_message = "Geçmiş bir ofis saatine randevu alınamaz."


class SlotUnavailable(DomainError):
    status_code = 409
    code = "slot_unavailable"
    default_message = "Bu ofis saati dilimi dolu."


class ActiveAppointmentExists(DomainError):
    status_code = 409
    code = "active_appointment_exists"
    default_message = "Zaten aktif bir randevunuz var."


class ActorNotAllowed(DomainError):
    status_code = 403
    code = "actor_not_allowed"
    default_message = "Bu işlemi yapma yetkiniz yok."


class InvalidTransition(DomainError):
    status_code = 409
    code = "invalid_transition"
    default_message = "Randevu bu durumdayken bu işlem yapılamaz."


class ReasonRequired(DomainError):
    status_code = 400
    code = "reason_required"
    default_message = "İptal için gerekçe yazmalısınız."


class MeetingLinkRequired(DomainError):
    status_code = 400
    code = "meeting_link_required"
    default_message = "Online randevuyu onaylamak için görüşme bağlantısı gerekli."


class NotFound(DomainError):
    status_code = 404
    code = "not_found"
    default_message = "Kayıt bulunamadı."
