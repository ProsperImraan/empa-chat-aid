import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, Square, Clock, Coffee, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudySession {
  id: string;
  type: 'focus' | 'break' | 'long-break';
  duration: number;
  completedAt: Date;
}

const StudyTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSession, setCurrentSession] = useState<'focus' | 'break' | 'long-break'>('focus');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [customDuration, setCustomDuration] = useState('25');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sessionTypes = {
    focus: { duration: 25 * 60, label: 'Focus Time', icon: BookOpen, color: 'bg-green-100 text-green-800' },
    break: { duration: 5 * 60, label: 'Short Break', icon: Coffee, color: 'bg-blue-100 text-blue-800' },
    'long-break': { duration: 15 * 60, label: 'Long Break', icon: Coffee, color: 'bg-purple-100 text-purple-800' }
  };

  useEffect(() => {
    // Create notification sound
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEaDSGH0fPTgjMGHm7A7+ОWRwwZZ7zk2ıoH...'); // Simplified beep sound
  }, []);

  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    if (timeLeft === 0 && isActive) {
      handleSessionComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, timeLeft]);

  const handleSessionComplete = () => {
    setIsActive(false);
    setIsPaused(false);

    // Play notification sound
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }

    // Record session
    const newSession: StudySession = {
      id: Date.now().toString(),
      type: currentSession,
      duration: sessionTypes[currentSession].duration,
      completedAt: new Date()
    };

    setStudySessions(prev => [newSession, ...prev]);
    
    if (currentSession === 'focus') {
      setSessionsCompleted(prev => prev + 1);
      setTotalFocusTime(prev => prev + sessionTypes[currentSession].duration);
      
      // Auto-start break after focus session
      if (sessionsCompleted + 1 > 0 && (sessionsCompleted + 1) % 4 === 0) {
        setCurrentSession('long-break');
        setTimeLeft(sessionTypes['long-break'].duration);
      } else {
        setCurrentSession('break');
        setTimeLeft(sessionTypes.break.duration);
      }
    } else {
      // Auto-start focus session after break
      setCurrentSession('focus');
      setTimeLeft(parseInt(customDuration) * 60);
    }

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Study Session Complete!', {
        body: `${sessionTypes[currentSession].label} finished. Time for ${currentSession === 'focus' ? 'a break' : 'focus time'}!`,
        icon: '/favicon.ico'
      });
    }
  };

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    if (currentSession === 'focus') {
      setTimeLeft(parseInt(customDuration) * 60);
    } else {
      setTimeLeft(sessionTypes[currentSession].duration);
    }
  };

  const switchSession = (type: 'focus' | 'break' | 'long-break') => {
    setCurrentSession(type);
    setIsActive(false);
    setIsPaused(false);
    if (type === 'focus') {
      setTimeLeft(parseInt(customDuration) * 60);
    } else {
      setTimeLeft(sessionTypes[type].duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalDuration = currentSession === 'focus' ? parseInt(customDuration) * 60 : sessionTypes[currentSession].duration;
    return ((totalDuration - timeLeft) / totalDuration) * 100;
  };

  const currentSessionType = sessionTypes[currentSession];
  const SessionIcon = currentSessionType.icon;

  return (
    <div className="space-y-6">
      <Card className="shadow-gentle border-0 bg-card">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center space-x-2">
            <Clock className="w-6 h-6 text-primary" />
            <span>Study Timer</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <Badge className={cn("mb-4 text-sm px-4 py-2", currentSessionType.color)}>
              <SessionIcon className="w-4 h-4 mr-2" />
              {currentSessionType.label}
            </Badge>
            
            <div className="text-6xl md:text-7xl font-mono font-bold text-foreground mb-4">
              {formatTime(timeLeft)}
            </div>
            
            <div className="w-full bg-muted rounded-full h-2 mb-6">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>

            <div className="flex justify-center space-x-3 mb-6">
              {!isActive ? (
                <Button onClick={startTimer} className="bg-green-600 hover:bg-green-700 text-white px-6">
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
              ) : (
                <Button onClick={pauseTimer} variant="outline" className="px-6">
                  {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
              )}
              
              <Button onClick={resetTimer} variant="outline" className="px-6">
                <Square className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <Button
                variant={currentSession === 'focus' ? 'default' : 'outline'}
                onClick={() => switchSession('focus')}
                className="text-xs"
              >
                Focus
              </Button>
              <Button
                variant={currentSession === 'break' ? 'default' : 'outline'}
                onClick={() => switchSession('break')}
                className="text-xs"
              >
                Short Break
              </Button>
              <Button
                variant={currentSession === 'long-break' ? 'default' : 'outline'}
                onClick={() => switchSession('long-break')}
                className="text-xs"
              >
                Long Break
              </Button>
            </div>

            {currentSession === 'focus' && (
              <div className="flex items-center justify-center space-x-2">
                <label className="text-sm text-muted-foreground">Focus Duration:</label>
                <Select value={customDuration} onValueChange={setCustomDuration}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15m</SelectItem>
                    <SelectItem value="25">25m</SelectItem>
                    <SelectItem value="30">30m</SelectItem>
                    <SelectItem value="45">45m</SelectItem>
                    <SelectItem value="60">60m</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-gentle border-0 bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Today's Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Focus Sessions</span>
                <Badge variant="secondary">{sessionsCompleted}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Focus Time</span>
                <Badge variant="secondary">{Math.round(totalFocusTime / 60)} min</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Streak</span>
                <Badge variant="secondary">{sessionsCompleted > 0 ? Math.floor(sessionsCompleted / 4) + 1 : 0}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-gentle border-0 bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {studySessions.slice(0, 5).map((session) => (
                <div key={session.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={sessionTypes[session.type].color}>
                      {sessionTypes[session.type].label}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {session.completedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {studySessions.length === 0 && (
                <p className="text-muted-foreground text-center text-sm">No sessions completed yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudyTimer;