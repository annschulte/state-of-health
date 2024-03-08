import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase/client";
import { useStore } from "@/store";
import UpVote from "./UpVote";
import MehVote from "./MehVote";
import DownVote from "./DownVote";

export const NeedBox = ({ need }: NeedBoxProps) => {
  const { setVoteStatusForNeed, voteStatuses } = useStore();
  const [localCheckIn, setLocalCheckIn] = useState<any>(undefined);

  useEffect(() => {
    const fetchVoteStatus = async () => {
      const { data: user } = await supabase.auth.getUser();

      let { data: existingCheckIn, error: existingVotesError } = await supabase
        .from("checkins")
        .select("*")
        .eq("need_id", need?.need_id)
        .eq("user_id", user?.user?.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (existingVotesError) {
        console.error("Error fetching vote status:", existingVotesError);
        return;
      }

      if (existingCheckIn && existingCheckIn?.length > 0) {
        setVoteStatusForNeed(need?.need_id, existingCheckIn[0].status);
        setLocalCheckIn(existingCheckIn[0]);
      }
    };

    fetchVoteStatus();
  }, [need?.need_id, setVoteStatusForNeed]);

  const handleVote = async (newVote: "green" | "yellow" | "red") => {
    setVoteStatusForNeed(need?.need_id, newVote);
    setLocalCheckIn({ created_at: new Date(), status: newVote });

    const { error } = await supabase.from("checkins").insert([
      {
        need_id: need?.need_id,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        status: newVote,
        date: new Date().toISOString().slice(0, 10),
      },
    ]);

    if (error) {
      console.error("Error voting:", error);
      return;
    }
  };

  const getCardClassName = () => {
    const status = voteStatuses[need?.need_id] ?? localCheckIn?.status;
    return `need-box ${status ?? ""}`;
  };

  return (
    <div className={getCardClassName()}>
      <div className="h-full flex flex-col justify-between">
        <div className="need-title">{need?.title?.toUpperCase()}</div>

        <div className="need-date">{need?.description}</div>
        <div className="need-date">
          {localCheckIn?.created_at
            ? new Date(localCheckIn?.created_at).toLocaleTimeString() +
              " " +
              new Date(localCheckIn?.created_at).toLocaleDateString()
            : " "}
        </div>

        <div className="vote-buttons">
          <button
            className={voteStatuses[need?.need_id] === "green" ? "voted" : ""}
            onClick={() => handleVote("green")}
          >
            <UpVote
              fill={
                voteStatuses[need?.need_id] === "green" ? "#00FF75" : "white"
              }
            />
          </button>
          <button
            className={voteStatuses[need?.need_id] === "yellow" ? "voted" : ""}
            onClick={() => handleVote("yellow")}
          >
            <MehVote
              fill={
                voteStatuses[need?.need_id] === "yellow" ? "#FFB443" : "white"
              }
            />
          </button>
          <button
            className={voteStatuses[need?.need_id] === "red" ? "voted" : ""}
            onClick={() => handleVote("red")}
          >
            <DownVote
              fill={voteStatuses[need?.need_id] === "red" ? "red" : "white"}
            />
          </button>
        </div>
        {/* <button className="neo-button">GO AWAY!</button> */}
      </div>
    </div>
  );
};
