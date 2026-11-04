"""Extension point for the Google Calendar / Meet integration (owned by the integration module).

Set settings.MEET_LINK_PROVIDER = "dotted.path.to.function". The function receives an Appointment and
returns a meeting URL, or None when the advisor has not connected a Google account. In that case the
advisor must paste a Zoom/Meet/Teams link manually when approving (FR-15).
"""
from typing import Optional

from django.conf import settings
from django.utils.module_loading import import_string


def try_create_meet_link(appointment) -> Optional[str]:
    path = getattr(settings, "MEET_LINK_PROVIDER", None)
    if not path:
        return None
    return import_string(path)(appointment)
