'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AdminNav } from '@/components/admin/admin-nav';
import { Mail, Search, Calendar } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  joinedAt: string;
  lastActive: string;
  postsRead: number;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    // Fetch real user data from reading progress
    fetch('/api/admin/users/list')
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || []);
      })
      .catch(() => {
        setUsers([]);
      });
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleContactSelected = () => {
    const selectedEmails = users
      .filter(user => selectedUsers.includes(user.id))
      .map(user => user.email)
      .join(',');
    
    window.location.href = `mailto:${selectedEmails}`;
  };

  return (
    <div className="container max-w-7xl py-8">
      <AdminNav />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button 
          onClick={handleContactSelected}
          disabled={selectedUsers.length === 0}
        >
          <Mail className="h-4 w-4 mr-2" />
          Contact Selected ({selectedUsers.length})
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredUsers.map(user => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    className="rounded"
                  />
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>{user.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(user.joinedAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span>{user.postsRead} posts read</span>
                  </div>
                  <div>
                    <span>Last active {new Date(user.lastActive).toLocaleDateString()}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = `mailto:${user.email}`}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}