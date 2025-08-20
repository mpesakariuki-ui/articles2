'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Users, Plus, Heart, Reply, Sparkles } from 'lucide-react';

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  createdAt: string;
  replies: number;
  likes: number;
  category: string;
}

export default function CommunityHub() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [newDiscussion, setNewDiscussion] = useState({ 
    title: '', 
    content: '', 
    category: 'General',
    imageUrl: '',
    code: '',
    references: '',
    videoUrl: ''
  });
  const [showNewForm, setShowNewForm] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    setDiscussions([
      {
        id: '1',
        title: 'What are your thoughts on the latest Renaissance article?',
        content: 'I found the connection between art and science fascinating. Would love to hear other perspectives.',
        author: { name: 'Sarah Chen', avatarUrl: 'https://placehold.co/100x100.png' },
        createdAt: '2 hours ago',
        replies: 5,
        likes: 12,
        category: 'Art History'
      },
      {
        id: '2',
        title: 'Book recommendations for poetry lovers?',
        content: 'Looking for modern poetry collections that explore themes of time and existence.',
        author: { name: 'Mike Johnson', avatarUrl: 'https://placehold.co/100x100.png' },
        createdAt: '5 hours ago',
        replies: 8,
        likes: 7,
        category: 'Poetry'
      }
    ]);
  }, []);

  const handleCreateDiscussion = () => {
    if (!user) {
      toast({ title: "Please sign in to create discussions", variant: "destructive" });
      return;
    }

    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    const discussion: Discussion = {
      id: Date.now().toString(),
      title: newDiscussion.title,
      content: newDiscussion.content,
      author: {
        name: user.displayName || 'User',
        avatarUrl: user.photoURL || 'https://placehold.co/100x100.png'
      },
      createdAt: 'Just now',
      replies: 0,
      likes: 0,
      category: newDiscussion.category
    };

    setDiscussions([discussion, ...discussions]);
    setNewDiscussion({ title: '', content: '', category: 'General', imageUrl: '', code: '', references: '', videoUrl: '' });
    setShowNewForm(false);
    toast({ title: "Discussion created successfully!" });
  };

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Community Hub</h1>
          <p className="text-muted-foreground">Connect with fellow readers and discuss articles</p>
        </div>
        <Button onClick={() => setShowNewForm(!showNewForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Discussion
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">1,234</div>
            <div className="text-sm text-muted-foreground">Active Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">567</div>
            <div className="text-sm text-muted-foreground">Discussions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Reply className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">2,890</div>
            <div className="text-sm text-muted-foreground">Total Replies</div>
          </CardContent>
        </Card>
      </div>

      {showNewForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Start a New Discussion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Discussion title..."
              value={newDiscussion.title}
              onChange={(e) => setNewDiscussion({...newDiscussion, title: e.target.value})}
            />
            <select
              className="w-full p-2 border rounded-md"
              value={newDiscussion.category}
              onChange={(e) => setNewDiscussion({...newDiscussion, category: e.target.value})}
            >
              <option value="General">General</option>
              <option value="Art History">Art History</option>
              <option value="Poetry">Poetry</option>
              <option value="Science">Science</option>
            </select>
            <Textarea
              placeholder="What would you like to discuss?"
              value={newDiscussion.content}
              onChange={(e) => setNewDiscussion({...newDiscussion, content: e.target.value})}
              className="min-h-[100px]"
            />
            <Input
              placeholder="Image URL (optional)"
              value={newDiscussion.imageUrl}
              onChange={(e) => setNewDiscussion({...newDiscussion, imageUrl: e.target.value})}
            />
            <Textarea
              placeholder="Code snippet (optional)"
              value={newDiscussion.code}
              onChange={(e) => setNewDiscussion({...newDiscussion, code: e.target.value})}
              className="min-h-[80px] font-mono text-sm"
            />
            <Input
              placeholder="Video URL (optional)"
              value={newDiscussion.videoUrl}
              onChange={(e) => setNewDiscussion({...newDiscussion, videoUrl: e.target.value})}
            />
            <Textarea
              placeholder="References (optional)"
              value={newDiscussion.references}
              onChange={(e) => setNewDiscussion({...newDiscussion, references: e.target.value})}
              className="min-h-[60px]"
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateDiscussion}>Create Discussion</Button>
              <Button variant="outline" onClick={() => setShowNewForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {discussions.map(discussion => (
          <Card key={discussion.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={discussion.author.avatarUrl} />
                    <AvatarFallback>{discussion.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{discussion.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{discussion.author.name}</span>
                      <span>•</span>
                      <span>{discussion.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Summary
                  </Button>
                  <Badge variant="secondary">{discussion.category}</Badge>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-4">{discussion.content}</p>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{discussion.replies} replies</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{discussion.likes} likes</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.location.href = `/community/discussion/${discussion.id}`}
                >
                  Join Discussion
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}