import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Users,
  Volume2,
  VolumeX,
  Smile,
  Image,
  Paperclip,
  MoreVertical,
  Crown,
  Shield,
  Star,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system' | 'tournament' | 'moderator';
  userRole: 'player' | 'spectator' | 'moderator' | 'admin';
  userAvatar?: string;
  isHighlighted?: boolean;
}

interface ChatChannel {
  id: string;
  name: string;
  type: 'general' | 'tournament' | 'team' | 'private';
  participants: number;
  isActive: boolean;
}

interface LiveChatProps {
  tournamentId: string;
  tournamentName: string;
  isOpen: boolean;
  onClose: () => void;
}

const LiveChat: React.FC<LiveChatProps> = ({
  tournamentId,
  tournamentName,
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: 'system',
      username: 'Sistema',
      message: '¡Bienvenidos al torneo! El chat está ahora activo.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: 'system',
      userRole: 'admin'
    },
    {
      id: '2',
      userId: 'mod1',
      username: 'Moderador_CS2',
      message: 'Recuerden mantener un ambiente respetuoso. ¡Buena suerte a todos!',
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
      type: 'moderator',
      userRole: 'moderator'
    },
    {
      id: '3',
      userId: 'player1',
      username: 'ProGamer123',
      message: '¡Hola a todos! ¿Quién está listo para la primera ronda?',
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      type: 'text',
      userRole: 'player'
    },
    {
      id: '4',
      userId: 'player2',
      username: 'ElitePlayer',
      message: '¡Listo! Esperando que empiece la acción 🔥',
      timestamp: new Date(Date.now() - 1000 * 60 * 1),
      type: 'text',
      userRole: 'player'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [activeChannel, setActiveChannel] = useState<string>('general');
  const [isMuted, setIsMuted] = useState(false);
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showChannels, setShowChannels] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const channels: ChatChannel[] = [
    { id: 'general', name: 'General', type: 'general', participants: 156, isActive: true },
    { id: 'tournament', name: 'Torneo', type: 'tournament', participants: 89, isActive: true },
    { id: 'team-alpha', name: 'Team Alpha', type: 'team', participants: 5, isActive: true },
    { id: 'team-beta', name: 'Team Beta', type: 'team', participants: 5, isActive: true },
    { id: 'spectators', name: 'Espectadores', type: 'general', participants: 67, isActive: true }
  ];

  const emojis = ['😀', '😂', '🤣', '😊', '😍', '🤔', '😎', '🔥', '💪', '🎮', '🏆', '👏', '👍', '❤️', '💯'];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && !isMuted) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        userId: 'currentUser',
        username: 'Tú',
        message: newMessage.trim(),
        timestamp: new Date(),
        type: 'text',
        userRole: 'player'
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setIsTyping([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-3 w-3 text-yellow-500" />;
      case 'moderator':
        return <Shield className="h-3 w-3 text-blue-500" />;
      case 'player':
        return <Star className="h-3 w-3 text-green-500" />;
      default:
        return null;
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'system':
        return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
      case 'moderator':
        return 'bg-purple-500/20 border-purple-500/30 text-purple-400';
      case 'tournament':
        return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
      default:
        return 'bg-white/5 border-white/10';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Chat Panel */}
      <div className="relative w-full max-w-md h-96 bg-gray-900/95 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-white" />
            <div>
              <h3 className="text-white font-semibold">Chat en Vivo</h3>
              <p className="text-xs text-white/60">{tournamentName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isMuted ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setShowChannels(!showChannels)}
              className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200"
            >
              <Users className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Channels Sidebar */}
          {showChannels && (
            <div className="w-48 border-r border-white/10 bg-white/5">
              <div className="p-3 border-b border-white/10">
                <h4 className="text-sm font-semibold text-white mb-2">Canales</h4>
              </div>
              <div className="p-2 space-y-1">
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel.id)}
                    className={`w-full text-left p-2 rounded-lg text-sm transition-all duration-200 ${
                      activeChannel === channel.id
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        : 'text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{channel.name}</span>
                      <span className="text-xs bg-white/10 px-1 rounded">
                        {channel.participants}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    getMessageTypeColor(message.type)
                  } ${message.isHighlighted ? 'ring-2 ring-orange-500/30' : ''}`}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0">
                      {message.userAvatar ? (
                        <img
                          src={message.userAvatar}
                          alt={message.username}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {message.username.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-white">
                          {message.username}
                        </span>
                        {getRoleIcon(message.userRole)}
                        <span className="text-xs text-white/40">
                          {message.timestamp.toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-white/80 break-words">
                        {message.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping.length > 0 && (
                <div className="p-3 rounded-lg border border-white/10 bg-white/5">
                  <p className="text-sm text-white/60 italic">
                    {isTyping.join(', ')} está escribiendo...
                  </p>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <Smile className="h-4 w-4" />
                </button>
                <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                  <Image className="h-4 w-4" />
                </button>
                <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                  <Paperclip className="h-4 w-4" />
                </button>
                {isMuted && (
                  <span className="text-xs text-red-400 ml-auto">
                    Chat silenciado
                  </span>
                )}
              </div>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="mb-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="grid grid-cols-8 gap-2">
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => addEmoji(emoji)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 text-lg"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isMuted ? "Chat silenciado" : "Escribe un mensaje..."}
                  disabled={isMuted}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200 disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isMuted}
                  className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
