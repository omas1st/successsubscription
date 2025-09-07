// src/components/SubscriptionForm.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/form.css';

export default function SubscriptionForm() {
  const [data, setData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    subscriptionPlan: '',
    paymentMethod: '',
    paymentMade: 'yes'
  });
  const navigate = useNavigate();

  const BASE = process.env.REACT_APP_API_URL || '';
  console.log('Using API base URL:', BASE);  // Add base URL logging

  const handleChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const showPaymentDetails = method => {
    document.querySelectorAll('.payment-details').forEach(el => el.style.display = 'none');
    if (method) document.getElementById(method).style.display = 'block';
  };

  const copyAddress = () => {
    navigator.clipboard.writeText('3Liim5xHAkLEgUjzfw2DNFqbEkzaXgWWu8');
    alert('Bitcoin address copied!');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log('Submission data:', data);  // Add request body logging
    
    try {
      const response = await axios.post(
        `${BASE}/api/subscribe`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      console.log('Submission response:', response);  // Add response logging
      
      if (response.status === 201) {
        navigate('/success');
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      console.error('Submission error details:', {
        message: err.message,
        response: err.response?.data,
        config: err.config,
        stack: err.stack
      });
      
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || err.message 
        || 'Submission failed. Please check your connection and try again.';
      
      alert(`Error: ${errorMessage}`);
    }
  };

  // The rest of the component remains the same as your original JSX
  return (
    <div className="container">
      <h1>Apex Subscription Form</h1>
      <form className="subscription-form" onSubmit={handleSubmit}>
        {/* Rest of your form JSX remains unchanged */}
        <div className="form-group">
          <input
            name="name"
            onChange={handleChange}
            className="form-input"
            placeholder="Full Name"
            required
          />
        </div>
        <div className="form-group">
          <input
            name="email"
            type="email"
            onChange={handleChange}
            className="form-input"
            placeholder="Email Address"
            required
          />
        </div>
        <div className="form-group">
          <input
            name="whatsapp"
            onChange={handleChange}
            className="form-input"
            placeholder="WhatsApp Number"
            required
          />
        </div>

        <div className="form-group">
          <h2>Choose Subscription Plan</h2>
          <div className="subscription-plans">
            {[
              { value: 'R500 Lunchtime', price: 'R500', desc: 'Lunchtime only (2 days)' },
              { value: 'R500 Teatime',   price: 'R500', desc: 'Teatime only (2 days)' },
              { value: 'R700 Both',      price: 'R700', desc: 'Lunchtime & Teatime (2 days)' }
            ].map(opt => (
              <label key={opt.value} className="plan-option">
                <input
                  type="radio"
                  name="subscriptionPlan"
                  value={opt.value}
                  onChange={handleChange}
                  required
                />
                <span className="plan-details">
                  <span className="plan-price">{opt.price}</span>
                  <span className="plan-description">{opt.desc}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <h2>Payment Method</h2>
          <select
            name="paymentMethod"
            className="form-input"
            onChange={e => { handleChange(e); showPaymentDetails(e.target.value); }}
            required
          >
            <option value="">Select Payment Method</option>
            <option value="bank">Deposit/Bank Transfer</option>
            <option value="crypto">Cryptocurrency</option>
          </select>
        </div>

        <div id="bank" className="payment-details">
          <h3>Bank Transfer Details</h3>
          <p><strong>Information:</strong> If you're using CAPITEC BANK, use STORE or ATM deposit for the payment. Transfer is not allowed for CAPITEC Users only.</p>
          <p><strong>Bank:</strong> FNB Bank</p>
          <p><strong>Account Name:</strong> Mama Pty</p>
          <p><strong>Account Number:</strong> 62509963139</p>
          <p><strong>Reference:</strong> 0657350788</p>
          <p><strong>Note:</strong> It is compulsory to Add "0657350788" as the reference.</p>
        </div>

        <div id="crypto" className="payment-details">
          <h3>Crypto Payment Details</h3>
          <div className="wallet-address">
            <code>3Liim5xHAkLEgUjzfw2DNFqbEkzaXgWWu8</code>
            <button type="button" className="copy-button" onClick={copyAddress}>
              Copy Address
            </button>
          </div>
        </div>

        <div className="form-group">
          <select
            name="paymentMade"
            className="form-input"
            onChange={handleChange}
            required
          >
            <option value="yes">Yes, I've made the payment</option>
            <option value="no">No, I'll pay later</option>
          </select>
        </div>

        <button type="submit" className="button">Complete Subscription</button>
      </form>
    </div>
  );
}
