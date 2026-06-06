import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Edit,
  Users,
  Heart,
  MessageCircle,
  Calendar,
  Briefcase,
  Link as LinkIcon,
  MapPin,
  Upload,
  X,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Separator } from '../../components/ui/separator';
import { getUserProfile, updateUserProfile } from '../../api/auth';
import { useAuth } from '../../context/AuthContext.tsx';
import { toast } from 'react-hot-toast';
import { followUser, unfollowUser, getFollowers, getFollowing } from '../../api/auth.tsx';

type ProfileData = {
  _id: string;
  fullName: string;
  profileImage?: string | null;
  post?: string;
  location?: string;
  websiteUrl?: string;
  aboutMe?: string;
};

type FollowerItem = {
  _id: string;
  follower: {
    _id: string;
    name: string;
    profileImage?: string;
  };
};

type FollowingItem = {
  _id: string;
  following: {
    _id: string;
    name: string;
    profileImage?: string;
  };
};

export default function Profile({ onNavigate }: { onNavigate?: (page: any) => void }) {
  const { user, token, login } = useAuth();
  const modalRef = useRef<HTMLDivElement | null>(null);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [followers, setFollowers] = useState<FollowerItem[]>([]);
  const [following, setFollowing] = useState<FollowingItem[]>([]);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);

  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followLoading, setFollowLoading] = useState<boolean>(false);

  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  // read current logged-in user from localStorage as required
  const getCurrentUserFromStorage = () => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  };

  const currentUser = getCurrentUserFromStorage();

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // Helper to normalize followers/following API responses
  const normalizeFollowersResponse = (resp: any): FollowerItem[] => {
    if (!resp) return [];
    if (Array.isArray(resp)) return resp as FollowerItem[];
    if (Array.isArray(resp.data)) return resp.data as FollowerItem[];
    return [];
  };

  const normalizeFollowingResponse = (resp: any): FollowingItem[] => {
    if (!resp) return [];
    if (Array.isArray(resp)) return resp as FollowingItem[];
    if (Array.isArray(resp.data)) return resp.data as FollowingItem[];
    return [];
  };

  // Fetch profile then follow data
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // prefer selected profile stored in localStorage
        const sel = localStorage.getItem('ethica-selectedProfile');
        if (sel) {
          try {
            const parsed = JSON.parse(sel);
            const mapped: ProfileData = {
              _id: parsed.id || parsed._id || 'external',
              fullName: parsed.name || parsed.fullName || 'User',
              profileImage: parsed.avatar || parsed.profileImage || null,
              post: parsed.post || parsed.title || '',
              location: parsed.location || '',
              websiteUrl: parsed.websiteUrl || '',
              aboutMe: parsed.bio || parsed.aboutMe || '',
            };
            setProfile(mapped);
            await fetchFollowData(String(mapped._id));
            setLoading(false);
            return;
          } catch { /* fallthrough to server fetch */ }
        }

        const data = await getUserProfile();
        const profileData = Array.isArray(data) ? data[0] : data;
        setProfile(profileData);
        if (profileData && profileData._id) {
          await fetchFollowData(String(profileData._id));
        }
      } catch (err: any) {
        console.error(err);
        setError(err?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch followers & following for a given user id
  const fetchFollowData = async (userId: string) => {
    if (!userId) return;
    try {
      const [fResp, foResp] = await Promise.all([getFollowers(userId), getFollowing(userId)]);
      const fList = normalizeFollowersResponse(fResp);
      const foList = normalizeFollowingResponse(foResp);

      setFollowers(fList);
      setFollowing(foList);

      // Count values: prefer resp.count if available
      const fCount = typeof fResp === 'object' && typeof fResp.count === 'number' ? fResp.count : fList.length;
      const foCount = typeof foResp === 'object' && typeof foResp.count === 'number' ? foResp.count : foList.length;

      setFollowersCount(fCount);
      setFollowingCount(foCount);

      // Determine follow status by checking whether currentUser.id exists inside followers list
      const curId = currentUser && (currentUser.id || currentUser._id || currentUser._userId);
      if (curId) {
        const found = fList.some((it) => it?.follower && (it.follower._id === curId || it.follower.id === curId));
        setIsFollowing(Boolean(found));
      } else {
        setIsFollowing(false);
      }
    } catch (err) {
      console.error('Failed to fetch follow data', err);
      setFollowers([]);
      setFollowing([]);
      setFollowersCount(0);
      setFollowingCount(0);
    }
  };

  // Prevent following yourself
  const isOwnProfile = () => {
    if (!profile) return false;
    const curId = currentUser && (currentUser.id || currentUser._id || currentUser._userId);
    return curId && profile._id && String(profile._id) === String(curId);
  };

  const handleFollow = async () => {
    if (!profile) return;
    if (!currentUser || !currentUser.id && !currentUser._id) {
      toast.error('Please login to follow users');
      return;
    }

    try {
      setFollowLoading(true);
      // Optimistic update
      setFollowersCount((s) => s + 1);
      setIsFollowing(true);

      await followUser(profile._id);

      // Refresh authoritative data
      await fetchFollowData(profile._id);

      // update localStorage user following count (best-effort)
      try {
        const stored = getCurrentUserFromStorage();
        const updated = { ...(stored || {}), followingCount: (stored.followingCount || 0) + 1 };
        localStorage.setItem('user', JSON.stringify(updated));
        // update auth context if present
        try { login({ token: token || '', user: updated }); } catch {}
      } catch {}

      toast.success('Followed');
    } catch (err: any) {
      console.error('Follow failed', err);
      // rollback
      setFollowersCount((s) => Math.max(0, s - 1));
      setIsFollowing(false);
      toast.error(err?.message || 'Failed to follow');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (!profile) return;
    if (!currentUser || !currentUser.id && !currentUser._id) {
      toast.error('Please login to unfollow users');
      return;
    }

    try {
      setFollowLoading(true);
      // Optimistic update
      setFollowersCount((s) => Math.max(0, s - 1));
      setIsFollowing(false);

      await unfollowUser(profile._id);

      // Refresh authoritative data
      await fetchFollowData(profile._id);

      // update localStorage user following count (best-effort)
      try {
        const stored = getCurrentUserFromStorage();
        const updated = { ...(stored || {}), followingCount: Math.max(0, (stored.followingCount || 1) - 1) };
        localStorage.setItem('user', JSON.stringify(updated));
        try { login({ token: token || '', user: updated }); } catch {}
      } catch {}

      toast.success('Unfollowed');
    } catch (err: any) {
      console.error('Unfollow failed', err);
      // rollback
      setFollowersCount((s) => s + 1);
      setIsFollowing(true);
      toast.error(err?.message || 'Failed to unfollow');
    } finally {
      setFollowLoading(false);
    }
  };

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
          <Button onClick={() => window.location.reload()} className="mt-4 bg-gradient-to-r from-violet-500 to-fuchsia-500">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
          <div className="px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 -mt-16 sm:-mt-12 items-start">
              <div className="flex-shrink-0">
                <Avatar className="w-28 h-28 sm:w-36 sm:h-36 border-4 border-slate-900 shadow-2xl">
                  {profile.profileImage ? (
                    <AvatarImage src={profile.profileImage} alt={profile.fullName} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-2xl">{getInitials(profile.fullName)}</AvatarFallback>
                  )}
                </Avatar>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl sm:text-3xl font-bold text-white">{profile.fullName}</h1>
                      <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">Verified</Badge>
                    </div>
                    <p className="text-gray-300 mt-2 max-w-2xl">{profile.aboutMe || 'No bio provided'}</p>

                    <div className="mt-4 flex items-center gap-6 text-sm text-gray-300">
                      <div>
                        <div className="text-white font-semibold text-lg">
                          <button onClick={() => setShowFollowersModal(true)} className="hover:underline">
                            {followersCount.toLocaleString()}
                          </button>
                        </div>
                        <div className="text-gray-400">Followers</div>
                      </div>

                      <div>
                        <div className="text-white font-semibold text-lg">
                          <button onClick={() => setShowFollowingModal(true)} className="hover:underline">
                            {followingCount.toLocaleString()}
                          </button>
                        </div>
                        <div className="text-gray-400">Following</div>
                      </div>

                      <div>
                        <div className="text-white font-semibold text-lg">127</div>
                        <div className="text-gray-400">Posts</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    {!isOwnProfile() && (
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          className={`border-0 ${isFollowing ? 'bg-gray-700/70' : 'bg-gradient-to-r from-violet-500 to-fuchsia-500'}`}
                          onClick={isFollowing ? handleUnfollow : handleFollow}
                          disabled={followLoading}
                        >
                          {followLoading ? (
                            <span className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Loading
                            </span>
                          ) : (
                            isFollowing ? 'Unfollow' : 'Follow'
                          )}
                        </Button>

                        <Button size="sm" variant="outline" onClick={() => { try { localStorage.setItem('ethica-startConversation', JSON.stringify({ id: profile._id, name: profile.fullName })); } catch {} onNavigate?.('messages'); }}>
                          Message
                        </Button>
                      </div>
                    )}

                    {isOwnProfile() && (
                      <Button size="sm" className="bg-gradient-to-r from-violet-500 to-fuchsia-500" onClick={() => {/* open edit */}}>
                        <Edit className="w-4 h-4 mr-2" /> Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Followers Modal */}
        <AnimatePresence>
          {showFollowersModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div ref={modalRef} className="bg-white rounded-xl w-11/12 max-w-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Followers ({followersCount})</h3>
                  <button onClick={() => setShowFollowersModal(false)} className="text-gray-500"><X /></button>
                </div>
                <div className="space-y-3 max-h-80 overflow-auto">
                  {followers.length ? followers.map((f) => (
                    <div key={f._id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          {f.follower.profileImage ? <AvatarImage src={f.follower.profileImage} /> : <AvatarFallback>{getInitials(f.follower.name)}</AvatarFallback>}
                        </Avatar>
                        <div>
                          <div className="font-medium">{f.follower.name}</div>
                          <div className="text-sm text-gray-500">{f.follower._id}</div>
                        </div>
                      </div>
                      <div>
                        <Button size="sm" onClick={() => { window.location.href = `/profile/${f.follower._id}`; }}>View Profile</Button>
                      </div>
                    </div>
                  )) : <p className="text-gray-500">No followers yet.</p>}
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Following Modal */}
        <AnimatePresence>
          {showFollowingModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div ref={modalRef} className="bg-white rounded-xl w-11/12 max-w-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Following ({followingCount})</h3>
                  <button onClick={() => setShowFollowingModal(false)} className="text-gray-500"><X /></button>
                </div>
                <div className="space-y-3 max-h-80 overflow-auto">
                  {following.length ? following.map((f) => (
                    <div key={f._id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          {f.following.profileImage ? <AvatarImage src={f.following.profileImage} /> : <AvatarFallback>{getInitials(f.following.name)}</AvatarFallback>}
                        </Avatar>
                        <div>
                          <div className="font-medium">{f.following.name}</div>
                          <div className="text-sm text-gray-500">{f.following._id}</div>
                        </div>
                      </div>
                      <div>
                        <Button size="sm" onClick={() => { window.location.href = `/profile/${f.following._id}`; }}>View Profile</Button>
                      </div>
                    </div>
                  )) : <p className="text-gray-500">Not following anyone yet.</p>}
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
