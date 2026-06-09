// import { useEffect, useState, useRef } from 'react';
// import { motion } from 'motion/react';
// import { Search, Send, Phone, Video, MoreHorizontal, Paperclip, Smile } from 'lucide-react';
// import { Button } from '../../components/ui/button';
// import { Input } from '../../components/ui/input';
// import { Avatar, AvatarFallback } from '../../components/ui/avatar';
// import { ScrollArea } from '../../components/ui/scroll-area';
// import { getConversations, sendMessage, getMessages } from '../../api/auth';

// // Type definitions
// interface User {
//   _id?: string;
//   id?: string;
//   name: string;
//   username?: string;
//   email?: string;
// }

// interface Participant {
//   _id: string;
//   name: string;
//   email?: string;
// }

// interface Conversation {
//   _id: string;
//   participants: Participant[];
//   lastMessage?: string;
//   updatedAt: string;
//   createdAt: string;
// }

// interface MessageType {
//   _id: string;
//   conversationId: string;
//   senderId: string;
//   receiverId: string;
//   text: string;
//   createdAt: string;
//   updatedAt: string;
//   __v?: number;
// }

// export default function Messages() {
//   const [selectedChat, setSelectedChat] = useState<string | null>(null);
//   const [selectedUser, setSelectedUser] = useState<any>(null);
//   const [message, setMessage] = useState('');
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [messages, setMessages] = useState<MessageType[]>([]);
//   const [currentUserId, setCurrentUserId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const userId = localStorage.getItem("userId");
//     setCurrentUserId(userId);
//     fetchConversations();
//   }, []);

//   useEffect(() => {
//     if (selectedChat) {
//       fetchMessages(selectedChat);
//     }
//   }, [selectedChat]);

