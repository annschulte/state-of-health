import React, { useState } from "react";
import { supabase } from "../utils/supabase/client";

interface BoardFormData {
  title: string;
  description: string;
  isPublic: boolean;
}

export const BoardCreate = async () => {
  const [formData, setFormData] = useState<BoardFormData>({
    title: "",
    description: "",
    isPublic: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const isCheckbox: boolean = name === "isPublic";
    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? !prev.isPublic : value,
    }));
  };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const handleCreateBoard = async () => {
    const { title, description, isPublic } = formData;
    const { data, error } = await supabase.from("Boards").insert([
      {
        title,
        description,
        is_public: isPublic,
        created_by_user_id: user?.id,
      },
    ]);

    if (error) {
      console.error("Error creating board:", error);
    } else {
      setFormData({
        title: "",
        description: "",
        isPublic: false,
      });
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleInputChange}
        style={{ display: "block", margin: "10px 0" }}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleInputChange}
        style={{ display: "block", margin: "10px 0" }}
      />
      <label>
        <input
          type="checkbox"
          name="isPublic"
          checked={formData.isPublic}
          onChange={handleInputChange}
          style={{ marginRight: "10px" }}
        />
        Public Board
      </label>
      <button
        onClick={handleCreateBoard}
        style={{ display: "block", marginTop: "10px" }}
      >
        Create Board
      </button>
    </div>
  );
};
