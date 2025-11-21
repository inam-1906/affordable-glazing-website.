from flask import Flask, render_template, request, redirect, url_for
import smtplib, os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)

# Secure email config via environment variables
# NOTE: Ensure these environment variables are set before running the app.
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
RECIPIENT_EMAIL = "affordableglazingsys@gmail.com"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/windows')
def windows():
    return render_template('windows.html')

@app.route('/doors')
def doors():
    return render_template('doors.html')

@app.route('/conservatories')
def conservatories():
    return render_template('conservatories.html')

@app.route('/rooflights')
def rooflights():
    return render_template('rooflights.html')


def send_email(subject, text_body, html_body):
    """Utility function to handle email sending logic."""
    if not EMAIL_ADDRESS or not EMAIL_PASSWORD:
        print("Error: Email credentials not set in environment variables.")
        return False

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
        return True
    except Exception as e:
        print("Error sending email:", e)
        return False

@app.route('/send_enquiry', methods=['POST'])
def send_enquiry():
    form = request.form

    # Common HTML Email Template Style
    email_style = """
    <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <h2 style="background-color: #1a5276; color: white; padding: 20px; margin: 0; text-align: center;">{subject_line}</h2>
        <div style="padding: 20px;">
            {content}
        </div>
        <div style="background-color: #f4f4f4; padding: 10px; text-align: center;">
            <small style="color: #777;">This message was sent from your website.</small>
        </div>
    </div>
    </body>
    """

    if "product" in form:
        # Quote form
        subject = f"New Quote Request - {form.get('product')}"
        content = f"""
        <p>A new quote request has been submitted for <strong>{form.get('product')}</strong>.</p>
        <p><strong>Name:</strong> {form.get('first_name')} {form.get('last_name')}</p>
        <p><strong>Phone:</strong> <a href="tel:{form.get('phone')}" style="color: #e67e22; text-decoration: none;">{form.get('phone')}</a></p>
        <p><strong>Email:</strong> <a href="mailto:{form.get('email')}" style="color: #e67e22; text-decoration: none;">{form.get('email')}</a></p>
        <p><strong>Address:</strong> {form.get('house_number')}, {form.get('postcode')}</p>
        """
        html_body = email_style.format(subject_line="New Price Request", content=content)
        text_body = f"""
        New Quote Request:
        Product: {form.get('product')}
        Name: {form.get('first_name')} {form.get('last_name')}
        Phone: {form.get('phone')}
        Email: {form.get('email')}
        Address: {form.get('house_number')}, {form.get('postcode')}
        """
    else:
        # Contact form
        subject = "New Message from Website Contact Form"
        content = f"""
        <p><strong>Name:</strong> {form.get('name')}</p>
        <p><strong>Email:</strong> <a href="mailto:{form.get('email')}" style="color: #e67e22; text-decoration: none;">{form.get('email')}</a></p>
        <p><strong>Phone:</strong> <a href="tel:{form.get('phone')}" style="color: #e67e22; text-decoration: none;">{form.get('phone')}</a></p>
        <p><strong>Message:</strong><br><em style="white-space: pre-wrap; display: block; background: #f9f9f9; padding: 10px; border-left: 3px solid #e67e22; margin-top: 10px;">{form.get('message')}</em></p>
        """
        html_body = email_style.format(subject_line="New Website Message", content=content)
        text_body = f"""
        New Contact Form Message:
        Name: {form.get('name')}
        Email: {form.get('email')}
        Phone: {form.get('phone')}
        Message: {form.get('message')}
        """

    if send_email(subject, text_body, html_body):
        return redirect(url_for('index', success=True))
    else:
        return redirect(url_for('index', error=True))

if __name__ == '__main__':
    # To run, ensure you set the environment variables:
    # os.environ["EMAIL_ADDRESS"] = "your_email@gmail.com"
    # os.environ["EMAIL_PASSWORD"] = "your_app_password"
    # app.run(debug=True)
    
    # Placeholder for local testing without environment vars
    if not EMAIL_ADDRESS or not EMAIL_PASSWORD:
        print("\n--- WARNING: Email credentials are not set. Form submission will fail. ---")
        print("Please set EMAIL_ADDRESS and EMAIL_PASSWORD environment variables.")
        print("--- Running in test mode with dummy credentials. ---\n")
    
    app.run(debug=True)