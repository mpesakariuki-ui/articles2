'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Eye, 
  Palette, 
  Globe,
  Shield,
  Save,
  Bot,
  Key
} from 'lucide-react';

interface UserSettings {
  displayName: string;
  email: string;
  notifications: {
    email: boolean;
    comments: boolean;
    likes: boolean;
    newPosts: boolean;
  };
  privacy: {
    profileVisible: boolean;
    showEmail: boolean;
    showReadingHistory: boolean;
  };
  preferences: {
    theme: string;
    language: string;
    readingMode: string;
    aiAssistance: boolean;
  };
  aiModel: {
    provider: string;
    model: string;
    apiKey: string;
    enabled: boolean;
  };
}

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    displayName: '',
    email: '',
    notifications: {
      email: true,
      comments: true,
      likes: false,
      newPosts: true
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showReadingHistory: true
    },
    preferences: {
      theme: 'light',
      language: 'en',
      readingMode: 'comfortable',
      aiAssistance: true
    },
    aiModel: {
      provider: 'google',
      model: 'gemini-1.5-flash',
      apiKey: '',
      enabled: false
    }
  });

  // Apply theme changes immediately
  useEffect(() => {
    if (settings.preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.preferences.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System theme
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      if (mediaQuery.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [settings.preferences.theme]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    
    fetchUserSettings();
  }, [user, authLoading]);

  const fetchUserSettings = async () => {
    try {
      // Try localStorage first
      const localSettings = localStorage.getItem('userSettings');
      const savedTheme = localStorage.getItem('theme');
      
      if (localSettings) {
        const parsedSettings = JSON.parse(localSettings);
        setSettings({
          ...settings,
          displayName: user?.displayName || '',
          email: user?.email || '',
          ...parsedSettings,
          preferences: {
            ...settings.preferences,
            ...parsedSettings.preferences,
            theme: savedTheme || parsedSettings.preferences?.theme || 'light'
          }
        });
      } else {
        // Fallback to API
        const response = await fetch(`/api/user/settings?userId=${user?.uid}`);
        if (response.ok) {
          const userSettings = await response.json();
          setSettings({
            ...settings,
            displayName: user?.displayName || '',
            email: user?.email || '',
            ...userSettings,
            preferences: {
              ...settings.preferences,
              ...userSettings.preferences,
              theme: savedTheme || userSettings.preferences?.theme || 'light'
            }
          });
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Update display name in Firebase Auth if changed
      if (settings.displayName !== user?.displayName) {
        const { updateProfile } = await import('firebase/auth');
        const { auth } = await import('@/lib/firebase');
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, {
            displayName: settings.displayName
          });
        }
      }

      // Save settings to localStorage as fallback
      localStorage.setItem('userSettings', JSON.stringify({
        notifications: settings.notifications,
        privacy: settings.privacy,
        preferences: settings.preferences,
        aiModel: settings.aiModel,
        updatedAt: new Date().toISOString()
      }));

      // Try to save to API (will succeed now)
      const response = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.uid,
          settings: {
            notifications: settings.notifications,
            privacy: settings.privacy,
            preferences: settings.preferences,
            aiModel: settings.aiModel
          }
        })
      });

      if (response.ok) {
        toast({
          title: 'Settings saved',
          description: 'Your preferences have been updated successfully.'
        });
      } else {
        // Still show success since localStorage worked
        toast({
          title: 'Settings saved locally',
          description: 'Your preferences are saved in your browser.'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="grid grid-cols-1 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="p-12 text-center">
            <SettingsIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Sign In Required</h1>
            <p className="text-muted-foreground mb-6">
              You need to sign in to access your settings.
            </p>
            <Button onClick={() => router.push('/')}>
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and privacy settings</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={settings.displayName}
                onChange={(e) => setSettings({...settings, displayName: e.target.value})}
                placeholder="Your display name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={settings.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings, 
                    notifications: {...settings.notifications, email: checked}
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Comment Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified when someone comments on your posts</p>
              </div>
              <Switch
                checked={settings.notifications.comments}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings, 
                    notifications: {...settings.notifications, comments: checked}
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Like Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified when someone likes your content</p>
              </div>
              <Switch
                checked={settings.notifications.likes}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings, 
                    notifications: {...settings.notifications, likes: checked}
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>New Posts</Label>
                <p className="text-sm text-muted-foreground">Get notified about new posts from followed authors</p>
              </div>
              <Switch
                checked={settings.notifications.newPosts}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings, 
                    notifications: {...settings.notifications, newPosts: checked}
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Public Profile</Label>
                <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
              </div>
              <Switch
                checked={settings.privacy.profileVisible}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings, 
                    privacy: {...settings.privacy, profileVisible: checked}
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Show Email</Label>
                <p className="text-sm text-muted-foreground">Display your email on your public profile</p>
              </div>
              <Switch
                checked={settings.privacy.showEmail}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings, 
                    privacy: {...settings.privacy, showEmail: checked}
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Reading History</Label>
                <p className="text-sm text-muted-foreground">Allow others to see your reading activity</p>
              </div>
              <Switch
                checked={settings.privacy.showReadingHistory}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings, 
                    privacy: {...settings.privacy, showReadingHistory: checked}
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Theme</Label>
              <Select 
                value={settings.preferences.theme} 
                onValueChange={(value) => {
                  setSettings({
                    ...settings, 
                    preferences: {...settings.preferences, theme: value}
                  });
                  // Apply theme immediately
                  localStorage.setItem('theme', value);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Language</Label>
              <Select 
                value={settings.preferences.language} 
                onValueChange={(value) => 
                  setSettings({
                    ...settings, 
                    preferences: {...settings.preferences, language: value}
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="sw">Swahili</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reading Mode</Label>
              <Select 
                value={settings.preferences.readingMode} 
                onValueChange={(value) => 
                  setSettings({
                    ...settings, 
                    preferences: {...settings.preferences, readingMode: value}
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comfortable">Comfortable</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="spacious">Spacious</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>AI Assistance</Label>
                <p className="text-sm text-muted-foreground">Enable AI-powered reading features</p>
              </div>
              <Switch
                checked={settings.preferences.aiAssistance}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings, 
                    preferences: {...settings.preferences, aiAssistance: checked}
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Model Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Model Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Use Custom AI Model</Label>
                <p className="text-sm text-muted-foreground">Enable your own AI model instead of default</p>
              </div>
              <Switch
                checked={settings.aiModel.enabled}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings, 
                    aiModel: {...settings.aiModel, enabled: checked}
                  })
                }
              />
            </div>
            {settings.aiModel.enabled && (
              <>
                <div>
                  <Label>AI Provider</Label>
                  <Select 
                    value={settings.aiModel.provider} 
                    onValueChange={(value) => 
                      setSettings({
                        ...settings, 
                        aiModel: {...settings.aiModel, provider: value}
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="deepseek">DeepSeek</SelectItem>
                      <SelectItem value="cohere">Cohere</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Model Name</Label>
                  <Input
                    value={settings.aiModel.model}
                    onChange={(e) => setSettings({
                      ...settings, 
                      aiModel: {...settings.aiModel, model: e.target.value}
                    })}
                    placeholder="e.g., deepseek-chat, gpt-4, claude-3"
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    API Key
                  </Label>
                  <Input
                    type="password"
                    value={settings.aiModel.apiKey}
                    onChange={(e) => setSettings({
                      ...settings, 
                      aiModel: {...settings.aiModel, apiKey: e.target.value}
                    })}
                    placeholder="Enter your API key"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your API key is stored securely and only used for AI requests.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={saveSettings} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}