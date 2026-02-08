import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Image, Environment, Float, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const PortalCard = ({ imageUrl }) => {
    const mesh = useRef();
    const { viewport } = useThree();
    const [hovered, setHover] = useState(false);
    
    useFrame((state) => {
        if (!mesh.current) return;
        
        // Gentle tilt based on mouse position
        const tiltX = state.mouse.y * 0.15;
        const tiltY = state.mouse.x * 0.15;
        
        mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, -tiltX, 0.1);
        mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, tiltY, 0.1);
        
        // Scale pulse on hover
        const targetScale = hovered ? 1.1 : 1;
        mesh.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), 0.1);
    });

    return (
        <group ref={mesh} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
            {/* Background Glow Plane - Adds depth */}
            <mesh position={[0, 0, -1]}>
                <planeGeometry args={[viewport.width * 1.5, viewport.height * 1.5]} />
                <meshBasicMaterial 
                    color={hovered ? "#29b6f6" : "#1a237e"} 
                    transparent 
                    opacity={hovered ? 0.4 : 0.0} 
                    depthWrite={false}
                />
            </mesh>

            {/* Main Image Layer - Floating and prominent */}
            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
                <Image 
                    url={imageUrl}
                    scale={[viewport.width * 0.85, viewport.height * 0.85]} 
                    position={[0, 0, 0]}
                    transparent
                    toneMapped={false}
                    radius={0.2} // Rounded corners
                />
            </Float>
            
            {/* Holographic Reflection Overlay */}
            {hovered && (
                <mesh position={[0, 0, 0.1]} scale={[0.85, 0.85, 1]}>
                    <planeGeometry args={[viewport.width, viewport.height]} />
                    <meshPhysicalMaterial 
                        transparent 
                        opacity={0.2} 
                        roughness={0} 
                        metalness={1}
                        clearcoat={1}
                        color="#ffffff"
                    />
                </mesh>
            )}
        </group>
    );
};

const ThreeGameCard = ({ imageUrl }) => {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} color="#4fc3f7" />
                 
                {/* Space Atmosphere */}
                <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
                <Sparkles count={40} scale={10} size={2} speed={0.5} opacity={0.6} color="#4fc3f7" />
                
                <React.Suspense fallback={null}>
                    <PortalCard imageUrl={imageUrl} />
                </React.Suspense>
                
                <Environment preset="night" />
            </Canvas>
        </div>
    );
};

export default ThreeGameCard;
