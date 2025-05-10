import React, { useState, useEffect, useRef } from "react";
import "../styles/StoryContent.css";

interface Story {
  id: number;
  imageUrl: string;
  altText: string;
  viewed: boolean;
}

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
  markAsViewed: (index: number) => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  initialIndex,
  onClose,
  markAsViewed,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const storyDuration = 5000;
  const transitionDuration = 400;

  const clearProgressInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    markAsViewed(currentIndex);

    setProgress(0);
    clearProgressInterval();

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / (storyDuration / 100);
        if (newProgress >= 100) {
          clearProgressInterval();
          moveToNextStory(false);
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return clearProgressInterval;
  }, [currentIndex]);

  const findNextUnviewedIndex = (startIndex: number): number | null => {
    for (let i = startIndex + 1; i < stories.length; i++) {
      if (!stories[i].viewed) {
        return i;
      }
    }
    return null;
  };

  const moveToNextStory = (manual = false) => {
    if (manual) {
      if (currentIndex < stories.length - 1) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
          setIsTransitioning(false);
        }, transitionDuration);
      } else {
        setIsTransitioning(true);
        setTimeout(onClose, transitionDuration);
      }
    } else {
      const nextUnviewedIndex = findNextUnviewedIndex(currentIndex);
      if (nextUnviewedIndex !== null) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex(nextUnviewedIndex);
          setIsTransitioning(false);
        }, transitionDuration);
      } else {
        setIsTransitioning(true);
        setTimeout(onClose, transitionDuration);
      }
    }
  };

  const findPrevUnviewedIndex = (startIndex: number): number | null => {
    for (let i = startIndex - 1; i >= 0; i--) {
      if (!stories[i].viewed) {
        return i;
      }
    }
    return startIndex > 0 ? startIndex - 1 : null;
  };

  const moveToPrevStory = () => {
    if (currentIndex > 0) {
      const prevIndex = findPrevUnviewedIndex(currentIndex) ?? currentIndex - 1;

      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(prevIndex);
        setIsTransitioning(false);
      }, transitionDuration);
    } else {
      onClose();
    }
  };

  const handlePrevStory = () => {
    clearProgressInterval();
    moveToPrevStory();
  };

  const handleNextStory = () => {
    clearProgressInterval();
    moveToNextStory(true);
  };
  if (currentIndex < 0 || currentIndex >= stories.length) {
    onClose();
    return null;
  }

  const currentStory = stories[currentIndex];

  return (
    <div className="story-viewer">
      <button className="story-close" onClick={onClose}>
        Close
      </button>

      <div className="story-navigation">
        <div className="nav-zone" onClick={handlePrevStory} />
        <div className="nav-zone" onClick={handleNextStory} />
      </div>

      <img
        src={currentStory.imageUrl}
        alt={currentStory.altText}
        className={isTransitioning ? "transitioning" : ""}
      />

      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StoryViewer;
