import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Phone, Book, Heart, Headphones, Users } from 'lucide-react';

const ResourcesHub = () => {
  const emergencyContacts = [
    {
      name: 'National Suicide Prevention Lifeline',
      number: '988',
      description: '24/7 crisis support',
      urgent: true,
    },
    {
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: 'Free, confidential crisis support',
      urgent: true,
    },
    {
      name: 'SAMHSA National Helpline',
      number: '1-800-662-4357',
      description: 'Treatment referral and information service',
      urgent: false,
    },
  ];

  const articles = [
    {
      title: 'Understanding Anxiety: A Beginner\'s Guide',
      category: 'Anxiety',
      readTime: '5 min read',
      description: 'Learn about anxiety symptoms, causes, and coping strategies.',
      icon: Heart,
    },
    {
      title: 'Mindfulness Techniques for Daily Stress',
      category: 'Mindfulness',
      readTime: '7 min read',
      description: 'Simple mindfulness exercises you can practice anywhere.',
      icon: Headphones,
    },
    {
      title: 'Building Healthy Sleep Habits',
      category: 'Wellness',
      readTime: '6 min read',
      description: 'Improve your mental health through better sleep.',
      icon: Book,
    },
    {
      title: 'Supporting a Friend in Crisis',
      category: 'Support',
      readTime: '4 min read',
      description: 'How to be there for someone who\'s struggling.',
      icon: Users,
    },
  ];

  const selfCareActivities = [
    { activity: 'Deep Breathing Exercise', duration: '5 minutes', type: 'Relaxation' },
    { activity: 'Gratitude Journaling', duration: '10 minutes', type: 'Reflection' },
    { activity: 'Progressive Muscle Relaxation', duration: '15 minutes', type: 'Relaxation' },
    { activity: 'Mindful Walking', duration: '20 minutes', type: 'Movement' },
    { activity: 'Positive Affirmations', duration: '5 minutes', type: 'Mindset' },
    { activity: 'Creative Expression', duration: '30 minutes', type: 'Creative' },
  ];

  return (
    <div className="space-y-6">
      {/* Emergency Contacts */}
      <Card className="shadow-warm border-0 bg-gradient-to-br from-red-50 to-orange-50 border-l-4 border-l-destructive">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-destructive">
            <Phone className="w-5 h-5" />
            <span>Emergency Support</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-foreground">{contact.name}</h3>
                    {contact.urgent && (
                      <Badge variant="destructive" className="text-xs">Urgent</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{contact.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="font-mono font-bold text-destructive border-destructive hover:bg-destructive hover:text-white"
                  onClick={() => window.open(`tel:${contact.number.replace(/\D/g, '')}`)}
                >
                  {contact.number}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Articles & Resources */}
        <Card className="shadow-gentle border-0 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Book className="w-5 h-5 text-primary" />
              <span>Educational Resources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {articles.map((article, index) => (
                <div key={index} className="group p-4 rounded-lg border border-border hover:shadow-gentle transition-smooth hover:bg-muted/30">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <article.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-smooth">
                          {article.title}
                        </h3>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-smooth" />
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                        <span className="text-xs text-muted-foreground">{article.readTime}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{article.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Self-Care Activities */}
        <Card className="shadow-gentle border-0 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-secondary" />
              <span>Self-Care Activities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selfCareActivities.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-soft-gradient hover:shadow-gentle transition-smooth">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{item.activity}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">{item.type}</Badge>
                      <span className="text-xs text-muted-foreground">{item.duration}</span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-primary hover:bg-primary/10"
                  >
                    Try it
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
              <h3 className="font-semibold text-secondary mb-2">Daily Self-Care Reminder</h3>
              <p className="text-sm text-muted-foreground">
                Remember: Taking care of your mental health is not selfish. Small, consistent actions can make a big difference in how you feel.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResourcesHub;