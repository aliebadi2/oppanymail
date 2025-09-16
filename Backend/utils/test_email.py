import os
from dotenv import load_dotenv
from send_email import send_email

# Load .env file
load_dotenv()

if __name__ == "__main__":
    # Check if environment variables are loaded
    print(f"🔍 MAIL_HOST: {os.getenv('MAIL_HOST')}")
    print(f"🔍 MAIL_USER: {os.getenv('MAIL_USER')}")
    print(f"🔍 MAIL_FROM_ADDRESS: {os.getenv('MAIL_FROM_ADDRESS')}")
    
    recipient = "test@example.com"  # Replace with a real test email
    subject = "Test Email from Oppany"
    body = "سلام! این یک ایمیل تست از سیستم Oppany است 🌹\n\nThis is a test email from Oppany system."

    try:
        result = send_email(recipient, subject, body)
        if result:
            print("✅ Email sent successfully!")
        else:
            print("❌ Email sending failed")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
