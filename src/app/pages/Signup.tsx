import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowLeft, Check, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';

interface SignupProps {
  onNavigate: (page: 'landing' | 'login') => void;
  onSignup: () => void;
}

export default function Signup({ onNavigate, onSignup }: SignupProps) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    agreedToTerms: false,
  });

  const privacyPromises = [
    'We will never sell your data',
    'No tracking cookies or fingerprinting',
    'You can delete your account anytime',
    'All data is encrypted end-to-end',
    'You own your content, always',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      onSignup();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-4 py-8">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full blur-[150px] opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate('landing')}
            className="mb-6 hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl mb-2">Create Your Account</h1>
          <p className="text-gray-400">
            Step {step} of 3
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all ${
                  s <= step
                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500'
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                <div className="space-y-4">
                  <h2 className="text-xl mb-6">Before we start...</h2>
                  
                  <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-6 space-y-3">
                    <h3 className="flex items-center gap-2 mb-4">
                      <Shield className="w-5 h-5 text-violet-400" />
                      Our Privacy Promise
                    </h3>
                    {privacyPromises.map((promise, index) => (
                      <motion.div
                        key={promise}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">{promise}</span>
                      </motion.div>
                    ))}
                  </div>

                  <p className="text-sm text-gray-400 leading-relaxed">
                    Unlike other social networks, we collect only what's necessary
                    to provide you the service. No hidden tracking, no data harvesting.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0"
                  size="lg"
                >
                  I Understand, Continue
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="mt-2 bg-white/5 border-white/10 focus:border-violet-500 placeholder:text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Used only for account recovery and important updates
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="username" className="text-gray-300">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="your_username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                      className="mt-2 bg-white/5 border-white/10 focus:border-violet-500 placeholder:text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      How others will see you on the platform
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-gray-300">Password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        className="bg-white/5 border-white/10 focus:border-violet-500 placeholder:text-gray-500 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Minimum 8 characters, encrypted with industry standards
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0"
                  size="lg"
                  disabled={!formData.email || !formData.username || !formData.password}
                >
                  Continue
                </Button>
              </>
            )}

            {step === 3 && (
              <>
                <div className="space-y-6">
                  <h2 className="text-xl">Final Step</h2>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="terms"
                        checked={formData.agreedToTerms}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, agreedToTerms: checked as boolean })
                        }
                        className="mt-1"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-300 leading-relaxed cursor-pointer">
                        I agree to the Terms of Service and Privacy Policy.
                        I understand my data will be processed according to GDPR
                        and I have the right to access, modify, or delete it anytime.
                      </label>
                    </div>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
                    <h3 className="flex items-center gap-2 text-green-400 mb-3">
                      <Check className="w-5 h-5" />
                      You're All Set!
                    </h3>
                    <p className="text-sm text-gray-300">
                      Your account will be created with maximum privacy settings by default.
                      You can customize these anytime in your Privacy Dashboard.
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0"
                  size="lg"
                  disabled={!formData.agreedToTerms}
                >
                  Create My Account
                </Button>
              </>
            )}
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate('login')}
              className="text-sm text-gray-400 hover:text-gray-300"
            >
              Already have an account? <span className="text-violet-400">Sign in</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
