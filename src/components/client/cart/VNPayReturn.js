import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import axios from 'axios';
import './CartPage.css';

const VNPayReturn = () => {
    const [searchParams] = useSearchParams();
    const { clearCart } = useCart();
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    const responseCode = searchParams.get('vnp_ResponseCode');
    const txnRef       = searchParams.get('vnp_TxnRef');
    const amount       = searchParams.get('vnp_Amount');
    const bankCode     = searchParams.get('vnp_BankCode');
    const transDate    = searchParams.get('vnp_PayDate');

    const isSuccess = responseCode === '00';

    useEffect(() => {
        const confirmOrder = async () => {
            if (isSuccess) {
                const pendingCart = JSON.parse(sessionStorage.getItem('pendingCart') || '[]');
                if (pendingCart.length > 0) {
                    setIsSaving(true);
                    try {
                        await axios.post('http://localhost:8080/api/client/payment/confirm-order', pendingCart, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        });
                        // Clear the online cart on successful payment and save
                        clearCart();
                        sessionStorage.removeItem('pendingCart');
                    } catch (err) {
                        console.error('Lỗi lưu đơn hàng:', err);
                        setSaveError('Thanh toán thành công nhưng có lỗi khi lưu đơn hàng vào hệ thống. Vui lòng liên hệ quán.');
                    } finally {
                        setIsSaving(false);
                    }
                }
            }
        };

        confirmOrder();
    }, [isSuccess, clearCart]);

    const formatAmount = (raw) => {
        if (!raw) return '—';
        const num = parseInt(raw) / 100;
        return num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const formatDate = (raw) => {
        if (!raw || raw.length < 14) return raw || '—';
        // VNPay format: yyyyMMddHHmmss
        const y  = raw.substring(0, 4);
        const mo = raw.substring(4, 6);
        const d  = raw.substring(6, 8);
        const h  = raw.substring(8, 10);
        const mi = raw.substring(10, 12);
        return `${d}/${mo}/${y} ${h}:${mi}`;
    };

    return (
        <div className="vnpay-return">
            <div className="vnpay-card">
                <div className="vnpay-icon">
                    {isSuccess ? '🎉' : '❌'}
                </div>

                <div className={`vnpay-title ${isSuccess ? 'success' : 'fail'}`}>
                    {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
                </div>

                <div className="vnpay-desc">
                    {isSuccess
                        ? (isSaving ? '⏳ Đang lưu đơn hàng của bạn vào hệ thống...' : (saveError ? `⚠️ ${saveError}` : 'Cảm ơn bạn đã đặt hàng tại Hương Coffee! ☕\nĐơn hàng của bạn đang được chuẩn bị.'))
                        : `Giao dịch không thành công (Mã lỗi: ${responseCode}).\nVui lòng thử lại hoặc liên hệ hỗ trợ.`}
                </div>

                {isSuccess && (
                    <div style={{
                        background: 'rgba(110,231,160,0.08)',
                        border: '1px solid rgba(110,231,160,0.2)',
                        borderRadius: 12,
                        padding: '16px 20px',
                        marginBottom: 28,
                        textAlign: 'left',
                        fontSize: '0.9rem',
                        color: '#c0d8c0',
                        lineHeight: 2
                    }}>
                        <div>🧾 Mã giao dịch: <strong style={{color:'#f5e6d0'}}>{txnRef}</strong></div>
                        <div>💰 Số tiền: <strong style={{color:'#e8a87c'}}>{formatAmount(amount)}</strong></div>
                        <div>🏦 Ngân hàng: <strong style={{color:'#f5e6d0'}}>{bankCode || '—'}</strong></div>
                        <div>📅 Thời gian: <strong style={{color:'#f5e6d0'}}>{formatDate(transDate)}</strong></div>
                    </div>
                )}

                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/" className="vnpay-home-btn">
                        🏠 Về trang chủ
                    </Link>
                    {!isSuccess && (
                        <Link to="/cart" className="vnpay-home-btn"
                              style={{ background: 'linear-gradient(135deg, #555, #333)' }}>
                            🔄 Thử lại
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VNPayReturn;
