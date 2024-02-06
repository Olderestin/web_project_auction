from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """
    Class for storing app settings.
    """

    SECRET_KEY: str

    POSTGRES_HOST: str
    POSTGRES_PORT: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

    class Config:
        """
        Configuration class for settings.
        """

        env_file = ".env"
        case_sensitive = True

settings = Settings()
