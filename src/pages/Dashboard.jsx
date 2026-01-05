import React from 'react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-background text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                <h1 className="text-3xl font-bold mb-2">Project Documentation</h1>
                <p className="text-gray-400 mb-8">Detailed visualizations of the secure network architecture and implementation plan.</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Gantt Chart */}
                    <DashboardCard
                        title="Project Timeline & Gantt Chart"
                        description="A detailed timeline showing the project phases from inception to final submission."
                        imageSrc="/assets/gantt_chart.jpg"
                        delay={0.1}
                    />

                    {/* Network Topology */}
                    <DashboardCard
                        title="Network Topology (EVE-NG)"
                        description="The simulated network architecture including DMZ, Internal Zone, and WFH zones."
                        imageSrc="/assets/network_topology.png"
                        delay={0.2}
                    />

                    {/* Process Flow */}
                    <DashboardCard
                        title="Project Process Flow"
                        description="Flowchart outlining the methodology and stages of the project."
                        imageSrc="/assets/process_flow.jpg"
                        delay={0.3}
                    />

                    {/* Use Case */}
                    <DashboardCard
                        title="Use Case Diagram"
                        description="UML Use Case diagram illustrating system interactions."
                        imageSrc="/assets/use_case_diagram.jpg"
                        delay={0.4}
                    />
                </div>
            </motion.div>
        </div>
    );
};

const DashboardCard = ({ title, description, imageSrc, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group"
    >
        <div className="relative h-64 overflow-hidden bg-black/50">
            <img
                src={imageSrc}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
        <div className="p-6">
            <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
        </div>
    </motion.div>
);

export default Dashboard;
