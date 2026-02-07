import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Edit,
  Briefcase,
  GraduationCap,
  Globe,
  Shield,
  Award,
  Users,
  MessageCircle,
  Heart,
  TrendingUp,
  Star,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Separator } from '../../components/ui/separator';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Posts', value: '127', icon: MessageCircle, change: '+12%' },
    { label: 'Followers', value: '1,234', icon: Users, change: '+8%' },
    { label: 'Following', value: '389', icon: Heart, change: '+3%' },
    { label: 'Engagement', value: '94%', icon: TrendingUp, change: '+5%' },
  ];

  const skills = [
    'Privacy Advocacy',
    'Sustainable Living',
    'Photography',
    'Digital Rights',
    'Community Building',
    'Content Creation',
  ];

  const achievements = [
    {
      name: 'Early Adopter',
      description: 'Joined in the first month',
      icon: Award,
      color: 'from-violet-500 to-fuchsia-500',
      date: 'January 2026',
    },
    {
      name: 'Community Helper',
      description: 'Helped 100+ community members',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      date: 'February 2026',
    },
    {
      name: 'Privacy Advocate',
      description: 'Promoted privacy best practices',
      icon: Shield,
      color: 'from-green-500 to-emerald-500',
      date: 'February 2026',
    },
    {
      name: 'Top Contributor',
      description: 'Most valuable community member',
      icon: Star,
      color: 'from-orange-500 to-red-500',
      date: 'February 2026',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'post',
      content: 'Shared thoughts on sustainable living practices',
      time: '2 hours ago',
      engagement: { likes: 42, comments: 8 },
    },
    {
      id: 2,
      type: 'community',
      content: 'Joined "Digital Privacy Advocates" community',
      time: '1 day ago',
    },
    {
      id: 3,
      type: 'achievement',
      content: 'Earned "Privacy Advocate" badge',
      time: '3 days ago',
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
        >
          {/* Cover with Gradient */}
          <div className="h-48 sm:h-64 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/20 to-purple-500/20 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.4),transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(217,70,239,0.3),transparent_70%)]" />
          </div>

          {/* Profile Content */}
          <div className="px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 -mt-20 sm:-mt-16">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-slate-900 shadow-2xl">
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-5xl">
                    JD
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Info & Actions */}
              <div className="flex-1 sm:mt-16">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl sm:text-4xl">Jane Doe</h1>
                      <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <p className="text-xl text-gray-400 mb-3">@janedoe</p>
                    <p className="text-gray-300 leading-relaxed max-w-2xl">
                      Privacy advocate, photographer, and sustainability enthusiast. Building a better
                      future through ethical technology and mindful living.
                    </p>
                  </div>
                  <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0 lg:mt-0">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>

                {/* Quick Info Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Briefcase className="w-4 h-4 flex-shrink-0" />
                    <span>Product Designer</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <LinkIcon className="w-4 h-4 flex-shrink-0" />
                    <a href="#" className="text-violet-400 hover:text-violet-300">
                      janedoe.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>Joined Jan 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-3xl mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - About & Skills */}
          <div className="lg:col-span-1 space-y-6">
            {/* About */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-xl mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-violet-400" />
                About
              </h2>
              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white mb-1">Stanford University</div>
                    <div className="text-gray-400">Computer Science, 2020</div>
                  </div>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white mb-1">Product Designer</div>
                    <div className="text-gray-400">Tech for Good Inc.</div>
                  </div>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white">jane.doe@ethica.com</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-xl mb-4">Skills & Interests</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="border-white/10 hover:bg-white/5 cursor-pointer"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Tabs Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
              <TabsList className="bg-white/5 border border-white/10 w-full justify-start overflow-x-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Highlights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                >
                  <h3 className="text-xl mb-4">Profile Highlights</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-lg mb-1">Growing Influence</div>
                        <div className="text-sm text-gray-400">
                          Your engagement has increased by 94% this month
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-lg mb-1">Active Community Member</div>
                        <div className="text-sm text-gray-400">
                          Part of 12 communities with 1.2K followers
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <motion.div
                      key={achievement.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${achievement.color} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl">{achievement.name}</h3>
                            <span className="text-sm text-gray-400">{achievement.date}</span>
                          </div>
                          <p className="text-gray-400">{achievement.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-gray-200">{activity.content}</p>
                      <span className="text-sm text-gray-400 whitespace-nowrap ml-4">
                        {activity.time}
                      </span>
                    </div>
                    {activity.engagement && (
                      <div className="flex items-center gap-4 text-sm text-gray-400 mt-3 pt-3 border-t border-white/10">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {activity.engagement.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {activity.engagement.comments}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
