import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import jwt from 'jsonwebtoken';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  FACEBOOK_CALLBACK_URL,
  JWT_SECRET,
  SOCIAL_REDIRECT_URL,
  validateSocialConfig,
} from '../config.js';
import {
  findUserByProvider,
  findUserByEmail,
  createUserFromProfile,
  linkProviderToUser,
} from './socialAuth.js';

function issueToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

function buildRedirectUrl(token, error) {
  const base = SOCIAL_REDIRECT_URL || '/';
  let url;
  try {
    url = new URL(base);
  } catch (err) {
    url = new URL(base, 'http://localhost');
  }
  if (token) {
    url.searchParams.set('token', token);
  }
  if (error) {
    url.searchParams.set('error', error);
  }
  return url.toString();
}

async function upsertSocialUser(provider, profile) {
  const providerId = profile.id;
  if (!providerId) {
    throw new Error('Provider profile missing id');
  }

  const existing = await findUserByProvider(provider, providerId);
  if (existing) {
    return existing;
  }

  const email = profile.emails?.[0]?.value?.toLowerCase();
  const displayName = profile.displayName || profile.name?.givenName || 'Travel Tour Guest';
  const phone = profile.phoneNumber ?? profile._json?.phone ?? null;

  if (!email) {
    throw new Error('EMAIL_REQUIRED');
  }

  const emailUser = await findUserByEmail(email);
  if (emailUser) {
    await linkProviderToUser(emailUser.id, provider, providerId);
    return emailUser;
  }

  return createUserFromProfile({ provider, providerId, name: displayName, email, phone });
}

export function configureSocialAuth() {
  const { googleConfigured, facebookConfigured } = validateSocialConfig();

  if (googleConfigured) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          callbackURL: GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const user = await upsertSocialUser('google', profile);
            const token = issueToken(user);
            done(null, { user, token });
          } catch (error) {
            if (error.message === 'EMAIL_REQUIRED') {
              done(null, false, { message: 'Google account missing email permission.' });
              return;
            }
            done(error);
          }
        },
      ),
    );
  }

  if (facebookConfigured) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: FACEBOOK_CLIENT_ID,
          clientSecret: FACEBOOK_CLIENT_SECRET,
          callbackURL: FACEBOOK_CALLBACK_URL,
          profileFields: ['id', 'displayName', 'emails'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const user = await upsertSocialUser('facebook', profile);
            const token = issueToken(user);
            done(null, { user, token });
          } catch (error) {
            if (error.message === 'EMAIL_REQUIRED') {
              done(null, false, { message: 'Facebook account missing email permission.' });
              return;
            }
            done(error);
          }
        },
      ),
    );
  }

  passport.serializeUser((data, done) => {
    done(null, data);
  });

  passport.deserializeUser((data, done) => {
    done(null, data);
  });

  return { googleConfigured, facebookConfigured };
}

export function socialSuccessHandler(req, res) {
  const payload = req.user;
  if (!payload) {
    res.redirect(buildRedirectUrl(null, 'Authentication failed'));
    return;
  }
  const redirectUrl = buildRedirectUrl(payload.token, null);
  res.redirect(redirectUrl);
}

export function socialFailureHandler(req, res) {
  const message = req.session?.messages?.[0] || 'Authentication failed';
  res.redirect(buildRedirectUrl(null, message));
}
