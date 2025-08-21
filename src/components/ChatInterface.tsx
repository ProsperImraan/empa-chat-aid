import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Bot, User, Mic, MicOff, Volume2 } from 'lucide-react';
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
      content: "Hello! I'm ScholarAI, your personal academic assistant. I'm here to help you with your studies, answer questions, and support your learning journey. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNewMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakMessage = (text: string) => {
    if (synthRef.current && voiceEnabled && !isSpeaking) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const generateBotResponse = (userMessage: string): string => {
    // Academic and student-focused responses based on keywords
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('study') || lowerMessage.includes('studying') || lowerMessage.includes('exam')) {
      return "I can help you create an effective study plan! What subject are you working on? I can suggest study techniques like the Pomodoro method, spaced repetition, or active recall that might work best for your learning style.";
    }
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('anxious')) {
      return "Academic stress is completely normal - you're not alone in feeling this way. Let's break down what's causing the pressure. Would you like some stress management techniques or help prioritizing your tasks?";
    }
    
    if (lowerMessage.includes('motivation') || lowerMessage.includes('procrastination') || lowerMessage.includes('lazy')) {
      return "Motivation can be tricky! Let's find what works for you. Try setting small, achievable goals and celebrating each win. Would you like me to help you break down a big task into smaller, manageable steps?";
    }
    
    if (lowerMessage.includes('math') || lowerMessage.includes('science') || lowerMessage.includes('homework') || lowerMessage.includes('assignment')) {
      return "I'd love to help with your academic work! Can you tell me more about what you're working on? I can explain concepts, help with problem-solving strategies, or suggest resources for deeper understanding.";
    }
    
    if (lowerMessage.includes('time') || lowerMessage.includes('schedule') || lowerMessage.includes('manage')) {
      return "Time management is a key skill for academic success! I can help you create a study schedule, set up a Pomodoro timer, or organize your tasks by priority. What's your biggest time management challenge right now?";
    }
    
    if (lowerMessage.includes('career') || lowerMessage.includes('future') || lowerMessage.includes('job')) {
      return "Planning for your future is exciting! I can help you explore career paths, discuss skill development, or even practice interview questions. What area interests you most?";
    }
    
    // Default supportive academic response
    return "I'm here to support your academic journey! Whether you need help with studies, time management, stress relief, or just want to chat about your goals, I'm ready to assist. How can I help you succeed today?";
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
      
      // Speak the bot response if voice is enabled
      if (voiceEnabled) {
        setTimeout(() => {
          speakMessage(botResponse.content);
        }, 500);
      }
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
        <div className="flex items-center space-x-2 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={cn(
              "transition-colors",
              voiceEnabled ? "bg-primary text-primary-foreground" : "bg-muted"
            )}
          >
            <Volume2 className="w-4 h-4 mr-2" />
            {voiceEnabled ? "Voice On" : "Voice Off"}
          </Button>
          {isSpeaking && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>Speaking...</span>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your studies or life..."
            className="flex-1 border-border/50 focus:ring-primary/50"
          />
          <Button
            variant="outline"
            onClick={isListening ? stopListening : startListening}
            disabled={isTyping}
            className={cn(
              "transition-colors",
              isListening ? "bg-red-500 text-white animate-pulse" : "bg-muted"
            )}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
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