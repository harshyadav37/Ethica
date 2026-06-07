import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Send, Phone, Video, MoreHorizontal, Paperclip, Smile } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { ScrollArea } from '../../components/ui/scroll-area';

// Type definitions
interface User {
  _id?: string;
  id?: string;
  name: string;
  username?: string;
  email?: string;
}

interface Conversation {
  id: string;
  name: string;
  username: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: number;
  sender: 'me' | 'other';
  content: string;
  timestamp: string;
}

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<Conversation | null>(null);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Sample messages - can be replaced with real data from API
  const messages: Message[] = [
    {
      id: 1,
      sender: 'other',
      content: 'Hey! How are you doing?',
      timestamp: '10:30 AM',
    },
    {
      id: 2,
      sender: 'me',
      content: "I'm doing great, thanks! Just finished working on a new project.",
      timestamp: '10:32 AM',
    },
    {
      id: 3,
      sender: 'other',
      content: 'Oh that\'s awesome! What kind of project?',
      timestamp: '10:33 AM',
    },
    {
      id: 4,
      sender: 'me',
      content: "It's a privacy-focused social platform. Really excited about it!",
      timestamp: '10:35 AM',
    },
    {
      id: 5,
      sender: 'other',
      content: 'That sounds great! When should we meet to discuss it further?',
      timestamp: '10:37 AM',
    },
  ];

  useEffect(() => {
    const raw = localStorage.getItem("ethica-startConversation");

    if (raw) {
      try {
        const user: User = JSON.parse(raw);
        const userId = user._id || user.id;
        
        if (!userId) return;

        // Create conversation object from the selected user
        const newConversation: Conversation = {
          id: userId,
          name: user.name,
          username: user.username || "",
          avatar: user.name
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "U",
          online: true,
          lastMessage: "Start a conversation...",
          timestamp: "Now",
          unread: 0,
        };

        // Set the selected user/conversation
        setSelectedUser(newConversation);
        setSelectedChat(userId);
        
        // Set conversations array with just this single user
        setConversations([newConversation]);

        // Clear localStorage to prevent re-adding on subsequent renders
        localStorage.removeItem("ethica-startConversation");
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setMessage('');
      // Here you would typically send the message to your backend
    }
  };

  // Get current conversation for the chat header
  const currentConversation = selectedChat 
    ? conversations.find(conv => conv.id === selectedChat)
    : null;

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Conversations List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-white/10 bg-white/5 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h1 className="text-2xl mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 bg-white/5 border-white/10 focus:border-violet-500 placeholder:text-gray-500"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {conversations.map((conv) => (
              <motion.button
                key={conv.id}
                onClick={() => setSelectedChat(conv.id)}
                whileHover={{ x: 4 }}
                className={`w-[95%] flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                  selectedChat === conv.id
                    ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                      {conv.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-slate-900 rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="truncate font-medium">{conv.name}</h3>
                    <span className="text-xs text-gray-400">{conv.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center text-xs font-medium">
                    {conv.unread}
                  </div>
                )}
              </motion.button>
            ))}
            {conversations.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p>No conversations yet</p>
                <p className="text-sm mt-2">Start a conversation from a user's profile</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="hidden md:flex flex-1 flex-col bg-gradient-to-br from-slate-950/50 via-slate-900/50 to-slate-950/50">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                    {currentConversation.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{currentConversation.name}</h3>
                  <p className="text-sm text-gray-400">
                    {currentConversation.online ? 'Active now' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="hover:bg-white/5">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="hover:bg-white/5">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="hover:bg-white/5">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-3xl mx-auto">
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md ${
                        msg.sender === 'me'
                          ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-2xl rounded-br-md'
                          : 'bg-white/10 text-gray-200 rounded-2xl rounded-bl-md'
                      } px-4 py-3`}
                    >
                      <p className="leading-relaxed">{msg.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">{msg.timestamp}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-xl">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="hover:bg-white/5"
                >
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="hover:bg-white/5"
                >
                  <Smile className="w-5 h-5" />
                </Button>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/5 border-white/10 focus:border-violet-500 placeholder:text-gray-500"
                />
                <Button
                  type="submit"
                  disabled={!message.trim()}
                  className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
              <p className="text-xs text-gray-500 mt-2 text-center">
                All messages are end-to-end encrypted 🔒
              </p>
            </div>
          </>
        ) : (
          /* No conversation selected state */
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div>
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">No conversation selected</h3>
              <p className="text-gray-400">
                Select a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile: Show message to select a chat */}
      <div className="md:hidden flex-1 flex items-center justify-center p-8 text-center">
        <div>
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-400">
            Select a conversation to start messaging
          </p>
        </div>
      </div>
    </div>
  );
}