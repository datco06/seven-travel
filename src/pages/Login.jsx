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
  const { login, loginWithProvider } = useAuth();
  const { language } = useLanguage();
  const copy = COPY[language];
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
      const user = await login(form.phone, form.password);
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
            <button
              type="button"
              className="social-btn google"
              onClick={async () => {
                setError('');
                setIsSubmitting(true);
                try {
                  await loginWithProvider('google');
                } catch (err) {
                  setError(err.message);
                  setIsSubmitting(false);
                }
              }}
            >
              <i className="fab fa-google" /> {copy.google}
            </button>
            <button
              type="button"
              className="social-btn facebook"
              onClick={async () => {
                setError('');
                setIsSubmitting(true);
                try {
                  await loginWithProvider('facebook');
                } catch (err) {
                  setError(err.message);
                  setIsSubmitting(false);
                }
              }}
            >
              <i className="fab fa-facebook-f" /> {copy.facebook}
            </button>
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
