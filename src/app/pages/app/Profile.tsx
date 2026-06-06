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
import { useAuth } from '../../context/AuthContext.tsx';
import { toast } from 'react-hot-toast';
import { followUser, unfollowUser, getFollowers, getFollowing } from '../../api/auth';

type ProfileData = {
  _id: string;
  fullName: string;
  profileImage?: string | null;
  post?: string;
  location?: string;
  websiteUrl?: string;
  aboutMe?: string;
  dateOfBirth?: string;
  university?: string;
  degree?: string;
  educationYear?: number;
  company?: string;
  position?: string;
  email?: string;
  skills?: string[];
};

export default function Profile({ onNavigate }: { onNavigate?: (page: any) => void }) {
  const { user, token, login } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editData, setEditData] = useState<ProfileData | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [viewingOther, setViewingOther] = useState(false);

  // Follow-related state
  const [isFollowing, setIsFollowing] = useState(false); // whether current user follows the viewed profile
  const [followers, setFollowers] = useState<any[]>([]); // list of followers for viewed profile
  const [following, setFollowing] = useState<any[]>([]); // list of who viewed profile follows
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = currentUser?._id || currentUser?.id;

  // Helper: initials
  const getInitials = (name?: string) => {
    const parts = (name || '').trim().split(' ').filter(Boolean);
    if (!parts.length) return 'U';
    const [first, second] = parts;
    return (first[0] + (second?.[0] ?? '')).toUpperCase();
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Fetch profile data (either selected external profile or current user's profile)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // If a selected profile was passed via localStorage, use it
        const raw = localStorage.getItem('ethica-selectedProfile');
        if (raw) {
          const sel = JSON.parse(raw as string);
          const mapped: any = {
            _id: sel.id ? String(sel.id) : 'external',
            fullName: sel.name || sel.fullName || 'User',
            profileImage: sel.avatar || sel.profileImage || null,
            post: '',
            location: '',
            websiteUrl: '',
            aboutMe: sel.bio || sel.aboutMe || '',
            dateOfBirth: '',
            university: '',
            degree: '',
            educationYear: 0,
            company: '',
            position: '',
            email: '',
            skills: sel.skills || [],
          };
          setProfile(mapped);
          setViewingOther(true);
          setLoading(false);
          return;
        }

        const data = await getUserProfile();
        const profileData = Array.isArray(data) ? data[0] : data;
        if (profileData?.dateOfBirth) {
          profileData.dateOfBirth = new Date(profileData.dateOfBirth).toISOString().split('T')[0];
        }
        setProfile(profileData);
        setViewingOther(false);
        // Quick local cache fallback: if we have a stored following list, use it as a temporary display
        try {
          const raw = localStorage.getItem('ethica-following');
          if (raw) {
            const ids: string[] = JSON.parse(raw || '[]');
            if (ids && ids.length > 0 && String(profileData._id) === String(currentUserId)) {
              const fallback = ids.map((id) => ({ _id: id, fullName: 'User' }));
              setFollowing(fallback);
              setFollowingCount(ids.length);
            }
          }
        } catch (e) {
          // ignore
        }
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => {
      try { localStorage.removeItem('ethica-selectedProfile'); } catch {}
    };
  }, []);

  // Fetch followers/following for the viewed profile and update counts
  const fetchCounts = async () => {
    try {
      if (!profile?._id) return;
      const followersRes = await getFollowers(profile._id);
      const followingRes = await getFollowing(profile._id);

      const rawFollowers = followersRes?.data ?? (Array.isArray(followersRes) ? followersRes : []);
      const rawFollowing = followingRes?.data ?? (Array.isArray(followingRes) ? followingRes : []);

      const normalize = (arr: any[]) => arr.map((item: any) => item?.follower ?? item?.following ?? item?.user ?? item);

      const fList = normalize(rawFollowers || []);
      const foList = normalize(rawFollowing || []);

      console.debug('Profile fetchCounts:', { profileId: profile._id, followers: fList.length, following: foList.length, followersSample: fList.slice(0,3), followingSample: foList.slice(0,3) });

      setFollowers(fList);
      setFollowing(foList);
      setFollowersCount(followersRes?.count ?? fList.length ?? 0);
      setFollowingCount(followingRes?.count ?? foList.length ?? 0);
    } catch (err) {
      console.error('Count Error:', err);
    }
  };

  const openFollowersModal = async () => {
    await fetchCounts();
    setShowFollowersModal(true);
  };

  const openFollowingModal = async () => {
    await fetchCounts();
    setShowFollowingModal(true);
  };

  // Determine whether current logged-in user follows the viewed profile
  const determineFollowStatus = async () => {
    try {
      if (!currentUserId || !profile?._id) return;
      const res = await getFollowing(currentUserId);
      const list = res?.data ?? (Array.isArray(res) ? res : []);
      const ids = list
        .map((item: any) => item?.following?._id ?? item?._id ?? item?.id)
        .filter(Boolean)
        .map(String);
      console.debug('determineFollowStatus:', { currentUserId, profileId: profile._id, followingCount: ids.length, sample: ids.slice(0,5) });
      setIsFollowing(ids.includes(String(profile._id)));
    } catch (err) {
      console.error('Determine follow status error', err);
    }
  };

  // When profile changes (or current user changes), refresh counts and follow status
  useEffect(() => {
    if (profile?._id) {
      fetchCounts();
      determineFollowStatus();
    }
  }, [profile?._id, currentUserId]);

  // Follow/unfollow handlers (work for both community and profile contexts)
  const handleFollow = async (userId: string) => {
    try {
      await followUser(userId);
      // If the followed user is the currently viewed profile, update state optimistically
      if (profile && String(profile._id) === String(userId)) {
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
      }
      // Refresh counts for viewed profile
      await fetchCounts();
      await determineFollowStatus();

      // Also refresh the current user's "following" list so their profile shows updates
      try {
        if (currentUserId) {
          const myFollowingRes = await getFollowing(currentUserId);
          const rawMyList = myFollowingRes?.data ?? (Array.isArray(myFollowingRes) ? myFollowingRes : []);
          const normalize = (arr: any[]) => arr.map((item: any) => item?.follower ?? item?.following ?? item?.user ?? item);
          const myList = normalize(rawMyList || []);
          const ids = myList
            .map((item: any) => item?._id ?? item?.id)
            .filter(Boolean)
            .map(String);
          try { localStorage.setItem('ethica-following', JSON.stringify(ids)); } catch (e) {}
          // If user is viewing their own profile, update local state immediately
          if (!viewingOther && String(profile?._id) === String(currentUserId)) {
            setFollowing(myList);
            setFollowingCount(myFollowingRes?.count ?? myList.length ?? 0);
          }
        }
      } catch (e) {
        console.error('Refresh my following list error', e);
      }
    } catch (err) {
      console.error('Follow Error:', err);
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      await unfollowUser(userId);
      if (profile && String(profile._id) === String(userId)) {
        setIsFollowing(false);
        setFollowersCount((prev) => Math.max(prev - 1, 0));
      }
      // Refresh counts for viewed profile
      await fetchCounts();
      await determineFollowStatus();

      // Also refresh the current user's "following" list so their profile shows updates
      try {
        if (currentUserId) {
          const myFollowingRes = await getFollowing(currentUserId);
          const rawMyList = myFollowingRes?.data ?? (Array.isArray(myFollowingRes) ? myFollowingRes : []);
          const normalize = (arr: any[]) => arr.map((item: any) => item?.follower ?? item?.following ?? item?.user ?? item);
          const myList = normalize(rawMyList || []);
          const ids = myList
            .map((item: any) => item?._id ?? item?.id)
            .filter(Boolean)
            .map(String);
          try { localStorage.setItem('ethica-following', JSON.stringify(ids)); } catch (e) {}
          if (!viewingOther && String(profile?._id) === String(currentUserId)) {
            setFollowing(myList);
            setFollowingCount(myFollowingRes?.count ?? myList.length ?? 0);
          }
        }
      } catch (e) {
        console.error('Refresh my following list error', e);
      }
    } catch (err) {
      console.error('Unfollow Error:', err);
    }
  };

  // Small UI helpers and edit-profile logic (kept as before but simplified)
  const openEditModal = () => {
    if (profile) {
      setEditData({ ...profile });
      setNewSkill('');
      setIsEditOpen(true);
    }
  };
  const closeEditModal = () => { setIsEditOpen(false); setEditData(null); setNewSkill(''); };

  const handleSave = async () => {
    if (!editData) return;
    try {
      setIsSaving(true);
      const updated = await updateUserProfile(editData as any);
      if (updated) {
        if (updated.dateOfBirth) updated.dateOfBirth = new Date(updated.dateOfBirth).toISOString().split('T')[0];
        setProfile(updated);
        if (token && user) login({ token, user: { ...user, profileImage: updated.profileImage ?? user.profileImage, name: updated.fullName || user.name, email: updated.email || user.email } });
        toast.success('Profile updated successfully!');
      }
      closeEditModal();
    } catch (err: any) {
      console.error('Save Error:', err);
      toast.error(err?.message || 'Failed to save profile');
    } finally { setIsSaving(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl text-gray-400">Loading profile...</h2>
      </div>
    </div>
  );

  if (error || !profile) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl text-red-400 mb-2">Error</h2>
        <p className="text-gray-400">{error || 'Failed to load profile'}</p>
        <Button onClick={() => window.location.reload()} className="mt-4 bg-gradient-to-r from-violet-500 to-fuchsia-500">Try Again</Button>
      </div>
    </div>
  );

  // Render
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
          <div className="h-48 sm:h-64 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/20 to-purple-500/20 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.4),transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(217,70,239,0.3),transparent_70%)]" />
          </div>
          <div className="px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 -mt-20 sm:-mt-16">
              <div className="flex-shrink-0">
                <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-slate-900 shadow-2xl">
                  {profile.profileImage ? <AvatarImage src={profile.profileImage} alt={profile.fullName} /> : (
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-5xl">{getInitials(profile.fullName)}</AvatarFallback>
                  )}
                </Avatar>
              </div>

              {/* Info & Actions */}
              <div className="flex-1 sm:mt-16">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
                  <div>
                  {/* Followers Modal */}
                  <AnimatePresence>
                    {showFollowersModal && (
                      <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="fixed inset-0 bg-black/60 z-50" />
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.18 }} className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-auto">
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                              <h3 className="text-lg font-semibold">Followers</h3>
                              <button onClick={() => setShowFollowersModal(false)} className="p-2 rounded hover:bg-white/5"><X className="w-4 h-4 text-gray-300" /></button>
                            </div>
                            <div className="p-4">
                              {followers && followers.length > 0 ? (
                                <div className="space-y-3">
                                  {followers.map((f: any) => (
                                    <div key={f._id || f.id} className="flex items-center justify-between gap-3">
                                      <div className="flex items-center gap-3">
                                        <Avatar className="w-9 h-9">
                                          {f.profileImage ? <AvatarImage src={f.profileImage} alt={f.fullName || f.name} /> : <AvatarFallback>{getInitials(f.fullName || f.name)}</AvatarFallback>}
                                        </Avatar>
                                        <div>
                                          <div className="font-medium text-white">{f.fullName || f.name}</div>
                                          <div className="text-sm text-gray-400">{f.aboutMe || ''}</div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button size="sm" variant="outline" onClick={() => { try { localStorage.setItem('ethica-selectedProfile', JSON.stringify({ id: f._id || f.id, name: f.fullName || f.name })); } catch(e){} window.location.href = `/profile/${f._id || f.id}`; }}>View Profile</Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-sm text-gray-400">No followers yet</div>
                              )}
                            </div>
                          </motion.div>
                        </div>
                      </>
                    )}
                  </AnimatePresence>

                  {/* Following Modal */}
                  <AnimatePresence>
                    {showFollowingModal && (
                      <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="fixed inset-0 bg-black/60 z-50" />
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.18 }} className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-auto">
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                              <h3 className="text-lg font-semibold">Following</h3>
                              <button onClick={() => setShowFollowingModal(false)} className="p-2 rounded hover:bg-white/5"><X className="w-4 h-4 text-gray-300" /></button>
                            </div>
                            <div className="p-4">
                              {following && following.length > 0 ? (
                                <div className="space-y-3">
                                  {following.map((f: any) => (
                                    <div key={f._id || f.id} className="flex items-center justify-between gap-3">
                                      <div className="flex items-center gap-3">
                                        <Avatar className="w-9 h-9">
                                          {f.profileImage ? <AvatarImage src={f.profileImage} alt={f.fullName || f.name} /> : <AvatarFallback>{getInitials(f.fullName || f.name)}</AvatarFallback>}
                                        </Avatar>
                                        <div>
                                          <div className="font-medium text-white">{f.fullName || f.name}</div>
                                          <div className="text-sm text-gray-400">{f.aboutMe || ''}</div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button size="sm" variant="outline" onClick={() => { try { localStorage.setItem('ethica-selectedProfile', JSON.stringify({ id: f._id || f.id, name: f.fullName || f.name })); } catch(e){} window.location.href = `/profile/${f._id || f.id}`; }}>View Profile</Button>
                                        {String(f._id || f.id) !== String(currentUserId) && (
                                          <Button size="sm" onClick={() => { if (String(f._id || f.id) === String(profile?._id)) { if (isFollowing) handleUnfollow(String(f._id || f.id)); else handleFollow(String(f._id || f.id)); } else { handleFollow(String(f._id || f.id)); } }}>{/* simplistic follow toggle */}{isFollowing ? 'Unfollow' : 'Follow'}</Button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-sm text-gray-400">Not following anyone yet</div>
                              )}
                            </div>
                          </motion.div>
                        </div>
                      </>
                    )}
                  </AnimatePresence>

                  {/* Profile Title & Bio */}
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">{profile.fullName || 'User'}</h1>
                    <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30"><Shield className="w-3 h-3 mr-1" /> Verified</Badge>
                  </div>
                  <p className="text-gray-300 leading-relaxed max-w-2xl">{profile.aboutMe || 'No bio provided'}</p>
                </div>

                  {viewingOther ? (
                    <div className="flex gap-3">
                      <Button className={`bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0 lg:mt-0 ${isFollowing ? 'opacity-80' : ''}`} onClick={() => { const id = profile?._id; if (!id) return; if (isFollowing) handleUnfollow(String(id)); else handleFollow(String(id)); }} size="sm">{isFollowing ? 'Unfollow' : 'Follow'}</Button>
                      <Button size="sm" variant="outline" onClick={() => { try { localStorage.setItem('ethica-startConversation', JSON.stringify({ id: profile?._id, name: profile?.fullName })); } catch(e) {} onNavigate?.('messages'); }}>Message</Button>
                    </div>
                  ) : (
                    <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0 lg:mt-0" onClick={openEditModal}><Edit className="w-4 h-4 mr-2" /> Edit Profile</Button>
                  )}
                </div>

                {/* Quick Info Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-400"><Briefcase className="w-4 h-4 flex-shrink-0" /><span>{profile.post || 'Not specified'}</span></div>
                  <div className="flex items-center gap-2 text-gray-400"><MapPin className="w-4 h-4 flex-shrink-0" /><span>{profile.location || 'Not specified'}</span></div>
                  <div className="flex items-center gap-2 text-gray-400"><LinkIcon className="w-4 h-4 flex-shrink-0" />{profile.websiteUrl ? (<a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 truncate max-w-[200px]">{profile.websiteUrl.replace(/^https?:\/\//, '')}</a>) : (<span>No website</span>)}</div>
                  <div className="flex items-center gap-2 text-gray-400"><Calendar className="w-4 h-4 flex-shrink-0" /><span>{profile.dateOfBirth ? `Born ${formatDate(profile.dateOfBirth)}` : 'Birthday not set'}</span></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards (followers/following use profile counts) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group"><div className="text-3xl text-white mb-1">127</div><div className="text-sm text-gray-400">Posts</div></motion.div>
          <motion.div onClick={openFollowersModal} className="cursor-pointer bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group"><div className="text-3xl text-white mb-1">{followersCount}</div><div className="text-sm text-gray-400">Followers</div></motion.div>
          <motion.div onClick={openFollowingModal} className="cursor-pointer bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group"><div className="text-3xl text-white mb-1">{followingCount}</div><div className="text-sm text-gray-400">Following</div></motion.div>
          <motion.div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group"><div className="text-3xl text-white mb-1">94%</div><div className="text-sm text-gray-400">Engagement</div></motion.div>
        </div>

        {/* Main Content Area (About, Skills, Tabs: Overview, Achievements, Activity) */}
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
                <TabsTrigger value="overview" className="text-gray-400 data-[state=active]:text-white">Overview</TabsTrigger>
                <TabsTrigger value="achievements" className="text-gray-400 data-[state=active]:text-white">Achievements</TabsTrigger>
                <TabsTrigger value="activity" className="text-gray-400 data-[state=active]:text-white">Activity</TabsTrigger>
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
                        <div className="text-sm text-gray-400">Your engagement has increased by 94% this month</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-lg text-white mb-1">Active Community Member</div>
                        <div className="text-sm text-gray-400">Part of 12 communities with 1.2K followers</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4">
                {/** Simple achievements static list for now */}
                {[
                  { name: 'Early Adopter', description: 'Joined in the first month', icon: Award, color: 'from-violet-500 to-fuchsia-500', date: 'January 2026' },
                  { name: 'Community Helper', description: 'Helped 100+ community members', icon: Users, color: 'from-blue-500 to-cyan-500', date: 'February 2026' },
                  { name: 'Privacy Advocate', description: 'Promoted privacy best practices', icon: Shield, color: 'from-green-500 to-emerald-500', date: 'February 2026' },
                  { name: 'Top Contributor', description: 'Most valuable community member', icon: Star, color: 'from-orange-500 to-red-500', date: 'February 2026' },
                ].map((achievement, index) => {
                  const Icon = achievement.icon as any;
                  return (
                    <motion.div
                      key={achievement.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${achievement.color} flex items-center justify-center flex-shrink-0`}>
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
                {[
                  { id: 1, type: 'post', content: 'Shared thoughts on sustainable living practices', time: '2 hours ago', engagement: { likes: 42, comments: 8 } },
                  { id: 2, type: 'community', content: 'Joined "Digital Privacy Advocates" community', time: '1 day ago' },
                  { id: 3, type: 'achievement', content: 'Earned "Privacy Advocate" badge', time: '3 days ago' },
                ].map((activity, index) => (
                  <motion.div key={activity.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-gray-200">{activity.content}</p>
                      <span className="text-sm text-gray-400 whitespace-nowrap ml-4">{activity.time}</span>
                    </div>
                    {activity.engagement && (
                      <div className="flex items-center gap-4 text-sm text-gray-400 mt-3 pt-3 border-t border-white/10">
                        <span className="flex items-center gap-1"><Heart className="w-4 h-4" />{activity.engagement.likes}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" />{activity.engagement.comments}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal (simplified) */}
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
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <h2 className="text-2xl font-semibold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Edit Profile</h2>
                  <button onClick={closeEditModal} className="p-2 rounded-lg hover:bg-white/10 transition-colors" aria-label="Close modal">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Modal Body - Scrollable */}
                <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 140px)' }}>
                  <form
                    className="space-y-6"
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleSave();
                    }}
                  >
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-200">Full Name <span className="text-red-400">*</span></label>
                      <input
                        id="fullName"
                        type="text"
                        required
                        className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
                        value={editData.fullName}
                        onChange={(event) => setEditData({ ...editData, fullName: event.target.value })}
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Profile Image */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-200">Profile Image</label>
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                          <div className="relative group">
                            <Avatar className="w-24 h-24 border-2 border-white/10">
                              {editData.profileImage ? (
                                <AvatarImage src={editData.profileImage} alt="Profile preview" />
                              ) : null}
                              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-2xl">{getInitials(editData.fullName)}</AvatarFallback>
                            </Avatar>
                            {editData.profileImage && (
                              <button
                                type="button"
                                onClick={() => setEditData({ ...editData, profileImage: '' })}
                                className="absolute -top-2 -right-2 p-1.5 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-full text-red-400 hover:bg-red-500/40 transition-colors"
                                aria-label="Remove image"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <input ref={fileInputRef} id="image" type="file" accept="image/*" className="hidden" onChange={() => { /* file handling kept minimal for now */ }} />
                          <div className="flex flex-col gap-2">
                            <Button type="button" variant="outline" className="border-violet-500/40 bg-violet-500/10 text-violet-200 hover:bg-violet-500/20 w-full sm:w-auto" onClick={() => fileInputRef.current?.click()} disabled={isSaving}>
                              <Upload className="w-4 h-4 mr-2" />
                              Upload New Image
                            </Button>
                            <p className="text-xs text-gray-400">Recommended: Square JPG or PNG, at least 400x400px (Max 5MB)</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Basic Info Grid */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Post/Title */}
                      <div className="space-y-2">
                        <label htmlFor="post" className="block text-sm font-medium text-gray-200">Post / Title</label>
                        <input id="post" type="text" className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all" value={editData.post} onChange={(e) => setEditData({ ...editData, post: e.target.value })} placeholder="Product Designer" disabled={isSaving} />
                      </div>

                      {/* Location */}
                      <div className="space-y-2">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-200">Location</label>
                        <input id="location" type="text" className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all" value={editData.location} onChange={(e) => setEditData({ ...editData, location: e.target.value })} placeholder="San Francisco, CA" disabled={isSaving} />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Date of Birth */}
                      <div className="space-y-2">
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-200">Date of Birth</label>
                        <input id="dateOfBirth" type="date" className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all [color-scheme:dark]" value={editData.dateOfBirth} onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })} disabled={isSaving} />
                      </div>

                      {/* Website */}
                      <div className="space-y-2">
                        <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-200">Website</label>
                        <input id="websiteUrl" type="url" className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all" value={editData.websiteUrl} onChange={(e) => setEditData({ ...editData, websiteUrl: e.target.value })} placeholder="https://example.com" disabled={isSaving} />
                      </div>
                    </div>

                    {/* About Section - Education */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white flex items-center gap-2"><School className="w-5 h-5 text-violet-400" />Education</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label htmlFor="university" className="block text-sm font-medium text-gray-200">University</label>
                          <input id="university" type="text" className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all" value={editData.university} onChange={(e) => setEditData({ ...editData, university: e.target.value })} placeholder="Stanford University" disabled={isSaving} />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="degree" className="block text-sm font-medium text-gray-200">Degree</label>
                          <input id="degree" type="text" className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all" value={editData.degree} onChange={(e) => setEditData({ ...editData, degree: e.target.value })} placeholder="Computer Science" disabled={isSaving} />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <label htmlFor="educationYear" className="block text-sm font-medium text-gray-200">Graduation Year</label>
                          <input id="educationYear" type="number" className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all" value={editData.educationYear as any} onChange={(e) => setEditData({ ...editData, educationYear: parseInt(e.target.value || '0') })} placeholder="2020" disabled={isSaving} />
                        </div>
                      </div>
                    </div>

                    {/* About Section - Work Experience */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white flex items-center gap-2"><Building className="w-5 h-5 text-violet-400" />Work Experience</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label htmlFor="company" className="block text-sm font-medium text-gray-200">Company</label>
                          <input id="company" type="text" className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all" value={editData.company} onChange={(e) => setEditData({ ...editData, company: e.target.value })} placeholder="Tech for Good Inc." disabled={isSaving} />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="position" className="block text-sm font-medium text-gray-200">Position</label>
                          <input id="position" type="text" className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all" value={editData.position} onChange={(e) => setEditData({ ...editData, position: e.target.value })} placeholder="Product Designer" disabled={isSaving} />
                        </div>
                      </div>
                    </div>

                    {/* About Section - Contact */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white flex items-center gap-2"><Mail className="w-5 h-5 text-violet-400" />Contact Information</h3>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
                          <input id="email" type="email" className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} placeholder="jane.doe@example.com" disabled={isSaving} />
                        </div>
                      </div>
                    </div>

                    {/* About Section - Bio */}
                    <div className="space-y-2">
                      <label htmlFor="aboutMe" className="block text-sm font-medium text-gray-200">About Me</label>
                      <textarea id="aboutMe" rows={4} className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all resize-none" value={editData.aboutMe} onChange={(e) => setEditData({ ...editData, aboutMe: e.target.value })} placeholder="Tell us about yourself..." disabled={isSaving} />
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                      <label htmlFor="skills" className="block text-sm font-medium text-gray-200">Skills</label>
                      <div className="flex flex-wrap gap-2 p-3 bg-slate-800/30 rounded-xl border border-white/5 min-h-[80px]">
                        {editData.skills && editData.skills.length > 0 ? (
                          editData.skills.map((skill) => (
                            <span key={skill} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 px-3 py-1.5 text-xs font-medium text-gray-100 border border-violet-500/30">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 w-full text-center py-2">No skills added yet</p>
                        )}
                      </div>
                      <div className="mt-2 flex gap-2">
                        <input id="newSkill" type="text" className="flex-1 rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all" placeholder="Add a skill (e.g., React, Design, Photography)" value={''} onChange={() => {}} onKeyDown={() => {}} disabled={isSaving} />
                        <Button type="button" variant="outline" className="border-violet-500/40 bg-violet-500/10 text-violet-200 hover:bg-violet-500/20"><Plus className="w-4 h-4" /></Button>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                      <Button type="button" variant="outline" className="border-white/20 bg-transparent text-gray-200 hover:bg-white/5" onClick={closeEditModal} disabled={isSaving}>Cancel</Button>
                      <Button type="submit" className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0 min-w-[120px]" disabled={isSaving}>
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
