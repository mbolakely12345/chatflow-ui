import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Conversation, useChat } from '@/context/ChatContext';
import { cn } from '@/lib/utils';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

const ConversationItem = ({ conversation, isActive, onClick }: ConversationItemProps) => {
  const { currentUser } = useChat();
  
  const otherParticipant = conversation.participants.find(p => p.id !== currentUser?.id);
  const displayName = conversation.type === 'group' ? conversation.name : otherParticipant?.name;
  const displayAvatar = conversation.type === 'group' ? conversation.avatar : otherParticipant?.avatar;

  const lastMessagePreview = conversation.isTyping 
    ? 'typing...' 
    : conversation.lastMessage?.content || 'No messages yet';

  return (
    <motion.button
      whileHover={{ backgroundColor: 'hsl(var(--secondary))' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left',
        isActive && 'bg-secondary'
      )}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={displayAvatar}
          alt={displayName}
          className="w-12 h-12 rounded-full object-cover"
        />
        {conversation.type === 'direct' && otherParticipant?.status === 'online' && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-status-online rounded-full border-2 border-card" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-foreground truncate">{displayName}</span>
          {conversation.lastMessage && (
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formatDistanceToNow(conversation.lastMessage.timestamp, { addSuffix: false })}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className={cn(
            'text-sm truncate',
            conversation.isTyping ? 'text-status-typing' : 'text-muted-foreground'
          )}>
            {lastMessagePreview}
          </p>
          
          {conversation.unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex-shrink-0 min-w-5 h-5 px-1.5 flex items-center justify-center text-xs font-semibold text-primary-foreground bg-primary rounded-full"
            >
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </motion.span>
          )}
        </div>
      </div>
    </motion.button>
  );
};

export default ConversationItem;
