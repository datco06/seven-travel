import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const COPY = {
  vi: {
    title: 'Tạo tài khoản SEVEN TRAVEL',
    subtitle: 'Cá nhân hoá hành trình, quản lý thanh toán và lịch sử đặt dịch vụ.',
    name: 'Họ và tên',
    phone: 'Số điện thoại',
    password: 'Mật khẩu',
    confirmPassword: 'Nhập lại mật khẩu',
    submit: 'Đăng ký',
    loginQuestion: 'Đã có tài khoản?',
    loginLink: 'Đăng nhập',
    sideTitle: 'Gia nhập cộng đồng khám phá',
    sideSubtitle: 'Nhận ưu đãi độc quyền, quản lý ví điện tử và đặt tour chỉ với vài thao tác.',
  },
  en: {
    title: 'Create your SEVEN TRAVEL account',
    subtitle: 'Personalise your trips, manage payments, and track every booking.',
    name: 'Full name',
    phone: 'Phone number',
    password: 'Password',
    confirmPassword: 'Confirm password',
    submit: 'Sign up',
    loginQuestion: 'Already registered?',
    loginLink: 'Sign in',
    sideTitle: 'Join our explorers community',
    sideSubtitle: 'Unlock curated offers, manage your travel wallet, and reserve experiences in a few taps.',
  },
};

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { language } = useLanguage();
  const copy = COPY[language];
  const [form, setForm] = useState({ name: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError(language === 'vi' ? 'Mật khẩu không trùng khớp.' : 'Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ name: form.name, phone: form.phone, password: form.password });
      navigate('/tai-khoan');
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>{copy.title}</h1>
        <p className="auth-subtitle">{copy.subtitle}</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="name">{copy.name}</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="name"
          />
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
            autoComplete="new-password"
          />
          <label htmlFor="confirmPassword">{copy.confirmPassword}</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
          {error ? <p className="auth-error">{error}</p> : null}
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Loading…' : copy.submit}
          </button>
        </form>
        <p className="auth-switch">
          {copy.loginQuestion}{' '}
          <Link to="/dang-nhap">{copy.loginLink}</Link>
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

export default Register;
