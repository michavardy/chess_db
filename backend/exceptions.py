from fastapi import HTTPException, status

class AuthorizationError(HTTPException):
    def __init__(self, detail: str = "Authorization error", headers: dict = None):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers=headers or {"WWW-Authenticate": "Bearer"},
        )

class SchemeNotFoundError(HTTPException):
    def __init__(self, detail: str = "Scheme Not Found Error", headers: dict = None):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )

class InvalidTokenError(HTTPException):
    def __init__(self, detail: str = "Invalid Token Error", headers: dict = None):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )

class InvalidCredentialsError(HTTPException):
    def __init__(self, detail: str = "Invalid Credentials Error", headers: dict = None):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )
        