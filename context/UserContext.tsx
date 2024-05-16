import React, { createContext, useState } from "react";
import { Session, User } from "@supabase/supabase-js";

interface UserContextType {
  user: User | null;
  session: Session | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider: React.FC<{
  children: React.ReactNode;
  initialUser?: User;
}> = ({ children, initialUser }) => {
  const [user, setUser] = useState<User | null>(initialUser || null);

  return (
    <UserContext.Provider value={{ user, setUser, session: null }}>
      {children}
    </UserContext.Provider>
  );
};
