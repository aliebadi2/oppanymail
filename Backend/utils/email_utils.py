import os
from itsdangerous import URLSafeTimedSerializer
from fastapi import HTTPException
from utils.send_email import send_email
from dotenv import load_dotenv

# 🟢 Load .env file explicitly
load_dotenv()

# secret_key رو از .env می‌گیریم (توی settings یا config باید لود بشه)
SECRET_KEY = os.getenv("SECRET_KEY", "thisisthesecretekey")

# 🔹 ساخت لینک فعال‌سازی
def generate_validation_link(username: str, role: str):
    serializer = URLSafeTimedSerializer(SECRET_KEY)
    token = serializer.dumps(username, salt="email-validation")
    # آدرس سرور Backend خودت رو اینجا بذار
    return f"http://154.91.170.123:8000/signup/activate/{token}"

# 🔹 ارسال ایمیل فعال‌سازی
def send_email_validation_link(username: str, role: str, email: str):
    link = generate_validation_link(username, role)
    subject = "Verify your email address"
    body = f"""
    سلام {username} عزیز 🌹

    برای فعال‌سازی حساب کاربری‌ات لطفاً روی لینک زیر کلیک کن:

    {link}

    این لینک تا ۱ ساعت معتبر است.
    """
    send_email(email, subject, body)

# 🔹 اعتبارسنجی توکن هنگام کلیک روی لینک
def validate_email_token(token: str):
    serializer = URLSafeTimedSerializer(SECRET_KEY)
    try:
        username = serializer.loads(token, salt="email-validation", max_age=3600)  # ۱ ساعت اعتبار
        return username
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
