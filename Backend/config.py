from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    redis_host: str
    redis_port: int
    secret_key: str
    algorithm: str
    session_expire_minutes: int
    mail_host: str
    mail_port: int
    mail_user: str
    mail_password: str
    mail_from_address: str
    mail_from_name: str

    class Config:
        env_file = ".env"

settings = Settings()
