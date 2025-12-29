import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Camera, 
  Edit2, 
  Bell, 
  BellOff,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Shield,
  HelpCircle,
  LogOut,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useChat } from '@/context/ChatContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

interface UserProfileProps {
  onClose: () => void;
}

const UserProfile = ({ onClose }: UserProfileProps) => {
  const { currentUser } = useChat();
  const { theme, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [notifications, setNotifications] = useState(true);
  const [showOnline, setShowOnline] = useState(true);

  const handleSave = () => {
    setIsEditing(false);
    // Save logic would go here
  };

  const settingsGroups = [
    {
      title: 'Preferences',
      items: [
        {
          icon: theme === 'dark' ? Sun : Moon,
          label: theme === 'dark' ? 'Light Mode' : 'Dark Mode',
          action: toggleTheme,
          type: 'button' as const,
        },
        {
          icon: notifications ? Bell : BellOff,
          label: 'Notifications',
          checked: notifications,
          onChange: () => setNotifications(!notifications),
          type: 'toggle' as const,
        },
        {
          icon: showOnline ? Eye : EyeOff,
          label: 'Show Online Status',
          checked: showOnline,
          onChange: () => setShowOnline(!showOnline),
          type: 'toggle' as const,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: Shield,
          label: 'Privacy & Security',
          action: () => {},
          type: 'button' as const,
        },
        {
          icon: HelpCircle,
          label: 'Help Center',
          action: () => {},
          type: 'button' as const,
        },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col h-full bg-background"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-semibold text-foreground">Profile</h2>
        {isEditing && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full ml-auto"
            onClick={handleSave}
          >
            <Check className="w-5 h-5 text-primary" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Avatar Section */}
        <div className="flex flex-col items-center py-8 bg-gradient-to-b from-primary/10 to-transparent">
          <div className="relative group">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-28 h-28 rounded-full object-cover ring-4 ring-background shadow-lg"
            />
            <button className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {isEditing ? (
            <div className="mt-4 w-full max-w-xs px-4 space-y-3">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="text-center h-12 text-lg font-semibold"
              />
              <Input
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Your bio"
                className="text-center"
              />
            </div>
          ) : (
            <>
              <h3 className="mt-4 text-xl font-bold text-foreground">{currentUser?.name}</h3>
              <p className="text-muted-foreground">{currentUser?.bio || 'Hey there!'}</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-primary"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </>
          )}
        </div>

        {/* Settings */}
        <div className="p-4 space-y-6">
          {settingsGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                {group.title}
              </h4>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <div
                    key={item.label}
                    className={cn(
                      'flex items-center gap-3 px-3 py-3 rounded-xl',
                      item.type === 'button' && 'hover:bg-secondary cursor-pointer transition-colors'
                    )}
                    onClick={item.type === 'button' ? item.action : undefined}
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="flex-1 font-medium text-foreground">{item.label}</span>
                    {item.type === 'toggle' && (
                      <Switch checked={item.checked} onCheckedChange={item.onChange} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Logout */}
          <button className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-destructive/10 transition-colors w-full">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-destructive" />
            </div>
            <span className="font-medium text-destructive">Log Out</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfile;
