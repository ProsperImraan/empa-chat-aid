import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Heart, BookOpen, User, Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: MessageCircle, label: 'Chat', href: '#chat' },
    { icon: BookOpen, label: 'Timer', href: '#study-timer' },
    { icon: Heart, label: 'Energy', href: '#energy' },
    { icon: User, label: 'Resources', href: '#resources' },
  ];

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-warm-gradient rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold bg-warm-gradient bg-clip-text text-transparent">
              ScholarAI
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth"
                onClick={() => {
                  document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="flex items-center justify-start space-x-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth"
                  onClick={() => {
                    document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                    setIsOpen(false);
                  }}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;