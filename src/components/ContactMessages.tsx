import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Mail, 
  RefreshCw,
  Clock,
  User,
  MessageSquare
} from 'lucide-react';
import { contactApi } from '../utils/api';
import { ContactMessage } from '../utils/types';
import { encode } from 'punycode';

interface ContactMessagesProps {
  accessToken: string;
}

export function ContactMessages({ accessToken }: ContactMessagesProps) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const data = await contactApi.getMessages(accessToken);

      if (!data) {
        throw new Error(data["error"] || 'Failed to load messages');
      }
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading contact messages:', error);
      showMessage('error', 'Failed to load contact messages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'read':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'replied':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Contact Messages
          {messages.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {messages.length}
            </Badge>
          )}
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={loadMessages}
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

      {/* Messages List */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Messages Yet</h3>
              <p className="text-muted-foreground">
                Contact messages will appear here when visitors reach out.
              </p>
            </CardContent>
          </Card>
        ) : (
          messages.map((msg) => (
            <Card key={msg.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{msg.subject}</CardTitle>
                      <Badge className={getStatusColor(msg.status)}>
                        {msg.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{msg.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{msg.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(msg.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Message</span>
                  </div>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {msg.body}
                  </p>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    // onClick={() => window.open(`mailto:${msg.email}?subject=Re: ${msg.subject}`, '_blank')}
                    onClick={() => {
                      window.location.href = `mailto:${msg.email}?subject=Re:${encodeURIComponent(msg.subject)}`;
                    }}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Reply via Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}