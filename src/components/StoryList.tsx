import React from "react";
import '../styles/StoryList.css';

interface Story {
  id: number;
  imageUrl: string;
  altText: string;
}

interface StoryListProps {
  stories: Story[];
  onStoryClick: (index: number) => void;
}

const StoryList: React.FC<StoryListProps> = ({ stories, onStoryClick }) => {
  return (
    <div className="story-list">
      {stories.map((story, index) => (
        <div
          key={story.id}
          className="story-item"
          onClick={() => onStoryClick(index)}
        >
          <img src={story.imageUrl} alt={story.altText} />
        </div>
      ))}
    </div>
  );
};

export default StoryList;
