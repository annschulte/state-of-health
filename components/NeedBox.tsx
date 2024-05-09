import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase/client";
import { useStore } from "@/store";
import UpVote from "./UpVote";
import DownVote from "./DownVote";

export const NeedBox = ({ need }: NeedBoxProps) => {
  const { setVoteStatusForNeed, voteStatuses } = useStore();
  const [checkIn, setCheckIn] = useState<any>(undefined);
  const [voteLengths, setVoteLengths] = useState<any>({
    good: 0,
    meh: 0,
    bad: 0,
  });

  useEffect(() => {
    const fetchVoteStatus = async () => {
      const { data: user } = await supabase.auth.getUser();

      let { data: existingCheckIn, error: existingVotesError } = await supabase
        .from("checkins")
        .select("*")
        .eq("need_id", need?.need_id)
        .eq("user_id", user?.user?.id)
        .order("created_at", { ascending: false });

      const goodLength = existingCheckIn?.filter(
        (checkin: any) => checkin?.status === "green"
      ).length;
      const mehLength = existingCheckIn?.filter(
        (checkin: any) => checkin?.status === "yellow"
      ).length;

      const badLength = existingCheckIn?.filter(
        (checkin: any) => checkin?.status === "red"
      ).length;

      if (existingVotesError) {
        console.error("Error fetching vote status:", existingVotesError);
        return;
      }

      if (existingCheckIn && existingCheckIn?.length > 0) {
        setVoteStatusForNeed(need?.need_id, existingCheckIn[0].status);
        setCheckIn(existingCheckIn[0]);

        setVoteLengths({
          good: goodLength,
          meh: mehLength,
          bad: badLength,
        });
      }
    };

    fetchVoteStatus();
  }, [need?.need_id, setVoteStatusForNeed]);

  const handleVote = async (newVote: "green" | "yellow" | "red") => {
    const { data, error } = await supabase
      .from("checkins")
      .insert([
        {
          need_id: need?.need_id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          status: newVote,
          date: new Date().toISOString().slice(0, 10),
        },
      ])
      .select("*");

    if (error) {
      console.error("Error voting:", error);
      return;
    }

    const goodLength: boolean = data?.filter(
      (checkin: any) => checkin?.status === "green"
    ).length
      ? true
      : false;
    const mehLength: boolean = data?.filter(
      (checkin: any) => checkin?.status === "yellow"
    ).length
      ? true
      : false;

    const badLength: boolean = data?.filter(
      (checkin: any) => checkin?.status === "red"
    ).length
      ? true
      : false;

    if (data) {
      setCheckIn(data[0]);
      setVoteLengths((prev: any) => ({
        good: prev.good + goodLength,
        meh: prev.meh + mehLength,
        bad: prev.bad + badLength,
      }));
      setVoteStatusForNeed(need?.need_id, newVote);
    }
  };

  const getCardClassName = () => {
    const status = voteStatuses[need?.need_id] ?? checkIn?.status;
    return `need-box ${status ?? ""}`;
  };

  return (
    <div className={getCardClassName()}>
      <div className="h-full flex flex-col justify-between">
        <div style={needTitleStyle}>{need?.title?.toUpperCase()}</div>

        <div style={needContent}>{need?.description}</div>
        <div style={needContent}>
          {checkIn?.created_at
            ? new Date(checkIn?.created_at).toLocaleTimeString() +
              " " +
              new Date(checkIn?.created_at).toLocaleDateString()
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
            {voteLengths?.good}
          </button>
          {/* <button
            className={voteStatuses[need?.need_id] === "yellow" ? "voted" : ""}
            onClick={() => handleVote("yellow")}
          >
            <MehVote
              fill={
                voteStatuses[need?.need_id] === "yellow" ? "#FFB443" : "white"
              }
            />
            {voteLengths?.meh}
          </button> */}
          <button
            className={voteStatuses[need?.need_id] === "red" ? "voted" : ""}
            onClick={() => handleVote("red")}
          >
            <DownVote
              fill={voteStatuses[need?.need_id] === "red" ? "red" : "white"}
            />
            {voteLengths?.bad}
          </button>
        </div>
        {/* <button className="neo-button">GO AWAY!</button> */}
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
