import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Server, Lock, Globe } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen bg-background text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 bg-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-indigo-600/30"
                    >
                        <Shield className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-bold mb-4">About the Project</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Design and Implementation of a Secure Network Architecture with Centralized Log Management.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16 relative z-10">
                    <AboutCard
                        icon={<Server className="w-6 h-6 text-indigo-400" />}
                        title="Architecture"
                        description="A robust network design featuring DMZ, Internal, and secure remote access zones, simulated securely within EVE-NG."
                        delay={0.1}
                    />
                    <AboutCard
                        icon={<Globe className="w-6 h-6 text-purple-400" />}
                        title="Connectivity"
                        description="Seamless integration of various network segments ensuring high availability and redundancy across the infrastructure."
                        delay={0.2}
                    />
                    <AboutCard
                        icon={<Lock className="w-6 h-6 text-green-400" />}
                        title="Security First"
                        description="Implementation of best practices in network security, including firewall rules, restricted access, and secure protocols."
                        delay={0.3}
                    />
                    <AboutCard
                        icon={<Shield className="w-6 h-6 text-blue-400" />}
                        title="Centralized Mgmt"
                        description="Unified dashboard for logging and monitoring, providing a single pane of glass for network observability."
                        delay={0.4}
                    />
                </div>
            </motion.div>

            {/* Background Glow */}
            <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none -z-10" />
            <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />
        </div>
    );
};

const AboutCard = ({ icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -5, boxShadow: "0 10px 40px -10px rgba(79, 70, 229, 0.3)" }}
        className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
    >
        <div className="mb-4 p-2 bg-white/5 w-fit rounded-lg shadow-inner shadow-white/10">
            {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
            {description}
        </p>
    </motion.div>
);

export default About;
