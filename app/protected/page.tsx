"use client";
import { supabase } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import NeedsList from "@/components/NeedsList";
import { Nameplate } from "@/components/Nameplate";
import { UserProvider } from "@/context/UserContext";
import { Calendar } from "@/components/Calendar";

export default async function ProtectedPage() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <UserProvider initialUser={user}>
      <div className="w-full flex flex-col 10 items-center">
        <nav className="px-6 w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full flex justify-between items-center p-3 text-sm ">
            <div className="flex items-center gap-4 text-xl">
              STATE OF HEALTH
            </div>
            <Nameplate userId={user.id} />

            <div className="flex items-center gap-4 text-xl">
              {new Date().toLocaleDateString()}
              {/* <AuthButton /> */}
            </div>
          </div>
        </nav>

        <div className="w-full animate-in flex-1 flex flex-col gap-10 opacity-0">
          <main className="w-full flex-1 flex flex-col">
            <Calendar user={user} />
            {/* <NeedsList user={user} /> */}
          </main>
        </div>

        <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
          Made with ❤️
          {/* <Link href="https://annschulteportfolio.vercel.app"> Ann</Link> */}
        </footer>
      </div>
    </UserProvider>
  );
}
