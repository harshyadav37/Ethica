import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  ThumbsUp,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Skeleton } from '../../components/ui/skeleton';

type Comment = { id: number; author: string; content: string; createdAt: string };
type Post = {
  id: number;
  author: string;
  username: string;
  avatar: string;
  avatarUrl?: string;
  content: string;
  timestamp: string;
  image?: string;
  likes: number;
  liked?: boolean;
  comments: Comment[];
  shares: number;
  saved?: boolean;
};

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=60',
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&q=60',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=60',
  'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=1200&q=60',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=60',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&q=60',
  'https://images.unsplash.com/photo-1514512364185-21b3f3d98f9f?w=1200&q=60',
  'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&q=60',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=60',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=60',
];

const SAMPLE_AUTHORS = [
  { name: 'Sarah Chen', username: '@sarahchen', avatar: 'SC' },
  { name: 'Marcus Rivera', username: '@marcusr', avatar: 'MR' },
  { name: 'Emma Thompson', username: '@emmathompson', avatar: 'ET' },
  { name: 'Liam Patel', username: '@liamp', avatar: 'LP' },
  { name: 'Olivia Gomez', username: '@oliviag', avatar: 'OG' },
  { name: 'Noah Kim', username: '@noahk', avatar: 'NK' },
  { name: 'Ava Martinez', username: '@avam', avatar: 'AM' },
  { name: 'Mason Lee', username: '@masonl', avatar: 'ML' },
  { name: 'Isabella Rossi', username: '@isabellar', avatar: 'IR' },
  { name: 'Ethan Brown', username: '@ethanb', avatar: 'EB' },
  { name: 'Sophia Wilson', username: '@sophiaw', avatar: 'SW' },
  { name: 'Jacob Nguyen', username: '@jacobn', avatar: 'JN' },
  { name: 'Mia Anderson', username: '@miaa', avatar: 'MA' },
  { name: 'William Scott', username: '@williams', avatar: 'WS' },
  { name: 'Charlotte King', username: '@charlottek', avatar: 'CK' },
  { name: 'James Young', username: '@jamesy', avatar: 'JY' },
  { name: 'Amelia Hall', username: '@ameliah', avatar: 'AH' },
  { name: 'Benjamin Wright', username: '@benw', avatar: 'BW' },
  { name: 'Harper Green', username: '@harperg', avatar: 'HG' },
  { name: 'Alexander Cox', username: '@alexc', avatar: 'AC' },
];

const SAMPLE_CAPTIONS = [
  'Just finished redesigning my portfolio homepage. Feedback welcome!',
  'My first React project is finally deployed.',
  'Captured this sunrise during my morning hike.',
  'Completed a 30-day fitness challenge.',
  'Sharing some UI concepts for a music streaming app.',
  'Built a Node.js API with authentication today.',
  'Tried a new recipe today — absolutely delicious!',
  'Sketches from today\'s design jam.',
  'Working on performance optimizations — big improvements.',
  'Photo from my recent trip — such a peaceful place.',
];

