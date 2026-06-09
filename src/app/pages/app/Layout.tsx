import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  Users,
  MessageCircle,
  Video,
  MessageSquare,
  Shield,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

import { joinCommunity as apiJoinCommunity, leaveCommunity as apiLeaveCommunity, getCommunities, createCommunity } from "../../api/auth";
import { toast } from 'react-hot-toast';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { useAuth } from '../../context/AuthContext.tsx';
import Feed from './Feed';
import Communities from './Communities';
import NewCommunities from './NewCommunities';
import CommunityDetail from './CommunityDetail';
import Messages from './Messages';
import VideoCalls from './VideoCalls';
import Forums from './Forums';
import PrivacyDashboard from './PrivacyDashboard';
import Profile from './Profile';

interface LayoutProps {
  onLogout: () => void;
}

type Page =
  | 'feed'
  | 'communities'
  | 'newcommunities'
  | 'community'
  | 'messages'
  | 'videocalls'
  | 'forums'
  | 'privacy'
  | 'profile';

export default function Layout({ onLogout }: LayoutProps) {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    return (localStorage.getItem('ethica-currentPage') as Page) || 'feed';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const [selectedCommunityId, setSelectedCommunityId] = useState<number | null>(null);

  type Community = {
     id?: number;
  _id?: string;
    name: string;
    description: string;
    members: number;
    posts: number;
    category: string;
    trending: boolean;
    joined: boolean;
    postsData?: any[];
  };
  // const defaultCommunities: Community[] = [
  //   {
  //     id: 1,
  //     name: 'Sustainable Living',
  //     description: 'Tips and discussions about eco-friendly lifestyle choices',
  //     members: 12500,
  //     posts: 1840,
  //     postsData: [
  //       {
  //         id: 1,
  //         author: 'alice@example.com',
  //         content: 'We organized a beach cleanup this weekend! Here are some photos.',
  //         image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=60',
  //         likes: 42,
  //         liked: false,
  //         createdAt: new Date().toISOString(),
  //         comments: [
  //           { id: 1, author: 'bob@example.com', content: 'Amazing work!', createdAt: new Date().toISOString() },
  //         ],
  //       },
  //     ],
  //     category: 'Environment',
  //     trending: true,
  //     joined: true,
  //   },
  //   {
  //     id: 2,
  //     name: 'Digital Privacy',
  //     description: 'Protecting your online presence and data',
  //     members: 8900,
  //     posts: 2100,
  //     category: 'Technology',
  //     trending: false,
  //     joined: true,
  //   },
  //   {
  //     id: 3,
  //     name: 'Mental Health & Wellness',
  //     description: 'Support and resources for mental wellbeing',
  //     members: 15200,
  //     posts: 3450,
  //     category: 'Health',
  //     trending: true,
  //     joined: false,
  //   },
  //   {
  //     id: 4,
  //     name: 'Photography Enthusiasts',
  //     description: 'Share your photos and learn from others',
  //     members: 9800,
  //     posts: 5600,
  //     category: 'Arts',
  //     trending: false,
  //     joined: true,
  //   },
  //   {
  //     id: 5,
  //     name: 'Book Club',
  //     description: 'Monthly book discussions and recommendations',
  //     members: 6700,
  //     posts: 890,
  //     category: 'Literature',
  //     trending: false,
  //     joined: false,
  //   },
  //   {
  //     id: 6,
  //     name: 'Indie Game Developers',
  //     description: 'Connect with game creators and share your projects',
  //     members: 11200,
  //     posts: 4200,
  //     postsData: [
  //       {
  //         id: 1,
  //         author: 'carol@example.com',
  //         content: 'Released a new demo of my platformer — feedback welcome!',
  //         image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=60',
  //         likes: 13,
  //         liked: false,
  //         createdAt: new Date().toISOString(),
  //         comments: [],
  //       },
  //     ],
  //     category: 'Gaming',
  //     trending: true,
  //     joined: false,
  //   },
  // ];

  // Minimal default communities fallback (was referenced but missing)
  const defaultCommunities: Community[] = [];

  // Use a per-user localStorage key to avoid sharing joined state across accounts
  const communitiesStorageKey = (() => {
    try {
      const id = (user && (user._id || user.id || user.email)) || 'guest';
      return `ethica-communities-${id}`;
    } catch (e) {
      return 'ethica-communities-guest';
    }
  })();

  const [communities, setCommunities] = useState<Community[]>(() => {
    try {
      const stored = localStorage.getItem(communitiesStorageKey);
      if (stored) return JSON.parse(stored) as Community[];
    } catch (e) {
      // ignore parse errors
    }
    return defaultCommunities;
  });

useEffect(() => {
  const fetchCommunities = async () => {
    try {
      const response = await getCommunities();

      // merge server data with any locally stored communities so we don't wipe joined/members
      let stored: Community[] = [];
      try {
        const raw = localStorage.getItem(communitiesStorageKey);
        if (raw) stored = JSON.parse(raw) as Community[];
      } catch (e) {}

      const formattedCommunities = response.data.map((community: any, idx: number) => {
        const existing = stored.find((s) => s._id === community._id || s.name === community.name);

        // Determine if current logged-in user is a member of this community
        const rawMembers = community.members || community.membersData || community.membersList || community.members_users || community.users || [];
        let isMember = false;
        try {
          if (Array.isArray(rawMembers) && user) {
            isMember = rawMembers.some((m: any) => {
              const memberId = m._id || m.id || m.userId || m.email || m.emailAddress;
              if (!memberId) return false;
              if (user._id && (memberId === user._id || memberId === user.id)) return true;
              if (user.id && memberId === user.id) return true;
              if (user.email && memberId === user.email) return true;
              return false;
            });
          }
          // Fallback to server-provided boolean if available
          if (!isMember && typeof community.joined === 'boolean') isMember = community.joined;
        } catch (e) {
          isMember = existing?.joined ?? false;
        }

        return {
          id: existing?.id ?? idx + 1,
          _id: community._id,
          name: community.name,
          description: community.description,
          category: community.category,
          members: community.membersCount ?? existing?.members ?? 0,
          posts: community.posts?.length ?? existing?.posts ?? 0,
          joined: isMember,
          trending: community.trending ?? existing?.trending ?? false,
          postsData: existing?.postsData ?? [],
        } as Community;
      });

      setCommunities(formattedCommunities);
      try { localStorage.setItem(communitiesStorageKey, JSON.stringify(formattedCommunities)); } catch (e) {}
    } catch (error) {
      console.error("Fetch Communities Error:", error);
    }
  };

  fetchCommunities();
}, []);

  // helper to refresh and merge communities from server (authoritative data)
  const refreshCommunitiesFromServer = async () => {
    try {
      const response = await getCommunities();
      let stored: Community[] = [];
      try {
        const raw = localStorage.getItem(communitiesStorageKey);
        if (raw) stored = JSON.parse(raw) as Community[];
      } catch (e) {}

      const formattedCommunities = response.data.map((community: any, idx: number) => {
        const existing = stored.find((s) => s._id === community._id || s.name === community.name);

        // Determine membership for current user similar to initial load
        const rawMembers = community.members || community.membersData || community.membersList || community.members_users || community.users || [];
        let isMember = false;
        try {
          if (Array.isArray(rawMembers) && user) {
            isMember = rawMembers.some((m: any) => {
              const memberId = m._id || m.id || m.userId || m.email || m.emailAddress;
              if (!memberId) return false;
              if (user._id && (memberId === user._id || memberId === user.id)) return true;
              if (user.id && memberId === user.id) return true;
              if (user.email && memberId === user.email) return true;
              return false;
            });
          }
          if (!isMember && typeof community.joined === 'boolean') isMember = community.joined;
        } catch (e) {
          isMember = existing?.joined ?? false;
        }

        return {
          id: existing?.id ?? idx + 1,
          _id: community._id,
          name: community.name,
          description: community.description,
          category: community.category,
          members: community.membersCount ?? existing?.members ?? 0,
          posts: community.posts?.length ?? existing?.posts ?? 0,
          joined: isMember,
          trending: community.trending ?? existing?.trending ?? false,
          postsData: existing?.postsData ?? [],
        } as Community;
      });

      setCommunities(formattedCommunities);
      try { localStorage.setItem(communitiesStorageKey, JSON.stringify(formattedCommunities)); } catch (e) {}
    } catch (err) {
      console.error('Failed to refresh communities from server', err);
    }
  };

 

  const addCommunity = (data: { name: string; description?: string; category?: string }) => {
    setCommunities((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((c) => c.id)) + 1 : 1;
      const newCommunity: Community = {
        id: nextId,
        name: data.name,
        description: data.description || '',
        members: 0,
        posts: 0,
        category: data.category || 'General',
        trending: false,
        joined: false,
      };
      const updated = [newCommunity, ...prev];
      try {
        localStorage.setItem(communitiesStorageKey, JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
  };

  const openCommunity = (id: number) => {
    setSelectedCommunityId(id);
    setCurrentPage('community');
  };

  // Accept number, string (_id or name), or community object and resolve to numeric id
  const openCommunityResolved = (idOrCommunity: any) => {
    let idToUse: number | null = null;
    if (typeof idOrCommunity === 'number') {
      idToUse = idOrCommunity;
    } else if (typeof idOrCommunity === 'string') {
      const found = communities.find(
        (c) => c._id === idOrCommunity || c.name === idOrCommunity || (c.id?.toString() === idOrCommunity)
      );
      if (found) idToUse = found.id ?? null;
      else if (!isNaN(Number(idOrCommunity))) idToUse = Number(idOrCommunity);
    } else if (typeof idOrCommunity === 'object' && idOrCommunity !== null) {
      idToUse = idOrCommunity.id ?? null;
      if (!idToUse) {
        const found = communities.find((c) => c._id === idOrCommunity._id || c.name === idOrCommunity.name);
        if (found) idToUse = found.id ?? null;
      }
    }

    if (idToUse != null) {
      setSelectedCommunityId(idToUse);
      setCurrentPage('community');
    } else {
      console.warn('Unable to resolve community id to open:', idOrCommunity);
      toast.error('Unable to open community');
    }
  };








  
const joinCommunity = async (communityOrId: any) => {
  try {
    let community =
      typeof communityOrId === 'number'
        ? communities.find((c) => c.id === communityOrId)
        : typeof communityOrId === 'string'
        ? communities.find((c) => c._id === communityOrId || c.name === communityOrId)
        : communityOrId;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to join communities');
      console.error('No auth token found in localStorage');
      return;
    }

    // If community lacks a backend _id, create it first on the server
    if ((!community || !community._id) && createCommunity) {
      try {
        const created = await createCommunity({
          name: community?.name,
          description: community?.description || '',
          category: community?.category || 'General',
        });
        const newId = created?._id || created?.communityId || created?.id;
        if (newId) {
          // update local state to include new _id
          setCommunities((prev) => {
            const updated = prev.map((c) =>
              c.name === community?.name
                ? { ...c, _id: newId }
                : c
            );
            try { localStorage.setItem(communitiesStorageKey, JSON.stringify(updated)); } catch (e) {}
            return updated;
          });
          // assign identifier so we can join next
          community = { ...community, _id: newId };
        }
      } catch (err: any) {
        console.error('Failed to create community before join', err);
        toast.error(err?.response?.data?.message || err?.message || 'Failed to create community');
        return;
      }
    }

    const identifier = community?._id ?? community?.name ?? communityOrId;

    if (identifier && apiJoinCommunity) {
      const response = await apiJoinCommunity(identifier);

      // optimistic update
      setCommunities((prev) => {
        const updated = prev.map((c) =>
          c._id === identifier || c.id === community?.id || c.name === identifier
            ? { ...c, joined: true, members: response.totalMembers ?? (c.members || 0) + 1 }
            : c
        );
        try {
          localStorage.setItem(communitiesStorageKey, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      // refresh authoritative data from server
      await refreshCommunitiesFromServer();
    } else {
      // fallback local update when identifier is missing
      setCommunities((prev) => {
        const updated = prev.map((c) =>
          c.id === (community?.id ?? communityOrId) || c.name === community?.name
            ? { ...c, joined: true, members: (c.members || 0) + 1 }
            : c
        );
        try {
          localStorage.setItem(communitiesStorageKey, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }
  } catch (err: any) {
    console.error('Failed to join community', err);
    toast.error(err?.response?.data?.message || err?.message || 'Failed to join community');
  }
};







  const addPost = (communityId: number, content: string, image?: string, author = user?.email || 'You') => {
    setCommunities((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== communityId) return c;
        const nextPostId = (c.postsData?.length || 0) + 1;
        const post = {
          id: nextPostId,
          author,
          content,
          image,
          likes: 0,
          liked: false,
          createdAt: new Date().toISOString(),
          comments: [],
        };
        return {
          ...c,
          posts: (c.posts || 0) + 1,
          postsData: [post, ...(c.postsData || [])],
        };
      });
      try {
        localStorage.setItem(communitiesStorageKey, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const addComment = (communityId: number, postId: number, content: string, author = user?.email || 'You') => {
    setCommunities((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== communityId) return c;
        const posts = (c.postsData || []).map((p: any) => {
          if (p.id !== postId) return p;
          const nextCommentId = (p.comments?.length || 0) + 1;
          const comment = { id: nextCommentId, author, content, createdAt: new Date().toISOString() };
          return { ...p, comments: [...(p.comments || []), comment] };
        });
        return { ...c, postsData: posts };
      });
      try {
        localStorage.setItem(communitiesStorageKey, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const toggleLike = (communityId: number, postId: number) => {
    setCommunities((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== communityId) return c;
        const posts = (c.postsData || []).map((p: any) => {
          if (p.id !== postId) return p;
          const liked = !p.liked;
          const likes = liked ? (p.likes || 0) + 1 : Math.max((p.likes || 1) - 1, 0);
          return { ...p, liked, likes };
        });
        return { ...c, postsData: posts };
      });
      try {
        localStorage.setItem(communitiesStorageKey, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const shareCommunityPost = (communityId: number, postId: number) => {
    setCommunities((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== communityId) return c;
        const posts = (c.postsData || []).map((p: any) => {
          if (p.id !== postId) return p;
          return { ...p, shares: (p.shares || 0) + 1 };
        });
        return { ...c, postsData: posts };
      });
      try {
        localStorage.setItem(communitiesStorageKey, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const leaveCommunity = async (communityOrId: any) => {
    try {
      const community =
        typeof communityOrId === 'number'
          ? communities.find((c) => c.id === communityOrId)
          : typeof communityOrId === 'string'
          ? communities.find((c) => c._id === communityOrId || c.name === communityOrId)
          : communityOrId;

      const identifier = community?._id ?? community?.name ?? communityOrId;

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to leave communities');
        console.error('No auth token found in localStorage');
        return;
      }

      if (identifier && apiLeaveCommunity) {
        const response = await apiLeaveCommunity(identifier);
        setCommunities((prev) => {
          const updated = prev.map((c) =>
            c._id === identifier || c.id === community?.id || c.name === identifier
              ? { ...c, joined: false, members: response.totalMembers ?? Math.max((c.members || 1) - 1, 0) }
              : c
          );
          try {
            localStorage.setItem(communitiesStorageKey, JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });
        // refresh authoritative data from server
        await refreshCommunitiesFromServer();
      } else {
        setCommunities((prev) => {
          const updated = prev.map((c) =>
            c.id === (community?.id ?? communityOrId) || c.name === community?.name
              ? { ...c, joined: false, members: Math.max((c.members || 1) - 1, 0) }
              : c
          );
          try {
            localStorage.setItem(communitiesStorageKey, JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });
      }
    } catch (err: any) {
      console.error('Failed to leave community', err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to leave community');
    }
  };

  const getInitials = (name?: string) => {
    const parts = (name || '').trim().split(' ').filter(Boolean);
    if (!parts.length) return 'JD';
    const [first, second] = parts;
    return (first[0] + (second?.[0] ?? '')).toUpperCase();
  };

  const navigation = [
    { id: 'feed' as Page, label: 'Feed', icon: Home },
    { id: 'communities' as Page, label: 'Communities', icon: Users },
    { id: 'messages' as Page, label: 'Messages', icon: MessageCircle },
    { id: 'videocalls' as Page, label: 'Video Calls', icon: Video },
    { id: 'forums' as Page, label: 'Forums', icon: MessageSquare },
    { id: 'privacy' as Page, label: 'Privacy Dashboard', icon: Shield },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'feed':
        return <Feed />;
      case 'communities':
        return (
          <Communities
            onNavigate={handleNavigate as any}
            communities={communities}
            joinCommunity={joinCommunity}
            openCommunity={openCommunityResolved}
          />
        );
      case 'newcommunities':
        return (
          <NewCommunities onNavigate={handleNavigate as any} addCommunity={addCommunity} />
        );
      case 'community': {
        const community = communities.find((c) => c.id === selectedCommunityId) || null;
        return (
          <>
            {community ? (
              <CommunityDetail
                community={community}
                onBack={() => handleNavigate('communities')}
                joinCommunity={joinCommunity}
                leaveCommunity={leaveCommunity}
                toggleLike={toggleLike}
                sharePost={shareCommunityPost}
                addPost={addPost}
                addComment={addComment}
              />
            ) : (
              <div className="p-6">Community not found</div>
            )}
          </>
        );
      }
      case 'messages':
        return <Messages />;
      case 'videocalls':
        return <VideoCalls />;
      case 'forums':
        return <Forums />;
      case 'privacy':
        return <PrivacyDashboard />;
      case 'profile':
        return <Profile onNavigate={handleNavigate as any} />;
      default:
        return <Feed />;
    }
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    localStorage.setItem('ethica-currentPage', currentPage);
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarCollapsed ? '80px' : '280px',
        }}
        className="hidden lg:flex fixed left-0 top-0 h-full bg-white/5 backdrop-blur-xl border-r border-white/10 flex-col z-40"
      >
        {/* Logo & Collapse Button */}
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg">Ethica</span>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hover:bg-white/5"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-white border border-violet-500/30'
                    : 'hover:bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-xl border border-violet-500/30"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-violet-400' : ''}`} />
                {!sidebarCollapsed && (
                  <span className="relative z-10">{item.label}</span>
                )}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                    {item.label}
                  </div>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/10">
          <div
            onClick={() => handleNavigate('profile')}
            className={`flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer group transition-all ${
              sidebarCollapsed ? 'justify-center' : ''
            } ${currentPage === 'profile' ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30' : ''}`}
          >
            <Avatar className="w-10 h-10">
              {user?.profileImage ? (
                <AvatarImage src={user.profileImage} alt={user.name || 'User'} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                  {getInitials(user?.name)}
                </AvatarFallback>
              )}
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                {user ? (
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                ) : (
                  <p className="text-xs text-gray-400 truncate">Logged out</p>
                )}
              </div>
            )}
          </div>

          
        </div>
      </motion.aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/5 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg">Ethica</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="hover:bg-white/5"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed right-0 top-0 bottom-0 w-80 bg-slate-900 border-l border-white/10 z-50 flex flex-col"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <span className="text-lg">Menu</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-white border border-violet-500/30'
                          : 'hover:bg-white/5 text-gray-400'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-violet-400' : ''}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-white/10 space-y-3">
                <button
                  type="button"
                  onClick={() => handleNavigate('profile')}
                  className="w-full text-left flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                >
                  <Avatar className="w-10 h-10">
                    {user?.profileImage ? (
                      <AvatarImage src={user.profileImage} alt={user.name || 'User'} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{user?.name || 'Jane Doe'}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email ? `@${user.email.split('@')[0]}` : '@janedoe'}</p>
                  </div>
                </button>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={onLogout}
                    className="flex-1 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`min-h-screen lg:pl-[280px] pt-16 lg:pt-0 transition-all ${
          sidebarCollapsed ? 'lg:pl-[80px]' : ''
        }`}
      >
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 z-40">
        <div className="flex justify-around items-center py-2">
          {navigation.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className="flex flex-col items-center gap-1 px-3 py-2"
              >
                <Icon
                  className={`w-6 h-6 ${
                    isActive ? 'text-violet-400' : 'text-gray-400'
                  }`}
                />
                <span
                  className={`text-xs ${
                    isActive ? 'text-violet-400' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}