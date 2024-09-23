import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async () => {
    try {
      await axios.post('/api/auth/register', { email, password });
      history.push('/login');
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleSubmit}>Register</button>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}

export default Register;