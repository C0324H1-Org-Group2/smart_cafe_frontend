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
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
        initiateVNPay();
    };

    const initiateVNPay = async () => {
        setLoading(true);
        try {
            const orderInfo = `Thanh toan ${cartItems.length} mon - Hương Coffee`;
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
                // Save cart to sessionStorage before redirect so we can clear after return
                sessionStorage.setItem('pendingCart', JSON.stringify(cartItems));
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
        setTimeout(() => initiateVNPay(), 400);
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
        </>
    );
};

export default CartPage;
