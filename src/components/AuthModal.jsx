import React, { useState, useEffect, useRef } from 'react';
import './AuthModal.css';

/* ===== Inline SVG icons ===== */
const Svg = ({ children, size = 18, strokeWidth = 1.8, ...p }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size} height={size} viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true" {...p}
    >
        {children}
    </svg>
);

const CloseIcon = (p) => (
    <Svg {...p}>
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </Svg>
);
const MailIcon = (p) => (
    <Svg {...p}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
    </Svg>
);
const LockIcon = (p) => (
    <Svg {...p}>
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </Svg>
);
const UserIcon = (p) => (
    <Svg {...p}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
    </Svg>
);
const EyeIcon = (p) => (
    <Svg {...p}>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </Svg>
);
const EyeOffIcon = (p) => (
    <Svg {...p}>
        <path d="m3 3 18 18" />
        <path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a17.4 17.4 0 0 1-3.2 4" />
        <path d="M6.3 6.3A17.4 17.4 0 0 0 2 12s3.5 7 10 7a10.9 10.9 0 0 0 4.5-.9" />
        <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </Svg>
);
const CheckIcon = (p) => (
    <Svg {...p}>
        <path d="M20 6 9 17l-5-5" />
    </Svg>
);
const AlertIcon = (p) => (
    <Svg {...p}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4" /><path d="M12 16h.01" />
    </Svg>
);
const SpinnerIcon = ({ size = 18, ...p }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size} height={size} viewBox="0 0 24 24"
        fill="none" aria-hidden="true" {...p}
    >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
);

