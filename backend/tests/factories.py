"""Fabriques d'objets de test."""
from datetime import timedelta
from decimal import Decimal

from app.extensions import db
from app.models import (
    Admin,
    Category,
    Consumer,
    Merchant,
    Offer,
    Product,
    Reservation,
    Store,
    ValidationStatus,
)
from app.utils import utcnow


def create_admin(email="admin@gbandjo.tg"):
    user = Admin(last_name="Admin", first_name="Gbandjo", email=email)
    user.set_password("MotDePasse#Admin")
    db.session.add(user)
    db.session.flush()
    return user


def create_merchant(email="commercant@gbandjo.tg"):
    user = Merchant(
        last_name="Kpossou",
        first_name="Ama",
        email=email,
        phone="90000000",
    )
    user.set_password("MotDePasse#1")
    db.session.add(user)
    db.session.flush()
    return user


def create_consumer(email="consommateur@gbandjo.tg"):
    user = Consumer(last_name="Agbeko", first_name="Yao", email=email)
    user.set_password("MotDePasse#2")
    db.session.add(user)
    db.session.flush()
    return user


def create_store(owner=None, **fields):
    owner = owner or create_merchant()
    values = dict(
        owner_id=owner.id,
        name="Supermarché Lomé 2",
        activity_type="Supermarché",
        address="Boulevard du 13 Janvier, Lomé",
        latitude=6.1319,
        longitude=1.2228,
        validation_status=ValidationStatus.VALIDE,
    )
    values.update(fields)
    store = Store(**values)
    db.session.add(store)
    db.session.flush()
    return store


def create_category(name="Produits laitiers"):
    category = Category(name=name)
    db.session.add(category)
    db.session.flush()
    return category


def create_product(store=None, category=None, name="Yaourt nature"):
    store = store or create_store()
    category = category or create_category()
    product = Product(store_id=store.id, category_id=category.id, name=name)
    db.session.add(product)
    db.session.flush()
    return product


def create_offer(product=None, **fields):
    product = product or create_product()
    now = utcnow()
    values = dict(
        product_id=product.id,
        initial_price=Decimal("1000"),
        discounted_price=Decimal("750"),
        available_quantity=10,
        starts_at=now,
        ends_at=now + timedelta(days=2),
    )
    values.update(fields)
    offer = Offer(**values)
    db.session.add(offer)
    db.session.flush()
    return offer


def create_reservation(offer=None, consumer=None, **fields):
    offer = offer or create_offer()
    consumer = consumer or create_consumer()
    values = dict(
        offer_id=offer.id,
        consumer_id=consumer.id,
        quantity=2,
        unit_price=offer.discounted_price,
    )
    values.update(fields)
    reservation = Reservation(**values)
    db.session.add(reservation)
    db.session.flush()
    return reservation
