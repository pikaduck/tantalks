import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Play, Clock, Calendar, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Episode } from '../utils/types';

// Mock data - in real app this would come from backend
const mockEpisodes: Episode[] = [
  {
    id: '1',
    title: 'The Future of Artificial General Intelligence',
    description: 'Exploring the path towards AGI and what it means for humanity. We discuss the latest breakthroughs, challenges, and philosophical implications.',
    duration: '45 min',
    publishDate: '2024-12-15',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    youtubeUrl: '#',
    spotifyUrl: '#',
    tags: ['AI', 'AGI', 'Technology']
  },
  {
    id: '2',
    title: 'Consciousness and the Brain: A Data Science Perspective',
    description: 'How can we use data science to understand consciousness? We dive into neural networks, brain imaging, and the hard problem of consciousness.',
    duration: '52 min',
    publishDate: '2024-12-08',
    thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    youtubeUrl: '#',
    spotifyUrl: '#',
    tags: ['Neuroscience', 'Consciousness', 'Data Science']
  },
  {
    id: '3',
    title: 'Building AI Startups: From 0 to 1',
    description: 'The journey of building AI-first companies. What does it take to go from idea to product in the age of artificial intelligence?',
    duration: '38 min',
    publishDate: '2024-12-01',
    thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400',
    youtubeUrl: '#',
    spotifyUrl: '#',
    tags: ['Startups', 'AI', 'Entrepreneurship']
  }
];

interface EpisodesProps {
  episodes?: Episode[];
  onViewAll?: () => void;
}

export function Episodes({ episodes = mockEpisodes, onViewAll }: EpisodesProps) {
  return (
    <section id="episodes" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Latest Episodes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dive deep into conversations about AI, consciousness, and the future of human intelligence.
          </p>
        </div>

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
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={episode.youtubeUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        YouTube
                      </a>
                    </Button>
                  )}
                  {episode.spotifyUrl && (
                    <Button variant="outline" size="sm" className="flex-1" asChild>
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

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" onClick={onViewAll}>
            View All Episodes
          </Button>
        </div>
      </div>
    </section>
  );
}