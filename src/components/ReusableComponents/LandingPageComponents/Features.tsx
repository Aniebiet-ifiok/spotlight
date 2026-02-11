import React from 'react';
import { motion } from 'framer-motion';
import { RiRobot3Line } from 'react-icons/ri';
import { LuZap } from 'react-icons/lu';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import Link from 'next/link';

const CORE_FEATURES = [
  {
    id: 1,
    icon: <RiRobot3Line aria-hidden="true" />,
    title: 'AI Sales Agents',
    description: 'AI voice agents pitch your products and convert leads into sales automatically',
  },
  {
    id: 2,
    icon: <LuZap aria-hidden="true" />,
    title: 'Automated Webinars',
    description: 'Run live AI-driven webinars that sell your products 24/7',
  },
  {
    id: 3,
    icon: <MdOutlineAddShoppingCart aria-hidden="true" />,
    title: 'Sell Products Directly',
    description: 'Seamlessly integrate and sell your products directly within your automated webinars',
  },
  {
    id: 4,
    icon: <CiEdit aria-hidden="true" />,
    title: 'Customizable AI',
    description: "Tailor your AI agents' scripts and behavior with easy-to-use prompt customization",
  },
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const Features = () => {
  return (
    <section className="relative flex flex-col items-center py-24 px-6 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#2c8c8815] via-transparent to-transparent -z-10" />

      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 max-w-3xl"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight ubuntu-medium">
          Powerful <span className="themeColor">Features</span>
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          The next generation of sales automation, designed to scale your business effortlessly.
        </p>
      </motion.header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl"
      >
        {CORE_FEATURES.map(({ id, icon, title, description }) => (
          <motion.article
            key={id}
            variants={itemVariants}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-[#2c8c88]/50 transition-colors duration-500"
          >
            <div className="relative bg-[#0a0a0a] backdrop-blur-xl flex flex-col h-full items-center text-center p-8 rounded-2xl border border-white/5 shadow-2xl">
              <div className="mb-6 p-4 rounded-full bg-white/5 group-hover:bg-[#2c8c88]/10 transition-colors duration-300 text-[35px] themeColor">
                {icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-wide">
                {title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                {description}
              </p>
            </div>
          </motion.article>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        viewport={{ once: true }}
      >
      
      </motion.div>
    </section>
  );
};

export default Features;