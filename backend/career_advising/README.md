# career_advising — Uygulama ve Entegrasyon modülü (Bölüm 6)

Kapsam: **kural tabanlı eşleştirme servisi**, **ofis saati / randevu akışı** ve **e-posta + .ics takvim entegrasyonu**.
Yığın: Django + Django REST Framework (rapordaki 2.1.1 ile aynı; Spring Boot yerine bu seçildi).

## Yapı

```
domain/                   Saf Python, Django'ya bağımlı değil, burada test edildi
  matching.py             Puanlama + danışman seçimi
  appointment_rules.py    409/403/400 kuralları + durum makinesi
  ics.py                  RFC 5545 .ics üretici (UTC, kaçışlama, 75 oktet katlama)
  errors.py               Hata sınıfları (HTTP kodlarıyla)
models.py                 Profil, ofis saati, randevu + DB kısıtları
matching_service.py       Eşleştirme: DB'den aday yükle, kuralı uygula, kaydet; danışman değişikliği sonrası yeniden eşleştirme
appointment_service.py    Talep / onay / red / iptal / tamamlandı / gelmedi (transaction + satır kilidi)
notifications.py          E-postalar + .ics eki
integrations.py           Google Meet bağlantısı için kanca (başka modül dolduracak)
views.py, urls.py, serializers.py, exception_handler.py
frontend/AddToCalendarButton.jsx   "Takvime ekle" düğmesi (React + Tailwind)
tests/                    33 saf mantık testi + Django entegrasyon testleri
```

## Kurulum

1. Projeye ekle: `INSTALLED_APPS += ["rest_framework", "career_advising"]`
2. `REST_FRAMEWORK = {"EXCEPTION_HANDLER": "career_advising.exception_handler.api_exception_handler"}`
3. `path("api/", include("career_advising.urls"))`
4. Ayarlar: `TIME_ZONE = "Europe/Istanbul"`, `USE_TZ = True`, `DEFAULT_FROM_EMAIL`, e-posta backend'i, `FRONTEND_URL`
5. `python manage.py makemigrations career_advising && python manage.py migrate`
6. İsteğe bağlı: `MEET_LINK_PROVIDER = "yol.google_meet.create_link"` (Appointment alıp URL ya da `None` döndüren fonksiyon)

Rol belirleme profil varlığına göre yapılır (`student_profile` / `advisor_profile`); e-posta biçimine göre rol atayan kayıt modülü bu profilleri oluşturmalıdır.
Veritabanı: PostgreSQL (kısmi benzersiz kısıtlar için; SQLite da çalışır).

## Uç noktalar

| Yöntem | Yol | Açıklama | İlgili FR |
|---|---|---|---|
| POST | `/api/students/me/matching/` | Danışman ata (zaten atanmışsa değiştirmez) | FR-06, 07, 08 |
| GET | `/api/students/me/advisor/slots/` | Kendi danışmanının boş, gelecekteki dilimleri | FR-11 |
| POST | `/api/appointments/` | `{slot_id, meeting_type, location?}` talep gönder | FR-11, 12, 13 |
| GET | `/api/appointments/` | Kendi randevuları (öğrenci veya danışman) | FR-20 |
| POST | `/api/appointments/{id}/approve/` | `{meeting_link?}` onayla | FR-14, 15 |
| POST | `/api/appointments/{id}/reject/` | Reddet | FR-14 |
| POST | `/api/appointments/{id}/cancel/` | `{reason}` gerekçeli iptal (iki taraf) | FR-17 |
| POST | `/api/appointments/{id}/complete/`, `/no-show/` | Danışman işaretler (slot bittikten sonra) | FR-18 |
| GET | `/api/appointments/{id}/ics/` | "Takvime ekle" indirmesi (yalnızca onaylı, yalnızca iki taraf) | FR-19 |

Hata biçimi: `{"error": {"code": "slot_unavailable", "message": "..."}}`

| Durum | Kod | Ne zaman |
|---|---|---|
| 409 | `slot_unavailable` | Dilim dolu (talep veya onaylı randevu var) |
| 409 | `active_appointment_exists` | Öğrencinin zaten aktif (Talep edildi / Onaylandı) randevusu var |
| 403 | `not_your_advisor` | Başka danışmanın dilimi veya eşleşmemiş öğrenci |
| 400 | `slot_in_past`, `invalid_meeting_type`, `reason_required`, `meeting_link_required`, `validation_error` | Geçersiz girdi |
| 409 | `invalid_transition` | Duruma uymayan işlem (ör. iki kez onay) |

## Önemli tasarım kararları

- **Eşleştirme formülü** birebir spesifikasyondaki gibidir. Not ortalaması girdide **yoktur**, puanı etkileyemez. Eşitlikte az öğrencisi olan, o da eşitse en küçük danışman id'si seçilir (aynı girdi, aynı sonuç).
- **Aktif randevu = Talep edildi veya Onaylandı.** Bekleyen talep dilimi kilitler ve öğrencinin tek aktif randevu hakkını kullanır. Reddedilen / iptal edilen randevu dilimi serbest bırakır.
- **Eşzamanlılık:** satır kilitleri + iki kısmi benzersiz DB kısıtı (`slot`, `student`). Aynı anda gelen iki istekten yalnızca biri başarılı olur, diğeri 409 alır.
- **E-postalar:** talepte danışmana .ics'siz bildirim gider. Onayda hem öğrenciye hem danışmana `METHOD:REQUEST` .ics gider. Onaylı randevu iptalinde `METHOD:CANCEL` .ics gider (takvimden siler). Mail gönderimi `on_commit` içindedir; SMTP hatası randevuyu geri almaz.
- **Danışman değişikliği (FR-26/27):** `matching_service.reassign_after_change_approval(student_profile_id)` onay modülünden çağrılır. Mevcut danışman hariç tutulur. Başka uygun danışman yoksa öğrenci mevcut danışmanında kalır ve hiçbir randevu iptal edilmez. Varsa eski danışmanla gelecekteki aktif randevular iptal edilir, iki tarafa e-posta gider. Eski danışman, **yalnızca gerçekten yeni danışman bulunursa** o öğrenci için kalıcı olarak hariç tutulur (**ekip onayı gereken varsayım**).

## Kararı bekleyen / yapılmayan işler

- **[KARAR]** Yanıtlanmayan talebin otomatik düşme süresi ve randevu hatırlatması: yapılmadı.
- **[KARAR]** Son iptal zamanı (randevuya X saat kala): kural eklenmedi, her zaman iptal edilebilir.
- E-posta için yeniden deneme / outbox (NFR-05): yok; hata yalnızca loglanır. Üretimde Celery veya outbox tablosu önerilir.
- Google OAuth ve Meet bağlantısı üretimi bu modülde yok; `integrations.py` kancası hazır.
- Danışman ofis saati girişi (CRUD) bu modülde yok. Modelde `OfficeHourSlot` ve 30 dk doğrulaması hazır.

## Testler

```
# saf mantık (Django gerekmez), kök dizinden:
python -m unittest discover -s career_advising/tests -t .
# Django entegrasyonu (proje içinde):
python manage.py test career_advising
```
