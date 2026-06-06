import { motion } from 'motion/react';
import { useMemo, useState, useEffect } from 'react';
import { Users, TrendingUp, Star, Plus, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import MemberList from './MemberList';
import MemberProfile from './MemberProfile';
import { joinCommunity as joinCommunityAPI } from '../../api/auth';
import CommunityMembersModal from '../../components/CommunityMembersModal';
import { getCommunityMembers } from '../../api/communityService';

interface CommunitiesProps {
  onNavigate?: (page: string) => void;
  communities?: Array<{
    id?: number;
    _id?: string; // MongoDB ObjectId format
    name: string;
    description: string;
    members: number;
    posts: number;
    membersData?: Array<{ id: number; name: string; avatar?: string; bio?: string; followed?: boolean }>;
    postsData?: any[];
    category: string;
    trending: boolean;
    joined: boolean;
  }>;
  joinCommunity?: (community: any) => void;
  openCommunity?: (id: string) => void;
  onCommunityJoin?: (communityId: string) => void;
}

export default function Communities({ onNavigate, communities, joinCommunity, openCommunity, onCommunityJoin }: CommunitiesProps) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Joined' | 'Trending' | 'Recommended'>('All');
  const [showMembers, setShowMembers] = useState(false);
  const [activeMembers, setActiveMembers] = useState<any[] | null>(null);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<any | null>(null);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [localCommunities, setLocalCommunities] = useState(communities || []);

  // Update local communities when prop changes
  useEffect(() => {
    if (communities) {
      setLocalCommunities(communities);
    }
  }, [communities]);

  const makeSampleMembers = (count: number, seed = 1) => {
    const NAMES = [
      'Alice Nguyen',
      'Carlos Mendes',
      'Priya Patel',
      "Liam O'Connor",
      'Sofia Rossi',
      'Noah Kim',
      'Emma Johnson',
      'Oliver Wang',
      'Maya Singh',
      'Ethan Brown',
      'Zara Ali',
      'Hiro Tanaka',
    ];
    const avatars = [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=60',
      'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&q=60',
      'https://images.unsplash.com/photo-1545996124-1f6a2e4b6f9b?w=200&q=60',
      'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=200&q=60',
    ];

    const out = [] as any[];
    for (let i = 0; i < Math.max(0, count); i++) {
      const idx = (i + seed) % NAMES.length;
      out.push({ id: i + 1, name: NAMES[idx], avatar: avatars[i % avatars.length], bio: '', followed: false });
      if (out.length >= 12) break;
    }
    return out;
  };

  // Handle join community with API integration
  const handleJoinCommunity = async (community: any) => {
    // CRITICAL: Use the community's actual name from the database as the identifier
    // This avoids sending local placeholder IDs like "local-17"
    const idToUse = community.name;

    console.log('Joining community with name:', idToUse);
    console.log('Full community object:', community);
    
    try {
      setLoading(idToUse);
      setError(null);
      
      // Call the API
      const response = await joinCommunityAPI(idToUse);
      
      console.log('Join API response:', response);
      
      // Update local state to show community as joined using the response's communityId
      setLocalCommunities(prevCommunities => 
        prevCommunities.map(c => {
          // Check if this is the community we just joined
          const isSameCommunity = 
            c._id === response.communityId || 
            c._id === idToUse ||
            c.id?.toString() === idToUse ||
            c.name === community.name;
          
          if (isSameCommunity) {
            console.log('Updating community to joined:', c.name);
            return { 
              ...c, 
              joined: true,
              // Update _id if backend returned one and the community doesn't have it
              _id: c._id || response.communityId
            };
          }
          return c;
        })
      );
      
      // If you have a joinCommunity prop passed from parent, call it
      if (joinCommunity) {
        joinCommunity(community);
      }
      
      // Optional callback for parent component
      if (onCommunityJoin) {
        onCommunityJoin(response.communityId);
      }

      // If this community is currently open in the members modal, refresh its members
      try {
        const joinedId = response.communityId || idToUse;
        if (
          joinedId &&
          selectedCommunity &&
          (joinedId === selectedCommunity._id || joinedId === community._id || joinedId === community.id?.toString())
        ) {
          const membersResp = await getCommunityMembers(joinedId);
          const newMembers = Array.isArray(membersResp.members) ? membersResp.members : [];
          setSelectedCommunity((prev) => (prev ? { ...prev, members: newMembers, membersCount: newMembers.length } : prev));
        }
      } catch (e) {
        console.warn('Failed to refresh members after join', e);
      }
      
      // Show success message
      alert(`Successfully joined ${community.name}!`);
      
    } catch (err: any) {
      console.error('Error joining community:', err);
      console.error('Error response:', err.response);
      
      // Handle specific error cases
      if (err.response?.status === 404) {
        setError(`Community "${community.name}" not found. Please try again.`);
      } else if (err.response?.status === 400) {
        setError('You have already joined this community.');
      } else if (err.response?.status === 401) {
        setError('Please login to join communities.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.message || 'Failed to join community. Please try again.');
      }
      
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(null);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let base = localCommunities.slice();

    // Apply filter
    if (activeFilter === 'Joined') base = base.filter((c) => c.joined);
    else if (activeFilter === 'Trending') base = base.filter((c) => c.trending);
    else if (activeFilter === 'Recommended') {
      const joinedCategories = new Set(localCommunities.filter((c) => c.joined).map((c) => c.category));
      const recs = base.filter((c) => !c.joined).filter((c) => joinedCategories.has(c.category));
      const fallback = base.filter((c) => !c.joined && c.trending);
      base = recs.length ? recs : fallback;
    }

    // Apply search query
    if (!q) return base;
    return base.filter((c) => {
      return (
        c.name.toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q) ||
        (c.category || '').toLowerCase().includes(q)
      );
    });
  }, [localCommunities, query, activeFilter]);


  const handleJoin = async (communityId :any) => {
  console.log("Community ID:", communityId);

  try {
    const data = await joinCommunityAPI(communityId);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl mb-2">Communities</h1>
            <p className="text-gray-400">
              Connect with people who share your interests
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0"
            onClick={() => onNavigate?.('newcommunities')}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Community
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
            placeholder="Search communities..."
            className="pl-12 bg-white/5 border-white/10 focus:border-violet-500 placeholder:text-gray-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['All', 'Joined', 'Trending', 'Recommended'] as const).map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'default' : 'outline'}
              className={
                activeFilter === filter
                  ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 border-0'
                  : 'border-white/10 hover:bg-white/5'
              }
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Communities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((community, index) => {
            // Determine loading ID for this community
            const loadingId = community._id || community.id?.toString() || community.name;
            
            return (
              <motion.div
                key={community._id || community.id || community.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative cursor-pointer"
                onClick={() => {
                    if (community.joined) {
                      openCommunity?.(community._id || community.id?.toString() || community.name);
                    } else {
                      toast((t) => (
                        <div className="flex items-center gap-4">
                          <div className="flex-1">Please join this community to view posts.</div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                toast.dismiss(t.id);
                                if (joinCommunity) {
                                  joinCommunity(community);
                                } else {
                                  handleJoin(community._id || community.id || community.name);
                                }
                              }}
                              className="px-3 py-1 bg-violet-500 text-white rounded-md"
                            >
                              Join
                            </button>
                          </div>
                        </div>
                      ), { duration: 6000 });
                    }
                  }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-violet-400" />
                    </div>
                    {community.trending && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="text-xl mb-2">{community.name}</h3>
                  <p className="text-sm text-gray-400 mb-4 flex-1">
                    {community.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCommunity(community);
                        setIsMembersModalOpen(true);
                      }}
                      className="text-left hover:text-violet-400 transition-colors"
                    >
                      {community.members.toLocaleString()} members
                    </button>
                    <span>•</span>
                    <span>{community.posts.toLocaleString()} posts</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-white/10 text-gray-400">
                      {community.category}
                    </Badge>

                    {/* Join button */}
                    


                    <Button
                      className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (joinCommunity) {
                          joinCommunity(community);
                        } else {
                          handleJoin(community._id || community.name || community.id);
                        }
                      }}
                    >
                      Join
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* No communities found */}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-gray-400 mb-2">No communities found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Featured Communities */}
        <div className="mt-12">
          <h2 className="text-2xl mb-6">Featured Communities</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-2xl p-6"
            >
              <Star className="w-8 h-8 text-violet-400 mb-4" />
              <h3 className="text-xl mb-2">Climate Action Network</h3>
              <p className="text-sm text-gray-400 mb-4">
                Join activists and change-makers working towards a sustainable future
              </p>
              <Button className="bg-white/10 hover:bg-white/20 border-0">
                Learn More
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6"
            >
              <Star className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-xl mb-2">Creative Writers</h3>
              <p className="text-sm text-gray-400 mb-4">
                Share your stories, get feedback, and improve your craft
              </p>
              <Button className="bg-white/10 hover:bg-white/20 border-0">
                Learn More
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Community Members Modal (fetches members for selected community) */}
        {/* <CommunityMembersModal
          open={isMembersModalOpen}
          onOpenChange={(v: boolean) => {
            setIsMembersModalOpen(v);
            if (!v) {
              setSelectedCommunity(null);
            }
          }}
          community={selectedCommunity}
        /> */}

        <CommunityMembersModal
  open={isMembersModalOpen}
  onOpenChange={(v: boolean) => {
    setIsMembersModalOpen(v);
    if (!v) {
      setSelectedCommunity(null);
    }
  }}
  community={selectedCommunity}
  onNavigate={onNavigate}
/>

        {/* Legacy Member list & profile dialogs (kept for local/sample data selection) */}
        {activeMembers && (
          <>
            <MemberList
              open={showMembers}
              onOpenChange={(v: boolean) => {
                setShowMembers(v);
                if (!v) setActiveMembers(null);
              }}
              members={activeMembers}
              onSelect={(m: any) => {
                setSelectedMember(m);
                setShowProfile(true);
              }}
              onViewProfile={(m: any) => {
                try {
                  localStorage.setItem('ethica-selectedProfile', JSON.stringify(m));
                } catch (e) {}
                setShowMembers(false);
                onNavigate?.('profile');
              }}
            />

            <MemberProfile
              member={selectedMember}
              open={showProfile}
              onOpenChange={(v: boolean) => {
                setShowProfile(v);
                if (!v) setSelectedMember(null);
              }}
              onFollow={(id: number, follow: boolean) => {
                setActiveMembers((prev: any[] | null) => prev?.map((mm) => (mm.id === id ? { ...mm, followed: follow } : mm)) || prev);
                setSelectedMember((s: any) => (s && s.id === id ? { ...s, followed: follow } : s));
              }}
              onMessage={(id: number) => {
                onNavigate?.('messages');
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}