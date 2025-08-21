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

import { User } from 'lucide-react';

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
      

    }
  }, [user]);



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
        </div>
      </div>
    </div>
  );
}