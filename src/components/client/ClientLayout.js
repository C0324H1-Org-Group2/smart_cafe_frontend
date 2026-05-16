import React, { useState, useEffect } from 'react';
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";
import ClientAuthModal from "./cart/ClientAuthModal";

const ClientLayout = ({ children }) => {
    const [showForcedAuth, setShowForcedAuth] = useState(false);

    useEffect(() => {
        const username = localStorage.getItem('clientUsername');
        const isResetPasswordPage = window.location.pathname === '/reset-password';

        if (!username && !isResetPasswordPage) {
            setShowForcedAuth(true);
        }
    }, []);

    const handleAuthSuccess = () => {
        setShowForcedAuth(false);
        window.location.reload(); // Refresh to update nav and app state
    };

    return (
        <div>
            {/* Navbar cho phần client */}
            <Navbar />

            {/* Nội dung chính của các trang client */}
            <main>
                {children}
            </main>

            {/* Footer cho phần client */}
            <Footer />

            {showForcedAuth && (
                <ClientAuthModal 
                    onClose={() => {}} 
                    onSuccess={handleAuthSuccess} 
                    isForced={true} 
                />
            )}
        </div>
    );
};

export default ClientLayout;
