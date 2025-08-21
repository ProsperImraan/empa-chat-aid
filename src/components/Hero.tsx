import { Button } from '@/components/ui/button';
import { MessageCircle, Heart, Sparkles } from 'lucide-react';
import heroImage from '@/assets/hero-mental-health.jpg';

interface HeroProps {
  onStartChat: () => void;
}

const Hero = ({ onStartChat }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-secondary/80"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-warm">
              <Heart className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Your Mental Health
            <span className="block bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
              Companion
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            A safe space to share your thoughts, track your mood, and find support whenever you need it.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <Button 
              size="lg"
              className="bg-white text-primary hover:bg-white/90 shadow-warm text-lg px-8 py-6 rounded-full font-semibold"
              onClick={onStartChat}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Chatting
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-md text-lg px-8 py-6 rounded-full font-semibold"
              onClick={() => document.querySelector('#mood')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Track Your Mood
            </Button>
          </div>
          
          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-warm">
              <MessageCircle className="w-8 h-8 text-white mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2">AI Chat Support</h3>
              <p className="text-white/80 text-sm">
                Talk to our empathetic AI companion anytime you need someone to listen.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-warm">
              <Heart className="w-8 h-8 text-white mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Mood Tracking</h3>
              <p className="text-white/80 text-sm">
                Log your daily emotions and discover patterns in your mental health journey.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-warm">
              <Sparkles className="w-8 h-8 text-white mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Curated Resources</h3>
              <p className="text-white/80 text-sm">
                Access helpful articles, exercises, and professional support contacts.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;