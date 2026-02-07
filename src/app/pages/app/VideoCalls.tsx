import { motion } from 'motion/react';
import {
  Video,
  Calendar,
  Users,
  Clock,
  Plus,
  VideoOff,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';

export default function VideoCalls() {
  const upcomingCalls = [
    {
      id: 1,
      title: 'Project Discussion',
      participants: ['Alex Johnson', 'Sarah Chen'],
      time: 'Today, 2:00 PM',
      duration: '30 min',
      type: 'Meeting',
    },
    {
      id: 2,
      title: 'Community Catch-up',
      participants: ['Marcus Rivera', 'Emma Thompson', '+3 others'],
      time: 'Tomorrow, 10:00 AM',
      duration: '1 hour',
      type: 'Group',
    },
  ];

  const recentCalls = [
    {
      id: 1,
      name: 'Alex Johnson',
      avatar: 'AJ',
      type: 'Video Call',
      time: '2 hours ago',
      duration: '45 min',
      missed: false,
    },
    {
      id: 2,
      name: 'Sarah Chen',
      avatar: 'SC',
      type: 'Voice Call',
      time: 'Yesterday',
      duration: '12 min',
      missed: false,
    },
    {
      id: 3,
      name: 'Marcus Rivera',
      avatar: 'MR',
      type: 'Video Call',
      time: '2 days ago',
      duration: '0 min',
      missed: true,
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl mb-2">Video Calls</h1>
            <p className="text-gray-400">
              Connect face-to-face with your network
            </p>
          </div>
          <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0">
            <Plus className="w-5 h-5 mr-2" />
            Start New Call
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mb-4">
              <Video className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="mb-1">Instant Video</h3>
            <p className="text-sm text-gray-400">Start a call now</p>
          </motion.button>

          <motion.button
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="mb-1">Schedule Call</h3>
            <p className="text-sm text-gray-400">Plan for later</p>
          </motion.button>

          <motion.button
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="mb-1">Group Call</h3>
            <p className="text-sm text-gray-400">Multiple people</p>
          </motion.button>

          <motion.button
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="mb-1">Call Rooms</h3>
            <p className="text-sm text-gray-400">Drop-in spaces</p>
          </motion.button>
        </div>

        {/* Upcoming Calls */}
        {upcomingCalls.length > 0 && (
          <div>
            <h2 className="text-2xl mb-4">Upcoming Calls</h2>
            <div className="space-y-4">
              {upcomingCalls.map((call, index) => (
                <motion.div
                  key={call.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-2xl p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl">{call.title}</h3>
                        <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">
                          {call.type}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {call.time}
                        </span>
                        <span>•</span>
                        <span>{call.duration}</span>
                        <span>•</span>
                        <span className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {call.participants.join(', ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="border-white/10 hover:bg-white/5">
                        Reschedule
                      </Button>
                      <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0">
                        <Video className="w-4 h-4 mr-2" />
                        Join Call
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Calls */}
        <div>
          <h2 className="text-2xl mb-4">Recent Calls</h2>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl divide-y divide-white/10">
            {recentCalls.map((call) => (
              <motion.div
                key={call.id}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                      {call.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="mb-1">{call.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      {call.missed ? (
                        <VideoOff className="w-4 h-4 text-red-400" />
                      ) : call.type === 'Video Call' ? (
                        <Video className="w-4 h-4 text-violet-400" />
                      ) : (
                        <Phone className="w-4 h-4 text-green-400" />
                      )}
                      <span className={call.missed ? 'text-red-400' : ''}>
                        {call.missed ? 'Missed' : call.type}
                      </span>
                      <span>•</span>
                      <span>{call.time}</span>
                      {!call.missed && (
                        <>
                          <span>•</span>
                          <span>{call.duration}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-white/5"
                  >
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-white/5"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6"
        >
          <div className="flex items-start gap-3">
            <Video className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-blue-400 mb-2">Privacy-First Video Calls</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• End-to-end encrypted video and audio</li>
                <li>• No call recordings without explicit consent</li>
                <li>• Your call history stays private</li>
                <li>• Optimized for low-bandwidth connections</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
