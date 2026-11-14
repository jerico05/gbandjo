"""Tests des modèles : héritage, contraintes d'intégrité et attributs dérivés."""
from datetime import timedelta
from decimal import Decimal

import pytest
from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models import (
    AccountStatus,
    Admin,
    Category,
    Consumer,
    Merchant,
    Notification,
    ProductImage,
    Reservation,
    ReservationStatus,
    Store,
    User,
    UserRole,
)
from app.utils import utcnow
from tests import factories as f


def assert_rejected(session):
    """Vérifie que la base refuse l'écriture, puis annule la transaction."""
    with pytest.raises(IntegrityError):
        session.flush()
    session.rollback()


def test_role_defini_automatiquement_par_la_sous_classe(session):
    merchant = f.create_merchant()
    consumer = f.create_consumer()
    admin = Admin(last_name="Admin", first_name="Gbandjo", email="admin@gbandjo.tg")
    admin.set_password("MotDePasse#3")
    session.add(admin)
    session.flush()
    assert merchant.role == UserRole.COMMERCANT
    assert consumer.role == UserRole.CONSOMMATEUR
    assert admin.role == UserRole.ADMIN


def test_requete_sur_user_retourne_les_bonnes_sous_classes(session):
    f.create_merchant("a@gbandjo.tg")
    f.create_consumer("b@gbandjo.tg")
    session.commit()
    session.expunge_all()
    types = {type(u) for u in User.query.all()}
    assert types == {Merchant, Consumer}
    assert Consumer.query.count() == 1


def test_email_unique(session):
    f.create_merchant("meme@gbandjo.tg")
    session.add(Consumer(last_name="X", first_name="Y", email="meme@gbandjo.tg", password_hash="h"))
    assert_rejected(session)


def test_mot_de_passe_stocke_hache_et_verifiable(session):
    user = f.create_merchant()
    assert user.password_hash != "MotDePasse#1"
    assert user.verify_password("MotDePasse#1")
    assert not user.verify_password("autre")


def test_compte_suspendu_ne_peut_pas_se_connecter(session):
    user = f.create_consumer()
    assert user.account_status == AccountStatus.ACTIF and user.can_login
    user.account_status = AccountStatus.SUSPENDU
    assert not user.can_login


def test_un_seul_commerce_par_commercant(session):
    merchant = f.create_merchant()
    f.create_store(merchant)
    session.add(
        Store(
            owner_id=merchant.id,
            name="Second",
            activity_type="Boutique",
            address="Lomé",
            latitude=6.1,
            longitude=1.2,
        )
    )
    assert_rejected(session)


@pytest.mark.parametrize("latitude,longitude", [(91, 1.2), (-91, 1.2), (6.1, 181), (6.1, -181)])
def test_coordonnees_hors_limites_refusees(session, latitude, longitude):
    with pytest.raises(IntegrityError):
        f.create_store(latitude=latitude, longitude=longitude)
    session.rollback()


def test_nom_de_categorie_unique(session):
    f.create_category("Boissons")
    session.add(Category(name="Boissons"))
    assert_rejected(session)


def test_supprimer_un_produit_supprime_ses_images(session):
    product = f.create_product()
    product.images.append(ProductImage(url="https://exemple.tg/1.jpg", sort_order=0))
    session.flush()
    assert ProductImage.query.count() == 1
    session.delete(product)
    session.flush()
    assert ProductImage.query.count() == 0


def test_prix_reduit_doit_etre_inferieur_au_prix_initial(session):
    with pytest.raises(IntegrityError):
        f.create_offer(initial_price=Decimal("500"), discounted_price=Decimal("500"))
    session.rollback()
    with pytest.raises(IntegrityError):
        f.create_offer(initial_price=Decimal("500"), discounted_price=Decimal("800"))
    session.rollback()


def test_prix_reduit_negatif_refuse(session):
    with pytest.raises(IntegrityError):
        f.create_offer(discounted_price=Decimal("-1"))
    session.rollback()


def test_quantite_disponible_negative_refusee_mais_zero_accepte(session):
    assert f.create_offer(available_quantity=0).available_quantity == 0
    with pytest.raises(IntegrityError):
        f.create_offer(available_quantity=-1)
    session.rollback()


def test_date_fin_doit_suivre_la_date_debut(session):
    now = utcnow()
    with pytest.raises(IntegrityError):
        f.create_offer(starts_at=now, ends_at=now)
    session.rollback()


def test_pourcentage_de_reduction_est_calcule(session):
    product = f.create_product()
    offer = f.create_offer(product, initial_price=Decimal("1000"), discounted_price=Decimal("750"))
    assert offer.discount_percentage == Decimal("25.00")
    offer = f.create_offer(product, initial_price=Decimal("3"), discounted_price=Decimal("2"))
    assert offer.discount_percentage == Decimal("33.33")


def test_offre_epuisee_et_expiree(session):
    product = f.create_product()
    offer = f.create_offer(product, available_quantity=0)
    assert offer.is_sold_out and not offer.is_expired()
    now = utcnow()
    offer = f.create_offer(product, starts_at=now - timedelta(days=3), ends_at=now - timedelta(days=1))
    assert offer.is_expired() and not offer.is_sold_out


def test_quantite_de_reservation_doit_etre_positive(session):
    with pytest.raises(IntegrityError):
        f.create_reservation(quantity=0)
    session.rollback()


def test_reservation_valeurs_par_defaut(session):
    reservation = f.create_reservation()
    assert reservation.status == ReservationStatus.EN_ATTENTE
    ecart = reservation.expires_at - reservation.created_at
    assert timedelta(hours=23, minutes=59) < ecart < timedelta(hours=24, minutes=1)
    assert reservation.unit_price == Decimal("750.00")


def test_delai_de_reservation_depasse(session):
    reservation = f.create_reservation()
    assert not reservation.is_past_deadline()
    assert reservation.is_past_deadline(utcnow() + timedelta(hours=25))
    reservation.status = ReservationStatus.CONFIRMEE
    assert not reservation.is_past_deadline(utcnow() + timedelta(hours=25))


def test_notification_non_lue_par_defaut_et_liee_au_destinataire(session):
    reservation = f.create_reservation()
    notification = Notification(
        recipient_id=reservation.consumer_id,
        reservation_id=reservation.id,
        type="RESERVATION_CONFIRMEE",
        message="Votre réservation est confirmée.",
    )
    session.add(notification)
    session.flush()
    assert notification.is_read is False
    assert notification.recipient is reservation.consumer


def test_endpoint_de_sante(client):
    reponse = client.get("/api/health")
    assert reponse.status_code == 200
    corps = reponse.get_json()
    assert corps["data"]["status"] == "ok"
    assert corps["data"]["database"] == "ok"
