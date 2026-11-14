"""Module 2 — tests du profil utilisateur."""
from tests import factories as f


def _token(client, email="profil@gbandjo.tg"):
    client.post(
        "/api/auth/register/consumer",
        json={
            "last_name": "Profil",
            "first_name": "Test",
            "email": email,
            "password": "MotDePasse#1",
        },
    )
    return client.post(
        "/api/auth/login",
        json={"email": email, "password": "MotDePasse#1"},
    ).get_json()["data"]["access_token"]


def test_consulter_profil(client):
    token = _token(client)
    reponse = client.get("/api/users/profile", headers={"Authorization": f"Bearer {token}"})
    assert reponse.status_code == 200
    assert reponse.get_json()["data"]["user"]["email"] == "profil@gbandjo.tg"


def test_profil_sans_jeton(client):
    assert client.get("/api/users/profile").status_code == 401


def test_modifier_profil(client):
    token = _token(client, "patch@gbandjo.tg")
    reponse = client.patch(
        "/api/users/profile",
        json={"last_name": "Nouveau", "phone": "91111111"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert reponse.status_code == 200
    corps = reponse.get_json()["data"]["user"]
    assert corps["last_name"] == "Nouveau"
    assert corps["phone"] == "91111111"


def test_email_deja_pris(client, session):
    f.create_consumer("occupe@gbandjo.tg")
    session.commit()
    token = _token(client, "autre@gbandjo.tg")
    assert (
        client.patch(
            "/api/users/profile",
            json={"email": "occupe@gbandjo.tg"},
            headers={"Authorization": f"Bearer {token}"},
        ).status_code
        == 409
    )


def test_modifier_mot_de_passe(client):
    token = _token(client, "mdp@gbandjo.tg")
    assert (
        client.put(
            "/api/users/password",
            json={"old_password": "MotDePasse#1", "new_password": "AutreMotDePasse#9"},
            headers={"Authorization": f"Bearer {token}"},
        ).status_code
        == 200
    )
    assert (
        client.post(
            "/api/auth/login",
            json={"email": "mdp@gbandjo.tg", "password": "AutreMotDePasse#9"},
        ).status_code
        == 200
    )


def test_ancien_mot_de_passe_incorrect(client):
    token = _token(client, "badmdp@gbandjo.tg")
    assert (
        client.put(
            "/api/users/password",
            json={"old_password": "faux", "new_password": "AutreMotDePasse#9"},
            headers={"Authorization": f"Bearer {token}"},
        ).status_code
        == 401
    )
