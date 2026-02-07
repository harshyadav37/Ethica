import { useState } from 'react';
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

export default function Feed() {
  const [posts] = useState([
    {
      id: 1,
      author: 'Sarah Chen',
      username: '@sarahchen',
      avatar: 'SC',
      content: 'Just finished reading an amazing book on sustainable living. The small changes we make today can have a huge impact on our planet tomorrow. What are some sustainable practices you follow?',
      timestamp: '2 hours ago',
      likes: 42,
      comments: 8,
      saved: false,
      liked: false,
    },
    {
      id: 2,
      author: 'Marcus Rivera',
      username: '@marcusr',
      avatar: 'MR',
      content: 'Working on a new photography project capturing local wildlife. Nature is incredible when you take the time to really observe it. Here are some of my favorite shots from this week.',
      timestamp: '5 hours ago',
      likes: 127,
      comments: 23,
      saved: false,
      liked: true,
    },
    {
      id: 3,
      author: 'Emma Thompson',
      username: '@emmathompson',
      avatar: 'ET',
      content: 'Reminder: It\'s okay to take breaks from social media. Your mental health matters more than staying constantly connected. I\'m taking a week off starting tomorrow.',
      timestamp: '1 day ago',
      likes: 89,
      comments: 15,
      saved: true,
      liked: false,
    },
  ]);

  const [showLoadingMessage, setShowLoadingMessage] = useState(false);

  const handleLoadMore = () => {
    setShowLoadingMessage(true);
    setTimeout(() => setShowLoadingMessage(false), 2000);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl mb-2">Your Feed</h1>
          <p className="text-gray-400">
            Curated content from people and communities you follow
          </p>
        </div>

        {/* Healthy Engagement Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-green-400 mb-1">Mindful Browsing</h3>
              <p className="text-sm text-gray-300">
                You've been browsing for 15 minutes. Remember to take breaks and stay present.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                      {post.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{post.author}</h3>
                    <p className="text-sm text-gray-400">{post.username} • {post.timestamp}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="hover:bg-white/5">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>

              {/* Post Content */}
              <p className="text-gray-200 leading-relaxed mb-6">
                {post.content}
              </p>

              {/* Post Actions */}
              <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 text-sm ${
                    post.liked ? 'text-red-400' : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{post.comments}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`ml-auto text-sm ${
                    post.saved ? 'text-violet-400' : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${post.saved ? 'fill-current' : ''}`} />
                </motion.button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Load More - Ethical Pattern */}
        <div className="text-center py-8">
          {!showLoadingMessage ? (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                You've reached the end of new content
              </p>
              <Button
                onClick={handleLoadMore}
                variant="outline"
                className="border-white/10 hover:bg-white/5"
              >
                Load More Posts
              </Button>
              <p className="text-xs text-gray-500">
                No infinite scroll here - you're in control
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full bg-white/5" />
              <p className="text-sm text-gray-400">Loading more content...</p>
            </div>
          )}
        </div>

        {/* Wellness Prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-6 text-center"
        >
          <ThumbsUp className="w-8 h-8 text-violet-400 mx-auto mb-3" />
          <h3 className="text-lg mb-2">You're all caught up!</h3>
          <p className="text-sm text-gray-400 mb-4">
            Consider taking a break or connecting with friends offline
          </p>
          <Button variant="ghost" className="hover:bg-white/5">
            View Suggested Communities
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
