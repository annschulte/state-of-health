"use client";

import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase/client";
import { usePublicNeedsStore } from "@/store";
import Image from "next/image";
import A from "./letters/A";
import N from "./letters/N";
import S from "./letters/S";
import { Nameplate } from "./Nameplate";

export const PublicNeedsList = () => {
  const { publicNeeds, setPublicNeeds } = usePublicNeedsStore();

  const fetchNeeds = async () => {
    const { data, error } = await supabase
      .from("needs")
      .select("*")
      .eq("is_public", true);

    if (error) {
      console.error("Error fetching public needs:", error);
      return;
    }

    setPublicNeeds(data || []);
  };

  useEffect(() => {
    fetchNeeds();
  }, []);

  return (
    <div className="needs-list">
      {publicNeeds.map((publicNeed: Need) => (
        <NeedBox publicNeed={publicNeed} />
      ))}
    </div>
  );
};

interface Profile {
  avatar_url: string;
  first_name: string;
  last_name: string;
  id: string;
}

const NeedBox = ({ publicNeed }: { publicNeed: any }) => {
  const [profile, setProfile] = useState<Profile>();
  const fetchProfiles = async () => {
    const { data: profile } = await supabase
      .from("profiles")
      .select()
      .eq("id", publicNeed?.user_id)
      .single();

    setProfile(profile);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <div className="need-box" key={publicNeed?.need_id}>
      <div className="h-full flex flex-col justify-between">
        <div style={needTitleStyle}>{publicNeed?.title?.toUpperCase()}</div>
        <div style={needContent}>{publicNeed?.description}</div>

        <Nameplate userId={publicNeed?.user_id} />
      </div>
    </div>
  );
};
const needTitleStyle = {
  fontWeight: "string",
  color: "black",
  marginBottom: "8px",
  fontSize: "1.2rem",
};

const needContent = {
  color: "black",
  fontSize: "0.85em",
  marginBottom: "12px",
};
