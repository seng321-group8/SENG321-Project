# Sequence: Randevu ve Danışman Değişikliği

> Issue #68 · İnceleyenler: Nil, Fatima

## 1. Randevu: talep → onay → .ics e-postası

```mermaid
sequenceDiagram
    actor S as Öğrenci
    participant API as Backend API
    participant DB as Veritabanı
    participant Mail as E-posta Servisi
    actor A as Danışman

    S->>API: POST /appointments (officeHourId, startAt, topic)
    API->>DB: Slot müsait mi? (çakışma kontrolü)
    alt slot dolu
        API-->>S: 409 Conflict
    else müsait
        API->>DB: INSERT appointment (status=REQUESTED)
        API->>Mail: Danışmana yeni talep bildirimi
        API-->>S: 201 Created (REQUESTED)
    end

    A->>API: PATCH /appointments/{id}/confirm
    API->>DB: status=CONFIRMED
    API->>API: .ics dosyası oluştur
    API->>Mail: Öğrenci + danışmana .ics eki ile e-posta
    API-->>A: 200 OK

    opt Danışman reddederse
        A->>API: PATCH /appointments/{id}/reject (reason)
        API->>DB: status=REJECTED
        API->>Mail: Öğrenciye ret bildirimi
    end
```

## 2. İptal ve 30 dk kilidi

Randevu başlangıcına 30 dakika veya daha az kaldıysa iptal edilemez.

```mermaid
sequenceDiagram
    actor U as Öğrenci / Danışman
    participant API as Backend API
    participant DB as Veritabanı
    participant Mail as E-posta Servisi

    U->>API: DELETE /appointments/{id}
    API->>DB: Randevuyu getir
    alt status CONFIRMED/REQUESTED değil
        API-->>U: 409 Conflict
    else startAt - now <= 30 dk
        API-->>U: 422 Cancellation locked (30 dk kuralı)
    else iptal edilebilir
        API->>DB: status=CANCELLED, cancelled_at=now
        API->>Mail: Karşı tarafa iptal + .ics CANCEL
        API-->>U: 200 OK
    end
```

## 3. Danışman değişikliği talebi ve yeniden eşleştirme

```mermaid
sequenceDiagram
    actor S as Öğrenci
    participant API as Backend API
    participant DB as Veritabanı
    participant M as Eşleştirme Servisi
    actor AD as Yönetici
    participant Mail as E-posta Servisi

    S->>API: POST /change-requests (reason, requestedAdvisorId?)
    API->>DB: Bekleyen talep var mı?
    alt zaten PENDING var
        API-->>S: 409 Conflict
    else yok
        API->>DB: INSERT change_request (PENDING)
        API->>Mail: Yöneticiye bildirim
        API-->>S: 201 Created
    end

    AD->>API: PATCH /change-requests/{id}/approve
    API->>DB: status=APPROVED
    API->>M: Yeniden eşleştirme başlat (trigger=CHANGE_REQUEST)
    M->>DB: INSERT matching_run (RUNNING)
    M->>DB: İlgi alanı + kontenjan ile skorla
    M->>DB: INSERT matching_results, run=COMPLETED
    M-->>API: Önerilen danışman
    API->>DB: students.advisor_id güncelle
    API->>DB: Eski danışmanla REQUESTED/CONFIRMED randevuları CANCELLED
    API->>Mail: Öğrenci, eski ve yeni danışmana bildirim
    API-->>AD: 200 OK

    opt Reddedilirse
        AD->>API: PATCH /change-requests/{id}/reject
        API->>DB: status=REJECTED
        API->>Mail: Öğrenciye bildirim
    end
```

## 4. Randevu durum diyagramı

```mermaid
stateDiagram-v2
    [*] --> REQUESTED : öğrenci talep eder
    REQUESTED --> CONFIRMED : danışman onaylar
    REQUESTED --> REJECTED : danışman reddeder
    REQUESTED --> CANCELLED : iptal (30 dk kuralı)
    CONFIRMED --> CANCELLED : iptal (30 dk kuralı)
    CONFIRMED --> COMPLETED : görüşme yapıldı
    CONFIRMED --> NO_SHOW : öğrenci gelmedi
    REJECTED --> [*]
    CANCELLED --> [*]
    COMPLETED --> [*]
    NO_SHOW --> [*]
```
