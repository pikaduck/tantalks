import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Save, 
  Upload, 
  User, 
  RefreshCw,
  Camera,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { projectId } from '../utils/supabase/info';

interface ProfileData {
  name: string;
  title: string;
  bio: string;
  photo: string;
  email: string;
  linkedinUrl: string;
  twitterUrl: string;
  education: string;
  workStartDate: string; // YYYY-MM format
  skills: string[]; // comma separated in form
  achievements: string;
}

interface ProfileManagerProps {
  accessToken: string;
  onDataChange: () => void;
}

export function ProfileManager({ accessToken, onDataChange }: ProfileManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Sakshi Tantak',
    title: 'Data Scientist & AI Researcher',
    bio: 'Passionate data scientist exploring the intersection of artificial intelligence, neuroscience, and consciousness. I love diving deep into complex problems and sharing insights through tantalks.',
    photo: 'https://images.unsplash.com/photo-1712174766230-cb7304feaafe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGRhdGElMjBzY2llbnRpc3QlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTY3MTIyMTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    email: 'sakshi99tantak@gmail.com',
    linkedinUrl: '',
    twitterUrl: '',
    education: 'Masters in Computer Science, Bachelors in Data Science',
    workStartDate: '2021-01',
    skills: ['Data Science', 'Machine Learning', 'AI Research', 'Python', 'Neural Networks', 'Deep Learning'],
    achievements: 'Published researcher in AI and consciousness, Podcast host, Data science consultant for multiple startups'
  });

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const calculateExperience = (startDate: string): string => {
    if (!startDate) return '0.0';
    
    const [year, month] = startDate.split('-').map(Number);
    const start = new Date(year, month - 1); // month is 0-indexed
    const now = new Date();
    
    const totalMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    
    return `${years}.${months}`;
  };

  const loadProfileData = async () => {
    setIsLoading(true);
    try {
      const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-cd010421`;
      const response = await fetch(`${API_BASE}/profile`);
      const data = await response.json();
      
      if (data.profile) {
        setProfileData(data.profile);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      showMessage('error', 'Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfileData = async () => {
    if (!profileData.name.trim()) {
      showMessage('error', 'Name is required');
      return;
    }

    setIsLoading(true);
    try {
      const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-cd010421`;
      const response = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(profileData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save');
      }
      
      showMessage('success', 'Profile updated successfully');
      onDataChange();
    } catch (error) {
      console.error('Error saving profile data:', error);
      showMessage('error', 'Failed to save profile data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile Management
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={loadProfileData}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Photo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Profile Photo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-muted">
              <ImageWithFallback
                src={profileData.photo}
                alt={profileData.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <Label>Photo URL</Label>
              <Input
                value={profileData.photo}
                onChange={(e) => setProfileData(prev => ({ ...prev, photo: e.target.value }))}
                placeholder="https://example.com/photo.jpg"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter a direct URL to your profile photo
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Sakshi Tantak"
              />
            </div>
            <div>
              <Label>Professional Title</Label>
              <Input
                value={profileData.title}
                onChange={(e) => setProfileData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Data Scientist & AI Researcher"
              />
            </div>
          </div>

          <div>
            <Label>Bio</Label>
            <Textarea
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Write a brief bio about yourself..."
              rows={4}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="sakshi99tantak@gmail.com"
              />
            </div>
            <div>
              <Label>Education</Label>
              <Input
                value={profileData.education}
                onChange={(e) => setProfileData(prev => ({ ...prev, education: e.target.value }))}
                placeholder="Masters in Computer Science, etc."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Professional Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Work Start Date</Label>
              <Input
                type="month"
                value={profileData.workStartDate}
                onChange={(e) => setProfileData(prev => ({ ...prev, workStartDate: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Current experience: <strong>{calculateExperience(profileData.workStartDate)} years</strong>
              </p>
            </div>
            <div>
              <Label>Skills (comma separated)</Label>
              <Input
                value={profileData.skills.join(', ')}
                onChange={(e) => setProfileData(prev => ({ 
                  ...prev, 
                  skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                }))}
                placeholder="Data Science, Machine Learning, AI"
              />
            </div>
          </div>

          <div>
            <Label>Key Achievements</Label>
            <Textarea
              value={profileData.achievements}
              onChange={(e) => setProfileData(prev => ({ ...prev, achievements: e.target.value }))}
              placeholder="List your key professional achievements..."
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>LinkedIn URL (optional)</Label>
              <Input
                value={profileData.linkedinUrl}
                onChange={(e) => setProfileData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <Label>Twitter URL (optional)</Label>
              <Input
                value={profileData.twitterUrl}
                onChange={(e) => setProfileData(prev => ({ ...prev, twitterUrl: e.target.value }))}
                placeholder="https://twitter.com/username"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Skills Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profileData.skills.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveProfileData} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </div>
  );
}