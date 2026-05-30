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
    id: number;
    name: string;
    description: string;
    members: number;
    posts: number;
    category: string;
    trending: boolean;
    joined: boolean;
    postsData?: any[];
  };

  const defaultCommunities: Community[] = [
    {
      id: 1,
      name: 'Sustainable Living',
      description: 'Tips and discussions about eco-friendly lifestyle choices',
      members: 12500,
      posts: 1840,
      postsData: [
        {
          id: 1,
          author: 'alice@example.com',
          content: 'We organized a beach cleanup this weekend! Here are some photos.',
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=60',
          likes: 42,
          liked: false,
          createdAt: new Date().toISOString(),
          comments: [
            { id: 1, author: 'bob@example.com', content: 'Amazing work!', createdAt: new Date().toISOString() },
          ],
        },
      ],
      category: 'Environment',
      trending: true,
      joined: true,
    },
    {
      id: 2,
      name: 'Digital Privacy',
      description: 'Protecting your online presence and data',
      members: 8900,
      posts: 2100,
      category: 'Technology',
      trending: false,
      joined: true,
    },
    {
      id: 3,
      name: 'Mental Health & Wellness',
      description: 'Support and resources for mental wellbeing',
      members: 15200,
      posts: 3450,
      category: 'Health',
      trending: true,
      joined: false,
    },
    {
      id: 4,
      name: 'Photography Enthusiasts',
      description: 'Share your photos and learn from others',
      members: 9800,
      posts: 5600,
      category: 'Arts',
      trending: false,
      joined: true,
    },
    {
      id: 5,
      name: 'Book Club',
      description: 'Monthly book discussions and recommendations',
      members: 6700,
      posts: 890,
      category: 'Literature',
      trending: false,
      joined: false,
    },
    {
      id: 6,
      name: 'Indie Game Developers',
      description: 'Connect with game creators and share your projects',
      members: 11200,
      posts: 4200,
      postsData: [
        {
          id: 1,
          author: 'carol@example.com',
          content: 'Released a new demo of my platformer — feedback welcome!',
          image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=60',
          likes: 13,
          liked: false,
          createdAt: new Date().toISOString(),
          comments: [],
        },
      ],
      category: 'Gaming',
      trending: true,
      joined: false,
    },
  ];

  const [communities, setCommunities] = useState<Community[]>(() => {
    try {
      const raw = localStorage.getItem('ethica-communities');
      return raw ? JSON.parse(raw) : defaultCommunities;
    } catch (e) {
      return defaultCommunities;
    }
  });

  // Seed sample posts across communities if missing (ensures at least 20 sample posts exist)
  useEffect(() => {
    const totalPosts = communities.reduce((acc, c) => acc + (c.postsData?.length || 0), 0);
    if (totalPosts >= 20) return;

    const SAMPLE_AUTHORS = [
      { name: 'Alice Nguyen', avatar: 'https://images.unsplash.com/photo-1531123414780-fb6f3a7d0b7a?w=200&q=60' },
      { name: 'Carlos Mendes', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=60' },
      { name: 'Priya Patel', avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&q=60' },
      { name: 'Liam O’Connor', avatar: 'https://images.unsplash.com/photo-1547425260-1e1f8a432d0f?w=200&q=60' },
      { name: 'Sofia Rossi', avatar: 'https://images.unsplash.com/photo-1545996124-1f6a2e4b6f9b?w=200&q=60' },
      { name: 'Noah Kim', avatar: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=200&q=60' },
      { name: 'Emma Johnson', avatar: 'https://images.unsplash.com/photo-1545996124-1f6a2e4b6f9b?w=200&q=60' },
      { name: 'Oliver Wang', avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=200&q=60' },
      { name: 'Maya Singh', avatar: 'https://images.unsplash.com/photo-1545996124-1f6a2e4b6f9b?w=200&q=60' },
      { name: 'Ethan Brown', avatar: 'https://images.unsplash.com/photo-1541745537418-0b9a7f2a1c9b?w=200&q=60' },
    ];

    const SAMPLE_IMAGES = [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=60',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=60',
      'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=1200&q=60',
      'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=1200&q=60',
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&q=60',
      'https://images.unsplash.com/photo-1491933382704-9f3c26c5f0f9?w=1200&q=60',
      'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?w=1200&q=60',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=60',
      'https://images.unsplash.com/photo-1526403224743-5f3f6b8b2a2b?w=1200&q=60',
      'https://images.unsplash.com/photo-1485217988980-11786ced9454?w=1200&q=60',
    ];

    const SAMPLE_CAPTIONS = [
      'Just finished redesigning my portfolio homepage. Feedback welcome!',
      'My first React project is finally deployed.',
      'Captured this sunrise during my morning hike.',
      'Completed a 30-day fitness challenge.',
      'Sharing some UI concepts for a music streaming app.',
      'Built a Node.js API with authentication today.',
      'Experimenting with long exposure photography — thoughts?',
      "Here's a quick recipe I tried last night, super tasty!",
      'Sketching new iconography for a client project.',
      'Refactored the auth flow — fewer bugs now!',
      'Weekend trip — these shots from the coast are amazing.',
      'A minimal CSS trick that saved my layout.',
      'Proof-of-concept: real-time comments with WebSockets.',
      'Before/after: my workspace setup upgrade.',
      'Design critique: what would you improve here?',
      'Sharing my workflow for fast prototyping.',
      'Tiny animation trick with CSS transforms.',
      'Just shipped a small but useful npm package.',
      'Trying a new 35mm lens — color tones are lovely.',
      'Mindful breathing helped me ship that feature today.',
    ];

    // build posts until we reach 20 total across communities
    let postsToCreate = 20 - totalPosts;
    const newCommunities = communities.map((c, ci) => ({ ...c }));
    let authorIx = 0;
    let imageIx = 0;
    let captionIx = 0;

    while (postsToCreate > 0) {
      // pick a community to add to (round-robin)
      const idx = postsToCreate % newCommunities.length;
      const community = newCommunities[idx];
      const postsData = community.postsData ? [...community.postsData] : [];
      const author = SAMPLE_AUTHORS[authorIx % SAMPLE_AUTHORS.length];
      const image = SAMPLE_IMAGES[imageIx % SAMPLE_IMAGES.length];
      const caption = SAMPLE_CAPTIONS[captionIx % SAMPLE_CAPTIONS.length];

      const comments: any[] = [];
      // randomly add a few comments
      const commentCount = Math.floor(Math.random() * 4);
      for (let ci2 = 0; ci2 < commentCount; ci2++) {
        comments.push({ id: ci2 + 1, author: SAMPLE_AUTHORS[(authorIx + ci2 + 1) % SAMPLE_AUTHORS.length].name, content: ['Nice!', 'Love this', 'Great work', 'Inspiring'][ci2 % 4], createdAt: new Date(Date.now() - 1000 * 60 * (ci2 + 10)).toISOString() });
      }

      const post = {
        id: (postsData.length ? Math.max(...postsData.map((p: any) => p.id)) : 0) + 1,
        author: author.name,
        authorAvatar: author.avatar,
        content: caption,
        image,
        likes: Math.floor(Math.random() * 120),
        liked: false,
        shares: Math.floor(Math.random() * 30),
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)).toISOString(),
        comments,
        category: community.category || 'General',
      };

      postsData.unshift(post);
      community.postsData = postsData;
      community.posts = (community.posts || 0) + 1;

      postsToCreate -= 1;
      authorIx += 1;
      imageIx += 1;
      captionIx += 1;
    }

    setCommunities(() => {
      try {
        localStorage.setItem('ethica-communities', JSON.stringify(newCommunities));
      } catch (e) {}
      return newCommunities;
    });
  }, []); // run once on mount

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
        localStorage.setItem('ethica-communities', JSON.stringify(updated));
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

  const joinCommunity = (id: number) => {
    setCommunities((prev) => {
      const updated = prev.map((c) =>
        c.id === id ? { ...c, joined: true, members: (c.members || 0) + 1 } : c
      );
      try {
        localStorage.setItem('ethica-communities', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
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
        localStorage.setItem('ethica-communities', JSON.stringify(updated));
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
        localStorage.setItem('ethica-communities', JSON.stringify(updated));
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
        localStorage.setItem('ethica-communities', JSON.stringify(updated));
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
        localStorage.setItem('ethica-communities', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const leaveCommunity = (id: number) => {
    setCommunities((prev) => {
      const updated = prev.map((c) =>
        c.id === id ? { ...c, joined: false, members: Math.max((c.members || 1) - 1, 0) } : c
      );
      try {
        localStorage.setItem('ethica-communities', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
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
            openCommunity={openCommunity}
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

          <div className={`flex gap-2 mt-2 ${sidebarCollapsed ? 'flex-col' : ''}`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className={`hover:bg-red-500/10 hover:text-red-400 ${
                sidebarCollapsed ? 'w-full' : 'flex-1'
              }`}
            >
              <LogOut className="w-4 h-4" />
              {!sidebarCollapsed && <span className="ml-2">Logout</span>}
            </Button>
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