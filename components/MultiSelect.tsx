import React, { useState, useEffect } from "react";

export const MultiSelect = ({
  tags,
  onSelectTags,
}: {
  tags: any[];
  onSelectTags: any;
}) => {
  const [selectedTags, setSelectedTags] = useState<any>([]);

  const toggleTag = (tag: any) => {
    setSelectedTags((currentTags: any) => {
      if (currentTags.includes(tag)) {
        return currentTags.filter((t: any) => t !== tag);
      } else {
        return [...currentTags, tag];
      }
    });
  };

  useEffect(() => {
    onSelectTags(selectedTags);
  }, [selectedTags, onSelectTags]);

  return (
    <div
      style={{
        padding: "10px",
        border: "2px solid #000",
        backgroundColor: "#FFF",
        width: "max-content",
      }}
    >
      {tags.map((tag) => (
        <span
          key={tag.id}
          onClick={() => toggleTag(tag)}
          style={{
            display: "inline-block",
            padding: "5px 10px",
            margin: "5px",
            fontWeight: "bold",
            fontSize: "14px",
            cursor: "pointer",
            backgroundColor: selectedTags.includes(tag.id)
              ? "#FF00FF"
              : "#00FFFF", // Bright colors for selected and unselected states
            color: "#000",
            border: "none",
          }}
        >
          {tag.name}
        </span>
      ))}
    </div>
  );
};
