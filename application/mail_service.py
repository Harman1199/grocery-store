from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

SMTP_HOST = "localhost"
SMTP_PORT = 1025
SENDER_EMAIL = 'system@grocerystore.com'
SENDER_PASSWORD = ''


def send_message(to, subject, body):
    message = MIMEMultipart()
    message["To"] = to
    message["From"] = SENDER_EMAIL
    message["Subject"] = subject
    message.attach(MIMEText(body, 'html'))
    client = SMTP(host=SMTP_HOST, port=SMTP_PORT)
    client.send_message(msg=message)
    client.quit()