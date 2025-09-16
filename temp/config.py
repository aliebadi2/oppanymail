from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    redis_host: str
    redis_port: int
    secret_key: str
    algorithm: str
    session_expire_minutes: int

    class Config:
        env_file = ".env"

settings = Settings()
