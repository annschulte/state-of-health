"use client";
import { supabase } from "@/utils/supabase/client";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { EmojiPicker } from "./EmojiPicker";
import { useActivitiesStore } from "@/store";

export function Modal({ fullDate }: { fullDate: Date | undefined }) {
  const { addActivity } = useActivitiesStore();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>();

  const fetchUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    setUser(user);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleEmojiSelect = async (emoji: string) => {
    setIsOpen(false);
    const activity = {
      item: emoji,
      user_id: user?.id,
      date: fullDate?.toISOString(),
    };
    const { data, error } = await supabase
      .from("activities")
      .insert([activity])
      .select("*");

    if (!error && data) {
      addActivity(data[0]);
    } else {
      console.error("Failed to insert activity:", error.message);
    }
  };

  return (
    <Fragment>
      <button
        className="w-2/3 absolute bottom-1 px-1 bg-[#01ff75] text-black border-2 border-black cursor-pointer transition-colors duration-300 hover:bg-[#00cc5c]"
        onClick={() => setIsOpen(true)}
      >
        Add
      </button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="bg-white p-6 relative border-2 border-black z-50">
            <DialogTitle className="text-xl font-bold mb-4">
              {fullDate?.toDateString()}
            </DialogTitle>

            {/* <Description className="text-sm">
              Fill out the details below to add a new activity to your day.
            </Description>

            <input
              type="text"
              placeholder="Activity description"
              className="mt-4 border-2 border-black p-2 w-full"
            />  */}
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />

            {/* <div className="mt-4">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={() => setIsOpen(false)}
              >
                Save Activity
              </button>
              <button
                type="button"
                className="ml-2 inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
            </div> */}
          </DialogPanel>
        </div>
      </Dialog>
    </Fragment>
  );
}