export default function AuthModal({ open, mode: initialMode = 'login', onClose, onSuccess }) {
    const [mode, setMode] = useState(initialMode);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const firstInputRef = useRef(null);

    const isSignup = mode === 'signup';

    useEffect(() => { setMode(initialMode); }, [initialMode]);

    useEffect(() => {
        if (!open) return;
        setStatus('idle');
        setErrorMessage('');
        setShowPassword(false);
        setForm({ name: '', email: '', password: '' });
        const t = setTimeout(() => firstInputRef.current?.focus(), 350);
        return () => clearTimeout(t);
    }, [open, mode]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
        document.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [open, onClose]);

    if (!open) return null;

    const handleFieldChange = (field) => (e) => {
        setForm((f) => ({ ...f, [field]: e.target.value }));
        if (status === 'error') { setStatus('idle'); setErrorMessage(''); }
    };

    const validate = () => {
        if (isSignup && !form.name.trim()) return 'Please tell us your name.';
        if (!form.email.trim()) return 'Email is required.';
        if (!/^\S+@\S+\.\S+$/.test(form.email)) return "That email doesn't look right.";
        if (!form.password) return 'Password is required.';
        if (form.password.length < 6) return 'Password must be at least 6 characters.';
        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        setTimeout(() => {
            const problem = validate();
            if (problem) {
                setStatus('error');
                setErrorMessage(problem);
                return;
            }

            setStatus('success');
            setTimeout(() => {
                onSuccess?.({ mode, ...form });
                onClose?.();
            }, 1200);
        }, 1000);
    };

    const switchMode = (next) => {
        if (next !== mode) setMode(next);
    };

    return (
        <div className="auth-overlay" onClick={onClose}>
            <div
                className={`auth-modal mode-${mode} status-${status}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="auth-title"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="auth-border" aria-hidden="true" />
                <div className="auth-orbs" aria-hidden="true">
                    <span className="orb orb-1" />
                    <span className="orb orb-2" />
                    <span className="orb orb-3" />
                </div>

                <button type="button" className="auth-close" onClick={onClose} aria-label="Close">
                    <CloseIcon size={18} />
                </button>

                <div className="auth-inner">
                    <header className="auth-header">
                        <div className="auth-logo" aria-hidden="true">Fv</div>
                        <h2 id="auth-title" className="auth-title">
                            {isSignup ? 'Create your account' : 'Welcome back'}
                        </h2>
                        <p className="auth-subtitle">
                            {isSignup
                                ? 'Join millions of fans across every universe.'
                                : 'Log in to pick up where you left off.'}
                        </p>
                    </header>

                    <div className="auth-tabs" role="tablist">
                        <button type="button" role="tab" aria-selected={!isSignup}
                            className={`auth-tab${!isSignup ? ' active' : ''}`}
                            onClick={() => switchMode('login')}>Login</button>
                        <button type="button" role="tab" aria-selected={isSignup}
                            className={`auth-tab${isSignup ? ' active' : ''}`}
                            onClick={() => switchMode('signup')}>Sign Up</button>
                        <span className="auth-tab-slider" aria-hidden="true" />
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit} noValidate>
                        <div className={`auth-field${isSignup ? ' shown' : ''}`}>
                            <label className="auth-label" htmlFor="auth-name">Full name</label>
                            <div className="auth-input-wrap">
                                <span className="auth-input-icon"><UserIcon size={16} /></span>
                                <input id="auth-name" ref={isSignup ? firstInputRef : null}
                                    type="text" className="auth-input" placeholder="Ada Lovelace"
                                    value={form.name} onChange={handleFieldChange('name')}
                                    autoComplete="name" tabIndex={isSignup ? 0 : -1} />
                            </div>
                        </div>

                        <div className="auth-field shown">
                            <label className="auth-label" htmlFor="auth-email">Email</label>
                            <div className="auth-input-wrap">
                                <span className="auth-input-icon"><MailIcon size={16} /></span>
                                <input id="auth-email" ref={!isSignup ? firstInputRef : null}
                                    type="email" className="auth-input" placeholder="you@fandomverse.app"
                                    value={form.email} onChange={handleFieldChange('email')}
                                    autoComplete="email" />
                            </div>
                        </div>

                        <div className="auth-field shown">
                            <label className="auth-label" htmlFor="auth-password">
                                Password
                                {!isSignup && (
                                    <a href="#forgot" className="auth-forgot"
                                        onClick={(e) => e.preventDefault()}>Forgot?</a>
                                )}
                            </label>
                            <div className="auth-input-wrap">
                                <span className="auth-input-icon"><LockIcon size={16} /></span>
                                <input id="auth-password" type={showPassword ? 'text' : 'password'}
                                    className="auth-input"
                                    placeholder={isSignup ? 'At least 6 characters' : '••••••••'}
                                    value={form.password} onChange={handleFieldChange('password')}
                                    autoComplete={isSignup ? 'new-password' : 'current-password'} />
                                <button type="button" className="auth-eye"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                    {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className={`auth-message${status === 'error' ? ' show' : ''}`} role="alert">
                            {status === 'error' && (<><AlertIcon size={15} /><span>{errorMessage}</span></>)}
                        </div>

                        <button type="submit" className="auth-submit"
                            disabled={status === 'loading' || status === 'success'}>
                            <span className="auth-submit-text">
                                {isSignup ? 'Create account' : 'Log in'}
                            </span>
                            <span className="auth-submit-icon">
                                {status === 'loading' && <SpinnerIcon size={18} className="auth-spin" />}
                                {status === 'success' && <CheckIcon size={18} />}
                            </span>
                            <span className="auth-submit-fill" aria-hidden="true" />
                        </button>

                        <div className="auth-success" aria-hidden={status !== 'success'}>
                            <div className="auth-success-circle"><CheckIcon size={28} /></div>
                            <p>{isSignup ? 'Account created!' : 'Logged in!'}</p>
                        </div>
                    </form>

                    <div className="auth-divider"><span>or continue with</span></div>

                    <div className="auth-socials">
                        <button type="button" className="auth-social" aria-label="Continue with Google">
                            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                                <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.4-.2-2H12v3.9h6c-.3 1.4-1 2.6-2.2 3.4v2.8h3.5c2-1.9 3.2-4.7 3.2-8.1Z"/>
                                <path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.5-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.2v2.9C4 20.1 7.7 23 12 23Z"/>
                                <path fill="#FBBC05" d="M5.8 14.2c-.2-.7-.3-1.4-.3-2.2s.1-1.5.3-2.2V6.9H2.2C1.4 8.4 1 10.2 1 12s.4 3.6 1.2 5.1l3.6-2.9Z"/>
                                <path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1C17.4 2.1 14.9 1 12 1 7.7 1 4 3.9 2.2 6.9l3.6 2.9C6.7 7.2 9.1 5.4 12 5.4Z"/>
                            </svg>
                            <span>Google</span>
                        </button>
                        <button type="button" className="auth-social" aria-label="Continue with GitHub">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.3-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.8-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/>
                            </svg>
                            <span>GitHub</span>
                        </button>
                        <button type="button" className="auth-social" aria-label="Continue with Apple">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.9-1.4-.1-2.8.8-3.5.8-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 6.9 1.2 9.2.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.8-2.2c.9-1.3 1.2-2.5 1.2-2.6 0 0-2.4-.9-2.4-3.6ZM14.1 5.7c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.8-.9 2.8 1 .1 2-.5 2.6-1.3Z"/>
                            </svg>
                            <span>Apple</span>
                        </button>
                    </div>

                    <p className="auth-footer-text">
                        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button type="button" className="auth-switch"
                            onClick={() => switchMode(isSignup ? 'login' : 'signup')}>
                            {isSignup ? 'Log in' : 'Sign up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}