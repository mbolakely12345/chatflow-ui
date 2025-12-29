import { useState, createContext, useContext, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  bio?: string;
  lastSeen?: Date;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  reactions?: string[];
  replyTo?: string;
  type: 'text' | 'image' | 'audio' | 'file';
  fileUrl?: string;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  name?: string;
  avatar?: string;
  isTyping?: boolean;
  typingUser?: string;
}

interface ChatContextType {
  currentUser: User | null;
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  setActiveConversation: (conversation: Conversation | null) => void;
  sendMessage: (content: string, type?: Message['type']) => void;
  setCurrentUser: (user: User | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Mock data
const mockUsers: User[] = [
  { id: '1', name: 'You', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you', status: 'online', bio: 'Available' },
  { id: '2', name: 'Sarah Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', status: 'online', bio: 'Hey there! I am using ChatApp' },
  { id: '3', name: 'Mike Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', status: 'offline', lastSeen: new Date(Date.now() - 3600000) },
  { id: '4', name: 'Emma Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma', status: 'online' },
  { id: '5', name: 'Alex Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', status: 'away' },
  { id: '6', name: 'Design Team', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=design', status: 'online' },
];

const mockMessages: Message[] = [
  { id: '1', content: 'Hey! How are you doing?', senderId: '2', timestamp: new Date(Date.now() - 7200000), status: 'read', type: 'text' },
  { id: '2', content: 'I am doing great, thanks! Just finished the new design 🎨', senderId: '1', timestamp: new Date(Date.now() - 7100000), status: 'read', type: 'text' },
  { id: '3', content: 'That sounds amazing! Can you share it?', senderId: '2', timestamp: new Date(Date.now() - 7000000), status: 'read', type: 'text' },
  { id: '4', content: 'Sure! Let me send you the Figma link', senderId: '1', timestamp: new Date(Date.now() - 6900000), status: 'read', type: 'text' },
  { id: '5', content: 'Here it is: figma.com/file/xyz123', senderId: '1', timestamp: new Date(Date.now() - 6800000), status: 'delivered', type: 'text' },
  { id: '6', content: 'This looks incredible! I love the color scheme 💚', senderId: '2', timestamp: new Date(Date.now() - 3600000), status: 'read', type: 'text', reactions: ['❤️', '🔥'] },
  { id: '7', content: 'Thanks! The teal really makes it pop', senderId: '1', timestamp: new Date(Date.now() - 3500000), status: 'read', type: 'text' },
  { id: '8', content: 'Are we still meeting tomorrow at 3?', senderId: '2', timestamp: new Date(Date.now() - 1800000), status: 'read', type: 'text' },
];

const mockConversations: Conversation[] = [
  {
    id: '1',
    type: 'direct',
    participants: [mockUsers[0], mockUsers[1]],
    lastMessage: mockMessages[mockMessages.length - 1],
    unreadCount: 2,
    isTyping: true,
    typingUser: 'Sarah',
  },
  {
    id: '2',
    type: 'direct',
    participants: [mockUsers[0], mockUsers[2]],
    lastMessage: { id: 'm1', content: 'See you tomorrow!', senderId: '3', timestamp: new Date(Date.now() - 86400000), status: 'read', type: 'text' },
    unreadCount: 0,
  },
  {
    id: '3',
    type: 'direct',
    participants: [mockUsers[0], mockUsers[3]],
    lastMessage: { id: 'm2', content: 'The project is almost done 🚀', senderId: '4', timestamp: new Date(Date.now() - 172800000), status: 'read', type: 'text' },
    unreadCount: 5,
  },
  {
    id: '4',
    type: 'group',
    participants: [mockUsers[0], mockUsers[1], mockUsers[2], mockUsers[3], mockUsers[4]],
    name: 'Design Team',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=design',
    lastMessage: { id: 'm3', content: 'Alex: Great work everyone!', senderId: '5', timestamp: new Date(Date.now() - 259200000), status: 'read', type: 'text' },
    unreadCount: 12,
  },
];

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]);
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const sendMessage = (content: string, type: Message['type'] = 'text') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      senderId: currentUser?.id || '1',
      timestamp: new Date(),
      status: 'sent',
      type,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <ChatContext.Provider
      value={{
        currentUser,
        conversations,
        activeConversation,
        messages,
        setActiveConversation,
        sendMessage,
        setCurrentUser,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
