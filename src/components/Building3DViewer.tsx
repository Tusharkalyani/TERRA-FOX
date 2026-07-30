import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, RoundedBox } from '@react-three/drei';
import { X } from 'lucide-react';
import type * as THREE from 'three';
import type { CampusNode } from '../data/campusData';

interface Building3DViewerProps {
  building: CampusNode;
  onClose: () => void;
  isDarkMode: boolean;
}

const BuildingModel = () => {
  const group = useRef<THREE.Group>(null);
  
  // Subtle hovering animation
  useFrame((state) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.15;
    }
  });

  return (
    <group ref={group}>
      {/* Main Academic Block */}
      <RoundedBox args={[5, 2, 2.5]} radius={0.05} smoothness={4} position={[0, 1, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial 
          color="#3b82f6" 
          metalness={0.3}
          roughness={0.4}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
        />
      </RoundedBox>
      
      {/* Left Wing / Lecture Halls */}
      <RoundedBox args={[1.5, 3.5, 3]} radius={0.05} smoothness={4} position={[-3, 1.75, 0.5]} castShadow receiveShadow>
        <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.2} />
      </RoundedBox>
      
      {/* Right Wing / Labs */}
      <RoundedBox args={[1.5, 3.5, 3]} radius={0.05} smoothness={4} position={[3, 1.75, 0.5]} castShadow receiveShadow>
        <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.2} />
      </RoundedBox>

      {/* Center Glass Atrium */}
      <RoundedBox args={[2.5, 2.5, 2.8]} radius={0.02} smoothness={4} position={[0, 1.25, 0.5]} castShadow receiveShadow>
        <meshPhysicalMaterial 
          color="#ffffff"
          transmission={0.9}
          opacity={1}
          metalness={0.1}
          roughness={0.1}
          ior={1.5}
          thickness={0.5}
          envMapIntensity={2}
        />
      </RoundedBox>

      {/* Roof detail */}
      <mesh position={[0, 2.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 0.2, 2.3]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>

      {/* Ground Pedestal */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[6, 6, 0.1, 64]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
    </group>
  );
};

export const Building3DViewer: React.FC<Building3DViewerProps> = ({ building, onClose, isDarkMode }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md cursor-pointer"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-[85vh] bg-slate-50 dark:bg-slate-950 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col pointer-events-auto transition-colors duration-300">
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-6 flex items-start justify-between z-10 pointer-events-none">
          <div className="pointer-events-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50">
            <h2 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white drop-shadow-sm flex items-center gap-3">
              {building.name}
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500 text-white rounded-md tracking-widest uppercase shadow-md shadow-blue-500/20">
                {building.id}
              </span>
            </h2>
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase mt-1">
              Interactive 3D Architectural Model
            </p>
          </div>
          <button 
            onClick={onClose}
            className="pointer-events-auto p-3 bg-white/70 hover:bg-white dark:bg-slate-900/70 dark:hover:bg-slate-800 backdrop-blur-xl rounded-full text-slate-800 dark:text-white transition-all shadow-md border border-slate-200/50 dark:border-slate-700/50 hover:scale-110 active:scale-95 cursor-pointer"
            title="Close 3D View"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 w-full h-full cursor-grab active:cursor-grabbing relative">
          {/* Subtle gradient background based on theme */}
          <div className={`absolute inset-0 bg-gradient-to-br ${isDarkMode ? 'from-slate-900 to-slate-950' : 'from-slate-100 to-slate-200'} z-0`} />
          
          <div className="absolute inset-0 z-10">
            <Canvas shadows camera={{ position: [8, 6, 10], fov: 40 }}>
              <ambientLight intensity={0.6} />
              <spotLight position={[10, 15, 10]} angle={0.2} penumbra={1} intensity={1.5} castShadow shadow-bias={-0.0001} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
              
              <BuildingModel />
              
              <ContactShadows position={[0, -0.1, 0]} opacity={0.6} scale={15} blur={2.5} far={4} color="#000000" />
              <Environment preset={isDarkMode ? "night" : "city"} environmentIntensity={isDarkMode ? 0.5 : 1} />
              <OrbitControls 
                autoRotate 
                autoRotateSpeed={0.8} 
                enablePan={false} 
                minPolarAngle={Math.PI / 6} 
                maxPolarAngle={Math.PI / 2.05} 
                minDistance={6} 
                maxDistance={20}
                dampingFactor={0.05}
              />
            </Canvas>
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="absolute bottom-6 left-6 right-6 pointer-events-none flex justify-center">
          <div className="pointer-events-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 text-center max-w-lg">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
              {building.description}
            </p>
            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">
              Drag to rotate • Scroll to zoom
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
