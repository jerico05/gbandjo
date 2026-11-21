"""reservation reference

Revision ID: a3f1c8e92d10
Revises: 7a78cc132cec
Create Date: 2026-03-22 12:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = "a3f1c8e92d10"
down_revision = "7a78cc132cec"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("reservation", schema=None) as batch_op:
        batch_op.add_column(sa.Column("reference", sa.String(length=32), nullable=True))
        batch_op.create_index(batch_op.f("ix_reservation_reference"), ["reference"], unique=True)

    conn = op.get_bind()
    rows = conn.execute(
        sa.text(
            """
            SELECT id, date_creation
            FROM reservation
            WHERE reference IS NULL
            """
        )
    ).fetchall()
    for row in rows:
        rid, created = row[0], row[1]
        date_part = created.strftime("%Y%m%d") if hasattr(created, "strftime") else str(created)[:10].replace("-", "")
        ref = f"GBJ-{date_part}-{int(rid):06d}"
        conn.execute(
            sa.text("UPDATE reservation SET reference = :ref WHERE id = :id"),
            {"ref": ref, "id": rid},
        )

    with op.batch_alter_table("reservation", schema=None) as batch_op:
        batch_op.alter_column("reference", nullable=False)


def downgrade():
    with op.batch_alter_table("reservation", schema=None) as batch_op:
        batch_op.drop_index(batch_op.f("ix_reservation_reference"))
        batch_op.drop_column("reference")