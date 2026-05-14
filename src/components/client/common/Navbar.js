import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import NewsNotification from '../news/NewsNotification';
import ClientAuthModal from '../cart/ClientAuthModal';
import { useCart } from '../../../context/CartContext';
import './Navbar.css';
import '../cart/CartPage.css';

const Navbar = () => {
    const [notificationCount, setNotificationCount] = useState(0);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem('clientUsername'));
    const { totalItems } = useCart();

    useEffect(() => {
        const handleStorageChange = () => {
            setUsername(localStorage.getItem('clientUsername'));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleNewNotifications = (count) => {
        setNotificationCount(count);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('clientUsername');
        localStorage.removeItem('userId');
        localStorage.removeItem('roles');
        localStorage.removeItem('authorities');
        localStorage.removeItem('employeeName');
        setUsername(null);
        window.location.reload();
    };

    const handleAuthSuccess = () => {
        setShowAuthModal(false);
        setUsername(localStorage.getItem('clientUsername'));
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
                <div className="container">
                    <Link className="navbar-brand" to="/">Hương<small>Coffee</small></Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="oi oi-menu"></span> Menu
                    </button>
                    <div className="collapse navbar-collapse" id="ftco-nav">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item"><NavLink to="/" className="nav-link">Home</NavLink></li>
                            <li className="nav-item"><NavLink to="/menu" className="nav-link">Menu</NavLink></li>
                            <li className="nav-item"><NavLink to="/order" className="nav-link">Order</NavLink></li>
                            <li className="nav-item"><NavLink to="/news#news-list" className="nav-link">News</NavLink></li>
                            <li className="nav-item"><NavLink to="/about" className="nav-link">About</NavLink></li>

                            {/* Notification bell */}
                            <li className="nav-item cart">
                                <a onClick={toggleDropdown} className="nav-link" style={{ cursor: 'pointer' }}>
                                    <span className="icon icon-bell"></span>
                                    <span className="bag d-flex justify-content-center align-items-center">
                                        <small>{notificationCount}</small>
                                    </span>
                                </a>
                                <NewsNotification onNewNotifications={handleNewNotifications} isDropdownOpen={isDropdownOpen} />
                            </li>

                            {/* Online Cart icon */}
                            <li className="nav-item cart" style={{ marginLeft: 10 }}>
                                <NavLink to="/cart" className="nav-link" title="Giỏ hàng online">
                                    <span className="icon icon-shopping_cart"></span>
                                    {totalItems > 0 && (
                                        <span className="bag d-flex justify-content-center align-items-center">
                                            <small>{totalItems > 99 ? '99+' : totalItems}</small>
                                        </span>
                                    )}
                                </NavLink>
                            </li>

                            {/* Login / Username */}
                            {username ? (
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span className="icon icon-person"></span> {username}
                                    </a>
                                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                                    </div>
                                </li>
                            ) : (
                                <li className="nav-item">
                                    <button 
                                        onClick={() => setShowAuthModal(true)} 
                                        className="nav-link btn btn-link" 
                                        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                                    >
                                        Login
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            {showAuthModal && (
                <ClientAuthModal
                    onClose={() => setShowAuthModal(false)}
                    onSuccess={handleAuthSuccess}
                />
            )}
        </>
    );
};

export default Navbar;


