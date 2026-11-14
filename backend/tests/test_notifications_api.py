"""Module 6 — tests notifications."""
from app.models import Notification

from tests import factories as f


def test_lister_et_marquer_notifications(client, session):
    consumer = f.create_consumer("notif-db@gbandjo.tg")
    reservation = f.create_reservation(consumer=consumer)
    session.add(
        Notification(
            recipient_id=consumer.id,
            reservation_id=reservation.id,
            type="RESERVATION_CONFIRMEE",
            message="Test",
        )
    )
    session.add(
        Notification(
            recipient_id=consumer.id,
            reservation_id=reservation.id,
            type="RESERVATION_REJETEE",
            message="Autre",
            is_read=True,
        )
    )
    session.commit()
    headers = {
        "Authorization": f"Bearer {client.post('/api/auth/login', json={'email': consumer.email, 'password': 'MotDePasse#2'}).get_json()['data']['access_token']}"
    }

    liste = client.get("/api/notifications?page=1&per_page=10", headers=headers)
    assert liste.status_code == 200
    corps = liste.get_json()["data"]
    assert corps["pagination"]["total"] == 2
    assert corps["unread_count"] == 1
    notif_id = [n for n in corps["notifications"] if not n["is_read"]][0]["id"]

    assert client.post(f"/api/notifications/{notif_id}/read", headers=headers).status_code == 200
    assert client.get("/api/notifications?unread_only=true", headers=headers).get_json()["data"]["notifications"] == []
    assert client.post("/api/notifications/read-all", headers=headers).status_code == 200
