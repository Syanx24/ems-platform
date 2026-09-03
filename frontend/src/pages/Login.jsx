import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await login(email, password);
      navigate(user.role === 'hr' ? '/hr' : '/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-card">
      <h2>Login</h2>
      <Message type="error" text={error} />
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit" className="primary-btn">Login</button>
      </form>
      <p>
        New employee? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
