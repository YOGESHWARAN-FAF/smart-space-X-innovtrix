import React from 'react';
import { useSmartSpace } from '../context/SmartSpaceContext';
import { Wifi, WifiOff, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

const Topbar = ({ onMenuClick }) => {
    const { espConfig } = useSmartSpace();

    return (
        <header className="topbar">
            <div className="topbar-left">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="btn-icon"
                    onClick={onMenuClick}
                >
                    <Menu size={24} />
                </motion.button>
                <div className="brand-container">
                    <img src={logo} alt="Smart Space" className="brand-logo" />
                    <h1 className="brand-title">Smart Space</h1>
                </div>
            </div>

            <div className="topbar-right">
                <div className={`status-badge ${espConfig.isOnline ? 'online' : 'offline'}`}>
                    {espConfig.isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
                    <span>{espConfig.isOnline ? 'Connected' : 'Offline'}</span>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
