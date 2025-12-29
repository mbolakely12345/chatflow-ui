import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';
import { Message } from '@/context/ChatContext';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  avatarUrl?: string;
}

const MessageBubble = ({ message, isOwn, showAvatar, avatarUrl }: MessageBubbleProps) => {
  const getStatusIcon = () => {
    if (!isOwn) return null;
    switch (message.status) {
      case 'sent':
        return <Check className="w-3.5 h-3.5 text-message-sent-foreground/60" />;
      case 'delivered':
        return <CheckCheck className="w-3.5 h-3.5 text-message-sent-foreground/60" />;
      case 'read':
        return <CheckCheck className="w-3.5 h-3.5 text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn('flex items-end gap-2 max-w-[85%] md:max-w-[70%]', isOwn ? 'ml-auto flex-row-reverse' : '')}
    >
      {showAvatar && !isOwn && (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
      )}
      {!showAvatar && !isOwn && <div className="w-8" />}
      
      <div className={cn('relative group', isOwn ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'px-4 py-2.5 rounded-2xl relative',
            isOwn
              ? 'bg-message-sent text-message-sent-foreground rounded-br-md'
              : 'bg-message-received text-message-received-foreground rounded-bl-md'
          )}
        >
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
          
          <div className={cn('flex items-center gap-1.5 mt-1', isOwn ? 'justify-end' : '')}>
            <span className={cn('text-[11px]', isOwn ? 'text-message-sent-foreground/60' : 'text-muted-foreground')}>
              {formatDistanceToNow(message.timestamp, { addSuffix: false })}
            </span>
            {getStatusIcon()}
          </div>
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              'absolute -bottom-3 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-card border border-border shadow-sm',
              isOwn ? 'right-2' : 'left-2'
            )}
          >
            {message.reactions.map((reaction, index) => (
              <span key={index} className="text-sm">{reaction}</span>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
