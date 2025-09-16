import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from ssl import create_default_context
from dotenv import load_dotenv

# 🟢 Load .env file explicitly
load_dotenv()

# 🟢 مقادیر از .env خونده میشن
MAIL_HOST = os.getenv("MAIL_HOST", "smtp.c1.liara.email")
MAIL_PORT = int(os.getenv("MAIL_PORT", 465))
MAIL_USER = os.getenv("MAIL_USER")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_FROM_ADDRESS = os.getenv("MAIL_FROM_ADDRESS")
MAIL_FROM_NAME = os.getenv("MAIL_FROM_NAME", "Oppany Website")

def send_email(to_address: str, subject: str, body: str):
    """
    ارسال ایمیل با استفاده از SMTP (لیارا یا هر سرور دیگه)
    """
    try:
        # TLS
        context = create_default_context()
        with smtplib.SMTP_SSL(MAIL_HOST, MAIL_PORT, context=context) as server:
            server.login(MAIL_USER, MAIL_PASSWORD)

            # ساختن ایمیل
            msg = MIMEMultipart()
            msg['From'] = f"{MAIL_FROM_NAME} <{MAIL_FROM_ADDRESS}>"
            msg['To'] = to_address
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))

            # ارسال
            server.sendmail(MAIL_FROM_ADDRESS, to_address, msg.as_string())
            print(f"✅ Email sent to {to_address}")
            return True
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        return False


# 📌 تست مستقل فایل
if __name__ == "__main__":
    recipient = "test@example.com"   # اینو برای تست خودت بذار
    subject = "Test Email"
    body = "این یک ایمیل تستی از سرور پایتون است 🚀"
    send_email(recipient, subject, body)
