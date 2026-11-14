"""Format JSON uniforme de l'API."""
from __future__ import annotations

from typing import Any


class ApiError(Exception):
    def __init__(
        self,
        message: str,
        *,
        status: int = 400,
        errors: dict[str, Any] | list[Any] | None = None,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.status = status
        self.errors = errors


class ApiResponse:
    @staticmethod
    def build(
        *,
        data: Any = None,
        message: str | None = None,
        errors: Any = None,
    ) -> dict[str, Any]:
        body: dict[str, Any] = {}
        if data is not None:
            body["data"] = data
        if message is not None:
            body["message"] = message
        if errors is not None:
            body["errors"] = errors
        return body

    @classmethod
    def ok(
        cls,
        *,
        data: Any = None,
        message: str | None = None,
        errors: Any = None,
        status: int = 200,
    ):
        return cls.build(data=data, message=message, errors=errors), status

    @classmethod
    def created(cls, *, data: Any = None, message: str | None = None):
        return cls.ok(data=data, message=message, status=201)
