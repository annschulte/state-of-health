import { Nameplate } from "@/components/Nameplate";
import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Fragment } from "react";

export default async function Index() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }
  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full flex justify-between items-center p-3 text-sm ">
          <div className="flex items-center gap-4 text-xl">STATE OF HEALTH</div>
          {user ? <Nameplate userId={user.id} /> : null}

          <div className="flex items-center gap-4 text-xl">
            {new Date().toLocaleDateString()}
            <AuthButton />
          </div>
        </div>
      </nav>

      <div className="w-full animate-in flex-1 flex flex-col gap-10 opacity-0">
        <main className="w-full flex-1 flex flex-col">
          <Fragment>
            <div className="w-full flex justify-center items-center flex-col gap-4">
              <h1 className="text-4xl font-bold">Welcome to State of Health</h1>
              <p className="text-lg text-center">
                This is a simple health tracking app that allows you to log your
                daily health status. You can also view your health history and
                share it with your doctor.
              </p>
            </div>
            <div className="w-full flex justify-center items-center flex-col gap-4">
              <AuthButton />
            </div>
          </Fragment>
        </main>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        Made with ❤️
        {/* <Link href="https://annschulteportfolio.vercel.app"> Ann</Link> */}
      </footer>
    </div>
  );
}
