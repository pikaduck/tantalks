import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Lock, User, Mail } from 'lucide-react';
import { auth } from '../utils/api';

interface AdminAuthProps {
  onAuth: (accessToken: string) => void;
  onClose: () => void;
  onSetupClick: () => void;
}

export function AdminAuth({ onAuth, onClose, onSetupClick }: AdminAuthProps) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await auth.login(credentials.email, credentials.password);
      
      if (result.success && result.access_token) {
        localStorage.setItem('tantalks_access_token', result.access_token);
        localStorage.setItem('tantalks_admin', 'authenticated');
        onAuth(result.access_token);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle>Admin Access</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access the admin panel
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  className="pl-10"
                  placeholder="Enter email"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="pl-10"
                  placeholder="Enter password"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </form>
          
          <div className="mt-6 space-y-3">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Don't have an admin account?</p>
              <Button 
                variant="outline" 
                onClick={onSetupClick}
                className="w-full"
                disabled={isLoading}
              >
                Create Admin Account
              </Button>
            </div>
            
            <div className="p-3 bg-muted rounded-lg space-y-2">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> Admin accounts can manage podcast episodes and blog posts.
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Tip:</strong> Access admin login by typing "admin" + Enter, or click the discrete "•" button in the header.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}