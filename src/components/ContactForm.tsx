import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Mail, Send, X } from 'lucide-react';
import { contactApi } from '../utils/api';

interface ContactFormProps {
  children?: React.ReactNode;
}

export function ContactForm({ children }: ContactFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    body: ''
  });

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.body.trim()) {
      showMessage('error', 'All fields are required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await contactApi.sendMessage(formData);
      if (!response["success"]) {
        throw new Error(response["error"] || 'Failed to send message');
      }
      
      showMessage('success', 'Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        body: ''
      });
      
      // Close dialog after successful submission
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Error sending contact form:', error);
      showMessage('error', 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button 
            variant="ghost" 
            size="sm" 
            className="justify-start p-0 h-auto text-muted hover:text-background"
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Get in Touch
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Message */}
          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="What's this about?"
              required
            />
          </div>

          <div>
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
              placeholder="Tell me more..."
              rows={4}
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              <Send className="w-4 h-4 mr-2" />
              {isLoading ? 'Sending...' : 'Send Message'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}