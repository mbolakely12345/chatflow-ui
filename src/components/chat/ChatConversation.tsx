import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Phone, 
  Video, 
  MoreVertical, 
  Search,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChat, Conversation } from '@/context/ChatContext';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { format, isToday, isYesterday } from 'date-fns';
import { cn } from '@/lib/utils';

interface ChatConversationProps {
  conversation: Conversation;
  onBack: () => void;
}

const ChatConversation = ({ conversation, onBack }: ChatConversationProps) => {
  const { messages, sendMessage, currentUser } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherParticipant = conversation.participants.find(p => p.id !== currentUser?.id);
  const displayName = conversation.type === 'group' ? conversation.name : otherParticipant?.name;
  const displayAvatar = conversation.type === 'group' ? conversation.avatar : otherParticipant?.avatar;
  const displayStatus = conversation.type === 'group' 
    ? `${conversation.participants.length} members` 
    : otherParticipant?.status === 'online' 
      ? 'Online' 
      : 'Last seen recently';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getDateSeparator = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM d, yyyy');
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const dateKey = format(message.timestamp, 'yyyy-MM-dd');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {} as Record<string, typeof messages>);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-background"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden rounded-full"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative">
            <img
              src={displayAvatar}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
            {conversation.type === 'direct' && otherParticipant?.status === 'online' && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-status-online rounded-full border-2 border-card" />
            )}
          </div>
          
          <div className="min-w-0">
            <h2 className="font-semibold text-foreground truncate">{displayName}</h2>
            <p className={cn(
              'text-xs truncate',
              otherParticipant?.status === 'online' ? 'text-status-online' : 'text-muted-foreground'
            )}>
              {conversation.isTyping ? 'typing...' : displayStatus}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Phone className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Video className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full hidden sm:flex">
            <Search className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedMessages).map(([dateKey, dayMessages]) => (
          <div key={dateKey}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-4">
              <span className="px-3 py-1 text-xs text-muted-foreground bg-secondary/50 rounded-full">
                {getDateSeparator(new Date(dateKey))}
              </span>
            </div>

            {/* Messages */}
            <div className="space-y-3">
              {dayMessages.map((message, index) => {
                const isOwn = message.senderId === currentUser?.id;
                const showAvatar = !isOwn && (
                  index === 0 || 
                  dayMessages[index - 1]?.senderId !== message.senderId
                );

                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={isOwn}
                    showAvatar={showAvatar}
                    avatarUrl={otherParticipant?.avatar}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        <AnimatePresence>
          {conversation.isTyping && (
            <TypingIndicator userName={conversation.typingUser} />
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={sendMessage} />
    </motion.div>
  );
};

export default ChatConversation;
