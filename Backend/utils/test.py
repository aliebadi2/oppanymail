import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from ssl import create_default_context

MAIL_HOST = os.getenv("MAIL_HOST", "smtp.c1.liara.email")
MAIL_PORT = int(os.getenv("MAIL_PORT", 465))
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_FROM_ADDRESS = os.getenv("MAIL_FROM_ADDRESS")
MAIL_FROM_NAME = os.getenv("MAIL_FROM_NAME")

# دو حالت مختلف برای MAIL_USER
USERNAMES_TO_TEST = [
    os.getenv("MAIL_USER"),          # چیزی که توی .env نوشتی
    MAIL_FROM_ADDRESS                # ایمیل کامل به عنوان یوزرنیم
]

def test_smtp(user):
    try:
        context = create_default_context()
        with smtplib.SMTP_SSL(MAIL_HOST, MAIL_PORT, context=context) as server:
            server.login(user, MAIL_PASSWORD)

            msg = MIMEMultipart()
            msg["From"] = f"{MAIL_FROM_NAME} <{MAIL_FROM_ADDRESS}>"
            msg["To"] = MAIL_FROM_ADDRESS  # به خودت بفرست
            msg["Subject"] = f"SMTP Test with user={user}"
            msg.attach(MIMEText("سلام! این یه تست ساده برای SMTP هست.", "plain"))

            server.sendmail(MAIL_FROM_ADDRESS, MAIL_FROM_ADDRESS, msg.as_string())
            print(f"✅ Success with user={user}")
    except Exception as e:
        print(f"❌ Failed with user={user} -> {e}")

if __name__ == "__main__":
    for user in USERNAMES_TO_TEST:
        if user:
            test_smtp(user)
