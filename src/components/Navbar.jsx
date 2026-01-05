import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Shield, LogIn, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Don't show navbar on login/signup pages
    if (location.pathname === '/login' || location.pathname === '/signup') {
        return null;
    }

    return (
        <nav className="fixed w-full z-50 top-0 start-0 border-b border-white/10 bg-black/20 backdrop-blur-lg">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to={isAuthenticated ? "/dashboard" : "/login"} className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/30">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <span className="self-center text-2xl font-bold whitespace-nowrap text-white">FYP <span className="text-indigo-400">Secure</span></span>
                </Link>
                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse items-center">
                    {isAuthenticated ? (
                        <>
                            {user?.role === 'Admin' && (
                                <Link to="/admin" className="hidden md:block mr-2">
                                    <button type="button" className="text-gray-300 hover:text-white font-medium rounded-lg text-sm px-4 py-2 text-center transition-all">
                                        Admin
                                    </button>
                                </Link>
                            )}
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="text-gray-300 hover:text-white font-medium rounded-lg text-sm px-4 py-2 text-center transition-all flex items-center gap-2"
                            >
                                <LogOut size={16} />
                                <span className="hidden md:inline">Log Out</span>
                            </button>
                        </>
                    ) : (
                        <Link to="/login">
                            <button type="button" className="text-white bg-white/10 hover:bg-white/20 focus:ring-4 focus:outline-none focus:ring-gray-800 font-medium rounded-lg text-sm px-4 py-2 text-center transition-all flex items-center gap-2 border border-white/10">
                                <LogIn size={16} />
                                Log In
                            </button>
                        </Link>
                    )}

                    {isAuthenticated && (
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            data-collapse-toggle="navbar-sticky"
                            type="button"
                            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    )}
                </div>
                {/* Only show navigation links when authenticated */}
                {isAuthenticated && (
                    <div className={`items-center justify-between w-full md:flex md:w-auto md:absolute md:left-1/2 md:-translate-x-1/2 ${isOpen ? 'block' : 'hidden'}`} id="navbar-sticky">
                        <ul className="flex flex-col p-2 md:p-1 mt-4 font-medium border border-white/10 rounded-2xl bg-black/40 backdrop-blur-md md:bg-white/5 md:backdrop-blur-none md:border-white/5 md:space-x-2 rtl:space-x-reverse md:flex-row md:mt-0 shadow-xl">
                            <li>
                                <Link to="/" className={`block py-2 px-5 rounded-full text-sm transition-all duration-300 ${location.pathname === '/' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}>Home</Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className={`block py-2 px-5 rounded-full text-sm transition-all duration-300 ${location.pathname === '/dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}>Docs</Link>
                            </li>
                            <li>
                                <Link to="/about" className={`block py-2 px-5 rounded-full text-sm transition-all duration-300 ${location.pathname === '/about' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}>About</Link>
                            </li>
                            {/* Mobile Only Links - Admin only */}
                            {user?.role === 'Admin' && (
                                <li className="md:hidden">
                                    <Link to="/admin" className={`block py-2 px-5 rounded-full text-sm transition-all duration-300 ${location.pathname === '/admin' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}>Admin Panel</Link>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};

const LogOut = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
)

export default Navbar;
