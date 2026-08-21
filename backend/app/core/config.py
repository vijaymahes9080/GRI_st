import json
import os
import secrets
from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        extra="ignore",
    )

    PROJECT_NAME: str = "GRI Unified University Backend API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Runtime environment: development | staging | production
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # Institutional Metadata
    INSTITUTION_NAME: str = "The Gandhigram Rural Institute (Deemed to be University)"
    MOTTO: str = "கிராமம் உயர நாடு உயரும் (As villages rise, the nation rises)"
    NAAC_GRADE: str = "A++ (4th Cycle)"
    MINISTRY: str = "Ministry of Education (Shiksha Mantralaya), Govt. of India"
    OFFICIAL_WEBSITE: str = "https://ruraluniv.ac.in"
    PORTAL_URL: str = "https://www.ruraluniv.ac.in/Portal/index.html"
    SAMARTH_URL: str = "https://ruraluniv.samarth.ac.in"

    # Free Cloud Stack Integrations
    RAILWAY_ENVIRONMENT: str = os.getenv("RAILWAY_ENVIRONMENT", "development")
    # No default credentials — must be injected via environment in any real deployment.
    SUPABASE_DB_URL: str = os.getenv("DATABASE_URL", "")
    VERCEL_ADMIN_URL: str = os.getenv("VERCEL_ADMIN_URL", "https://admin.ruraluniv.ac.in")
    CLOUDFLARE_CDN_URL: str = os.getenv("CLOUDFLARE_CDN_URL", "https://cdn.ruraluniv.ac.in")
    FIREBASE_SERVER_KEY: str = os.getenv("FIREBASE_SERVER_KEY", "")
    UPTIME_KUMA_WEBHOOK: str = os.getenv("UPTIME_KUMA_WEBHOOK", "")

    # Database Settings
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "localhost")
    POSTGRES_PORT: int = int(os.getenv("POSTGRES_PORT", "5432"))
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "gri_user")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "gri_db")

    @property
    def ASYNC_DATABASE_URL(self) -> str:
        if self.SUPABASE_DB_URL:
            url = self.SUPABASE_DB_URL
            if url.startswith("postgresql://"):
                url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
            elif url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql+asyncpg://", 1)
            return url
        pwd = self.POSTGRES_PASSWORD or "gri_password"
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{pwd}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # Redis Settings
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))

    # JWT Security Settings
    # No hardcoded production secret. An ephemeral random key is generated for
    # development only; production deployments MUST provide SECRET_KEY.
    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

    # Development-only mock user accounts (disabled by default; never enable in production)
    ALLOW_MOCK_USERS: bool = os.getenv("ALLOW_MOCK_USERS", "false").lower() == "true"

    # ERP webhook signature secret (disabled if empty)
    ERP_WEBHOOK_SECRET: str = os.getenv("ERP_WEBHOOK_SECRET", "")

    # CORS allow-list. Wildcard is NOT permitted when credentials are allowed.
    CORS_ORIGINS: list[str] = json.loads(
        os.getenv("CORS_ORIGINS", '["http://localhost:8081", "http://localhost:19006"]')
    )

    # Known weak/example secrets that must never be accepted in production.
    _INSECURE_SECRETS = {
        "SUPER_SECRET_PRODUCTION_KEY_GRI_2026_CHANGE_IN_ENV",
        "gri_super_secret_jwt_key_prod_8841_9921",
        "gri_jwt_staging_key_8841",
    }

    @model_validator(mode="after")
    def _validate_runtime_secrets(self) -> "Settings":
        if self.ENVIRONMENT == "production":
            if not self.SECRET_KEY or self.SECRET_KEY in self._INSECURE_SECRETS:
                raise ValueError(
                    "SECRET_KEY must be set to a strong, unique secret via environment "
                    "in the production environment."
                )
            if not self.SUPABASE_DB_URL:
                raise ValueError("DATABASE_URL must be set via environment in the production environment.")
        if not self.SECRET_KEY:
            # Development-only ephemeral key (tokens invalidate on process restart).
            self.SECRET_KEY = secrets.token_urlsafe(48)
        if not self.CORS_ORIGINS or "*" in self.CORS_ORIGINS:
            self.CORS_ORIGINS = []
        return self


settings = Settings()
