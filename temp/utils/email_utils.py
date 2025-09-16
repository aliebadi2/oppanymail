from itsdangerous import URLSafeTimedSerializer
from fastapi import HTTPException
from config import settings

def generate_validation_link(username: str, role: str):
    serializer = URLSafeTimedSerializer(settings.secret_key)
    token = serializer.dumps(username, salt="email-validation")
    return f"http://localhost:3000/verify_email?role={role}&token={token}"


def send_email_validation_link(username: str, role: str, email: str):
    link = generate_validation_link(username, role)
    # Simulate sending email
    print(f"Validation link for {username} ({role}) sent to {email}: {link}")

def validate_email_token(token: str):
    serializer = URLSafeTimedSerializer(settings.secret_key)
    try:
        username = serializer.loads(token, salt="email-validation", max_age=3600)
        return username
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
