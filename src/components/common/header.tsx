"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, LogOut, Settings, User as UserIcon, Menu, X, Sparkles, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { AuthModal } from '@/components/auth/auth-modal';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { user, logout } = useAuth();
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({ isOpen: false, mode: 'login' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline sm:inline-block">
              Pillar Page
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/categories">
              <Button variant="outline">
                Categories
              </Button>
            </Link>
            <Link href="/community">
              <Button variant="outline">
                Community
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline">
                About
              </Button>
            </Link>
            {user && (
              <Link href="/create-post">
                <Button variant="default">
                  Create Post
                </Button>
              </Link>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {user && <NotificationIcon />}
          <ThemeToggle />
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <UserNav user={user} onLogout={logout} />
            ) : (
              <>
                <Button variant="ghost" onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}>Login</Button>
                <Button onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}>Sign Up</Button>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <AuthModal 
            isOpen={authModal.isOpen} 
            onClose={() => setAuthModal({ isOpen: false, mode: 'login' })} 
            mode={authModal.mode} 
          />
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-4">
            <Link href="/categories" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-start">
                Categories
              </Button>
            </Link>
            <Link href="/community" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-start">
                Community
              </Button>
            </Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-start">
                About
              </Button>
            </Link>
            {user && (
              <Link href="/create-post" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="default" className="w-full justify-start">
                  Create Post
                </Button>
              </Link>
            )}
            {user ? (
              <div className="space-y-2">
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button variant="ghost" className="w-full" onClick={() => { setAuthModal({ isOpen: true, mode: 'login' }); setMobileMenuOpen(false); }}>Login</Button>
                <Button className="w-full" onClick={() => { setAuthModal({ isOpen: true, mode: 'signup' }); setMobileMenuOpen(false); }}>Sign Up</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function NotificationIcon() {
  const { user } = useAuth();
  const [hasNotifications, setHasNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/api/notifications?userId=${user.uid}`);
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
          setHasNotifications(data.some((n: any) => !n.read));
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {hasNotifications && (
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
              <div className="flex items-start justify-between w-full">
                <span className="text-sm flex-1">{notification.message}</span>
                {!notification.read && (
                  <span className="h-2 w-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0"></span>
                )}
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {new Date(notification.createdAt).toLocaleDateString()}
              </span>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>
            <span className="text-sm text-muted-foreground">No notifications</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserNav({ user, onLogout }: { user: any; onLogout: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} data-ai-hint="user avatar" />
            <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/my-posts">
              <BookOpen className="mr-2 h-4 w-4" />
              <span>My Posts</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/analytics">
              <Sparkles className="mr-2 h-4 w-4" />
              <span>Analytics</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
