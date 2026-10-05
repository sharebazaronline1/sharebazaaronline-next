// src/components/SkillUpClient.jsx
"use client";

import { motion } from "framer-motion";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const SkillUpClient = () => {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "SkillUp", url: "/skill-up" },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Hero Section - Coming Soon */}
          <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20 px-8 text-center overflow-hidden">
            {/* Subtle overlay pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-tr from-white via-transparent to-white"></div>
              <div className="absolute inset-0 bg-gradient-to-bl from-white via-transparent to-white"></div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="relative z-10"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                Skill Up – Coming Soon!
              </h1>
              <p className="text-xl sm:text-2xl max-w-4xl mx-auto mb-10 opacity-95 leading-relaxed">
                Master stock market investing, trading strategies, IPO analysis, and financial literacy with expert-led courses.
              </p>
              <div className="flex justify-center">
                <div className="bg-white/20 backdrop-blur-md rounded-full px-10 py-5 border border-white/30">
                  <p className="text-xl font-bold">Launching in 2026</p>
                </div>
              </div>
            </motion.div>

            {/* Decorative blur orbs */}
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-400/30 rounded-full blur-3xl"></div>
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl"></div>
          </div>

          {/* Features Teaser */}
          <div className="px-8 py-16 bg-gray-50">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
              What You'll Learn
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-10 text-center border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">📈</span>
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  Stock Market Basics & Advanced
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  From fundamentals to technical & fundamental analysis
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-10 text-center border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">💼</span>
                </div>
                <h3 className="text-2xl font-bold mb-3">IPO Mastery</h3>
                <p className="text-gray-600 leading-relaxed">
                  How to spot winners, apply smartly, and profit from listings
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SkillUpClient;