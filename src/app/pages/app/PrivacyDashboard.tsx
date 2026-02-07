import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  Eye,
  Lock,
  Globe,
  Bell,
  Database,
  Download,
  Trash2,
  Check,
  Info,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';

export default function PrivacyDashboard() {
  const [settings, setSettings] = useState({
    profileVisibility: true,
    activityStatus: false,
    readReceipts: true,
    dataCollection: false,
    personalization: true,
    locationSharing: false,
    contactSync: false,
    analyticsSharing: false,
  });

  const updateSetting = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const privacyScore = Object.values(settings).filter(
    (v, i) => i % 2 === 0 ? !v : v
  ).length * 12.5;

  const sections = [
    {
      title: 'Profile & Visibility',
      icon: Eye,
      description: 'Control who can see your profile and activity',
      settings: [
        {
          key: 'profileVisibility' as const,
          label: 'Public Profile',
          description: 'Allow others to find and view your profile',
          recommended: true,
        },
        {
          key: 'activityStatus' as const,
          label: 'Activity Status',
          description: 'Show when you\'re online or active',
          recommended: false,
        },
      ],
    },
    {
      title: 'Communication',
      icon: Bell,
      description: 'Manage how you communicate with others',
      settings: [
        {
          key: 'readReceipts' as const,
          label: 'Read Receipts',
          description: 'Let others know when you\'ve read their messages',
          recommended: true,
        },
      ],
    },
    {
      title: 'Data & Privacy',
      icon: Database,
      description: 'Control what data we collect and how it\'s used',
      settings: [
        {
          key: 'dataCollection' as const,
          label: 'Additional Data Collection',
          description: 'Allow collection beyond essential functionality',
          recommended: false,
        },
        {
          key: 'personalization' as const,
          label: 'Content Personalization',
          description: 'Use your activity to suggest relevant content',
          recommended: true,
        },
        {
          key: 'analyticsSharing' as const,
          label: 'Anonymous Analytics',
          description: 'Share anonymous usage data to improve the platform',
          recommended: false,
        },
      ],
    },
    {
      title: 'Location & Contacts',
      icon: Globe,
      description: 'Manage access to your location and contacts',
      settings: [
        {
          key: 'locationSharing' as const,
          label: 'Location Sharing',
          description: 'Share your location with posts and profile',
          recommended: false,
        },
        {
          key: 'contactSync' as const,
          label: 'Contact Sync',
          description: 'Find friends by syncing your contacts',
          recommended: false,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl mb-2">Privacy Dashboard</h1>
          <p className="text-gray-400">
            Full transparency and control over your data
          </p>
        </div>

        {/* Privacy Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-3xl p-8"
        >
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - privacyScore / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#d946ef" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl mb-1">{Math.round(privacyScore)}%</div>
                  <div className="text-xs text-gray-400">Protected</div>
                </div>
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-2xl mb-2">Your Privacy Score</h2>
              <p className="text-gray-400 mb-4">
                {privacyScore >= 80
                  ? 'Excellent! Your privacy settings are highly secure.'
                  : privacyScore >= 60
                  ? 'Good! Consider reviewing some settings for better privacy.'
                  : 'Review your settings to improve your privacy protection.'}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Check className="w-3 h-3 mr-1" />
                  End-to-End Encryption
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  <Lock className="w-3 h-3 mr-1" />
                  Zero Tracking
                </Badge>
                <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">
                  <Shield className="w-3 h-3 mr-1" />
                  GDPR Compliant
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Privacy Settings Sections */}
        <div className="space-y-6">
          {sections.map((section, sectionIndex) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="text-xl mb-1">{section.title}</h3>
                      <p className="text-sm text-gray-400">{section.description}</p>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-white/10">
                  {section.settings.map((setting) => (
                    <div key={setting.key} className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Label htmlFor={setting.key} className="cursor-pointer">
                              {setting.label}
                            </Label>
                            {!setting.recommended && (
                              <Badge
                                variant="outline"
                                className="border-violet-500/30 text-violet-400 text-xs"
                              >
                                Recommended Off
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 leading-relaxed">
                            {setting.description}
                          </p>
                        </div>
                        <Switch
                          id={setting.key}
                          checked={settings[setting.key]}
                          onCheckedChange={() => updateSetting(setting.key)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Data Management */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl mb-1">Your Data</h3>
              <p className="text-sm text-gray-400">
                Download or delete your data at any time
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="border-white/10 hover:bg-white/5 justify-start h-auto py-4"
            >
              <Download className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div>Download Your Data</div>
                <div className="text-xs text-gray-400 mt-1">
                  Get a copy of everything you've shared
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="border-red-500/30 hover:bg-red-500/10 text-red-400 hover:text-red-300 justify-start h-auto py-4"
            >
              <Trash2 className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div>Delete Account</div>
                <div className="text-xs opacity-70 mt-1">
                  Permanently remove your account
                </div>
              </div>
            </Button>
          </div>
        </div>

        {/* Privacy Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-blue-400 mb-2">How We Protect Your Privacy</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• We collect only the minimum data needed for the service to work</li>
                <li>• All your communications are end-to-end encrypted</li>
                <li>• We never sell your data to advertisers or third parties</li>
                <li>• You have full control to export or delete your data anytime</li>
                <li>• Our algorithms are transparent and you control what you see</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
