# app.py — final version with secure email & both form support
from flask import Flask, render_template, request, redirect, url_for
import smtplib, os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)

# Secure email config via environment variables
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
RECIPIENT_EMAIL = "affordableglazingsys@gmail.com"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send_enquiry', methods=['POST'])
def send_enquiry():
    form = request.form

    # Detect which form was submitted
    if "product" in form:
        # Quote form
        subject = f"New Quote Request - {form.get('product')}"
        html_body = f"""
        <html><body style="font-family:Arial,sans-serif;color:#333;">
        <h2 style="background:#004080;color:white;padding:10px;">New Quote Request</h2>
        <p><strong>Product:</strong> {form.get('product')}</p>
        <p><strong>Name:</strong> {form.get('first_name')} {form.get('last_name')}</p>
        <p><strong>Phone:</strong> {form.get('phone')}</p>
        <p><strong>Email:</strong> {form.get('email')}</p>
        <p><strong>Address:</strong> {form.get('house_number')}, {form.get('postcode')}</p>
        <hr><small>This message was sent from your website quote form.</small>
        </body></html>
        """
        text_body = f"""
        Product: {form.get('product')}
        Name: {form.get('first_name')} {form.get('last_name')}
        Phone: {form.get('phone')}
        Email: {form.get('email')}
        Address: {form.get('house_number')}, {form.get('postcode')}
        """

    else:
        # Contact form
        subject = "New Message from Website Contact Form"
        html_body = f"""
        <html><body style="font-family:Arial,sans-serif;color:#333;">
        <h2 style="background:#004080;color:white;padding:10px;">New Contact Form Message</h2>
        <p><strong>Name:</strong> {form.get('name')}</p>
        <p><strong>Email:</strong> {form.get('email')}</p>
        <p><strong>Phone:</strong> {form.get('phone')}</p>
        <p><strong>Message:</strong><br>{form.get('message')}</p>
        <hr><small>This message was sent from your website contact form.</small>
        </body></html>
        """
        text_body = f"""
        Name: {form.get('name')}
        Email: {form.get('email')}
        Phone: {form.get('phone')}
        Message: {form.get('message')}
        """

    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = EMAIL_ADDRESS
        msg['To'] = RECIPIENT_EMAIL
        msg.attach(MIMEText(text_body, 'plain'))
        msg.attach(MIMEText(html_body, 'html'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        server.sendmail(EMAIL_ADDRESS, RECIPIENT_EMAIL, msg.as_string())
        server.quit()

        return redirect(url_for('index', success=True))

    except Exception as e:
        print("Error sending email:", e)
        return redirect(url_for('index', error=True))

if __name__ == '__main__':
    app.run(debug=True)
