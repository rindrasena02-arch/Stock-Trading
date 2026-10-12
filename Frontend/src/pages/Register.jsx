import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await api.register({ name, email, password });
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 380 }}>
      <h2>Create your SB Stocks account</h2>
      <form onSubmit={handleSubmit} className="card">
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
        <label style={{ marginTop: 12, display: 'block' }}>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label style={{ marginTop: 12, display: 'block' }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        {error && <p className="error-text">{error}</p>}
        <button type="submit">Create account</button>
      </form>
      <p style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
