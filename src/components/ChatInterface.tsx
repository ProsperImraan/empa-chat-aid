import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm here to listen and support you. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    // Simple empathetic responses based on keywords
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
      return "I hear that you're feeling sad right now. That's completely valid, and I want you to know that these feelings are temporary. Would you like to talk about what's been weighing on your heart?";
    }
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('stress')) {
      return "It sounds like you're experiencing anxiety or stress. These feelings can be overwhelming, but remember that you're not alone. Let's take a deep breath together. What's been causing you the most worry lately?";
    }
    
    if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great')) {
      return "I'm so glad to hear that you're feeling positive today! It's wonderful when we can appreciate these brighter moments. What's been bringing you joy recently?";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "I'm here to help and support you in any way I can. Sometimes just talking about what we're going through can provide relief. What kind of support would be most helpful for you right now?";
    }
    
    // Default empathetic response
    return "Thank you for sharing that with me. I can sense that this is important to you. Your feelings are valid, and I'm here to listen without judgment. Would you like to tell me more about how you're experiencing this?";
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(newMessage),
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-soft-gradient rounded-lg overflow-hidden shadow-gentle">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start space-x-3",
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.sender === 'bot' && (
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <Card
              className={cn(
                "max-w-xs sm:max-w-md shadow-gentle border-0",
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card'
              )}
            >
              <CardContent className="p-3">
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className={cn(
                  "text-xs mt-1 opacity-70",
                  message.sender === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
                )}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </CardContent>
            </Card>

            {message.sender === 'user' && (
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <Card className="bg-card shadow-gentle border-0">
              <CardContent className="p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background/50 p-4">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share what's on your mind..."
            className="flex-1 border-border/50 focus:ring-primary/50"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isTyping}
            className="bg-primary hover:bg-primary/90 shadow-gentle"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;