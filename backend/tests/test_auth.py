"""Module 1 — tests d'authentification."""
from app.models import AccountStatus, UserRole
from tests import factories as f


def test_swagger_disponible(client):
    """Swagger et OpenAPI doivent répondre."""
    assert client.get("/api/docs").status_code == 200
    assert client.get("/api/openapi.json").status_code == 200


def test_sante_et_base(client):
    reponse = client.get("/api/health")
    assert reponse.status_code == 200
    corps = reponse.get_json()
    assert corps["data"]["status"] == "ok"
    assert corps["data"]["database"] == "ok"


def test_inscription_connexion(client):
    assert client.post(
        "/api/auth/register/merchant",
        json={
            "last_name": "A",
            "first_name": "B",
            "email": "auth@gbandjo.tg",
            "password": "MotDePasse#1",
        },
    ).status_code == 201
    assert client.post(
        "/api/auth/login",
        json={"email": "auth@gbandjo.tg", "password": "MotDePasse#1"},
    ).status_code == 200


def test_mauvais_mot_de_passe(client, session):
    f.create_merchant("bad@gbandjo.tg")
    session.commit()
    assert (
        client.post(
            "/api/auth/login",
            json={"email": "bad@gbandjo.tg", "password": "faux"},
        ).status_code
        == 401
    )


def test_compte_suspendu(client, session):
    user = f.create_consumer("suspendu@gbandjo.tg")
    user.account_status = AccountStatus.SUSPENDU
    session.commit()
    assert (
        client.post(
            "/api/auth/login",
            json={"email": user.email, "password": "MotDePasse#2"},
        ).status_code
        == 403
    )


def test_sans_token(client):
    assert client.get("/api/auth/me").status_code == 401


def test_jwt_et_refresh(client):
    data = client.post(
        "/api/auth/register/consumer",
        json={
            "last_name": "X",
            "first_name": "Y",
            "email": "refresh@gbandjo.tg",
            "password": "MotDePasse#2",
        },
    ).get_json()["data"]
    refresh = data["refresh_token"]
    assert client.get("/api/auth/me", headers={"Authorization": f"Bearer {data['access_token']}"}).status_code == 200
    nouveaux = client.post("/api/auth/refresh", json={"refresh_token": refresh}).get_json()["data"]
    assert nouveaux["refresh_token"] != refresh
