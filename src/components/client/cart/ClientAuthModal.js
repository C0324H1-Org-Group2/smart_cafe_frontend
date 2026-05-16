import React, { useState } from 'react';
import axios from 'axios';
import './CartPage.css';

const ClientAuthModal = ({ onClose, onSuccess, isForced = false }) => {
    const [tab, setTab] = useState('login'); // 'login' | 'register' | 'forgot'
    const [form, setForm] = useState({ username: '', password: '', fullName: '', email: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!form.username || !form.password) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8080/api/client/auth/login', {
                username: form.username,
                password: form.password
            });
            const { token, authorities, id, nameEmpployee } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('authorities', JSON.stringify(authorities));
            localStorage.setItem('userId', id);
            localStorage.setItem('roles', JSON.stringify(authorities.map(a => a.authority)));
            localStorage.setItem('employeeName', nameEmpployee || form.username);
            localStorage.setItem('clientUsername', form.username);
            onSuccess();
        } catch (err) {
            setError(err.response?.data || 'Tên đăng nhập hoặc mật khẩu không đúng');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!form.username || !form.password || !form.email) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        if (form.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }
        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/client/auth/register', {
                username: form.username,
                password: form.password,
                email: form.email,
                fullName: form.fullName || form.username
            });
            // Auto login after register
            const res = await axios.post('http://localhost:8080/api/client/auth/login', {
                username: form.username,
                password: form.password
            });
            const { token, authorities, id, nameEmpployee } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('authorities', JSON.stringify(authorities));
            localStorage.setItem('userId', id);
            localStorage.setItem('roles', JSON.stringify(authorities.map(a => a.authority)));
            localStorage.setItem('employeeName', nameEmpployee || form.username);
            localStorage.setItem('clientUsername', form.username);
            onSuccess();
        } catch (err) {
            setError(err.response?.data || 'Đăng ký thất bại, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!form.email) {
            setError('Vui lòng nhập email');
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8080/api/client/auth/forgot-password', {
                email: form.email
            });
            setMessage(res.data);
            setError('');
        } catch (err) {
            setError(err.response?.data || 'Gửi email thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={(e) => !isForced && e.target === e.currentTarget && onClose()}>
            <div className="auth-modal auth-modal-wrap">
                {!isForced && <button className="auth-close-btn" onClick={onClose}>✕</button>}
                <div className="auth-modal-logo">☕</div>
                <div className="auth-modal-title">Hương Coffee</div>
                <div className="auth-modal-sub">
                    {tab === 'login' && 'Đăng nhập để tiếp tục thanh toán'}
                    {tab === 'register' && 'Tạo tài khoản để thanh toán nhanh hơn'}
                    {tab === 'forgot' && 'Khôi phục mật khẩu tài khoản'}
                </div>

                {tab !== 'forgot' && (
                    <div className="auth-tabs">
                        <button
                            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
                            onClick={() => { setTab('login'); setError(''); setMessage(''); }}
                        >
                            Đăng nhập
                        </button>
                        <button
                            className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
                            onClick={() => { setTab('register'); setError(''); setMessage(''); }}
                        >
                            Đăng ký
                        </button>
                    </div>
                )}

                {error && <div className="auth-error">{error}</div>}
                {message && <div className="auth-success" style={{color: '#28a745', marginBottom: 15, textAlign: 'center'}}>{message}</div>}

                {tab === 'login' ? (
                    <form onSubmit={handleLogin}>
                        <div className="auth-field">
                            <label>Tên đăng nhập</label>
                            <input
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="Nhập tên đăng nhập"
                                autoFocus
                            />
                        </div>
                        <div className="auth-field">
                            <label>Mật khẩu</label>
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu"
                            />
                        </div>
                        <div style={{textAlign: 'right', marginBottom: 15}}>
                            <a href="#" onClick={(e) => { e.preventDefault(); setTab('forgot'); setError(''); setMessage(''); }} style={{fontSize: '0.85rem', color: '#e8a87c'}}>Quên mật khẩu?</a>
                        </div>
                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? '⏳ Đang đăng nhập...' : '🔑 Đăng nhập'}
                        </button>
                    </form>
                ) : tab === 'register' ? (
                    <form onSubmit={handleRegister}>
                        <div className="auth-field">
                            <label>Họ và tên</label>
                            <input
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                placeholder="Nhập họ và tên (tùy chọn)"
                            />
                        </div>
                        <div className="auth-field">
                            <label>Tên đăng nhập</label>
                            <input
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="Nhập tên đăng nhập"
                                autoFocus
                            />
                        </div>
                        <div className="auth-field">
                            <label>Email</label>
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Nhập email để khôi phục mật khẩu"
                            />
                        </div>
                        <div className="auth-field">
                            <label>Mật khẩu</label>
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Tối thiểu 6 ký tự"
                            />
                        </div>
                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? '⏳ Đang đăng ký...' : '🚀 Đăng ký & Tiếp tục'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleForgotPassword}>
                        <div className="auth-field">
                            <label>Email đã đăng ký</label>
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Nhập email của bạn"
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? '⏳ Đang gửi...' : '📧 Gửi yêu cầu'}
                        </button>
                        <div style={{textAlign: 'center', marginTop: 15}}>
                            <a href="#" onClick={(e) => { e.preventDefault(); setTab('login'); setError(''); setMessage(''); }} style={{fontSize: '0.85rem', color: '#e8a87c'}}>Quay lại đăng nhập</a>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ClientAuthModal;
