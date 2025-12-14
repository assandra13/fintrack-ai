import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { validateEmail } from '../utils/validators';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError('Email tidak valid');
            return;
        }

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setSuccess(true);
            setLoading(false);
        }, 1000);
    };

    if (success) {
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
                    textAlign: 'center',
                }}>
                    <CheckCircle size={64} style={{ color: 'var(--success-solid)', margin: '0 auto var(--space-4)' }} />
                    <h2>Email Terkirim!</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Kami telah mengirimkan link reset password ke <strong>{email}</strong>.
                        Silakan cek inbox Anda.
                    </p>
                    <Link to="/login">
                        <Button style={{ marginTop: 'var(--space-6)', width: '100%' }}>
                            Kembali ke Login
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

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
            }}>
                <Link to="/login" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    marginBottom: 'var(--space-6)',
                    color: 'var(--text-secondary)',
                }}>
                    <ArrowLeft size={18} />
                    Kembali
                </Link>

                <div style={{ marginBottom: 'var(--space-6)' }}>
                    <h2>Lupa Password?</h2>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                        Masukkan email Anda dan kami akan mengirimkan link untuk reset password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError('');
                        }}
                        error={error}
                        placeholder="nama@email.com"
                    />

                    <Button type="submit" loading={loading} style={{ width: '100%' }}>
                        Kirim Link Reset
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
