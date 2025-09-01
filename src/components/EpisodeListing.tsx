import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Play, Clock, Calendar, ExternalLink, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Episode {
  id: string;
  title: string;
  description: string;
  duration: string;
  publishDate: string;
  thumbnail: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  tags: string[];
}

interface EpisodeListingProps {
  episodes: Episode[];
  onBack: () => void;
}

export function EpisodeListing({ episodes, onBack }: EpisodeListingProps) {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              All Episodes
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore all conversations about AI, consciousness, and the future of human intelligence.
            </p>
          </div>
        </div>

        {/* Episodes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {episodes.map((episode) => (
            <Card key={episode.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                <div className="aspect-video rounded-t-lg overflow-hidden">
                  <ImageWithFallback
                    src={episode.thumbnail}
                    alt={episode.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button size="lg" className="rounded-full w-16 h-16 p-0">
                      <Play className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(episode.publishDate).toLocaleDateString()}
                  <Clock className="w-4 h-4 ml-2" />
                  {episode.duration}
                </div>
                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                  {episode.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {episode.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {episode.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  {episode.youtubeUrl && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      asChild
                    >
                      <a href={episode.youtubeUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        YouTube
                      </a>
                    </Button>
                  )}
                  {episode.spotifyUrl && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      asChild
                    >
                      <a href={episode.spotifyUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Spotify
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {episodes.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Play className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Episodes Yet</h3>
            <p className="text-muted-foreground">
              Episodes will appear here once they are published.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}