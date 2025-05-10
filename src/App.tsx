import React, { useState, useEffect } from "react";
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

const App: React.FC = () => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [originalStories, setOriginalStories] = useState<Story[]>([]);
  const [displayStories, setDisplayStories] = useState<Story[]>([]);

  useEffect(() => {
    const savedTheme = sessionStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }

    const savedViewedStatus = sessionStorage.getItem("viewedStories");
    let updatedStories = storiesData;

    if (savedViewedStatus) {
      try {
        const viewedIds = JSON.parse(savedViewedStatus);
        updatedStories = storiesData.map((story) => ({
          ...story,
          viewed: viewedIds.includes(story.id),
        }));
      } catch (e) {
        console.error("Error parsing viewed stories data", e);
      }
    }

    setOriginalStories(updatedStories);

    // Sort unviewed first for display
    const sorted = [...updatedStories].sort(
      (a, b) => Number(a.viewed) - Number(b.viewed)
    );
    setDisplayStories(sorted);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      sessionStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  const handleStoryClick = (indexInDisplay: number) => {
    const clickedStoryId = displayStories[indexInDisplay].id;
    const actualIndex = originalStories.findIndex(
      (s) => s.id === clickedStoryId
    );
    setCurrentStoryIndex(actualIndex);
    setIsViewerOpen(true);
  };

  const closeStoryViewer = () => {
    setIsViewerOpen(false);
  };

  const markStoryAsViewed = (index: number) => {
    setOriginalStories((prevStories) => {
      const updatedStories = [...prevStories];
      updatedStories[index] = {
        ...updatedStories[index],
        viewed: true,
      };

      const viewedIds = updatedStories
        .filter((story) => story.viewed)
        .map((story) => story.id);
      sessionStorage.setItem("viewedStories", JSON.stringify(viewedIds));

      const sorted = [...updatedStories].sort(
        (a, b) => Number(a.viewed) - Number(b.viewed)
      );
      setDisplayStories(sorted);

      return updatedStories;
    });
  };

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

      {isViewerOpen ? (
        <StoryViewer
          stories={originalStories}
          initialIndex={currentStoryIndex}
          onClose={closeStoryViewer}
          markAsViewed={markStoryAsViewed}
        />
      ) : (
        <StoryList stories={displayStories} onStoryClick={handleStoryClick} />
      )}
    </div>
  );
};

export default App;
