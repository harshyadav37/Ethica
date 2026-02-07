import { motion } from 'motion/react';
import {
  MessageSquare,
  TrendingUp,
  Clock,
  Pin,
  CheckCircle,
  Users,
  ThumbsUp,
  MessageCircle,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';

export default function Forums() {
  const categories = [
    { id: 1, name: 'General Discussion', threads: 1243, posts: 8901 },
    { id: 2, name: 'Privacy & Security', threads: 567, posts: 3421 },
    { id: 3, name: 'Feature Requests', threads: 234, posts: 1890 },
    { id: 4, name: 'Community Support', threads: 789, posts: 5432 },
  ];

  const threads = [
    {
      id: 1,
      title: 'How to customize your privacy settings?',
      author: 'Sarah Chen',
      avatar: 'SC',
      category: 'Privacy & Security',
      replies: 23,
      views: 456,
      lastActivity: '2h ago',
      pinned: true,
      solved: true,
      trending: false,
    },
    {
      id: 2,
      title: 'Ideas for improving the feed algorithm',
      author: 'Marcus Rivera',
      avatar: 'MR',
      category: 'Feature Requests',
      replies: 47,
      views: 892,
      lastActivity: '4h ago',
      pinned: false,
      solved: false,
      trending: true,
    },
    {
      id: 3,
      title: 'Welcome new members! Introduce yourself here',
      author: 'Community Team',
      avatar: 'CT',
      category: 'General Discussion',
      replies: 156,
      views: 2341,
      lastActivity: '1h ago',
      pinned: true,
      solved: false,
      trending: false,
    },
    {
      id: 4,
      title: 'Best practices for community moderation',
      author: 'Alex Johnson',
      avatar: 'AJ',
      category: 'Community Support',
      replies: 31,
      views: 678,
      lastActivity: '6h ago',
      pinned: false,
      solved: true,
      trending: false,
    },
    {
      id: 5,
      title: 'Feature announcement: New video call rooms',
      author: 'Ethica Team',
      avatar: 'ET',
      category: 'General Discussion',
      replies: 89,
      views: 1567,
      lastActivity: '3h ago',
      pinned: false,
      solved: false,
      trending: true,
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl mb-2">Forums</h1>
            <p className="text-gray-400">
              Join discussions and get help from the community
            </p>
          </div>
          <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0">
            <MessageSquare className="w-5 h-5 mr-2" />
            New Thread
          </Button>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-2xl mb-4">Categories</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="mb-2">{category.name}</h3>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>{category.threads.toLocaleString()} threads</p>
                  <p>{category.posts.toLocaleString()} posts</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['All Threads', 'Trending', 'Pinned', 'Solved', 'Unanswered'].map((filter) => (
            <Button
              key={filter}
              variant={filter === 'All Threads' ? 'default' : 'outline'}
              className={
                filter === 'All Threads'
                  ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 border-0'
                  : 'border-white/10 hover:bg-white/5'
              }
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Threads List */}
        <div className="space-y-3">
          {threads.map((thread, index) => (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 4 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all cursor-pointer"
            >
              <div className="flex gap-4">
                {/* Avatar */}
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                    {thread.avatar}
                  </AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-2">
                    {thread.pinned && (
                      <Pin className="w-4 h-4 text-violet-400 flex-shrink-0 mt-1" />
                    )}
                    <h3 className="text-lg flex-1">{thread.title}</h3>
                    <div className="flex gap-2 flex-shrink-0">
                      {thread.solved && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Solved
                        </Badge>
                      )}
                      {thread.trending && (
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-3">
                    <span>{thread.author}</span>
                    <span>•</span>
                    <Badge variant="outline" className="border-white/10 text-gray-400">
                      {thread.category}
                    </Badge>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {thread.lastActivity}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <span className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      {thread.replies} replies
                    </span>
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {thread.views} views
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Forum Guidelines */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-6"
        >
          <div className="flex items-start gap-3">
            <ThumbsUp className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-violet-400 mb-2">Community Guidelines</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Be respectful and constructive in your discussions</li>
                <li>• Search before posting to avoid duplicates</li>
                <li>• Mark solved threads to help others</li>
                <li>• Report inappropriate content - our moderation is transparent</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
