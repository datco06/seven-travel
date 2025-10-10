import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import { PORT, CORS_ORIGIN, JWT_SECRET } from './config.js';
import authRoutes from './routes/auth.js';
import walletRoutes from './routes/wallet.js';
import bookingRoutes from './routes/bookings.js';
import adminRoutes from './routes/admin.js';
import catalogRoutes from './routes/catalog.js';
import { authenticate } from './middleware/auth.js';
import { configureSocialAuth, socialFailureHandler, socialSuccessHandler } from './services/passport.js';

const app = express();

const socialConfig = configureSocialAuth();

app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN.split(',').map((value) => value.trim()) }));
app.use(express.json());
app.use(morgan('dev'));

app.use(session({
  secret: JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/auth', authRoutes);
app.use('/catalog', authenticate, catalogRoutes);
app.use('/wallet', authenticate, walletRoutes);
app.use('/orders', authenticate, bookingRoutes);
app.use('/admin', authenticate, adminRoutes);

if (socialConfig.googleConfigured) {
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  }));
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/auth/google/failure',
      failureMessage: true,
      session: false,
    }),
    socialSuccessHandler,
  );
  app.get('/auth/google/failure', socialFailureHandler);
}

if (socialConfig.facebookConfigured) {
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email'],
    session: false,
  }));
  app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/auth/facebook/failure',
      failureMessage: true,
      session: false,
    }),
    socialSuccessHandler,
  );
  app.get('/auth/facebook/failure', socialFailureHandler);
}

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.listen(PORT, () => {
  console.log(`Travel Tour API listening on port ${PORT}`);
});
