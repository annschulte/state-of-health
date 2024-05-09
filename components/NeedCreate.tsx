"use client";

import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Checkbox } from "./CheckBox";
import { useStore } from "@/store";
import { MultiSelect } from "./MultiSelect";
import { useUser } from "@/hooks/useUser";

export const NeedCreate = () => {
  const addNeed = useStore((state) => state.addNeed);
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<any>([]);
  const [allTags, setAllTags] = useState<any>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [boards, setBoards] = useState<any>([]);

  useEffect(() => {
    const fetchBoards = async () => {
      const { data, error } = await supabase
        .from("boards")
        .select("*")
        .eq("created_by_user_id", user?.id);
      if (error) {
        console.error("Error fetching boards:", error);
      } else {
        setBoards(data);
      }
    };

    fetchBoards();
  }, []);

  // useEffect(() => {
  //   const fetchTags = async () => {
  //     const { data, error } = await supabase.from("Tags").select("*");
  //     if (error) {
  //       console.error("Error fetching tags:", error);
  //     } else {
  //       setAllTags(data);
  //     }
  //   };

  //   fetchTags();
  // }, []);

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
          user_id: user?.id,
          is_public: !isPrivate,
        },
      ])
      .select("*");

    if (error) {
      console.error("Error creating need:", error);
      return;
    }
    // if (data) {
    //   const needId = data[0].need_id;
    //   const needsTagsData = selectedTags.map((tagId: number) => ({
    //     need_id: needId,
    //     tag_id: tagId,
    //   }));
    //   const { error: needsTagsError } = await supabase
    //     .from("NeedsTags")
    //     .insert(needsTagsData);

    //   if (needsTagsError) {
    //     console.error("Error associating tags with need:", needsTagsError);
    //     return;
    //   }
    //   addNeed({ ...data[0], tags: selectedTags });
    // }
  };

  // const handleSelectTags = (selectedTags: any) => {
  //   setSelectedTags(selectedTags);
  // };

  const handleSelectBoards = (selectedBoards: any) => {
    setSelectedBoardId(selectedBoards);
  };

  // const tags = ["Work", "Personal"];

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
        {/* <MultiSelect tags={tags} onSelectTags={handleSelectTags} /> */}
        <MultiSelect tags={boards} onSelectTags={handleSelectBoards} />
      </div>

      <Checkbox label="Private" value={isPrivate} setValue={setIsPrivate} />
      <button className="neo-button" onClick={handleCreateNeed}>
        Create
      </button>
    </div>
  );
};
