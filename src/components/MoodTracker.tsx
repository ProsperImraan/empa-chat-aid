import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Smile, Meh, Frown, Heart, BarChart3, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface MoodEntry {
  id: string;
  mood: string;
  emoji: string;
  intensity: number;
  notes?: string;
  date: Date;
  color: string;
}

const MoodTracker = () => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedIntensity, setSelectedIntensity] = useState<number>(5);
  const [notes, setNotes] = useState<string>('');
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([
    { id: '1', mood: 'Happy', emoji: '😊', intensity: 7, date: new Date(Date.now() - 86400000), color: 'bg-green-100 text-green-800' },
    { id: '2', mood: 'Anxious', emoji: '😰', intensity: 6, date: new Date(Date.now() - 172800000), color: 'bg-orange-100 text-orange-800' },
    { id: '3', mood: 'Calm', emoji: '😌', intensity: 8, date: new Date(Date.now() - 259200000), color: 'bg-blue-100 text-blue-800' },
  ]);

  const moods = [
    { name: 'Happy', emoji: '😊', icon: Smile, color: 'bg-green-100 text-green-800 hover:bg-green-200' },
    { name: 'Sad', emoji: '😢', icon: Frown, color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
    { name: 'Anxious', emoji: '😰', icon: Heart, color: 'bg-orange-100 text-orange-800 hover:bg-orange-200' },
    { name: 'Angry', emoji: '😠', icon: Frown, color: 'bg-red-100 text-red-800 hover:bg-red-200' },
    { name: 'Calm', emoji: '😌', icon: Smile, color: 'bg-teal-100 text-teal-800 hover:bg-teal-200' },
    { name: 'Excited', emoji: '🤗', icon: Smile, color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
    { name: 'Overwhelmed', emoji: '🤯', icon: Frown, color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
    { name: 'Neutral', emoji: '😐', icon: Meh, color: 'bg-gray-100 text-gray-800 hover:bg-gray-200' },
  ];

  useEffect(() => {
    if (user) {
      loadMoodEntries();
    }
  }, [user]);

  const loadMoodEntries = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) throw error;

      const entries = data?.map(entry => ({
        id: entry.id,
        mood: entry.mood,
        emoji: moods.find(m => m.name === entry.mood)?.emoji || '😐',
        intensity: entry.intensity,
        notes: entry.notes,
        date: new Date(entry.created_at),
        color: moods.find(m => m.name === entry.mood)?.color || 'bg-gray-100 text-gray-800'
      })) || [];

      setMoodEntries(entries);
    } catch (error) {
      console.error('Error loading mood entries:', error);
    }
  };

  const handleMoodSelect = async (mood: typeof moods[0]) => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: mood.name,
      emoji: mood.emoji,
      intensity: selectedIntensity,
      notes: notes.trim(),
      date: new Date(),
      color: mood.color.replace('hover:bg-', '').replace(/hover:\S+/g, '').trim(),
    };

    setMoodEntries(prev => [newEntry, ...prev]);
    setSelectedMood(mood.name);
    
    // Save to database if user is logged in
    if (user) {
      try {
        await supabase.from('mood_entries').insert({
          user_id: user.id,
          mood: mood.name,
          intensity: selectedIntensity,
          notes: notes.trim() || null,
        });
        toast.success('Mood entry saved successfully!');
      } catch (error) {
        console.error('Error saving mood entry:', error);
        toast.error('Failed to save mood entry');
      }
    }
    
    // Clear form
    setNotes('');
    setSelectedIntensity(5);
    
    // Clear selection after a moment
    setTimeout(() => setSelectedMood(''), 2000);
  };

  const getWeekSummary = () => {
    const weekEntries = moodEntries.filter(entry => 
      entry.date >= new Date(Date.now() - 7 * 86400000)
    );
    
    if (weekEntries.length === 0) return 'No entries this week';
    
    const averageIntensity = weekEntries.reduce((sum, entry) => sum + entry.intensity, 0) / weekEntries.length;
    const moodCounts = weekEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommon = Object.entries(moodCounts).sort(([,a], [,b]) => b - a)[0];
    return `Most common: ${mostCommon[0]} (Avg intensity: ${averageIntensity.toFixed(1)}/10)`;
  };

  const getChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    return last7Days.map(date => {
      const dayEntries = moodEntries.filter(entry => 
        entry.date.toDateString() === date.toDateString()
      );
      
      const avgIntensity = dayEntries.length > 0 
        ? dayEntries.reduce((sum, entry) => sum + entry.intensity, 0) / dayEntries.length
        : null;
        
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        intensity: avgIntensity,
      };
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-gentle border-0 bg-card">
        <CardHeader>
          <CardTitle className="text-center text-foreground">How are you feeling today?</CardTitle>
          <p className="text-center text-muted-foreground">Track your mental well-being with daily mood logging</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mood Selection */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-3 block">Select your mood:</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {moods.map((mood) => (
                <Button
                  key={mood.name}
                  variant="ghost"
                  className={`flex flex-col items-center space-y-2 p-4 h-auto ${mood.color} transition-smooth hover:scale-105 ${
                    selectedMood === mood.name ? 'ring-2 ring-primary scale-105' : ''
                  }`}
                  onClick={() => setSelectedMood(mood.name)}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-xs font-medium">{mood.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Intensity Scale */}
          {selectedMood && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-foreground">
                  Intensity (1-10): {selectedIntensity}
                </Label>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-sm text-muted-foreground">Low</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={selectedIntensity}
                    onChange={(e) => setSelectedIntensity(Number(e.target.value))}
                    className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-muted-foreground">High</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes" className="text-sm font-medium text-foreground">
                  Notes (optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="What's contributing to this feeling? Any specific thoughts or events?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={() => {
                  const mood = moods.find(m => m.name === selectedMood);
                  if (mood) handleMoodSelect(mood);
                }}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Log Mood Entry
              </Button>
            </div>
          )}
          
          {selectedMood && !selectedMood && (
            <div className="mt-4 text-center">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Mood logged: {selectedMood} ✓
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Mood Entries */}
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
                <div key={entry.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{entry.emoji}</span>
                      <div>
                        <Badge className={entry.color}>{entry.mood}</Badge>
                        <span className="ml-2 text-sm text-muted-foreground">
                          {entry.intensity}/10
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {entry.date.toLocaleDateString()}
                    </span>
                  </div>
                  {entry.notes && (
                    <p className="text-sm text-muted-foreground ml-8 italic">
                      "{entry.notes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
            {!user && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  Sign in to save your mood history and see detailed analytics
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mood Analytics */}
        <Card className="shadow-gentle border-0 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span>Weekly Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-soft-gradient rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">This Week</p>
                <p className="font-semibold text-foreground">{getWeekSummary()}</p>
              </div>
              
              {/* Chart */}
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip 
                      formatter={(value: any) => [value ? value.toFixed(1) : 'No data', 'Mood Intensity']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="intensity" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Mood Distribution:</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Happy', 'Sad', 'Anxious', 'Calm'].map(mood => {
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