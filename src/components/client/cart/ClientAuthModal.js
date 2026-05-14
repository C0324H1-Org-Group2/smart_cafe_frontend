import React, { useState } from 'react';
import axios from 'axios';
import './CartPage.css';

const ClientAuthModal = ({ onClose, onSuccess }) => {
    const [tab, setTab] = useState('login'); // 'login' | 'register'
    const [form, setForm] = useState({ username: '', password: '', fullName: '' });
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
        if (!form.username || !form.password) {
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

    return (
        <div className="auth-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="auth-modal auth-modal-wrap">
                <button className="auth-close-btn" onClick={onClose}>✕</button>
                <div className="auth-modal-logo">☕</div>
                <div className="auth-modal-title">Hương Coffee</div>
                <div className="auth-modal-sub">
                    {tab === 'login'
                        ? 'Đăng nhập để tiếp tục thanh toán'
                        : 'Tạo tài khoản để thanh toán nhanh hơn'}
                </div>

                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
                        onClick={() => { setTab('login'); setError(''); }}
                    >
                        Đăng nhập
                    </button>
                    <button
                        className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
                        onClick={() => { setTab('register'); setError(''); }}
                    >
                        Đăng ký
                    </button>
                </div>

                {error && <div className="auth-error">{error}</div>}

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
                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? '⏳ Đang đăng nhập...' : '🔑 Đăng nhập'}
                        </button>
                    </form>
                ) : (
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
                )}
            </div>
        </div>
    );
};

export default ClientAuthModal;
