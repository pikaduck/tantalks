import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Menu, X, Brain, Headphones } from 'lucide-react';

interface HeaderProps {
  onAdminClick?: () => void;
  isAdmin?: boolean;
  onNavigateHome?: () => void;
  onNavigateToSection?: (section: string) => void;
}

export function Header({ onAdminClick, isAdmin, onNavigateHome, onNavigateToSection }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [keySequence, setKeySequence] = useState('');

  const handleNavigation = (section: string) => {
    setIsMenuOpen(false);
    
    if (section === 'home') {
      if (onNavigateHome) {
        onNavigateHome();
      } else {
        scrollToSection('home');
      }
    } else {
      if (onNavigateToSection) {
        onNavigateToSection(section);
      } else {
        scrollToSection(section);
      }
    }
  };

  const scrollToSection = (id: string) => {
    // Small delay to allow navigation to complete
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Listen for admin key sequence: "admin" + Enter
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && keySequence === 'admin') {
        setKeySequence('');
        if (onAdminClick) {
          onAdminClick();
        }
        return;
      }
      
      if (e.key.match(/[a-zA-Z]/)) {
        setKeySequence(prev => (prev + e.key.toLowerCase()).slice(-5)); // Keep only last 5 chars
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [keySequence, onAdminClick]);

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-xl border-b border-border/50 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => handleNavigation('home')}>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">tantalks</span>
            <span className="text-xs text-muted-foreground -mt-1">with Sakshi Tantak</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <button 
            onClick={() => handleNavigation('home')}
            className="text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium px-4 py-2 rounded-lg relative group"
          >
            Home
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-8 group-hover:-translate-x-1/2"></span>
          </button>
          <button 
            onClick={() => handleNavigation('episodes')}
            className="text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium px-4 py-2 rounded-lg relative group"
          >
            Episodes
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-8 group-hover:-translate-x-1/2"></span>
          </button>
          <button 
            onClick={() => handleNavigation('about')}
            className="text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium px-4 py-2 rounded-lg relative group"
          >
            About
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-8 group-hover:-translate-x-1/2"></span>
          </button>
          <button 
            onClick={() => handleNavigation('blog')}
            className="text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium px-4 py-2 rounded-lg relative group"
          >
            Blog
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-8 group-hover:-translate-x-1/2"></span>
          </button>
          
          <div className="flex items-center ml-6 space-x-3">
            {isAdmin && (
              <Button 
                onClick={onAdminClick}
                variant="outline" 
                size="sm"
                className="border-primary/20 hover:border-primary hover:bg-primary/5"
              >
                Admin
              </Button>
            )}
            {/* Discrete admin access - hidden button */}
            {!isAdmin && (
              <button 
                onClick={onAdminClick}
                className="text-xs text-muted-foreground hover:text-primary transition-colors opacity-20 hover:opacity-100 p-2 rounded-full hover:bg-primary/5"
                title="Admin Access"
              >
                •
              </button>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-lg hover:bg-primary/5 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
        </button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/50 md:hidden shadow-lg">
            <nav className="flex flex-col p-6 space-y-1">
              <button 
                onClick={() => handleNavigation('home')}
                className="text-left text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium py-3 px-4 rounded-lg"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavigation('episodes')}
                className="text-left text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium py-3 px-4 rounded-lg"
              >
                Episodes
              </button>
              <button 
                onClick={() => handleNavigation('about')}
                className="text-left text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium py-3 px-4 rounded-lg"
              >
                About
              </button>
              <button 
                onClick={() => handleNavigation('blog')}
                className="text-left text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium py-3 px-4 rounded-lg"
              >
                Blog
              </button>
              
              <div className="pt-4 border-t border-border/50 mt-4">
                {isAdmin && (
                  <Button 
                    onClick={onAdminClick}
                    variant="outline" 
                    size="sm"
                    className="w-fit border-primary/20 hover:border-primary hover:bg-primary/5"
                  >
                    Admin Panel
                  </Button>
                )}
                {/* Discrete admin access - mobile */}
                {!isAdmin && (
                  <button 
                    onClick={onAdminClick}
                    className="text-left text-xs text-muted-foreground hover:text-primary transition-colors opacity-50 hover:opacity-100 py-2"
                    title="Admin Access"
                  >
                    Admin Access
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}