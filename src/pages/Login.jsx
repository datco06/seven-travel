import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const COPY = {
  vi: {
    title: 'Đăng nhập tài khoản',
    subtitle: 'Khám phá và quản lý chuyến đi của bạn dễ dàng hơn.',
    phone: 'Số điện thoại',
    password: 'Mật khẩu',
    submit: 'Đăng nhập',
    adminHint: 'Tài khoản quản trị: 0909000000 / admin123',
    registerQuestion: 'Chưa có tài khoản?',
    registerLink: 'Đăng ký ngay',
    sideTitle: 'Bắt đầu hành trình đáng nhớ',
    sideSubtitle: 'Các chuyên gia SEVEN TRAVEL thiết kế trải nghiệm riêng cho bạn từ khoảnh khắc đầu tiên đăng nhập.',
    socialTitle: 'Hoặc đăng nhập nhanh với',
    google: 'Google',
    facebook: 'Facebook',
  },
  en: {
    title: 'Sign in to your account',
    subtitle: 'Plan and manage unforgettable journeys with ease.',
    phone: 'Phone number',
    password: 'Password',
    submit: 'Sign in',
    adminHint: 'Admin account: 0909000000 / admin123',
    registerQuestion: 'Need an account?',
    registerLink: 'Create one now',
    sideTitle: 'Step into remarkable journeys',
    sideSubtitle: 'Our travel specialists craft bespoke experiences for you from the very first sign-in.',
    socialTitle: 'Or continue with',
    google: 'Google',
    facebook: 'Facebook',
  },
};

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language } = useLanguage();
  const copy = COPY[language];
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  const [form, setForm] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const user = login(form.phone, form.password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/tai-khoan');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>{copy.title}</h1>
        <p className="auth-subtitle">{copy.subtitle}</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="phone">{copy.phone}</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            required
            autoComplete="tel"
          />
          <label htmlFor="password">{copy.password}</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
          {error ? <p className="auth-error">{error}</p> : null}
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Loading…' : copy.submit}
          </button>
        </form>
        <div className="social-auth">
          <p>{copy.socialTitle}</p>
          <div className="social-auth__buttons">
            <a className="social-btn google" href={`${API_BASE_URL}/auth/google`}>
              <i className="fab fa-google" /> {copy.google}
            </a>
            <a className="social-btn facebook" href={`${API_BASE_URL}/auth/facebook`}>
              <i className="fab fa-facebook-f" /> {copy.facebook}
            </a>
          </div>
        </div>
        <p className="auth-hint">{copy.adminHint}</p>
        <p className="auth-switch">
          {copy.registerQuestion}{' '}
          <Link to="/dang-ky">{copy.registerLink}</Link>
        </p>
      </div>
      <div className="auth-side">
        <div className="auth-overlay" />
        <div className="auth-highlight">
          <h2>{copy.sideTitle}</h2>
          <p>{copy.sideSubtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
