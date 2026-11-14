"""Accès données — RefreshToken."""
import hashlib

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import RefreshToken
from app.utils.dates import utcnow


class RefreshTokenRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    @staticmethod
    def hash_token(token: str) -> str:
        return hashlib.sha256(token.encode()).hexdigest()

    def create(self, user_id: int, plain_token: str, expires_at) -> RefreshToken:
        record = RefreshToken(
            user_id=user_id,
            token_hash=self.hash_token(plain_token),
            expires_at=expires_at,
        )
        self._session.add(record)
        return record

    def find_by_token(self, plain_token: str) -> RefreshToken | None:
        return self._session.scalar(
            select(RefreshToken).where(RefreshToken.token_hash == self.hash_token(plain_token))
        )

    def revoke(self, record: RefreshToken) -> None:
        record.revoked_at = utcnow()
