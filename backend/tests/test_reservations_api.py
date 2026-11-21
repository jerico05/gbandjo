"""Module 5 — tests réservations."""
from datetime import timedelta
from decimal import Decimal

from app.models.enums import ReservationStatus, ValidationStatus

from tests import factories as f
from app.utils import utcnow


def _consumer_token(client, consumer):
    return client.post(
        "/api/auth/login",
        json={"email": consumer.email, "password": "MotDePasse#2"},
    ).get_json()["data"]["access_token"]


def _merchant_token(client, merchant):
    return client.post(
        "/api/auth/login",
        json={"email": merchant.email, "password": "MotDePasse#1"},
    ).get_json()["data"]["access_token"]


def _offer_setup(session):
    merchant = f.create_merchant("res-merchant@gbandjo.tg")
    store = f.create_store(owner=merchant, validation_status=ValidationStatus.VALIDE)
    product = f.create_product(store=store)
    offer = f.create_offer(product=product, available_quantity=2)
    consumer = f.create_consumer("buyer@gbandjo.tg")
    session.commit()
    return merchant, offer, consumer


def test_reservation_confirm_reduit_stock(client, session):
    merchant, offer, consumer = _offer_setup(session)
    consumer_headers = {"Authorization": f"Bearer {_consumer_token(client, consumer)}"}
    merchant_headers = {"Authorization": f"Bearer {_merchant_token(client, merchant)}"}

    create = client.post(
        "/api/consumer/reservations",
        json={"offer_id": offer.id, "quantity": 2},
        headers=consumer_headers,
    )
    assert create.status_code == 201
    created = create.get_json()["data"]["reservation"]
    reservation_id = created["id"]
    assert created["reference"].startswith("GBJ-")

    confirm = client.post(
        f"/api/merchant/reservations/{reservation_id}/confirm",
        headers=merchant_headers,
    )
    assert confirm.status_code == 200
    assert confirm.get_json()["data"]["reservation"]["status"] == "CONFIRMEE"
    session.expire_all()
    session.refresh(offer)
    assert offer.available_quantity == 0


def test_survente_confirm_refusee(client, session):
    merchant, offer, _consumer = _offer_setup(session)
    offer.available_quantity = 1
    session.commit()
    c1 = f.create_consumer("c1@gbandjo.tg")
    c2 = f.create_consumer("c2@gbandjo.tg")
    session.commit()
    headers1 = {"Authorization": f"Bearer {_consumer_token(client, c1)}"}
    headers2 = {"Authorization": f"Bearer {_consumer_token(client, c2)}"}
    merchant_headers = {"Authorization": f"Bearer {_merchant_token(client, merchant)}"}

    r1 = client.post("/api/consumer/reservations", json={"offer_id": offer.id, "quantity": 1}, headers=headers1)
    r2 = client.post("/api/consumer/reservations", json={"offer_id": offer.id, "quantity": 1}, headers=headers2)
    assert r1.status_code == 201 and r2.status_code == 201
    id1 = r1.get_json()["data"]["reservation"]["id"]
    id2 = r2.get_json()["data"]["reservation"]["id"]
    assert client.post(f"/api/merchant/reservations/{id1}/confirm", headers=merchant_headers).status_code == 200
    assert client.post(f"/api/merchant/reservations/{id2}/confirm", headers=merchant_headers).status_code == 409


def test_une_seule_reservation_active_par_offre(client, session):
    _merchant, offer, consumer = _offer_setup(session)
    headers = {"Authorization": f"Bearer {_consumer_token(client, consumer)}"}
    first = client.post(
        "/api/consumer/reservations",
        json={"offer_id": offer.id, "quantity": 1},
        headers=headers,
    )
    assert first.status_code == 201
    second = client.post(
        "/api/consumer/reservations",
        json={"offer_id": offer.id, "quantity": 1},
        headers=headers,
    )
    assert second.status_code == 409


def test_consommateur_modifie_quantite_en_attente(client, session):
    merchant, offer, consumer = _offer_setup(session)
    consumer_headers = {"Authorization": f"Bearer {_consumer_token(client, consumer)}"}
    merchant_headers = {"Authorization": f"Bearer {_merchant_token(client, merchant)}"}
    create = client.post(
        "/api/consumer/reservations",
        json={"offer_id": offer.id, "quantity": 1},
        headers=consumer_headers,
    )
    rid = create.get_json()["data"]["reservation"]["id"]
    update = client.patch(
        f"/api/consumer/reservations/{rid}",
        json={"quantity": 2},
        headers=consumer_headers,
    )
    assert update.status_code == 200
    assert update.get_json()["data"]["reservation"]["quantity"] == 2

    assert client.post(f"/api/merchant/reservations/{rid}/confirm", headers=merchant_headers).status_code == 200
    blocked = client.patch(
        f"/api/consumer/reservations/{rid}",
        json={"quantity": 1},
        headers=consumer_headers,
    )
    assert blocked.status_code == 409


def test_consumer_reservation_detail_avec_commerce(client, session):
    merchant, offer, consumer = _offer_setup(session)
    consumer_headers = {"Authorization": f"Bearer {_consumer_token(client, consumer)}"}
    merchant_headers = {"Authorization": f"Bearer {_merchant_token(client, merchant)}"}
    create = client.post(
        "/api/consumer/reservations",
        json={"offer_id": offer.id, "quantity": 1},
        headers=consumer_headers,
    )
    rid = create.get_json()["data"]["reservation"]["id"]
    detail_before = client.get(f"/api/consumer/reservations/{rid}", headers=consumer_headers)
    assert detail_before.status_code == 200
    body = detail_before.get_json()["data"]["reservation"]
    assert body["store"]["address"]
    assert "latitude" in body["store"]

    assert client.post(f"/api/merchant/reservations/{rid}/confirm", headers=merchant_headers).status_code == 200
    detail = client.get(f"/api/consumer/reservations/{rid}", headers=consumer_headers)
    assert detail.status_code == 200
    assert detail.get_json()["data"]["reservation"]["status"] == "CONFIRMEE"


def test_expiration_reservation(client, session):
    merchant, offer, consumer = _offer_setup(session)
    reservation = f.create_reservation(offer=offer, consumer=consumer)
    reservation.expires_at = utcnow() - timedelta(minutes=1)
    session.commit()
    assert client.post("/internal/expirer-reservations").status_code == 200
    session.refresh(reservation)
    assert reservation.status == ReservationStatus.EXPIREE


def test_consommateur_annule_en_attente(client, session):
    merchant, offer, consumer = _offer_setup(session)
    headers = {"Authorization": f"Bearer {_consumer_token(client, consumer)}"}
    create = client.post(
        "/api/consumer/reservations",
        json={"offer_id": offer.id, "quantity": 1},
        headers=headers,
    )
    rid = create.get_json()["data"]["reservation"]["id"]
    cancel = client.post(f"/api/consumer/reservations/{rid}/cancel", headers=headers)
    assert cancel.status_code == 200
    assert cancel.get_json()["data"]["reservation"]["status"] == "ANNULEE"
