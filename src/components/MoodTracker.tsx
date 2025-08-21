import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smile, Meh, Frown, Heart, Zap, Cloud, Sun } from 'lucide-react';

interface MoodEntry {
  id: string;
  mood: string;
  emoji: string;
  date: Date;
  color: string;
}

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([
    { id: '1', mood: 'Happy', emoji: '😊', date: new Date(Date.now() - 86400000), color: 'bg-yellow-100 text-yellow-800' },
    { id: '2', mood: 'Calm', emoji: '😌', date: new Date(Date.now() - 172800000), color: 'bg-blue-100 text-blue-800' },
    { id: '3', mood: 'Anxious', emoji: '😰', date: new Date(Date.now() - 259200000), color: 'bg-orange-100 text-orange-800' },
  ]);

  const moods = [
    { name: 'Excellent', emoji: '🤩', icon: Sun, color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
    { name: 'Happy', emoji: '😊', icon: Smile, color: 'bg-green-100 text-green-800 hover:bg-green-200' },
    { name: 'Good', emoji: '🙂', icon: Heart, color: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' },
    { name: 'Okay', emoji: '😐', icon: Meh, color: 'bg-gray-100 text-gray-800 hover:bg-gray-200' },
    { name: 'Low', emoji: '😔', icon: Cloud, color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
    { name: 'Sad', emoji: '😢', icon: Frown, color: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200' },
    { name: 'Anxious', emoji: '😰', icon: Zap, color: 'bg-orange-100 text-orange-800 hover:bg-orange-200' },
  ];

  const handleMoodSelect = (mood: typeof moods[0]) => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: mood.name,
      emoji: mood.emoji,
      date: new Date(),
      color: mood.color.replace('hover:bg-', '').replace(/hover:\S+/g, '').trim(),
    };

    setMoodEntries(prev => [newEntry, ...prev]);
    setSelectedMood(mood.name);
    
    // Clear selection after a moment
    setTimeout(() => setSelectedMood(''), 2000);
  };

  const getWeekSummary = () => {
    const weekEntries = moodEntries.filter(entry => 
      entry.date >= new Date(Date.now() - 7 * 86400000)
    );
    
    const moodCounts = weekEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommon = Object.entries(moodCounts).sort(([,a], [,b]) => b - a)[0];
    return mostCommon ? `Most common: ${mostCommon[0]}` : 'No entries this week';
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-gentle border-0 bg-card">
        <CardHeader>
          <CardTitle className="text-center text-foreground">How are you feeling today?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {moods.map((mood) => (
              <Button
                key={mood.name}
                variant="ghost"
                className={`flex flex-col items-center space-y-2 p-4 h-auto ${mood.color} transition-smooth hover:scale-105 ${
                  selectedMood === mood.name ? 'ring-2 ring-primary scale-105' : ''
                }`}
                onClick={() => handleMoodSelect(mood)}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs font-medium">{mood.name}</span>
              </Button>
            ))}
          </div>
          
          {selectedMood && (
            <div className="mt-4 text-center">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Mood logged: {selectedMood} ✓
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-gentle border-0 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-primary" />
              <span>Recent Moods</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {moodEntries.slice(0, 5).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{entry.emoji}</span>
                    <div>
                      <Badge className={entry.color}>{entry.mood}</Badge>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {entry.date.toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-gentle border-0 bg-card">
          <CardHeader>
            <CardTitle>Weekly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-soft-gradient rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">This Week</p>
                <p className="font-semibold text-foreground">{getWeekSummary()}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Mood Distribution:</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Happy', 'Calm', 'Anxious', 'Sad'].map(mood => {
                    const count = moodEntries.filter(entry => entry.mood === mood).length;
                    return (
                      <div key={mood} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{mood}</span>
                        <span className="font-medium text-foreground">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MoodTracker;