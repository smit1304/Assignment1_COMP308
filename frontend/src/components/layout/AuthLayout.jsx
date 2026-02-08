import React from 'react';

const AuthLayout = ({ title, children, footer }) => {
    return (
        <div className="auth-form-container">
            <h2>{title}</h2>
            {children}
            {footer}
        </div>
    );
};

export default AuthLayout;
