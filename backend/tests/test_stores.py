"""Module 3 — tests commerces."""
from app.models.enums import ValidationStatus

from tests import factories as f

STORE_PAYLOAD = {
    "name": "Épicerie du Port",
    "activity_type": "Épicerie",
    "address": "Rue du Port, Lomé",
    "latitude": 6.13,
    "longitude": 1.22,
    "phone": "90112233",
}


def _merchant_token(client, email="store@gbandjo.tg"):
    client.post(
        "/api/auth/register/merchant",
        json={
            "last_name": "Marchand",
            "first_name": "Test",
            "email": email,
            "password": "MotDePasse#1",
        },
    )
    return client.post(
        "/api/auth/login",
        json={"email": email, "password": "MotDePasse#1"},
    ).get_json()["data"]["access_token"]


def _admin_token(client, session):
    admin = f.create_admin("admin-stores@gbandjo.tg")
    session.commit()
    return client.post(
        "/api/auth/login",
        json={"email": admin.email, "password": "MotDePasse#Admin"},
    ).get_json()["data"]["access_token"]


def test_creer_et_consulter_commerce(client):
    token = _merchant_token(client)
    headers = {"Authorization": f"Bearer {token}"}
    creation = client.post("/api/stores/me", json=STORE_PAYLOAD, headers=headers)
    assert creation.status_code == 201
    corps = creation.get_json()["data"]["store"]
    assert corps["validation_status"] == "EN_ATTENTE"
    assert corps["name"] == STORE_PAYLOAD["name"]

    lecture = client.get("/api/stores/me", headers=headers)
    assert lecture.status_code == 200
    assert lecture.get_json()["data"]["store"]["id"] == corps["id"]


def test_double_commerce_refuse(client):
    """RG1 — un seul commerce par commerçant."""
    token = _merchant_token(client, "double@gbandjo.tg")
    headers = {"Authorization": f"Bearer {token}"}
    assert client.post("/api/stores/me", json=STORE_PAYLOAD, headers=headers).status_code == 201
    second = client.post("/api/stores/me", json={**STORE_PAYLOAD, "name": "Autre nom"}, headers=headers)
    assert second.status_code == 409


def test_modifier_commerce(client):
    token = _merchant_token(client, "patch-store@gbandjo.tg")
    headers = {"Authorization": f"Bearer {token}"}
    client.post("/api/stores/me", json=STORE_PAYLOAD, headers=headers)
    reponse = client.patch(
        "/api/stores/me",
        json={"name": "Nouveau nom", "description": "Description"},
        headers=headers,
    )
    assert reponse.status_code == 200
    assert reponse.get_json()["data"]["store"]["name"] == "Nouveau nom"


def test_admin_valide_et_rejette(client, session):
    merchant = f.create_merchant("wait@gbandjo.tg")
    store = f.create_store(owner=merchant, validation_status=ValidationStatus.EN_ATTENTE)
    session.commit()
    admin_headers = {"Authorization": f"Bearer {_admin_token(client, session)}"}

    liste = client.get("/api/admin/stores?validation_status=EN_ATTENTE", headers=admin_headers)
    assert liste.status_code == 200
    ids = [s["id"] for s in liste.get_json()["data"]["stores"]]
    assert store.id in ids

    validation = client.post(f"/api/admin/stores/{store.id}/validate", headers=admin_headers)
    assert validation.status_code == 200
    assert validation.get_json()["data"]["store"]["validation_status"] == "VALIDE"

    autre = f.create_merchant("reject@gbandjo.tg")
    refus = f.create_store(owner=autre, validation_status=ValidationStatus.EN_ATTENTE)
    session.commit()
    rejet = client.post(
        f"/api/admin/stores/{refus.id}/reject",
        json={"rejection_reason": "Documents incomplets"},
        headers=admin_headers,
    )
    assert rejet.status_code == 200
    assert rejet.get_json()["data"]["store"]["rejection_reason"] == "Documents incomplets"


def test_publication_offre_sans_commerce_valide(client, session):
    """RG1 — pas d'offre tant que le commerce n'est pas validé."""
    merchant = f.create_merchant("offre@gbandjo.tg")
    f.create_store(owner=merchant, validation_status=ValidationStatus.EN_ATTENTE)
    session.commit()
    token = client.post(
        "/api/auth/login",
        json={"email": merchant.email, "password": "MotDePasse#1"},
    ).get_json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    assert client.post("/api/merchant/offers", headers=headers).status_code == 403
