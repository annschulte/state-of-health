"use client";

import React, { useEffect } from "react";
import { supabase } from "../utils/supabase/client";
import { NeedBox } from "./NeedBox";
import { NeedCreate } from "./NeedCreate";
import { useStore } from "@/store";

const NeedsList = ({ user }: { user: any }) => {
  const { needs, setNeeds } = useStore();

  const fetchNeeds = async () => {
    const { data, error } = await supabase
      .from("needs")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching needs:", error);
      return;
    }

    setNeeds(data || []);
  };

  useEffect(() => {
    fetchNeeds();
  }, []);

  if (!needs || !user) {
    return "loading...";
  }

  return (
    <div className="needs-list">
      {needs.map((need, index) => (
        <NeedBox key={need?.need_id ?? index} need={need} />
      ))}
      <NeedCreate />
    </div>
  );
};

export default NeedsList;
