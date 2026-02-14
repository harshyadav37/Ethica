import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  X,
  Upload,
  Plus,
  Building,
  School,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Separator } from '../../components/ui/separator';
import { getUserProfile, updateUserProfile } from '../../api/auth';
import { toast } from 'react-hot-toast';

type ProfileData = {
  _id: string;
  fullName: string;
  profileImage: string | null;
  post: string;
  location: string;
  websiteUrl: string;
  aboutMe: string;
  dateOfBirth: string;
  university: string;
  degree: string;
  educationYear: number;
  company: string;
  position: string;
  email: string;
  skills: string[];
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editData, setEditData] = useState<ProfileData | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch profile data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();
        
        // Handle the API response - if it's an array, take the first item
        const profileData = Array.isArray(data) ? data[0] : data;
        
        // Format the date properly
        if (profileData.dateOfBirth) {
          profileData.dateOfBirth = new Date(profileData.dateOfBirth).toISOString().split('T')[0];
        }
        
        setProfile(profileData);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
        console.error(err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeEditModal();
      }
    };

    if (isEditOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isEditOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeEditModal();
      }
    };

    if (isEditOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isEditOpen]);

  const openEditModal = () => {
    if (profile) {
      setEditData({...profile});
      setNewSkill('');
      setIsEditOpen(true);
    }
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditData(null);
    setNewSkill('');
  };

  const handleInputChange = (field: keyof ProfileData, value: string | number | null) => {
    if (!editData) return;
    setEditData((prev) => ({
      ...prev!,
      [field]: value,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editData) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      handleInputChange('profileImage', typeof reader.result === 'string' ? reader.result : null);
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    if (!editData) return;
    handleInputChange('profileImage', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addSkill = () => {
    if (!editData) return;
    
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    
    if (editData.skills && editData.skills.includes(trimmed)) {
      toast.error('Skill already added');
      setNewSkill('');
      return;
    }
    
    setEditData((prev) => ({
      ...prev!,
      skills: [...(prev!.skills || []), trimmed],
    }));
    setNewSkill('');
  };

  const removeSkill = (skill: string) => {
    if (!editData) return;
    setEditData((prev) => ({
      ...prev!,
      skills: prev!.skills.filter((s) => s !== skill),
    }));
  };

  const handleSave = async () => {
    if (!editData || !profile) return;
    
    try {
      setIsSaving(true);
      
      // Prepare the data for update
      const updatePayload = {
        fullName: editData.fullName,
        profileImage: editData.profileImage,
        post: editData.post,
        location: editData.location,
        websiteUrl: editData.websiteUrl,
        aboutMe: editData.aboutMe,
        dateOfBirth: editData.dateOfBirth,
        university: editData.university,
        degree: editData.degree,
        educationYear: editData.educationYear,
        company: editData.company,
        position: editData.position,
        email: editData.email,
        skills: editData.skills || [],
      };

      // Call the update API
      const updatedProfile = await updateUserProfile(profile._id, updatePayload);
      
      // Update the local state with the response
      if (updatedProfile) {
        // Format the date if it exists in the response
        if (updatedProfile.dateOfBirth) {
          updatedProfile.dateOfBirth = new Date(updatedProfile.dateOfBirth).toISOString().split('T')[0];
        }
        setProfile(updatedProfile);
        toast.success('Profile updated successfully!');
      }
      
      closeEditModal();
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (!parts.length) return 'U';
    const [first, second] = parts;
    return (first[0] + (second?.[0] ?? '')).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return 'Invalid date';
    }
  };

  const stats = [
    { label: 'Posts', value: '127', icon: MessageCircle, change: '+12%' },
    { label: 'Followers', value: '1,234', icon: Users, change: '+8%' },
    { label: 'Following', value: '389', icon: Heart, change: '+3%' },
    { label: 'Engagement', value: '94%', icon: TrendingUp, change: '+5%' },
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl text-gray-400">Loading profile...</h2>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-red-400 mb-2">Error</h2>
          <p className="text-gray-400">{error || 'Failed to load profile'}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-gradient-to-r from-violet-500 to-fuchsia-500"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

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
                  {profile.profileImage && (
                    <AvatarImage src={profile.profileImage} alt={profile.fullName} />
                  )}
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-5xl">
                    {getInitials(profile.fullName)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Info & Actions */}
              <div className="flex-1 sm:mt-16">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl sm:text-4xl font-bold text-white">{profile.fullName}</h1>
                      <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <p className="text-gray-300 leading-relaxed max-w-2xl">
                      {profile.aboutMe || 'No bio provided'}
                    </p>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0 lg:mt-0"
                    onClick={openEditModal}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>

                {/* Quick Info Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Briefcase className="w-4 h-4 flex-shrink-0" />
                    <span>{profile.post || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{profile.location || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <LinkIcon className="w-4 h-4 flex-shrink-0" />
                    {profile.websiteUrl ? (
                      <a 
                        href={profile.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-violet-400 hover:text-violet-300 truncate max-w-[200px]"
                      >
                        {profile.websiteUrl.replace(/^https?:\/\//, '')}
                      </a>
                    ) : (
                      <span>No website</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {profile.dateOfBirth 
                        ? `Born ${formatDate(profile.dateOfBirth)}` 
                        : 'Birthday not set'}
                    </span>
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
                <div className="text-3xl text-white mb-1">{stat.value}</div>
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
              <h2 className="text-xl text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-violet-400" />
                About
              </h2>
              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white mb-1">{profile.university || 'Not specified'}</div>
                    <div className="text-gray-400">
                      {profile.degree || 'No degree'} 
                      {profile.educationYear ? `, ${profile.educationYear}` : ''}
                    </div>
                  </div>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white mb-1">{profile.position || 'Not specified'}</div>
                    <div className="text-gray-400">{profile.company || 'Not specified'}</div>
                  </div>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white">{profile.email || 'No email provided'}</div>
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
              <h2 className="text-xl text-white mb-4">Skills & Interests</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="border-white/10 hover:bg-white/5 cursor-pointer text-gray-300"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No skills added yet</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Tabs Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
              <TabsList className="bg-white/5 border border-white/10 w-full justify-start overflow-x-auto">
                <TabsTrigger value="overview" className="text-gray-400 data-[state=active]:text-white">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="achievements" className="text-gray-400 data-[state=active]:text-white">
                  Achievements
                </TabsTrigger>
                <TabsTrigger value="activity" className="text-gray-400 data-[state=active]:text-white">
                  Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Highlights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                >
                  <h3 className="text-xl text-white mb-4">Profile Highlights</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-lg text-white mb-1">Growing Influence</div>
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
                        <div className="text-lg text-white mb-1">Active Community Member</div>
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
                            <h3 className="text-xl text-white">{achievement.name}</h3>
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

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditOpen && editData && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            
            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <h2 className="text-2xl font-semibold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                    Edit Profile
                  </h2>
                  <button
                    onClick={closeEditModal}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Modal Body - Scrollable */}
                <div className="overflow-y-auto p-6" style={{ maxHeight: "calc(90vh - 140px)" }}>
                  <form
                    className="space-y-6"
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleSave();
                    }}
                  >
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-200"
                      >
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        required
                        className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
                        value={editData.fullName}
                        onChange={(event) => handleInputChange('fullName', event.target.value)}
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Profile Image */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-200">
                        Profile Image
                      </label>
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                          <div className="relative group">
                            <Avatar className="w-24 h-24 border-2 border-white/10">
                              {editData.profileImage ? (
                                <AvatarImage src={editData.profileImage} alt="Profile preview" />
                              ) : null}
                              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-2xl">
                                {getInitials(editData.fullName)}
                              </AvatarFallback>
                            </Avatar>
                            {editData.profileImage && (
                              <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute -top-2 -right-2 p-1.5 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-full text-red-400 hover:bg-red-500/40 transition-colors"
                                aria-label="Remove image"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <input
                            ref={fileInputRef}
                            id="image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                          <div className="flex flex-col gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="border-violet-500/40 bg-violet-500/10 text-violet-200 hover:bg-violet-500/20 w-full sm:w-auto"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isSaving}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Upload New Image
                            </Button>
                            <p className="text-xs text-gray-400">
                              Recommended: Square JPG or PNG, at least 400x400px (Max 5MB)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Basic Info Grid */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Post/Title */}
                      <div className="space-y-2">
                        <label
                          htmlFor="post"
                          className="block text-sm font-medium text-gray-200"
                        >
                          Post / Title
                        </label>
                        <input
                          id="post"
                          type="text"
                          className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
                          value={editData.post}
                          onChange={(event) => handleInputChange('post', event.target.value)}
                          placeholder="Product Designer"
                          disabled={isSaving}
                        />
                      </div>

                      {/* Location */}
                      <div className="space-y-2">
                        <label
                          htmlFor="location"
                          className="block text-sm font-medium text-gray-200"
                        >
                          Location
                        </label>
                        <input
                          id="location"
                          type="text"
                          className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
                          value={editData.location}
                          onChange={(event) => handleInputChange('location', event.target.value)}
                          placeholder="San Francisco, CA"
                          disabled={isSaving}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Date of Birth */}
                      <div className="space-y-2">
                        <label
                          htmlFor="dateOfBirth"
                          className="block text-sm font-medium text-gray-200"
                        >
                          Date of Birth
                        </label>
                        <input
                          id="dateOfBirth"
                          type="date"
                          className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all [color-scheme:dark]"
                          value={editData.dateOfBirth}
                          onChange={(event) => handleInputChange('dateOfBirth', event.target.value)}
                          disabled={isSaving}
                        />
                      </div>

                      {/* Website */}
                      <div className="space-y-2">
                        <label
                          htmlFor="websiteUrl"
                          className="block text-sm font-medium text-gray-200"
                        >
                          Website
                        </label>
                        <input
                          id="websiteUrl"
                          type="url"
                          className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
                          value={editData.websiteUrl}
                          onChange={(event) => handleInputChange('websiteUrl', event.target.value)}
                          placeholder="https://example.com"
                          disabled={isSaving}
                        />
                      </div>
                    </div>

                    {/* About Section - Education */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white flex items-center gap-2">
                        <School className="w-5 h-5 text-violet-400" />
                        Education
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label
                            htmlFor="university"
                            className="block text-sm font-medium text-gray-200"
                          >
                            University
                          </label>
                          <input
                            id="university"
                            type="text"
                            className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
                            value={editData.university}
                            onChange={(event) => handleInputChange('university', event.target.value)}
                            placeholder="Stanford University"
                            disabled={isSaving}
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="degree"
                            className="block text-sm font-medium text-gray-200"
                          >
                            Degree
                          </label>
                          <input
                            id="degree"
                            type="text"
                            className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
                            value={editData.degree}
                            onChange={(event) => handleInputChange('degree', event.target.value)}
                            placeholder="Computer Science"
                            disabled={isSaving}
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <label
                            htmlFor="educationYear"
                            className="block text-sm font-medium text-gray-200"
                          >
                            Graduation Year
                          </label>
                          <input
                            id="educationYear"
                            type="number"
                            className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
                            value={editData.educationYear}
                            onChange={(event) => handleInputChange('educationYear', parseInt(event.target.value))}
                            placeholder="2020"
                            disabled={isSaving}
                          />
                        </div>
                      </div>
                    </div>

                    {/* About Section - Work Experience */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white flex items-center gap-2">
                        <Building className="w-5 h-5 text-violet-400" />
                        Work Experience
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label
                            htmlFor="company"
                            className="block text-sm font-medium text-gray-200"
                          >
                            Company
                          </label>
                          <input
                            id="company"
                            type="text"
                            className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
                            value={editData.company}
                            onChange={(event) => handleInputChange('company', event.target.value)}
                            placeholder="Tech for Good Inc."
                            disabled={isSaving}
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="position"
                            className="block text-sm font-medium text-gray-200"
                          >
                            Position
                          </label>
                          <input
                            id="position"
                            type="text"
                            className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
                            value={editData.position}
                            onChange={(event) => handleInputChange('position', event.target.value)}
                            placeholder="Product Designer"
                            disabled={isSaving}
                          />
                        </div>
                      </div>
                    </div>

                    {/* About Section - Contact */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white flex items-center gap-2">
                        <Mail className="w-5 h-5 text-violet-400" />
                        Contact Information
                      </h3>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-200"
                          >
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
                            value={editData.email}
                            onChange={(event) => handleInputChange('email', event.target.value)}
                            placeholder="jane.doe@example.com"
                            disabled={isSaving}
                          />
                        </div>
                      </div>
                    </div>

                    {/* About Section - Bio */}
                    <div className="space-y-2">
                      <label
                        htmlFor="aboutMe"
                        className="block text-sm font-medium text-gray-200"
                      >
                        About Me
                      </label>
                      <textarea
                        id="aboutMe"
                        rows={4}
                        className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all resize-none"
                        value={editData.aboutMe}
                        onChange={(event) => handleInputChange('aboutMe', event.target.value)}
                        placeholder="Tell us about yourself..."
                        disabled={isSaving}
                      />
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                      <label
                        htmlFor="skills"
                        className="block text-sm font-medium text-gray-200"
                      >
                        Skills
                      </label>
                      <div className="flex flex-wrap gap-2 p-3 bg-slate-800/30 rounded-xl border border-white/5 min-h-[80px]">
                        {editData.skills && editData.skills.length > 0 ? (
                          editData.skills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 px-3 py-1.5 text-xs font-medium text-gray-100 border border-violet-500/30"
                            >
                              {skill}
                              <button
                                type="button"
                                className="ml-1 text-gray-400 hover:text-red-400 focus:outline-none transition-colors"
                                onClick={() => removeSkill(skill)}
                                aria-label={`Remove ${skill}`}
                                disabled={isSaving}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 w-full text-center py-2">
                            No skills added yet
                          </p>
                        )}
                      </div>
                      <div className="mt-2 flex gap-2">
                        <input
                          id="newSkill"
                          type="text"
                          className="flex-1 rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
                          placeholder="Add a skill (e.g., React, Design, Photography)"
                          value={newSkill}
                          onChange={(event) => setNewSkill(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.preventDefault();
                              addSkill();
                            }
                          }}
                          disabled={isSaving}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="border-violet-500/40 bg-violet-500/10 text-violet-200 hover:bg-violet-500/20"
                          onClick={addSkill}
                          disabled={isSaving}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-white/20 bg-transparent text-gray-200 hover:bg-white/5"
                        onClick={closeEditModal}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0 min-w-[120px]"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}