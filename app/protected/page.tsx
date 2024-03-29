import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import NeedsList from "@/components/NeedsList";
import { Nameplate } from "@/components/Nameplate";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="w-full flex flex-col 10 items-center">
      <nav className="px-6 w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full flex justify-between items-center p-3 text-sm ">
          <div className="flex items-center gap-4 text-xl">STATE OF HEALTH</div>
          <Nameplate userId={user.id} />

          <div className="flex items-center gap-4 text-xl">
            {new Date().toLocaleDateString()}
            <AuthButton />
          </div>
        </div>
      </nav>

      <div className="animate-in flex-1 flex flex-col gap-10 opacity-0 px-3">
        <main className="flex-1 flex flex-col gap-6">
          <NeedsList user={user} />
        </main>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs"></footer>
    </div>
  );
}
