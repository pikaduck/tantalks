import React from 'react';
import { Button } from './ui/button';
import { Play, Youtube, Music } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeroProps {
  onLatestEpisode?: () => void;
}

export function Hero({ onLatestEpisode }: HeroProps) {
  return (
    <section id="home" className="pt-16 min-h-screen flex items-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Welcome to{' '}
                <span className="text-primary">tantalks</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                A thought-provoking podcast where science, technology, and the mysteries of the mind converge.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-lg text-foreground">
                Hosted by <span className="font-semibold text-primary">Sakshi Tantak</span>
              </p>
              <p className="text-muted-foreground max-w-2xl">
                Dive into the worlds of artificial intelligence, data science, neuroscience, and consciousness. 
                Each episode unpacks how these fields shape our understanding of intelligence—both human and machine.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group" onClick={onLatestEpisode}>
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Latest Episode
              </Button>
              
              <div className="flex gap-3">
                <Button variant="outline" size="lg" className="group" asChild>
                  <a href="https://youtube.com/@tantalks" target="_blank" rel="noopener noreferrer">
                    <Youtube className="w-5 h-5 mr-2 group-hover:text-red-500 transition-colors" />
                    YouTube
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="group" asChild>
                  <a href="https://open.spotify.com/show/tantalks" target="_blank" rel="noopener noreferrer">
                    <Music className="w-5 h-5 mr-2 group-hover:text-green-500 transition-colors" />
                    Spotify
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1644560286635-d8e1268af76f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2RjYXN0JTIwbWljcm9waG9uZSUyMHN0dWRpbyUyMHdhcm0lMjBsaWdodGluZ3xlbnwxfHx8fDE3NTY3MDkzMjV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Podcast studio with microphone"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              
              {/* Floating Stats */}
              <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="font-bold text-primary">25+</div>
                  <div className="text-sm text-muted-foreground">Episodes</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="font-bold text-primary">10k+</div>
                  <div className="text-sm text-muted-foreground">Listeners</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="font-bold text-primary">4.8</div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}