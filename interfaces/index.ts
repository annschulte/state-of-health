interface User {
  id: string;
  email: string;
}

interface Need {
  need_id: string;
  user_id: string;
  title: string;
  description?: string;
  weight: number;
  last_updated: string;
}

interface CheckIn {
  checkin_id: string;
  need_id: string;
  user_id: string;
  status: "green" | "yellow" | "red";
  date: string;
  note?: string;
}

interface NeedBoxProps {
  need: Need;
  vote_status?: "green" | "yellow" | "red";
}

interface NeedCreatorProps {
  onNeedCreated: (newNeed: Need) => void;
}
