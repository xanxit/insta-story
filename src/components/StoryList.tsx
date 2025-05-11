import React, { useRef } from "react";
import "../styles/StoryList.css";

interface Story {
  id: number;
  imageUrl: string;
  altText: string;
  viewed: boolean;
}

interface StoryListProps {
  stories: Story[];
  onStoryClick: (index: number) => void;
  onUpload: (file: File) => void;
}

const StoryList: React.FC<StoryListProps> = ({
  stories,
  onStoryClick,
  onUpload,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="story-list">
      <div className="story-item upload" onClick={handleUploadClick}>
        <span className="plus-icon">+</span>
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
      {stories.map((story, index) => (
        <div
          key={story.id}
          className={`story-item ${story.viewed ? "viewed" : "not-viewed"}`}
          onClick={() => onStoryClick(index)}
        >
          <img src={story.imageUrl} alt={story.altText} />
        </div>
      ))}
    </div>
  );
};

export default StoryList;
