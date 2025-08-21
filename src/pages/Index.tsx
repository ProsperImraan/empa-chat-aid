import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import ChatInterface from '@/components/ChatInterface';
import StudyTimer from '@/components/StudyTimer';
import MoodTracker from '@/components/MoodTracker';
import ResourcesHub from '@/components/ResourcesHub';

const Index = () => {
  const [activeSection, setActiveSection] = useState<'hero' | 'chat' | 'study-timer' | 'energy' | 'resources'>('hero');

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
              Chat with ScholarAI
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your intelligent study companion with voice assistance. Ask questions, get study help, or just chat about your academic journey.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="h-[600px]">
              <ChatInterface />
            </div>
          </div>
        </div>
      </section>

      {/* Study Timer Section */}
      <section id="study-timer" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Focus Timer
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Use the Pomodoro technique to maximize your study sessions. Stay focused, take breaks, and track your productivity.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <StudyTimer />
          </div>
        </div>
      </section>

      {/* Energy Tracking Section */}
      <section id="energy" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Track Your Study Energy
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Monitor your study motivation and energy levels. Identify patterns to optimize your learning schedule and maintain peak performance.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <MoodTracker />
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Academic Resources
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover study techniques, academic support services, and productivity tools to excel in your educational journey.
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
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7V10C2 16 12 22 12 22S22 16 22 10V7L12 2ZM12 6C13.1 6 14 6.9 14 8S13.1 10 12 10 10 9.1 10 8 10.9 6 12 6ZM12 12C14.67 12 16.8 13.34 16.95 15H7.05C7.2 13.34 9.33 12 12 12Z"/>
              </svg>
            </div>
            <span className="text-xl font-semibold">ScholarAI</span>
          </div>
          <p className="text-background/80 mb-6">
            Your academic success is our priority. Study smart, not just hard.
          </p>
          <div className="text-sm text-background/60">
            <p>This is an educational support tool designed to enhance your learning experience.</p>
            <p className="mt-2">For academic emergencies or mental health crises, please contact your institution's support services.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
