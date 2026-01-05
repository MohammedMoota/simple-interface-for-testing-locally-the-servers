import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, FileText, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background text-white pt-20">
            {/* Hero Section */}
            <section className="relative px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center overflow-hidden">

                {/* Background glow effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -z-10" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8 p-1 px-3 bg-indigo-900/30 border border-indigo-500/30 rounded-full text-indigo-300 text-sm font-medium"
                >
                    FYP Secure Network System 2.0
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
                >
                    Secure Network <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                        Architecture Design
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="max-w-2xl text-lg text-gray-400 mb-10"
                >
                    Implementation of a secure network architecture with centralized log management and basic SIEM analysis. Enhanced security for modern enterprises.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Link to="/dashboard">
                        <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-105">
                            View Documentation
                        </button>
                    </Link>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<FileText className="w-8 h-8 text-blue-400" />}
                        title="Centralized Logging"
                        description="Aggregated logs from all network devices in a single secure location for comprehensive analysis."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={<Activity className="w-8 h-8 text-green-400" />}
                        title="Real-time Monitoring"
                        description="Live dashboard metrics and alerts to keep you informed of network health and security status."
                        delay={0.4}
                    />
                    <FeatureCard
                        icon={<Shield className="w-8 h-8 text-purple-400" />}
                        title="Threat Detection"
                        description="Basic SIEM analysis to identify potentially malicious activities and security breaches."
                        delay={0.6}
                    />
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 transition-all group"
    >
        <div className="mb-4 p-3 bg-white/5 w-fit rounded-lg group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed">
            {description}
        </p>
    </motion.div>
);

export default LandingPage;
