"""Module 4 — tests API produits et offres."""
from datetime import timedelta
from decimal import Decimal

from app.models.enums import ValidationStatus

from tests import factories as f
from app.utils import utcnow


def _merchant_token(client, merchant, password="MotDePasse#1"):
    return client.post(
        "/api/auth/login",
        json={"email": merchant.email, "password": password},
    ).get_json()["data"]["access_token"]


def _validated_merchant_setup(session):
    merchant = f.create_merchant("catalog@gbandjo.tg")
    store = f.create_store(owner=merchant, validation_status=ValidationStatus.VALIDE)
    category = f.create_category("Fruits")
    session.commit()
    return merchant, store, category


def test_flux_produit_et_offre(client, session):
    merchant, store, category = _validated_merchant_setup(session)
    headers = {"Authorization": f"Bearer {_merchant_token(client, merchant)}"}

    product_response = client.post(
        "/api/merchant/products",
        json={"category_id": category.id, "name": "Banane", "description": "Lot"},
        headers=headers,
    )
    assert product_response.status_code == 201
    product_id = product_response.get_json()["data"]["product"]["id"]

    now = utcnow()
    offer_response = client.post(
        "/api/merchant/offers",
        json={
            "product_id": product_id,
            "initial_price": "1000.00",
            "discounted_price": "700.00",
            "available_quantity": 5,
            "starts_at": now.isoformat(),
            "ends_at": (now + timedelta(days=2)).isoformat(),
        },
        headers=headers,
    )
    assert offer_response.status_code == 201

    catalog = client.get("/api/offers")
    assert catalog.status_code == 200
    offer_ids = [o["id"] for o in catalog.get_json()["data"]["offers"]]
    assert offer_response.get_json()["data"]["offer"]["id"] in offer_ids


def test_rg4_prix_invalide(client, session):
    merchant, _store, category = _validated_merchant_setup(session)
    headers = {"Authorization": f"Bearer {_merchant_token(client, merchant)}"}
    product_id = client.post(
        "/api/merchant/products",
        json={"category_id": category.id, "name": "Riz"},
        headers=headers,
    ).get_json()["data"]["product"]["id"]
    now = utcnow()
    reponse = client.post(
        "/api/merchant/offers",
        json={
            "product_id": product_id,
            "initial_price": "500",
            "discounted_price": "500",
            "available_quantity": 1,
            "starts_at": now.isoformat(),
            "ends_at": (now + timedelta(days=1)).isoformat(),
        },
        headers=headers,
    )
    assert reponse.status_code == 422


def test_rg5_date_peremption(client, session):
    merchant, _store, category = _validated_merchant_setup(session)
    headers = {"Authorization": f"Bearer {_merchant_token(client, merchant)}"}
    product_id = client.post(
        "/api/merchant/products",
        json={"category_id": category.id, "name": "Lait"},
        headers=headers,
    ).get_json()["data"]["product"]["id"]
    now = utcnow()
    end = now + timedelta(days=5)
    reponse = client.post(
        "/api/merchant/offers",
        json={
            "product_id": product_id,
            "initial_price": "1000",
            "discounted_price": "800",
            "available_quantity": 2,
            "starts_at": now.isoformat(),
            "ends_at": end.isoformat(),
            "expiry_date": (end.date() - timedelta(days=10)).isoformat(),
        },
        headers=headers,
    )
    assert reponse.status_code == 422


def test_tri_par_distance(client, session):
    merchant = f.create_merchant("geo1@gbandjo.tg")
    store_near = f.create_store(
        owner=merchant,
        validation_status=ValidationStatus.VALIDE,
        latitude=6.131,
        longitude=1.222,
        name="Proche",
    )
    m2 = f.create_merchant("geo2@gbandjo.tg")
    store_far = f.create_store(
        owner=m2,
        validation_status=ValidationStatus.VALIDE,
        latitude=6.18,
        longitude=1.28,
        name="Loin",
    )
    cat = f.create_category("Snacks-tri")
    p_near = f.create_product(store=store_near, category=cat, name="Near")
    p_far = f.create_product(store=store_far, category=cat, name="Far")
    now = utcnow()
    f.create_offer(
        product=p_near,
        initial_price=Decimal("100"),
        discounted_price=Decimal("80"),
        starts_at=now,
        ends_at=now + timedelta(days=2),
    )
    f.create_offer(
        product=p_far,
        initial_price=Decimal("100"),
        discounted_price=Decimal("80"),
        starts_at=now,
        ends_at=now + timedelta(days=2),
    )
    session.commit()

    reponse = client.get("/api/offers?sort=distance&latitude=6.13&longitude=1.22")
    assert reponse.status_code == 200
    offers = reponse.get_json()["data"]["offers"]
    assert len(offers) >= 2
    assert offers[0]["distance_km"] <= offers[1]["distance_km"]


def test_offre_expiree_indisponible_au_detail(client, session):
    merchant = f.create_merchant("exp@gbandjo.tg")
    store = f.create_store(owner=merchant, validation_status=ValidationStatus.VALIDE)
    product = f.create_product(store=store)
    now = utcnow()
    offer = f.create_offer(
        product,
        starts_at=now - timedelta(days=3),
        ends_at=now - timedelta(hours=1),
    )
    session.commit()
    assert client.get(f"/api/offers/{offer.id}").status_code == 404
