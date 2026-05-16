import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CartPage.css';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    
    const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.newPassword || !form.confirmPassword) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        if (form.newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }
        if (form.newPassword !== form.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`http://localhost:8080/api/client/auth/reset-password?token=${token}`, {
                newPassword: form.newPassword,
                confirmPassword: form.confirmPassword
            });
            setMessage(res.data);
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (err) {
            setError(err.response?.data || 'Đặt lại mật khẩu thất bại');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="cart-page">
                <div className="container text-center py-5">
                    <h2 className="text-danger">Liên kết không hợp lệ</h2>
                    <p>Vui lòng kiểm tra lại email hoặc yêu cầu mã mới.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container py-5 d-flex justify-content-center">
                <div className="auth-modal p-4" style={{position: 'relative'}}>
                    <div className="auth-modal-logo">☕</div>
                    <div className="auth-modal-title">Đặt lại mật khẩu</div>
                    <div className="auth-modal-sub mb-4">Nhập mật khẩu mới cho tài khoản của bạn</div>

                    {error && <div className="auth-error">{error}</div>}
                    {message && <div className="auth-success" style={{color: '#28a745', textAlign: 'center', marginBottom: 15}}>{message}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label>Mật khẩu mới</label>
                            <input
                                name="newPassword"
                                type="password"
                                value={form.newPassword}
                                onChange={handleChange}
                                placeholder="Tối thiểu 6 ký tự"
                                autoFocus
                            />
                        </div>
                        <div className="auth-field">
                            <label>Xác nhận mật khẩu mới</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Nhập lại mật khẩu mới"
                            />
                        </div>
                        <button type="submit" className="auth-submit-btn" disabled={loading || message}>
                            {loading ? '⏳ Đang xử lý...' : '💾 Cập nhật mật khẩu'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
