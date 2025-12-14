import React from 'react';

const Card = ({
    children,
    className = '',
    glass = false,
    onClick,
    ...props
}) => {
    const baseClass = glass ? 'card card-glass' : 'card';
    const clickable = onClick ? { cursor: 'pointer' } : {};

    return (
        <div
            className={`${baseClass} ${className}`}
            onClick={onClick}
            style={clickable}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
