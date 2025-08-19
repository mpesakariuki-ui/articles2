'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { getUserReadingStats, ReadingStats } from '@/lib/analytics';
import { generateRecommendations } from '@/ai/flows/generate-recommendations';
import { User, Mail, MapPin, Calendar, BookOpen, TrendingUp, Target, Zap } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    avatarUrl: 'https://placehold.co/100x100.png'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [readingStats, setReadingStats] = useState<ReadingStats | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.displayName || 'User',
        email: user.email || '',
        bio: '',
        location: '',
        website: '',
        avatarUrl: user.photoURL || 'https://placehold.co/100x100.png'
      });
      
      // Load reading analytics
      getUserReadingStats(user.uid).then(setReadingStats);
    }
  }, [user]);

  const handleGenerateRecommendations = async () => {
    if (!readingStats || !user) return;
    
    setLoadingRecommendations(true);
    try {
      const result = await generateRecommendations({
        favoriteCategories: readingStats.favoriteCategories,
        readingHistory: [], // Could be enhanced with actual history
        completionRate: readingStats.completionRate
      });
      setRecommendations(result.recommendations);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate recommendations",
        variant: "destructive"
      });
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been saved successfully.",
    });
  };

  return (
    <div className="container max-w-6xl py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card className="h-fit">
          <CardContent className="p-4 text-center">
            <Avatar className="h-12 w-12 mx-auto mb-2">
              <AvatarImage src={profile.avatarUrl} />
              <AvatarFallback>{profile.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
            </Avatar>
            <h3 className="font-medium text-sm mb-1">{profile.name || 'User'}</h3>
            <p className="text-xs text-muted-foreground truncate mb-1">{profile.email}</p>
            <p className="text-xs text-muted-foreground">Joined {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}</p>
          </CardContent>
        </Card>

        <div className="lg:col-span-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <Button 
                variant={isEditing ? "default" : "outline"}
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              >
                {isEditing ? 'Save' : 'Edit'}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({...prev, name: e.target.value}))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({...prev, email: e.target.value}))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({...prev, bio: e.target.value}))}
                  disabled={!isEditing}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile(prev => ({...prev, location: e.target.value}))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profile.website}
                    onChange={(e) => setProfile(prev => ({...prev, website: e.target.value}))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* AI Recommendations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI Recommendations
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleGenerateRecommendations}
                disabled={loadingRecommendations || !readingStats}
              >
                {loadingRecommendations ? 'Generating...' : 'Get Recommendations'}
              </Button>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                <ul className="space-y-2">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <BookOpen className="h-4 w-4 mt-0.5 text-primary" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-muted-foreground text-sm">
                  Click "Get Recommendations" to discover articles tailored to your reading preferences.
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Reading Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Reading Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {readingStats ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{readingStats.totalArticlesRead}</div>
                      <div className="text-sm text-muted-foreground">Articles Read</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{readingStats.readingStreak}</div>
                      <div className="text-sm text-muted-foreground">Day Streak</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{readingStats.completionRate}%</div>
                    <div className="text-sm text-muted-foreground">Completion Rate</div>
                  </div>
                  {readingStats.favoriteCategories.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Favorite Categories</div>
                      <div className="flex flex-wrap gap-1">
                        {readingStats.favoriteCategories.map(category => (
                          <span key={category} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-muted-foreground">Loading analytics...</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}