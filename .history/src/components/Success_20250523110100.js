import '../styles/base.css';
import '../styles/form.css';

export default function Success() {
  return (
    <div className="container success-container">
      <div className="success-icon">✓</div>
      <h1>Subscription Successful!</h1>
      <p className="success-message">
        Thank you for subscribing! Please send your payment receipt to
        <a href="mailto:uk49success@gmail.com" className="admin-email"> uk49success@gmail.com</a>
        to activate your subscription.
      </p>
      <p className="support-note">
        Our support team will contact you within 24 hours after verifying your payment.
      </p>
    </div>
  );
}
