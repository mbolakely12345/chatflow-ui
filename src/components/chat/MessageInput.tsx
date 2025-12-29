import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Paperclip, Mic, Send, Image, FileText, Video, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

const emojis = ['😊', '😂', '❤️', '🔥', '👍', '🎉', '😍', '🙌', '💯', '✨', '🚀', '💪'];

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      setShowEmoji(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
    inputRef.current?.focus();
  };

  return (
    <div className="relative px-4 py-3 bg-card border-t border-border">
      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmoji && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-4 mb-2 p-3 bg-card border border-border rounded-2xl shadow-card"
          >
            <div className="grid grid-cols-6 gap-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => addEmoji(emoji)}
                  className="w-9 h-9 flex items-center justify-center text-xl hover:bg-secondary rounded-lg transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attachment Options */}
      <AnimatePresence>
        {showAttach && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-12 mb-2 p-2 bg-card border border-border rounded-2xl shadow-card flex gap-2"
          >
            {[
              { icon: Image, label: 'Photo', color: 'text-green-500' },
              { icon: Video, label: 'Video', color: 'text-purple-500' },
              { icon: FileText, label: 'Document', color: 'text-blue-500' },
            ].map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                className="flex flex-col items-center gap-1 p-3 hover:bg-secondary rounded-xl transition-colors"
              >
                <div className={cn('w-10 h-10 rounded-full bg-secondary flex items-center justify-center', color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs text-muted-foreground">{label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2">
        {/* Emoji Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn('rounded-full h-10 w-10 flex-shrink-0', showEmoji && 'bg-secondary')}
          onClick={() => {
            setShowEmoji(!showEmoji);
            setShowAttach(false);
          }}
        >
          {showEmoji ? (
            <X className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Smile className="w-5 h-5 text-muted-foreground" />
          )}
        </Button>

        {/* Attach Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn('rounded-full h-10 w-10 flex-shrink-0', showAttach && 'bg-secondary')}
          onClick={() => {
            setShowAttach(!showAttach);
            setShowEmoji(false);
          }}
        >
          {showAttach ? (
            <X className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          )}
        </Button>

        {/* Input Field */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-2xl resize-none focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground max-h-32"
            style={{ minHeight: '44px' }}
          />
        </div>

        {/* Voice / Send Button */}
        {message.trim() ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Button
              onClick={handleSend}
              className="rounded-full h-10 w-10 bg-primary hover:bg-primary/90"
            >
              <Send className="w-5 h-5" />
            </Button>
          </motion.div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className={cn('rounded-full h-10 w-10', isRecording && 'bg-destructive text-destructive-foreground')}
            onMouseDown={() => setIsRecording(true)}
            onMouseUp={() => setIsRecording(false)}
            onMouseLeave={() => setIsRecording(false)}
          >
            <Mic className={cn('w-5 h-5', isRecording ? 'animate-pulse' : 'text-muted-foreground')} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MessageInput;
