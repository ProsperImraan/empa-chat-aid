import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import ChatInterface from '@/components/ChatInterface';
import MoodTracker from '@/components/MoodTracker';
import ResourcesHub from '@/components/ResourcesHub';

const Index = () => {
  const [activeSection, setActiveSection] = useState<'hero' | 'chat' | 'mood' | 'resources'>('hero');

  const handleStartChat = () => {
    setActiveSection('chat');
    setTimeout(() => {
      document.querySelector('#chat')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div id="hero">
        <Hero onStartChat={handleStartChat} />
      </div>

      {/* Chat Section */}
      <section id="chat" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Chat with EmpaBot
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI companion is here to listen, provide support, and help you process your thoughts in a safe, judgment-free environment.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="h-[600px]">
              <ChatInterface />
            </div>
          </div>
        </div>
      </section>

      {/* Mood Tracking Section */}
      <section id="mood" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Track Your Mood
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Understanding your emotional patterns is the first step toward better mental health. Log your mood daily and see your progress over time.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <MoodTracker />
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Mental Health Resources
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find professional help, educational content, and self-care activities to support your mental health journey.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <ResourcesHub />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-warm-gradient rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xl font-semibold">EmpaChat</span>
          </div>
          <p className="text-background/80 mb-6">
            Your mental health matters. You are not alone in this journey.
          </p>
          <div className="text-sm text-background/60">
            <p>This is a support tool and does not replace professional mental health care.</p>
            <p className="mt-2">If you're in crisis, please contact emergency services or a mental health professional immediately.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
