import React, { useState } from 'react';
import './RegistrationPage.css';

function RegistrationPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Registration has been completed successfully! You can now login.');
        // Clear form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        // Redirect to login page or auto-login
        window.location.href = '/';
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Error connecting to server');
    }
  };

  const handleLoginRedirect = () => {
    window.location.href = '/';
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h1 className="registration-title">REGISTER</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Confirm Your Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="registration-button">
            REGISTER
          </button>
        </form>

        <button className="login-redirect-link" onClick={handleLoginRedirect}>
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

export default RegistrationPage;
