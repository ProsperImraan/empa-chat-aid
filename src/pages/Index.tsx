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
              Mental Health Support Chat
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A safe, judgment-free space to share your thoughts and feelings. Our AI provides empathetic support and resources tailored to your needs.
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
              Mood Tracking & Analytics
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Monitor your emotional wellbeing with daily mood logging. Track patterns and insights to better understand your mental health journey.
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
              Access curated mental health resources, emergency support, self-care activities, and professional services to support your wellbeing.
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
            <div className="w-8 h-8 bg-healing-gradient rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 3.5C14.1 3.1 13.1 3.1 12.2 3.5L6 7V9C6 10.1 6.9 11 8 11S10 10.1 10 9V8L12 7L14 8V9C14 10.1 14.9 11 16 11S18 10.1 18 9H21ZM12 13.5C7.1 13.5 3 17.6 3 22.5H21C21 17.6 16.9 13.5 12 13.5Z"/>
              </svg>
            </div>
            <span className="text-xl font-semibold">MindfulChat</span>
          </div>
          <p className="text-background/80 mb-6">
            Your mental health matters. You are not alone in this journey.
          </p>
          <div className="text-sm text-background/60">
            <p>This platform provides supportive resources and should not replace professional mental health care.</p>
            <p className="mt-2">If you're experiencing a mental health emergency, please contact emergency services or a crisis hotline immediately.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