//   // Auto-scroll to bottom when new messages arrive
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const fetchConversations = async () => {
//     try {
//       const res = await getConversations();
//       console.log("Conversations:", res);
//       setConversations(res.conversations || []);
//     } catch (error) {
//       console.error("Error fetching conversations:", error);
//     }
//   };

//   const fetchMessages = async (conversationId: string) => {
//     try {
//       setLoading(true);
//       const res = await getMessages(conversationId);
//       console.log("Messages response:", res);
      
//       // Handle the response structure correctly
//       if (res.success && res.messages) {
//         setMessages(res.messages);
//       } else if (Array.isArray(res)) {
//         setMessages(res);
//       } else {
//         setMessages([]);
//       }
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//       setMessages([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!message.trim() || !selectedChat || !currentConversation) return;

//     try {
//       const receiver = currentConversation.participants?.find(
//         (user: any) => user._id !== currentUserId
//       );

//       if (!receiver) {
//         console.error("Receiver not found");
//         return;
//       }

//       const response = await sendMessage(selectedChat, receiver._id, message);
//       console.log("Message sent:", response);
      
//       // Clear input
//       setMessage("");
      
//       // Refresh messages after sending
//       await fetchMessages(selectedChat);
      
//       // Also update the conversation's last message in the list
//       setConversations(prevConversations => 
//         prevConversations.map(conv => 
//           conv._id === selectedChat 
//             ? { ...conv, lastMessage: message, updatedAt: new Date().toISOString() }
//             : conv
//         )
//       );
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   useEffect(() => {
//     const raw = localStorage.getItem("ethica-startConversation");

//     if (raw) {
//       try {
//         const user: User = JSON.parse(raw);
//         const userId = user._id || user.id;
        
//         if (!userId) return;

//         // Check if conversation already exists
//         const existingConversation = conversations.find(
//           conv => conv.participants.some(p => p._id === userId)
//         );

//         if (existingConversation) {
//           setSelectedChat(existingConversation._id);
//           localStorage.removeItem("ethica-startConversation");
//           return;
//         }

//         // Create conversation object from the selected user
//         const newConversation: any = {
//           _id: userId,
//           participants: [
//             { _id: userId, name: user.name },
//             { _id: currentUserId, name: "Me" }
//           ],
//           lastMessage: "Start a conversation...",
//           updatedAt: new Date().toISOString(),
//           createdAt: new Date().toISOString(),
//         };

//         // Set the selected user/conversation
//         setSelectedUser(newConversation);
//         setSelectedChat(userId);
        
//         // Set conversations array with just this single user
//         setConversations(prev => [newConversation, ...prev]);

//         // Clear localStorage to prevent re-adding on subsequent renders
//         localStorage.removeItem("ethica-startConversation");
//       } catch (error) {
//         console.error("Error parsing user data from localStorage:", error);
//       }
//     }
//   }, [currentUserId, conversations]);

//   // Get current conversation for the chat header
//   const currentConversation = selectedChat 
//     ? conversations.find(conv => conv._id === selectedChat)
//     : null;

//   // Get the other user in the conversation
//   const getOtherUser = (conversation: Conversation) => {
//     return conversation.participants?.find(
//       (user: any) => user._id !== currentUserId
//     );
//   };

//   // Format message for display
//   const formatMessagesForDisplay = () => {
//     return messages.map((msg) => ({
//       id: msg._id,
//       sender: msg.senderId === currentUserId ? 'me' : 'other',
//       content: msg.text,
//       timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     }));
//   };

//   return (
//     <div className="h-screen flex overflow-hidden">
//       {/* Conversations List */}
//       <div className="w-full md:w-80 lg:w-96 border-r border-white/10 bg-white/5 flex flex-col">
//         <div className="p-4 border-b border-white/10">
//           <h1 className="text-2xl mb-4">Messages</h1>
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <Input
//               placeholder="Search conversations..."
//               className="pl-10 bg-white/5 border-white/10 focus:border-violet-500 placeholder:text-gray-500"
//             />
//           </div>
//         </div>

//         <ScrollArea className="flex-1">
//           <div className="p-2 space-y-1">
//             {conversations.map((conversation: Conversation) => {
//               const otherUser = getOtherUser(conversation);
              
//               return (
//                 <motion.button
//                   key={conversation._id}
//                   onClick={() => setSelectedChat(conversation._id)}
//                   whileHover={{ x: 4 }}
//                   className={`w-[95%] flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
//                     selectedChat === conversation._id
//                       ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30'
//                       : 'hover:bg-white/5'
//                   }`}
//                 >
//                   <div className="relative">
//                     <Avatar className="w-12 h-12">
//                       <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
//                         {otherUser?.name?.charAt(0)?.toUpperCase() || "U"}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-slate-900 rounded-full" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center justify-between mb-1">
//                       <h3 className="truncate font-medium">{otherUser?.name || "Unknown User"}</h3>
//                       <span className="text-xs text-gray-400">
//                         {new Date(conversation.updatedAt).toLocaleDateString()}
//                       </span>
//                     </div>
//                     <p className="text-sm text-gray-400 truncate">
//                       {conversation.lastMessage || "Start a conversation"}
//                     </p>
//                   </div>
//                 </motion.button>
//               );
//             })}
//             {conversations.length === 0 && (
//               <div className="text-center py-8 text-gray-400">
//                 <p>No conversations yet</p>
//                 <p className="text-sm mt-2">Start a conversation from a user's profile</p>
//               </div>
//             )}
//           </div>
//         </ScrollArea>
//       </div>

//       {/* Chat Area */}
//       <div className="hidden md:flex flex-1 flex-col bg-gradient-to-br from-slate-950/50 via-slate-900/50 to-slate-950/50">
//         {currentConversation ? (
//           <>
//             {/* Chat Header */}
//             <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <Avatar className="w-10 h-10">
//                   <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
//                     {getOtherUser(currentConversation)?.name?.charAt(0)?.toUpperCase() || "U"}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <h3 className="font-medium">{getOtherUser(currentConversation)?.name || "Unknown User"}</h3>
//                   <p className="text-sm text-gray-400">Active now</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Button variant="ghost" size="sm" className="hover:bg-white/5">
//                   <Phone className="w-5 h-5" />
//                 </Button>
//                 <Button variant="ghost" size="sm" className="hover:bg-white/5">
//                   <Video className="w-5 h-5" />
//                 </Button>
//                 <Button variant="ghost" size="sm" className="hover:bg-white/5">
//                   <MoreHorizontal className="w-5 h-5" />
//                 </Button>
//               </div>
//             </div>

//             {/* Messages */}
//             <ScrollArea className="flex-1 p-4">
//               <div className="space-y-4 max-w-3xl mx-auto">
//                 {loading ? (
//                   <div className="text-center py-8 text-gray-400">
//                     <p>Loading messages...</p>
//                   </div>
//                 ) : (
//                   <>
//                     {formatMessagesForDisplay().map((msg, index) => (
//                       <motion.div
//                         key={msg.id}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: index * 0.05 }}
//                         className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
//                       >
//                         <div
//                           className={`max-w-md ${
//                             msg.sender === 'me'
//                               ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-2xl rounded-br-md'
//                               : 'bg-white/10 text-gray-200 rounded-2xl rounded-bl-md'
//                           } px-4 py-3`}
//                         >
//                           <p className="leading-relaxed">{msg.content}</p>
//                           <span className="text-xs opacity-70 mt-1 block">{msg.timestamp}</span>
//                         </div>
//                       </motion.div>
//                     ))}
//                     {messages.length === 0 && (
//                       <div className="text-center py-8 text-gray-400">
//                         <p>No messages yet</p>
//                         <p className="text-sm mt-2">Send a message to start the conversation</p>
//                       </div>
//                     )}
//                     <div ref={messagesEndRef} />
//                   </>
//                 )}
//               </div>
//             </ScrollArea>

//             {/* Message Input */}
//             <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-xl">
//               <form onSubmit={handleSendMessage} className="flex items-center gap-2">
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="hover:bg-white/5"
//                 >
//                   <Paperclip className="w-5 h-5" />
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="hover:bg-white/5"
//                 >
//                   <Smile className="w-5 h-5" />
//                 </Button>
//                 <Input
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   placeholder="Type a message..."
//                   className="flex-1 bg-white/5 border-white/10 focus:border-violet-500 placeholder:text-gray-500"
//                   onKeyPress={(e) => {
//                     if (e.key === 'Enter' && !e.shiftKey) {
//                       e.preventDefault();
//                       handleSendMessage(e);
//                     }
//                   }}
//                 />
//                 <Button
//                   type="submit"
//                   disabled={!message.trim() || loading}
//                   className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0"
//                 >
//                   <Send className="w-5 h-5" />
//                 </Button>
//               </form>
//               <p className="text-xs text-gray-500 mt-2 text-center">
//                 All messages are end-to-end encrypted 🔒
//               </p>
//             </div>
//           </>
//         ) : (
//           /* No conversation selected state */
//           <div className="flex-1 flex items-center justify-center p-8 text-center">
//             <div>
//               <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
//                 <Search className="w-10 h-10 text-gray-400" />
//               </div>
//               <h3 className="text-xl font-medium mb-2">No conversation selected</h3>
//               <p className="text-gray-400">
//                 Select a conversation from the list to start messaging
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Mobile: Show message to select a chat */}
//       <div className="md:hidden flex-1 flex items-center justify-center p-8 text-center">
//         <div>
//           <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
//             <Search className="w-8 h-8 text-gray-400" />
//           </div>
//           <p className="text-gray-400">
//             Select a conversation to start messaging
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }








import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Search, Send, Phone, Video, MoreHorizontal, Paperclip, Smile, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { ScrollArea } from '../../components/ui/scroll-area';
import { getConversations, sendMessage, getMessages } from '../../api/auth';

// Type definitions
interface User {
  _id?: string;
  id?: string;
  name: string;
  username?: string;
  email?: string;
}

interface Participant {
  _id: string;
  name: string;
  email?: string;
}

interface Conversation {
  _id: string;
  participants: Participant[];
  lastMessage?: string;
  updatedAt: string;
  createdAt: string;
}

interface MessageType {
  _id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mobileView, setMobileView] = useState<'conversations' | 'chat'>('conversations');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check screen size for mobile view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Mobile view
        if (selectedChat) {
          setMobileView('chat');
        } else {
          setMobileView('conversations');
        }
      } else {
        // Desktop view
        setMobileView('conversations');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedChat]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log("Current user ID:", userId);
    setCurrentUserId(userId);
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat);
      // On mobile, switch to chat view when a conversation is selected
      if (window.innerWidth < 768) {
        setMobileView('chat');
      }
      // Focus input on mobile when chat opens
      setTimeout(() => {
        if (window.innerWidth < 768 && inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const res = await getConversations();
      console.log("Conversations:", res);
      setConversations(res.conversations || []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      setLoading(true);
      const res = await getMessages(conversationId);
      console.log("Messages response:", res);
      
      let messagesData = [];
      if (res.success && res.messages) {
        messagesData = res.messages;
      } else if (Array.isArray(res)) {
        messagesData = res;
      } else {
        messagesData = [];
      }
      
      setMessages(messagesData);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !selectedChat || !currentConversation) return;

    try {
      const receiver = currentConversation.participants?.find(
        (user: any) => user._id !== currentUserId
      );

      if (!receiver) {
        console.error("Receiver not found");
        return;
      }

      const response = await sendMessage(selectedChat, receiver._id, message);
      console.log("Message sent:", response);
      
      setMessage("");
      await fetchMessages(selectedChat);
      
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv._id === selectedChat 
            ? { ...conv, lastMessage: message, updatedAt: new Date().toISOString() }
            : conv
        )
      );
      
      // Keep focus on input after sending on mobile
      if (window.innerWidth < 768 && inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const raw = localStorage.getItem("ethica-startConversation");

    if (raw) {
      try {
        const user: User = JSON.parse(raw);
        const userId = user._id || user.id;
        
        if (!userId) return;

        const existingConversation = conversations.find(
          conv => conv.participants.some(p => p._id === userId)
        );

        if (existingConversation) {
          setSelectedChat(existingConversation._id);
          localStorage.removeItem("ethica-startConversation");
          return;
        }

        const newConversation: any = {
          _id: userId,
          participants: [
            { _id: userId, name: user.name },
            { _id: currentUserId, name: "Me" }
          ],
          lastMessage: "Start a conversation...",
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };

        setSelectedUser(newConversation);
        setSelectedChat(userId);
        setConversations(prev => [newConversation, ...prev]);
        localStorage.removeItem("ethica-startConversation");
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, [currentUserId, conversations]);

  const currentConversation = selectedChat 
    ? conversations.find(conv => conv._id === selectedChat)
    : null;

  const getOtherUser = (conversation: Conversation) => {
    return conversation.participants?.find(
      (user: any) => user._id !== currentUserId
    );
  };

  // Improved message sender check
  const isMyMessage = (message: MessageType): boolean => {
    if (!currentUserId) return false;
    
    // Convert both to strings for reliable comparison
    const senderIdStr = String(message.senderId);
    const currentIdStr = String(currentUserId);
    
    return senderIdStr === currentIdStr;
  };

  // Format message for display with proper alignment
  const formatMessagesForDisplay = () => {
    return messages.map((msg) => ({
      id: msg._id,
      isMyMessage: isMyMessage(msg),
      content: msg.text,
      timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
  };

  const handleBackToConversations = () => {
    setSelectedChat(null);
    setMobileView('conversations');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Conversations List - Desktop always visible, Mobile conditional */}
      <div className={`
        ${mobileView === 'conversations' ? 'flex' : 'hidden md:flex'}
        w-full md:w-80 lg:w-96 border-r border-white/10 bg-white/5 flex flex-col
      `}>
        <div className="p-4 border-b border-white/10">
          <h1 className="text-2xl font-bold text-white mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 bg-white/5 border-white/10 focus:border-violet-500 placeholder:text-gray-500 text-white"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {conversations.map((conversation: Conversation) => {
              const otherUser = getOtherUser(conversation);
              
              return (
                <motion.button
                  key={conversation._id}
                  onClick={() => setSelectedChat(conversation._id)}
                  whileHover={{ x: 4 }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                    selectedChat === conversation._id
                      ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                        {otherUser?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-slate-900 rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="truncate font-medium text-white">{otherUser?.name || "Unknown User"}</h3>
                      <span className="text-xs text-gray-400">
                        {new Date(conversation.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {conversation.lastMessage || "Start a conversation"}
                    </p>
                  </div>
                </motion.button>
              );
            })}
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
      <div className={`
        ${mobileView === 'chat' ? 'flex' : 'hidden md:flex'}
        flex-1 flex-col bg-gradient-to-br from-slate-950/50 via-slate-900/50 to-slate-950/50
      `}>
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Back button for mobile */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToConversations}
                  className="md:hidden hover:bg-white/5 text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                    {getOtherUser(currentConversation)?.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-white">{getOtherUser(currentConversation)?.name || "Unknown User"}</h3>
                  <p className="text-sm text-green-400">Active now</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="hover:bg-white/5 text-white">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="hover:bg-white/5 text-white">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="hover:bg-white/5 text-white">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-3xl mx-auto">
                {loading ? (
                  <div className="text-center py-8 text-gray-400">
                    <p>Loading messages...</p>
                  </div>
                ) : (
                  <>
                    {formatMessagesForDisplay().map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex ${msg.isMyMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] sm:max-w-[70%] px-4 py-3 ${
                            msg.isMyMessage
                              ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-2xl rounded-br-md'
                              : 'bg-white/10 text-white rounded-2xl rounded-bl-md'
                          }`}
                        >
                          <p className="leading-relaxed break-words text-sm sm:text-base">{msg.content}</p>
                          <span className={`text-xs mt-1 block ${
                            msg.isMyMessage ? 'text-purple-200' : 'text-gray-300'
                          }`}>
                            {msg.timestamp}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                    {messages.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <p>No messages yet</p>
                        <p className="text-sm mt-2">Send a message to start the conversation</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
            </ScrollArea>

            {/* Message Input - Fixed for mobile */}
            <div className="p-3 sm:p-4 border-t border-white/10 bg-white/5 backdrop-blur-xl">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="hover:bg-white/5 text-white flex-shrink-0 hidden sm:flex"
                >
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="hover:bg-white/5 text-white flex-shrink-0 hidden sm:flex"
                >
                  <Smile className="w-5 h-5" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full bg-white/5 border-white/10 focus:border-violet-500 placeholder:text-gray-500 text-white text-sm sm:text-base pr-12"
                    style={{
                      WebkitAppearance: 'none',
                      WebkitTapHighlightColor: 'transparent',
                      fontSize: '16px', // Prevents zoom on mobile
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!message.trim() || loading}
                  className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 border-0 flex-shrink-0"
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
              <h3 className="text-xl font-medium text-white mb-2">No conversation selected</h3>
              <p className="text-gray-400">
                Select a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}