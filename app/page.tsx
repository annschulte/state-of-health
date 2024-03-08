import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { PublicNeedsList } from "@/components/PublicNeedsList";

export default async function Index() {
  const canInitSupabaseClient = () => {
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full flex justify-between items-center p-3 text-sm ">
          <div className="flex items-center gap-4 text-xl">STATE OF HEALTH</div>
          {/* <Nameplate userId={user.id} /> */}

          <div className="flex items-center gap-4 text-xl">
            {new Date().toLocaleDateString()}
            <AuthButton />
          </div>
        </div>
      </nav>

      <div className="animate-in flex-1 flex flex-col gap-1s0 opacity-0 px-3">
        <main className="flex-1 flex flex-col gap-6">
          <PublicNeedsList />
        </main>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs"></footer>
    </div>
  );
}
