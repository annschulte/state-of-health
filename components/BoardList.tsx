import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase/client";
import { useUser } from "@/hooks/useUser";

interface Board {
  board_id: string;
  title: string;
  description: string;
  is_public: boolean;
}

export const BoardList: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchBoards = async () => {
      const { data, error } = await supabase
        .from("Boards")
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

  // Add UI logic to display the list of boards
  return (
    <div>
      {boards.map((board) => (
        <div key={board.board_id}>{board.title}</div>
      ))}
    </div>
  );
};
