import React, { useState, useMemo, useCallback } from "react";
import StoryList from "./components/StoryList";
import StoryViewer from "./components/StoryContent";
import storiesData from "./data/stories.json";
import "./styles/App.css";

interface Story {
  id: number;
  imageUrl: string;
  altText: string;
  viewed: boolean;
}

const VIEWED_KEY = "viewedStories";
const THEME_KEY = "theme";

const App: React.FC = () => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [punScreenEnabled, setPunScreenEnabled] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return sessionStorage.getItem(THEME_KEY) === "dark";
  });
  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      sessionStorage.setItem(THEME_KEY, next ? "dark" : "light");
      return next;
    });
  }, []);

  const [originalStories, setOriginalStories] = useState<Story[]>(() => {
    const saved = sessionStorage.getItem(VIEWED_KEY);
    let viewedIds: number[] = [];
    try {
      viewedIds = saved ? JSON.parse(saved) : [];
    } catch {
      console.error("Failed to parse viewed stories from sessionStorage");
    }
    return storiesData.map((s) => ({
      ...s,
      viewed: viewedIds.includes(s.id),
    }));
  });

  // derive the sorted list (unviewed first)
  const displayStories = useMemo(
    () =>
      [...originalStories].sort((a, b) => Number(a.viewed) - Number(b.viewed)),
    [originalStories]
  );

  const handleStoryUpload = useCallback((file: File) => {
    setPunScreenEnabled(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalStories((prev) => [
        {
          id: Date.now(),
          imageUrl: reader.result as string,
          altText: "Uploaded Story",
          viewed: false,
        },
        ...prev,
      ]);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleStoryClick = useCallback(
    (displayIndex: number) => {
      const storyId = displayStories[displayIndex].id;
      const actualIndex = originalStories.findIndex((s) => s.id === storyId);
      if (actualIndex !== -1) {
        setCurrentStoryIndex(actualIndex);
        setIsViewerOpen(true);
      }
    },
    [displayStories, originalStories]
  );

  const closeStoryViewer = useCallback(() => {
    setIsViewerOpen(false);
  }, []);

  const markStoryAsViewed = useCallback((index: number) => {
    setOriginalStories((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], viewed: true };
      const viewedIds = next.filter((s) => s.viewed).map((s) => s.id);
      sessionStorage.setItem(VIEWED_KEY, JSON.stringify(viewedIds));
      return next;
    });
  }, []);

  return (
    <div className={`app ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <div className="top-bar">
        <img
          src="https://www.stage.in/_next/image?url=https%3A%2F%2Fmedia.stage.in%2Fstatic%2Fstage_logo_horizontal.webp&w=256&q=75"
          className="stage-logo"
          alt="Stage Logo"
        />
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {isDarkMode ? "🌞" : "🌙"}
        </button>
      </div>

      {!punScreenEnabled ? (
        isViewerOpen ? (
          <StoryViewer
            stories={originalStories}
            initialIndex={currentStoryIndex}
            onClose={closeStoryViewer}
            markAsViewed={markStoryAsViewed}
          />
        ) : (
          <StoryList
            stories={displayStories}
            onStoryClick={handleStoryClick}
            onUpload={handleStoryUpload}
          />
        )
      ) : (
        <div className="pun-screen">
          <h2>Well, the app "crashed"! 📚💥</h2>
          <p>
            Just kidding—it was a prank! Click “Continue” to see your upload.
          </p>
          <p className="pun-ps">
            PS: Your uploaded story will <strong>not</strong> be visible on
            refresh, as I don’t want to overload your browser.
          </p>
          <button
            className="pun-continue-btn"
            onClick={() => setPunScreenEnabled(false)}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
