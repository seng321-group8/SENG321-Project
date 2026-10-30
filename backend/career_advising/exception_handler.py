"""One error shape for the whole API (NFR-06):  {"error": {"code": "...", "message": "...", "details"?: ...}}
Register in settings:  REST_FRAMEWORK = {"EXCEPTION_HANDLER": "career_advising.exception_handler.api_exception_handler"}"""
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import exception_handler

from .domain.errors import DomainError


def api_exception_handler(exc, context):
    if isinstance(exc, DomainError):
        return Response({"error": {"code": exc.code, "message": exc.message}}, status=exc.status_code)
    response = exception_handler(exc, context)
    if response is not None and isinstance(exc, ValidationError):
        response.data = {"error": {"code": "validation_error", "message": "Geçersiz veri.", "details": response.data}}
    return response
