import { motion } from 'motion/react';
import { Shield, Lock, Eye, Heart, Users, Zap, ArrowRight, Check, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';

interface LandingProps {
  onNavigate: (page: 'signup' | 'login') => void;
}

export default function Landing({ onNavigate }: LandingProps) {
  const features = [
    {
      icon: Shield,
      title: 'Privacy by Design',
      description: 'Your data stays yours. No tracking, no selling, no exploitation.',
    },
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All conversations are encrypted. Not even we can read them.',
    },
    {
      icon: Eye,
      title: 'Transparent Algorithms',
      description: 'You control what you see. No hidden manipulation.',
    },
    {
      icon: Heart,
      title: 'Ethical Engagement',
      description: 'Designed for healthy connections, not addiction.',
    },
    {
      icon: Users,
      title: 'Real Communities',
      description: 'Connect with people who share your interests and values.',
    },
    {
      icon: Zap,
      title: 'Instant & Lightweight',
      description: 'Blazing fast performance, even on slow networks.',
    },
  ];

  const trustIndicators = [
    'Zero data collection',
    'Open source algorithms',
    'User-controlled feed',
    'No dark patterns',
    'Ethical AI moderation',
    'GDPR compliant',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/50 border-b border-white/5"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl tracking-tight">Ethica</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => onNavigate('login')}
                className="hover:bg-white/5"
              >
                Sign In
              </Button>
              <Button
                onClick={() => onNavigate('signup')}
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-0"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Animated background glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full blur-[150px] pointer-events-none"
          />

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center relative z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-gray-300">Privacy-First Social Network</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl mb-6 bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent leading-tight">
              Social Networking
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect with people who matter, without compromising your privacy or mental health.
              Built for humans, not algorithms.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => onNavigate('signup')}
                size="lg"
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-0 px-8 py-6 text-lg group"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/10 hover:bg-white/5 px-8 py-6 text-lg"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {trustIndicators.map((indicator, index) => (
                <motion.div
                  key={indicator}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{indicator}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl mb-4">
              Built on <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Trust</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Every feature designed with your privacy, security, and wellbeing in mind
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 h-full hover:border-white/20 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-violet-400" />
                    </div>
                    <h3 className="text-xl mb-3">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ethical Algorithm Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center"
          >
            <Eye className="w-16 h-16 text-violet-400 mx-auto mb-6" />
            <h2 className="text-4xl mb-6">
              No Hidden Algorithms
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Traditional social networks use secret algorithms to manipulate what you see,
              keeping you hooked and angry. We believe you deserve better.
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/5 rounded-xl p-6">
                <h4 className="text-lg mb-2">You Choose</h4>
                <p className="text-sm text-gray-400">Control what appears in your feed</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6">
                <h4 className="text-lg mb-2">We Explain</h4>
                <p className="text-sm text-gray-400">Clear reasoning for every decision</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6">
                <h4 className="text-lg mb-2">No Manipulation</h4>
                <p className="text-sm text-gray-400">Zero dark patterns or tricks</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl sm:text-5xl mb-6">
              Ready to take control?
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Join thousands of people choosing privacy, authenticity, and mental wellbeing
            </p>
            <Button
              onClick={() => onNavigate('signup')}
              size="lg"
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-0 px-12 py-6 text-lg"
            >
              Create Your Account
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg">Ethica</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2026 Ethica. Built with privacy and respect.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
