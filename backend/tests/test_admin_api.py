"""Module 7 — tests administration."""
from app.models.enums import AccountStatus

from tests import factories as f


def _admin_headers(client, session):
    admin = f.create_admin("admin-mod7@gbandjo.tg")
    session.commit()
    token = client.post(
        "/api/auth/login",
        json={"email": admin.email, "password": "MotDePasse#Admin"},
    ).get_json()["data"]["access_token"]
    return {"Authorization": f"Bearer {token}"}, admin


def test_admin_liste_et_suspend_utilisateur(client, session):
    headers, admin = _admin_headers(client, session)
    consumer = f.create_consumer("cible@gbandjo.tg")
    session.commit()

    liste = client.get("/api/admin/users?role=CONSOMMATEUR", headers=headers)
    assert liste.status_code == 200
    assert liste.get_json()["data"]["pagination"]["total"] >= 1

    patch = client.patch(
        f"/api/admin/users/{consumer.id}/status",
        json={"account_status": "SUSPENDU"},
        headers=headers,
    )
    assert patch.status_code == 200
    session.refresh(consumer)
    assert consumer.account_status == AccountStatus.SUSPENDU

    self_patch = client.patch(
        f"/api/admin/users/{admin.id}/status",
        json={"account_status": "SUSPENDU"},
        headers=headers,
    )
    assert self_patch.status_code == 409


def test_admin_cree_categorie(client, session):
    headers, _admin = _admin_headers(client, session)
    creation = client.post(
        "/api/admin/categories",
        json={"name": "Épicerie fine"},
        headers=headers,
    )
    assert creation.status_code == 201
    noms = [c["name"] for c in client.get("/api/categories").get_json()["data"]["categories"]]
    assert "Épicerie fine" in noms


def test_admin_stats_et_offres(client, session):
    headers, _admin = _admin_headers(client, session)
    offer = f.create_offer()
    session.commit()

    stats = client.get("/api/admin/dashboard/stats", headers=headers)
    assert stats.status_code == 200
    assert "totals" in stats.get_json()["data"]["stats"]

    listing = client.get("/api/admin/offers?status=ACTIVE", headers=headers)
    assert listing.status_code == 200

    deactivate = client.post(f"/api/admin/offers/{offer.id}/deactivate", headers=headers)
    assert deactivate.status_code == 200
    assert deactivate.get_json()["data"]["offer"]["status"] == "DESACTIVEE"
