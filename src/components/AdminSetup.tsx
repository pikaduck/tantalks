import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { auth } from '../utils/api';

interface AdminSetupProps {
  onClose: () => void;
  onSetupComplete: () => void;
}

export function AdminSetup({ onClose, onSetupComplete }: AdminSetupProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const result = await auth.signup(formData.email, formData.password, formData.name);
      
      if (result.success) {
        onSetupComplete();
      } else {
        setError(result.error || 'Failed to create admin account');
      }
    } catch (error) {
      console.error('Setup error:', error);
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
            <UserPlus className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle>Create Admin Account</CardTitle>
          <p className="text-sm text-muted-foreground">
            Set up your admin account to manage tantalks content
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="pl-10"
                  placeholder="Your full name"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="pl-10"
                  placeholder="admin@tantalks.com"
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
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="pl-10"
                  placeholder="Choose a strong password"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="pl-10"
                  placeholder="Confirm your password"
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
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </form>
          
          <div className="mt-6 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> This will create your admin account for managing podcast episodes and blog posts.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}