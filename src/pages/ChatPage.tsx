import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { ChatProvider, useChat, Conversation } from '@/context/ChatContext';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatConversation from '@/components/chat/ChatConversation';
import UserProfile from '@/components/chat/UserProfile';
import { cn } from '@/lib/utils';

const ChatContent = () => {
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileView, setMobileView] = useState<'sidebar' | 'chat' | 'profile'>('sidebar');

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    setMobileView('chat');
  };

  const handleBack = () => {
    setActiveConversation(null);
    setMobileView('sidebar');
  };

  const handleOpenProfile = () => {
    setShowProfile(true);
    setMobileView('profile');
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
    setMobileView(activeConversation ? 'chat' : 'sidebar');
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Sidebar - Desktop always visible, Mobile conditional */}
      <div className={cn(
        'w-full md:w-80 lg:w-96 flex-shrink-0',
        mobileView !== 'sidebar' && 'hidden md:block'
      )}>
        <ChatSidebar
          activeConversation={activeConversation}
          onSelectConversation={handleSelectConversation}
          onOpenProfile={handleOpenProfile}
        />
      </div>

      {/* Main Content Area */}
      <div className={cn(
        'flex-1 flex',
        mobileView === 'sidebar' && 'hidden md:flex'
      )}>
        <AnimatePresence mode="wait">
          {showProfile ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1"
            >
              <UserProfile onClose={handleCloseProfile} />
            </motion.div>
          ) : activeConversation ? (
            <motion.div
              key={activeConversation.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1"
            >
              <ChatConversation
                conversation={activeConversation}
                onBack={handleBack}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 hidden md:flex items-center justify-center bg-background"
            >
              <div className="text-center">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to ChatFlow</h2>
                <p className="text-muted-foreground max-w-sm">
                  Select a conversation from the sidebar to start chatting
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ChatPage = () => {
  return (
    <ChatProvider>
      <ChatContent />
    </ChatProvider>
  );
};

export default ChatPage;
