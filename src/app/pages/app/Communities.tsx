import { motion } from 'motion/react';
import { Users, TrendingUp, Star, Plus, Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

export default function Communities() {
  const communities = [
    {
      id: 1,
      name: 'Sustainable Living',
      description: 'Tips and discussions about eco-friendly lifestyle choices',
      members: 12500,
      posts: 1840,
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
      category: 'Gaming',
      trending: true,
      joined: false,
    },
  ];

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
          <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0">
            <Plus className="w-5 h-5 mr-2" />
            Create Community
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search communities..."
            className="pl-12 bg-white/5 border-white/10 focus:border-violet-500 placeholder:text-gray-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['All', 'Joined', 'Trending', 'Recommended'].map((filter) => (
            <Button
              key={filter}
              variant={filter === 'All' ? 'default' : 'outline'}
              className={
                filter === 'All'
                  ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 border-0'
                  : 'border-white/10 hover:bg-white/5'
              }
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Communities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {communities.map((community, index) => (
            <motion.div
              key={community.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative"
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
                  <span>{community.members.toLocaleString()} members</span>
                  <span>•</span>
                  <span>{community.posts.toLocaleString()} posts</span>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-white/10 text-gray-400">
                    {community.category}
                  </Badge>
                  <Button
                    size="sm"
                    variant={community.joined ? 'outline' : 'default'}
                    className={
                      community.joined
                        ? 'border-white/10 hover:bg-white/5'
                        : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0'
                    }
                  >
                    {community.joined ? 'Joined' : 'Join'}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
      </div>
    </div>
  );
}
