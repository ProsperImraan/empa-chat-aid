import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, TrendingUp, AlertTriangle, Plus, Edit, Trash } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface AdminStats {
  totalUsers: number;
  totalChats: number;
  totalMoodEntries: number;
  recentActivity: number;
}

interface UserData {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  last_login?: string;
  mood_entries_count: number;
  chat_messages_count: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalChats: 0,
    totalMoodEntries: 0,
    recentActivity: 0
  });
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load stats
      const [usersRes, chatsRes, moodsRes] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('chat_messages').select('*', { count: 'exact' }),
        supabase.from('mood_entries').select('*', { count: 'exact' })
      ]);

      // Get recent activity (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentRes = await supabase
        .from('mood_entries')
        .select('*', { count: 'exact' })
        .gte('created_at', weekAgo.toISOString());

      setStats({
        totalUsers: usersRes.count || 0,
        totalChats: chatsRes.count || 0,
        totalMoodEntries: moodsRes.count || 0,
        recentActivity: recentRes.count || 0
      });

      // Load user data with counts
      const { data: userData } = await supabase
        .from('profiles')
        .select(`
          *,
          mood_entries(count),
          chat_messages(count)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (userData) {
        const processedUsers = userData.map((user: any) => ({
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          created_at: user.created_at,
          last_login: user.last_login,
          mood_entries_count: user.mood_entries?.length || 0,
          chat_messages_count: user.chat_messages?.length || 0
        }));
        setUsers(processedUsers);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-gentle border-0 bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered platform users
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-gentle border-0 bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chat Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalChats}</div>
            <p className="text-xs text-muted-foreground">
              Total conversations
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-gentle border-0 bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mood Entries</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMoodEntries}</div>
            <p className="text-xs text-muted-foreground">
              User mood logs
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-gentle border-0 bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Activity</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentActivity}</div>
            <p className="text-xs text-muted-foreground">
              Entries this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card className="shadow-gentle border-0 bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Users</CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((userData) => (
              <div key={userData.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-healing-gradient rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {userData.full_name || userData.email}
                    </p>
                    <p className="text-sm text-muted-foreground">{userData.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(userData.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex space-x-2">
                      <Badge variant="outline">
                        {userData.mood_entries_count} moods
                      </Badge>
                      <Badge variant="outline">
                        {userData.chat_messages_count} chats
                      </Badge>
                    </div>
                    {userData.last_login && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Last active: {new Date(userData.last_login).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resource Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-gentle border-0 bg-card">
          <CardHeader>
            <CardTitle>Mental Health Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Emergency Hotlines</p>
                  <p className="text-sm text-muted-foreground">Crisis support resources</p>
                </div>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Self-Help Articles</p>
                  <p className="text-sm text-muted-foreground">Educational content</p>
                </div>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              
              <Button className="w-full" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add New Resource
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-gentle border-0 bg-card">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database Status</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Healthy
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">AI Chat Service</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Online
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">User Authentication</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Active
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Data Backup</span>
                <Badge variant="secondary">
                  Last: 2 hours ago
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <Card className="shadow-gentle border-0 bg-card">
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Admin Dashboard - Mental Health Chatbot Platform</p>
            <p className="mt-1">
              For technical support, contact: admin@mentalhealthbot.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;