import React, { useState, useEffect } from "react";
import StoryList from "./components/StoryList";
import StoryViewer from "./components/StoryContent";
import "./styles/App.css";

const App: React.FC = () => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const stories = [
    { id: 1, imageUrl: "/images/story1.jpg", altText: "Story 1" },
    { id: 2, imageUrl: "/images/story2.jpg", altText: "Story 2" },
    { id: 3, imageUrl: "/images/story3.jpg", altText: "Story 3" },
    { id: 4, imageUrl: "/images/story4.jpg", altText: "Story 4" },
    { id: 5, imageUrl: "/images/story1.jpg", altText: "Story 1" },
    { id: 6, imageUrl: "/images/story2.jpg", altText: "Story 2" },
    { id: 7, imageUrl: "/images/story3.jpg", altText: "Story 3" },
    { id: 8, imageUrl: "/images/story4.jpg", altText: "Story 4" },
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  const handleStoryClick = (index: number) => {
    setCurrentStoryIndex(index);
    setIsViewerOpen(true);
  };

  const closeStoryViewer = () => {
    setIsViewerOpen(false);
  };

  return (
    <div className={`app ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <div className="top-bar">
          <img
            src="https://www.stage.in/_next/image?url=https%3A%2F%2Fmedia.stage.in%2Fstatic%2Fstage_logo_horizontal.webp&w=256&q=75"
            className="stage-logo"
          />
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {isDarkMode ? "🌞" : "🌙"}
        </button>
      </div>
      {isViewerOpen ? (
        <StoryViewer
          stories={stories}
          initialIndex={currentStoryIndex}
          onClose={closeStoryViewer}
        />
      ) : (
        <StoryList stories={stories} onStoryClick={handleStoryClick} />
      )}
    </div>
  );
};

export default App;
