import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail } from '../utils/validators';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Chrome, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { login, loginWithGoogle } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!validateEmail(formData.email)) {
            newErrors.email = 'Email tidak valid';
        }

        if (!formData.password) {
            newErrors.password = 'Password wajib diisi';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            const { user, error } = await login(formData);

            if (error) {
                setErrors({ submit: error });
                setLoading(false);
                return;
            }

            navigate('/dashboard');
        } catch (error) {
            setErrors({ submit: error.message });
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const { user, error } = await loginWithGoogle();

            if (error) {
                setErrors({ submit: error });
                setLoading(false);
                return;
            }

            navigate('/dashboard');
        } catch (error) {
            setErrors({ submit: error.message });
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--gradient-ocean)',
            padding: 'var(--space-6)',
        }}>
            <div className="card" style={{
                maxWidth: '450px',
                width: '100%',
                animation: 'slideUp 0.5s ease-out',
            }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        background: 'var(--gradient-primary)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: 'var(--space-2)',
                    }}>
                        FinTrack AI
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                        Masuk untuk melanjutkan
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="nama@email.com"
                    />

                    <div style={{ position: 'relative' }}>
                        <Input
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            placeholder="Masukkan password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '12px',
                                top: '38px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--text-secondary)',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <Link
                            to="/forgot-password"
                            style={{
                                color: 'var(--primary-600)',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                            }}
                        >
                            Lupa password?
                        </Link>
                    </div>

                    {errors.submit && (
                        <div style={{
                            padding: 'var(--space-3)',
                            background: 'var(--error-bg)',
                            border: '1px solid var(--error-border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--error-text)',
                            fontSize: '0.875rem',
                        }}>
                            {errors.submit}
                        </div>
                    )}

                    <Button type="submit" loading={loading} style={{ width: '100%' }}>
                        Masuk
                    </Button>
                </form>

                <div style={{
                    margin: 'var(--space-6) 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>atau</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                </div>

                <Button variant="secondary" onClick={handleGoogleLogin} style={{ width: '100%' }}>
                    <Chrome size={18} />
                    Masuk dengan Google
                </Button>

                <p style={{
                    textAlign: 'center',
                    marginTop: 'var(--space-6)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                }}>
                    Belum punya akun?{' '}
                    <Link to="/register" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
                        Daftar sekarang
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
