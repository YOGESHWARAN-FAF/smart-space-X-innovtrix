import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

    const sidebarVariants = {
        closed: { x: '-100%', transition: { type: 'tween', duration: 0.3, ease: 'easeInOut' } },
        open: { x: 0, transition: { type: 'tween', duration: 0.3, ease: 'easeInOut' } },
    };

    const overlayVariants = {
        closed: { opacity: 0 },
        open: { opacity: 1 },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="sidebar-overlay"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={overlayVariants}
                        onClick={onClose}
                    />
                    <motion.aside
                        className="sidebar"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={sidebarVariants}
                    >
                        <div className="sidebar-header">
                            <div className="sidebar-brand">
                                <img src={logo} alt="Logo" className="sidebar-logo" />
                                <h2>Menu</h2>
                            </div>
                            <button className="btn-icon" onClick={onClose}>
                                <X size={24} />
                            </button>
                        </div>

                        <nav className="sidebar-nav">
                            <Link
                                to="/"
                                className={`sidebar-link ${location.pathname === '/' ? 'active' : ''}`}
                                onClick={onClose}
                            >
                                <Home size={20} />
                                <span>Home</span>
                            </Link>
                            <Link
                                to="/connect"
                                className={`sidebar-link ${location.pathname === '/connect' ? 'active' : ''}`}
                                onClick={onClose}
                            >
                                <Settings size={20} />
                                <span>Settings</span>
                            </Link>
                            <Link
                                to="/docs"
                                className={`sidebar-link ${location.pathname === '/docs' ? 'active' : ''}`}
                                onClick={onClose}
                            >
                                <BookOpen size={20} />
                                <span>Documentation</span>
                            </Link>
                        </nav>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};

export default Sidebar;
