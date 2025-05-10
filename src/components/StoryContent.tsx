import React, { useState, useEffect, useRef } from "react";
import "../styles/StoryContent.css";

interface Story {
  id: number;
  imageUrl: string;
  altText: string;
}

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  initialIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const storyDuration = 5000;
  const transitionDuration = 400;

  const clearProgressInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    setProgress(0);
    clearProgressInterval();

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / (storyDuration / 100);

        if (newProgress >= 100) {
          clearProgressInterval();
          moveToNextStory();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return clearProgressInterval;
  }, [currentIndex]);

  const moveToNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setIsTransitioning(false);
      }, transitionDuration);
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        onClose();
      }, transitionDuration);
    }
  };

  const moveToPrevStory = () => {
    if (currentIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
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
    moveToNextStory();
  };

  // Safety check for currentIndex
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
