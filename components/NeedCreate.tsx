"use client";

import { supabase } from "@/utils/supabase/client";
import { useState } from "react";
import { Checkbox } from "./CheckBox";
import { useStore } from "@/store";

export const NeedCreate = () => {
  const addNeed = useStore((state) => state.addNeed);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const handleCreateNeed = async () => {
    if (!title || !description) {
      alert("Please fill out all fields");
      return;
    }
    const { data, error } = await supabase
      .from("needs")
      .insert([
        {
          title,
          description,
          weight: 0,
          user_id: (await supabase.auth.getSession()).data.session?.user.id,
          is_public: !isPrivate,
        },
      ])
      .select("*");

    if (error) {
      console.error("Error creating need:", error);
      return;
    }
    if (data) {
      addNeed(data[0]);
    }
  };

  return (
    <div className="need-creator">
      <div className="flex flex-col space-y-6">
        <input
          className="border-black border-2 p-2.5 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-[#FFA6F6] active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className=" border-black border-2 p-2.5 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:bg-[#FFA6F6] active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <Checkbox label="Private" value={isPrivate} setValue={setIsPrivate} />

      <button className="neo-button" onClick={handleCreateNeed}>
        Create
      </button>
    </div>
  );
};
