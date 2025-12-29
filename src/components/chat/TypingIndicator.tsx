import { motion } from 'framer-motion';

interface TypingIndicatorProps {
  userName?: string;
}

const TypingIndicator = ({ userName }: TypingIndicatorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-2 px-4 py-2"
    >
      <div className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-md bg-message-received">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-status-typing"
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
      {userName && (
        <span className="text-xs text-muted-foreground">{userName} is typing...</span>
      )}
    </motion.div>
  );
};

export default TypingIndicator;
