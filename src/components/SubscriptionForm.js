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
  const [receiptFile, setReceiptFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const BASE = process.env.REACT_APP_API_URL || '';
  console.log('Using API base URL:', BASE);

  const handleChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image (JPEG, PNG, GIF) or PDF file');
        e.target.value = '';
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size too large. Please upload a file smaller than 5MB');
        e.target.value = '';
        return;
      }
      
      setReceiptFile(file);
    }
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
    
    // Validate receipt file
    if (!receiptFile) {
      alert('Please upload your payment receipt before submitting');
      return;
    }

    setIsUploading(true);
    
    try {
      // First, upload the receipt to Cloudinary
      console.log('Uploading receipt to Cloudinary...');
      
      const uploadFormData = new FormData();
      uploadFormData.append('file', receiptFile);
      uploadFormData.append('upload_preset', 'ml_default'); // You'll need to create this in Cloudinary
      
      const uploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`,
        uploadFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      console.log('Cloudinary upload response:', uploadResponse);
      
      if (!uploadResponse.data.secure_url) {
        throw new Error('Failed to upload receipt');
      }
      
      const receiptUrl = uploadResponse.data.secure_url;
      
      // Now submit the form data with receipt URL
      const submissionData = {
        ...data,
        receiptUrl: receiptUrl
      };
      
      console.log('Submission data:', submissionData);
      
      const response = await axios.post(
        `${BASE}/api/subscribe`,
        submissionData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      console.log('Submission response:', response);
      
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
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container">
      <h1>Apex Subscription Form</h1>
      <form className="subscription-form" onSubmit={handleSubmit}>
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

        <div className="form-group">
          <h2>Upload Payment Receipt *</h2>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.gif,.pdf,.JPG,.JPEG,.PNG,.GIF,.PDF"
            onChange={handleFileChange}
            className="form-input"
            required
          />
          <small>Accepted formats: JPG, PNG, GIF, PDF (Max 5MB)</small>
          {receiptFile && (
            <div className="file-preview">
              <p>Selected file: {receiptFile.name}</p>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="button" 
          disabled={isUploading}
        >
          {isUploading ? 'Uploading Receipt...' : 'Complete Subscription'}
        </button>
      </form>
    </div>
  );
}
