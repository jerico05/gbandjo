"""table refresh_token

Revision ID: 7a78cc132cec
Revises: 2a92823eb1b1
Create Date: 2026-11-13 15:20:38.196906

"""
from alembic import op
import sqlalchemy as sa


revision = "7a78cc132cec"
down_revision = "2a92823eb1b1"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "refresh_token",
        sa.Column("id", sa.BigInteger(), nullable=False),
        sa.Column("utilisateur_id", sa.BigInteger(), nullable=False),
        sa.Column("jeton_hash", sa.String(length=64), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("revoked_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["utilisateur_id"],
            ["utilisateur.id"],
            name=op.f("fk_refresh_token_utilisateur_id_utilisateur"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_refresh_token")),
        sa.UniqueConstraint("jeton_hash", name="uq_refresh_token_jeton_hash"),
    )
    with op.batch_alter_table("refresh_token", schema=None) as batch_op:
        batch_op.create_index(batch_op.f("ix_refresh_token_utilisateur_id"), ["utilisateur_id"], unique=False)


def downgrade():
    with op.batch_alter_table("refresh_token", schema=None) as batch_op:
        batch_op.drop_index(batch_op.f("ix_refresh_token_utilisateur_id"))
    op.drop_table("refresh_token")
