"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';

// --- Dummy Data ---
const updatesData: { [key: string]: { user: { username: string; avatar: string; }; stories: { id: number; content: string; duration: number; }[] } } = {
  ngc: {
    user: { username: 'ngc', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ngc' },
    stories: [
      { id: 1, content: '/categories/automotive/automotive.jpg', duration: 5000 },
      { id: 2, content: '/categories/clothing/clothing.jpg', duration: 5000 },
      { id: 3, content: '/products/jersey.jpg', duration: 5000 },
    ]
  },
  omytech: {
    user: { username: 'omytech', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=omytech' },
    stories: [
      { id: 1, content: '/products/mattress.jpg', duration: 5000 },
      { id: 2, content: '/products/system.jpg', duration: 5000 },
    ]
  },
  dotsoko: {
    user: { username: 'dotsoko', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dotsoko' },
    stories: [
      { id: 1, content: '/categories/electronics/electronics.jpg', duration: 5000 },
    ]
  }
};

const userQueue = Object.keys(updatesData);
// --- End Dummy Data ---

const UpdatesPage = () => {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [currentUserData, setCurrentUserData] = useState(updatesData[username]);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const animationFrameRef = useRef<number | undefined>(undefined);

  const handleNextStory = useCallback(() => {
    if (!currentUserData) return;
    if (activeStoryIndex < currentUserData.stories.length - 1) {
      setActiveStoryIndex(prev => prev + 1);
    } else {
      const currentUserIndex = userQueue.indexOf(username);
      const nextUserIndex = (currentUserIndex + 1) % userQueue.length;
      router.push(`/updates/${userQueue[nextUserIndex]}`);
    }
  }, [activeStoryIndex, currentUserData, router, username]);

  useEffect(() => {
    setCurrentUserData(updatesData[username]);
    setActiveStoryIndex(0);
  }, [username]);

  useEffect(() => {
    if (!currentUserData) return;

    const story = currentUserData.stories[activeStoryIndex];
    let startTime: number;
    setProgress(0);

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsedTime = time - startTime;
      const newProgress = (elapsedTime / story.duration) * 100;

      if (newProgress >= 100) {
        handleNextStory();
      } else {
        setProgress(newProgress);
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeStoryIndex, currentUserData, handleNextStory]);

  const handlePrevStory = useCallback(() => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(prev => prev - 1);
    } else {
      const currentUserIndex = userQueue.indexOf(username);
      const prevUserIndex = (currentUserIndex - 1 + userQueue.length) % userQueue.length;
      router.push(`/updates/${userQueue[prevUserIndex]}`);
    }
  }, [activeStoryIndex, router, username]);

  if (!currentUserData) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center text-foreground">
        <p>User not found.</p>
        <Link href="/" className="absolute top-4 right-4 text-foreground">
          <X className="w-8 h-8" />
        </Link>
      </div>
    );
  }

  const activeStory = currentUserData.stories[activeStoryIndex];

  return (
    <div className="fixed top-[80px] md:top-[128px] bottom-0 left-0 right-0 bg-black flex items-center justify-center">
      <Link href="/" className="absolute top-5 right-5 z-50 text-white/80 hover:text-white transition-colors">
        <X className="w-8 h-8" />
      </Link>

      <div className="relative w-full max-w-[400px] h-full max-h-[80vh] bg-muted rounded-2xl overflow-hidden shadow-2xl">
        {/* Progress Bars */}
        <div className="absolute top-2 left-2 right-2 z-10 flex items-center gap-1">
          {currentUserData.stories.map((story, index) => (
            <div key={story.id} className="flex-1 h-1 bg-white/30 rounded-full">
              <div
                className="h-1 bg-primary rounded-full"
                style={{ width: `${index < activeStoryIndex ? 100 : (index === activeStoryIndex ? progress : 0)}%` }}
              />
            </div>
          ))}
        </div>

        {/* User Info */}
        <div className="absolute top-5 left-4 z-10 flex items-center gap-2">
          <img src={currentUserData.user.avatar} alt={currentUserData.user.username} className="w-8 h-8 rounded-full border-2 border-white/50" />
          <span className="text-white font-bold text-sm">{currentUserData.user.username}</span>
        </div>

        {/* Story Content */}
        <img src={activeStory.content} alt={`Story ${activeStory.id}`} className="w-full h-full object-cover" />

        {/* Navigation */}
        <div className="absolute inset-0 flex justify-between items-center">
          <button onClick={handlePrevStory} className="h-full w-1/3" />
          <button onClick={handleNextStory} className="h-full w-1/3" />
        </div>
      </div>
      
      {/* Desktop Prev/Next Buttons */}
      <div className="absolute inset-y-0 left-0 hidden md:flex items-center">
        <button onClick={handlePrevStory} className="p-4 text-white/50 hover:text-white">
          <ChevronLeft className="w-10 h-10" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 hidden md:flex items-center">
        <button onClick={handleNextStory} className="p-4 text-white/50 hover:text-white">
          <ChevronRight className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
};

export default UpdatesPage;
