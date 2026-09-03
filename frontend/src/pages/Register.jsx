import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    role: 'employee'
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await register(formData);
      navigate(user.role === 'hr' ? '/hr' : '/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-card">
      <h2>Register</h2>
      <Message type="error" text={error} />
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" value={formData.name} onChange={handleChange} required />

        <label>Email</label>
        <input name="email" type="email" value={formData.email} onChange={handleChange} required />

        <label>Password</label>
        <input name="password" type="password" value={formData.password} onChange={handleChange} required />

        <label>Department</label>
        <input name="department" value={formData.department} onChange={handleChange} required />

        <label>Role</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="employee">Employee</option>
          <option value="hr">HR</option>
        </select>

        <button type="submit" className="primary-btn">Register</button>
      </form>
      <p>
        Already registered? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;
