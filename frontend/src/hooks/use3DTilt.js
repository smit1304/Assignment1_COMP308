import { useState, useRef } from 'react';

const use3DTilt = () => {
    const ref = useRef(null);
    const [tiltStyles, setTiltStyles] = useState({});

    const handleMouseMove = (e) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Gentle tilt - max 10 degrees
        const rotateX = ((y - centerY) / centerY) * -10; 
        const rotateY = ((x - centerX) / centerX) * 10;

        setTiltStyles({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`,
            transition: 'transform 0.1s ease-out',
            zIndex: 10,
            boxShadow: '0 20px 30px rgba(0,0,0,0.5)'
        });
    };

    const handleMouseLeave = () => {
        setTiltStyles({
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
            transition: 'transform 0.5s ease-out',
            zIndex: 1,
            boxShadow: 'none'
        });
    };

    return { ref, tiltStyles, handleMouseMove, handleMouseLeave };
};

export default use3DTilt;
