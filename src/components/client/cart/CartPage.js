import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../../context/CartContext';
import ClientAuthModal from './ClientAuthModal';
import './CartPage.css';
import { toast } from 'react-toastify';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart, totalItems, totalAmount } = useCart();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);
    const [checkoutData, setCheckoutData] = useState({ fullName: '', phone: '', address: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const removeAccents = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
    };

    const isLoggedIn = () => !!localStorage.getItem('token');

    const formatVND = (amount) =>
        amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.error('Giỏ hàng trống!');
            return;
        }
        if (!isLoggedIn()) {
            setShowAuthModal(true);
            return;
        }
        
        // Populate default name if available
        const savedName = localStorage.getItem('employeeName') || localStorage.getItem('clientUsername') || '';
        setCheckoutData(prev => ({ ...prev, fullName: prev.fullName || savedName }));
        setShowCheckoutForm(true);
    };

    const initiateVNPay = async (details = checkoutData) => {
        setLoading(true);
        try {
            const rawOrderInfo = `Thanh toan ${cartItems.length} mon. Khach: ${details.fullName}. SDT: ${details.phone}`;
            const orderInfo = removeAccents(rawOrderInfo).substring(0, 200); // Limit length just in case
            const res = await axios.post(
                'http://localhost:8080/api/client/payment/create',
                {
                    amount: Math.round(totalAmount),
                    orderInfo
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            const { paymentUrl } = res.data;
            if (paymentUrl) {
                // Save cart and checkout data to sessionStorage before redirect
                sessionStorage.setItem('pendingCart', JSON.stringify(cartItems));
                sessionStorage.setItem('checkoutData', JSON.stringify(details));
                window.location.href = paymentUrl;
            } else {
                toast.error('Không thể tạo liên kết thanh toán');
            }
        } catch (err) {
            console.error('VNPay error:', err);
            toast.error('Lỗi khi kết nối VNPay. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleAuthSuccess = () => {
        setShowAuthModal(false);
        toast.success(`Xin chào, ${localStorage.getItem('clientUsername') || 'bạn'}!`);
        setTimeout(() => handleCheckout(), 400);
    };

    const handleCheckoutSubmit = (e) => {
        e.preventDefault();
        if (!checkoutData.fullName || !checkoutData.phone || !checkoutData.address) {
            toast.error('Vui lòng điền đầy đủ thông tin giao hàng!');
            return;
        }
        setShowCheckoutForm(false);
        initiateVNPay(checkoutData);
    };

    if (cartItems.length === 0) {
        return (
            <>
                <section className="cart-page">
                    <div className="container">
                        <div className="cart-empty">
                            <div className="cart-empty-icon">🛒</div>
                            <h3>Giỏ hàng của bạn đang trống</h3>
                            <p>Hãy khám phá menu và thêm món yêu thích vào giỏ hàng!</p>
                            <Link to="/order" className="go-order-btn">
                                Xem thực đơn
                            </Link>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <section className="cart-page">
                <div className="container">
                    {/* Back link */}
                    {/* <Link to="/order" className="back-btn">
                        ← Tiếp tục mua hàng
                    </Link> */}

                    <h1 className="cart-title">Giỏ hàng của bạn</h1>
                    <p className="cart-subtitle">Kiểm tra và chỉnh sửa đơn hàng trước khi thanh toán</p>

                    <div className="row">
                        {/* Cart table */}
                        <div className="col-lg-8 mb-4">
                            <div className="cart-table-wrapper">
                                <table className="cart-table">
                                    <thead>
                                        <tr>
                                            <th>Món</th>
                                            <th>Tên</th>
                                            <th>Đơn giá</th>
                                            <th>Số lượng</th>
                                            <th>Thành tiền</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map(item => (
                                            <tr key={item.serviceId}>
                                                <td>
                                                    <div
                                                        className="cart-img"
                                                        style={{ backgroundImage: `url(/images/${item.imageUrl})` }}
                                                    />
                                                </td>
                                                <td>
                                                    <div className="cart-item-name">{item.serviceName}</div>
                                                    <div className="cart-item-price">
                                                        ⏱ {item.waitTime ? item.waitTime.substring(0, 5) + ' phút' : '—'}
                                                    </div>
                                                </td>
                                                <td>{formatVND(item.price)}</td>
                                                <td>
                                                    <div className="qty-control">
                                                        <button
                                                            className="qty-btn"
                                                            onClick={() => updateQuantity(item.serviceId, item.quantity - 1)}
                                                        >
                                                            −
                                                        </button>
                                                        <span className="qty-value">{item.quantity}</span>
                                                        <button
                                                            className="qty-btn"
                                                            onClick={() => updateQuantity(item.serviceId, item.quantity + 1)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="row-total">
                                                        {formatVND(item.price * item.quantity)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="remove-btn"
                                                        onClick={() => removeFromCart(item.serviceId)}
                                                    >
                                                        🗑 Xóa
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Summary panel */}
                        <div className="col-lg-4">
                            <div className="cart-summary">
                                <div className="summary-title">📋 Tóm tắt đơn hàng</div>

                                {cartItems.map(item => (
                                    <div className="summary-row" key={item.serviceId}>
                                        <span>{item.serviceName} × {item.quantity}</span>
                                        <span>{formatVND(item.price * item.quantity)}</span>
                                    </div>
                                ))}

                                <div className="summary-total">
                                    <span>Tổng cộng ({totalItems} món)</span>
                                    <span>{formatVND(totalAmount)}</span>
                                </div>

                                <button
                                    className="checkout-btn"
                                    onClick={handleCheckout}
                                    disabled={loading}
                                >
                                    {loading
                                        ? '⏳ Đang xử lý...'
                                        : '💳 Thanh toán qua VNPay'}
                                </button>

                                <button className="clear-btn" onClick={() => {
                                    if (window.confirm('Bạn có muốn xóa toàn bộ giỏ hàng?')) {
                                        clearCart();
                                        toast.info('Đã xóa giỏ hàng');
                                    }
                                }}>
                                    🗑 Xóa tất cả
                                </button>

                                <div style={{ marginTop: 20, fontSize: '0.8rem', color: '#b89070', textAlign: 'center', lineHeight: 1.6 }}>
                                    🔒 Thanh toán an toàn qua VNPay<br />
                                    Được bảo mật bởi SSL 256-bit
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {showAuthModal && (
                <ClientAuthModal
                    onClose={() => setShowAuthModal(false)}
                    onSuccess={handleAuthSuccess}
                />
            )}

            {showCheckoutForm && (
                <div className="auth-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowCheckoutForm(false)}>
                    <div className="auth-modal auth-modal-wrap">
                        <button className="auth-close-btn" onClick={() => setShowCheckoutForm(false)}>✕</button>
                        <div className="auth-modal-title">Thông tin giao hàng</div>
                        <div className="auth-modal-sub">Vui lòng điền thông tin để chúng tôi giao hàng đến bạn</div>
                        
                        <form onSubmit={handleCheckoutSubmit}>
                            <div className="auth-field">
                                <label>Họ và tên người nhận</label>
                                <input
                                    type="text"
                                    required
                                    value={checkoutData.fullName}
                                    onChange={(e) => setCheckoutData({...checkoutData, fullName: e.target.value})}
                                    placeholder="Nhập họ và tên"
                                />
                            </div>
                            <div className="auth-field">
                                <label>Số điện thoại</label>
                                <input
                                    type="tel"
                                    required
                                    value={checkoutData.phone}
                                    onChange={(e) => setCheckoutData({...checkoutData, phone: e.target.value})}
                                    placeholder="Nhập số điện thoại liên hệ"
                                />
                            </div>
                            <div className="auth-field">
                                <label>Địa chỉ nhận hàng</label>
                                <textarea
                                    required
                                    rows="3"
                                    value={checkoutData.address}
                                    onChange={(e) => setCheckoutData({...checkoutData, address: e.target.value})}
                                    placeholder="Nhập địa chỉ giao hàng chi tiết"
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                            </div>
                            
                            <button type="submit" className="auth-submit-btn" disabled={loading}>
                                {loading ? '⏳ Đang kết nối VNPay...' : '💳 Xác nhận & Thanh toán'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default CartPage;
