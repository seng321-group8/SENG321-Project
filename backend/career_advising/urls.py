from django.urls import path

from . import views

urlpatterns = [
    path("students/me/matching/", views.MatchingView.as_view()),
    path("students/me/advisor/slots/", views.OpenSlotsView.as_view()),
    path("appointments/", views.AppointmentListCreateView.as_view()),
    path("appointments/<int:pk>/approve/", views.ApproveView.as_view()),
    path("appointments/<int:pk>/reject/", views.RejectView.as_view()),
    path("appointments/<int:pk>/cancel/", views.CancelView.as_view()),
    path("appointments/<int:pk>/complete/", views.CompleteView.as_view()),
    path("appointments/<int:pk>/no-show/", views.NoShowView.as_view()),
    path("appointments/<int:pk>/ics/", views.IcsDownloadView.as_view()),
]
