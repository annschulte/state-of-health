"use client";

import { letterComponents } from "@/components/letters/LetterIcons";
import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export function getInitialIcons(
  firstName: string,
  lastName: string
): React.ReactNode[] {
  const firstInitial = firstName[0];
  const lastInitial = lastName[0];

  const FirstIcon = letterComponents[firstInitial] || null;
  const LastIcon = letterComponents[lastInitial] || null;

  return [
    FirstIcon && <FirstIcon key="first" />,
    LastIcon && <LastIcon key="last" />,
  ];
}

export const Nameplate = ({ userId }: { userId: string }) => {
  const [profile, setProfile] = useState<any>();
  const fetchProfiles = async () => {
    const { data: profile } = await supabase
      .from("profiles")
      .select()
      .eq("id", userId)
      .single();

    setProfile(profile);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const [icons, setIcons] = useState<React.ReactNode[]>([]);
  useEffect(() => {
    const icons = getInitialIcons(
      profile?.first_name ?? "",
      profile?.last_name ?? ""
    );
    setIcons(icons);
  }, [profile]);

  return (
    <div className="flex items-center gap-4">
      {icons[0]} {icons[1]}
    </div>
  );
};
