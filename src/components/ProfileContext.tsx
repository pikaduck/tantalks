import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProfileData, profileApi } from '../utils/api';

interface ProfileContextType {
  profile: ProfileData | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = async () => {
    setIsLoading(true);
    try {
      const profileData = await profileApi.getProfile();
      console.log('ProfileContext: Loaded profile data:', profileData);
      setProfile(profileData);
    } catch (error) {
      console.error('ProfileContext: Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const value: ProfileContextType = {
    profile,
    isLoading,
    refreshProfile,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}