function randomFrom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeSamplePost(id: number): Post {
  const author = SAMPLE_AUTHORS[id % SAMPLE_AUTHORS.length];
  const caption = SAMPLE_CAPTIONS[id % SAMPLE_CAPTIONS.length];
  return {
    id,
    author: author.name,
    username: author.username,
    avatar: author.avatar,
    content: caption,
    timestamp: `${Math.floor(Math.random() * 23) + 1}h`,
    image: randomFrom(SAMPLE_IMAGES),
    likes: Math.floor(Math.random() * 200),
    liked: Math.random() > 0.7 ? true : false,
    comments: [
      { id: 1, author: 'community_member', content: 'Nice!', createdAt: new Date().toISOString() },
    ],
    shares: Math.floor(Math.random() * 50),
    saved: false,
  };
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>(() => {
    const initial: Post[] = [];
    for (let i = 1; i <= 12; i++) initial.push(makeSamplePost(i));
    return initial;
  });

  const [loadingMore, setLoadingMore] = useState(false);
  const [commentModalPostId, setCommentModalPostId] = useState<number | null>(null);
  const [shareModalPostId, setShareModalPostId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  const shareModalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCommentModalPostId(null);
        setShareModalPostId(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setPosts((p) => {
        const start = p.length + 1;
        const more: Post[] = [];
        for (let i = start; i < start + 8; i++) more.push(makeSamplePost(i));
        return [...p, ...more];
      });
      setLoadingMore(false);
    }, 900);
  };

  const toggleLike = (postId: number) => {
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? Math.max(p.likes - 1, 0) : p.likes + 1 } : p));
  };

  const addComment = (postId: number, content: string) => {
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, comments: [...p.comments, { id: (p.comments.length || 0) + 1, author: 'You', content, createdAt: new Date().toISOString() }] } : p));
  };

  const sharePost = async (post: Post) => {
    const shareText = `${post.author} (${post.username})\n\n${post.content}\n\nPosted: ${post.timestamp}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${post.author} on Ethica`, text: shareText });
      } else {
        setShareModalPostId(post.id);
      }
      setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, shares: (p.shares || 0) + 1 } : p));
    } catch (e) {
      setShareModalPostId(post.id);
    }
  };

  const handleOpenComments = (postId: number) => {
    setCommentModalPostId(postId);
    setNewComment('');
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl mb-2">Your Feed</h1>
          <p className="text-gray-400">Curated content from people and communities you follow</p>
        </div>

        {/* Healthy Engagement Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-green-400 mb-1">Mindful Browsing</h3>
              <p className="text-sm text-gray-300">You've been browsing for 15 minutes. Remember to take breaks and stay present.</p>
            </div>
          </div>
        </motion.div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12"><AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">{post.avatar}</AvatarFallback></Avatar>
                  <div>
                    <h3 className="font-medium">{post.author}</h3>
                    <p className="text-sm text-gray-400">{post.username} • {post.timestamp}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="hover:bg-white/5"><MoreHorizontal className="w-5 h-5" /></Button>
              </div>

              <p className="text-gray-200 leading-relaxed mb-4">{post.content}</p>
              {post.image && <img src={post.image} alt="post" className="w-full h-64 object-cover rounded-lg mb-4" />}

              <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`flex items-center gap-2 text-sm ${post.liked ? 'text-red-400' : 'text-gray-400 hover:text-gray-300'}`} onClick={() => toggleLike(post.id)}>
                  <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </motion.button>

                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300" onClick={() => handleOpenComments(post.id)}>
                  <MessageCircle className="w-5 h-5" />
                  <span>{post.comments.length}</span>
                </motion.button>

                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300" onClick={() => sharePost(post)}>
                  <Share2 className="w-5 h-5" />
                  <span>{post.shares}</span>
                </motion.button>

                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`ml-auto text-sm ${post.saved ? 'text-violet-400' : 'text-gray-400 hover:text-gray-300'}`}>
                  <Bookmark className={`w-5 h-5 ${post.saved ? 'fill-current' : ''}`} />
                </motion.button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center py-8">
          {!loadingMore ? (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">Need more content?</p>
              <Button onClick={loadMore} variant="outline" className="border-white/10 hover:bg-white/5">Load More Posts</Button>
            </div>
          ) : (
            <div className="space-y-4"><Skeleton className="h-48 w-full bg-white/5" /><p className="text-sm text-gray-400">Loading more content...</p></div>
          )}
        </div>

        {/* Wellness Prompt */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-6 text-center">
          <ThumbsUp className="w-8 h-8 text-violet-400 mx-auto mb-3" />
          <h3 className="text-lg mb-2">You're all caught up!</h3>
          <p className="text-sm text-gray-400 mb-4">Consider taking a break or connecting with friends offline</p>
          <Button variant="ghost" className="hover:bg-white/5">View Suggested Communities</Button>
        </motion.div>
      </div>

      {/* Comment Modal */}
      {commentModalPostId && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCommentModalPostId(null)} />
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative w-full sm:max-w-2xl bg-slate-900 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Comments</h3>
              <Button variant="ghost" size="sm" onClick={() => setCommentModalPostId(null)}>Close</Button>
            </div>
            <div className="max-h-80 overflow-y-auto space-y-3 mb-3">
              {posts.find((p) => p.id === commentModalPostId)?.comments.map((c) => (
                <div key={c.id} className="text-sm text-gray-300">• <strong className="text-gray-100">{c.author}:</strong> {c.content}</div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={newComment} onChange={(e) => setNewComment((e.target as HTMLInputElement).value)} placeholder="Write a comment..." />
              <Button onClick={() => { if (!newComment.trim()) return; addComment(commentModalPostId, newComment.trim()); setNewComment(''); }}>Add</Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Share Modal Fallback */}
      {shareModalPostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShareModalPostId(null)} />
          <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full sm:max-w-lg bg-slate-900 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Share Post</h3>
              <Button variant="ghost" size="sm" onClick={() => setShareModalPostId(null)}>Close</Button>
            </div>
            <div className="space-y-3">
              {(() => {
                const p = posts.find((x) => x.id === shareModalPostId);
                if (!p) return null;
                return (
                  <div>
                    <h4 className="font-medium">{p.author} <span className="text-sm text-gray-400">{p.username}</span></h4>
                    <p className="text-sm text-gray-300 mb-2">{p.content}</p>
                    {p.image && <img src={p.image} alt="share" className="w-full h-48 object-cover rounded-md mb-2" />}
                    <div className="flex gap-2">
                      <Button onClick={() => { navigator.clipboard?.writeText(`${p.author} (${p.username})\n\n${p.content}`); }}>Copy content</Button>
                      <Button variant="outline" onClick={() => { setShareModalPostId(null); }}>Done</Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
