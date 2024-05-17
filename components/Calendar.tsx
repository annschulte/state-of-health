"use client";
import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { supabase } from "@/utils/supabase/client";
import { Activity, useActivitiesStore } from "@/store";

interface DayProps {
  day: number | null;
  view: string;
  monthStart?: string;
  fullDate?: Date;
  extraStyle?: React.CSSProperties;
  activities: Activity[];
}

const Day: React.FC<DayProps> = ({
  day,
  monthStart,
  fullDate,
  extraStyle,
  activities,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const baseStyle = `border border-gray-700 border-2 dark:border-white flex flex-col items-center justify-center w-30  h-24`;

  const isCurrentDayFn = (fullDate: Date | undefined): boolean => {
    if (!fullDate) return false;

    const today = new Date();
    return (
      fullDate.getDate() === today.getDate() &&
      fullDate.getMonth() === today.getMonth() &&
      fullDate.getFullYear() === today.getFullYear()
    );
  };

  const isPastDateFn = (fullDate: Date | undefined): boolean => {
    if (!fullDate) return false;

    const today = new Date();
    const fullDateComparison = new Date(
      fullDate.getFullYear(),
      fullDate.getMonth(),
      fullDate.getDate()
    );
    const todayComparison = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    return fullDateComparison < todayComparison;
  };

  const isCurrentDay: boolean = isCurrentDayFn(fullDate);
  const isInPast: boolean = isPastDateFn(fullDate);

  return (
    <div
      className={`${baseStyle} ${
        isInPast
          ? "bg-gray-200 dark:bg-gray-700"
          : isCurrentDay
          ? "bg-blue-200 border-2 border-blue-600 dark:bg-blue-700 dark:border-blue-600"
          : "bg-white dark:bg-gray-700"
      }`}
      style={{ position: "relative", ...extraStyle }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="absolute top-1 left-1 text-xs">{monthStart}</span>
      <p className="absolute top-3 left-2 text-lg font-bold">{day}</p>
      <div className="flex flex-wrap justify-center items-center">
        {activities.map((activity) => (
          <div className="m-1" key={activity.id}>
            <span>{activity.item}</span>
          </div>
        ))}
      </div>

      {day && isHovered ? <Modal fullDate={fullDate} /> : null}
    </div>
  );
};

const monthColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-lime-500",
  "bg-amber-500",
  "bg-cyan-500",
];

export const Calendar = () => {
  const { activities, setActivities } = useActivitiesStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [user, setUser] = useState<any>();

  const fetchUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchActivities = async () => {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("user_id", user?.id);

    if (error) {
      console.error("Error fetching activities:", error);
      return;
    }

    setActivities(data || []);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [user]);

  if (!activities) {
    return "loading...";
  }

  const daysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const numDaysCurrentMonth = new Date(year, month + 1, 0).getDate();

    function formatDate(date: Date) {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    }

    const currentMonthDays: DayProps[] = Array.from(
      { length: numDaysCurrentMonth },
      (_, i) => ({
        day: i + 1,
        fullDate: new Date(year, month, i + 1),
        color: monthColors[month],
        monthStart:
          i === 0
            ? new Date(year, month, 1).toLocaleDateString("en-US", {
                month: "long",
              })
            : undefined,
        isPrevMonth: false,
        view: "month",
        activities: activities?.filter(
          (activity) =>
            activity.date === formatDate(new Date(year, month, i + 1))
        ),
      })
    );

    return currentMonthDays;
  };

  const generateDaysForWeek = (date: Date) => {
    const days: DayProps[] = [];
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() - date.getDay() + i);

      days.push({
        day: newDate.getDate(),

        view: "week",
        monthStart: newDate.toLocaleDateString("en-US", { month: "long" }),
        fullDate: newDate,
        activities: activities?.filter(
          (activity) => activity.date === newDate.toISOString()
        ),
      });
    }

    return days;
  };

  const generateDaysForYear = (year: number) => {
    let days: DayProps[] = [];
    for (let month = 0; month < 12; month++) {
      const monthDays = daysInMonth(new Date(year, month));
      days = days.concat(monthDays);
    }
    return days;
  };

  let days: DayProps[] = [];
  switch (view) {
    case "year":
      days = generateDaysForYear(currentDate.getFullYear());
      break;
    case "month":
      days = daysInMonth(currentDate);
      break;
    case "week":
      days = generateDaysForWeek(currentDate);
      break;
  }

  const renderDays = () => {
    return (
      <div className="grid xl:grid-cols-12 md:grid-cols-7 sm:grid-cols-4 gap-1">
        {days.map((day, index) => (
          <Day
            key={index}
            day={day.day}
            view={view}
            monthStart={day.monthStart}
            fullDate={day.fullDate}
            activities={day.activities}
          />
        ))}
      </div>
    );
  };

  const handlePrev = () => {
    const newDate =
      view === "year"
        ? new Date(currentDate.getFullYear() - 1, 0, 1)
        : new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate =
      view === "year"
        ? new Date(currentDate.getFullYear() + 1, 0, 1)
        : new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
  };

  return (
    <div className="mx-10">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <button
            onClick={handlePrev}
            className="h-12 border-black dark:border-white border-2 p-2.5 bg-[#ffc235] hover:bg-[#ffd36d] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
          >
            Prev
          </button>

          {/* <button
            onClick={() => setCurrentDate(new Date())}
            className={`h-12  border-2 p-2.5  hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]
          `}
          >
            Today
          </button> */}
        </div>
        <div className="flex space-x-4">
          {/* <span className="text-2xl font-bold">
            {currentDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: view === "month" || view === "week" ? "long" : undefined,
            })}
          </span> */}
          {/* <button
            onClick={() => setView("week")}
            className={`h-12  border-2 p-2.5 ${
              view === "week"
                ? "bg-[#f129ff] hover:bg-[#f051fe] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                : "bg-[rgb(85,245,253)]  hover:bg-[#5bf4ff] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            }`}
          >
            Week
          </button> */}
          <div>
            <button
              onClick={() => setView("month")}
              className={`h-12  border-2 p-2.5 border-black dark:border-white mr-2 ${
                view === "month"
                  ? "bg-[#f129ff] hover:bg-[#f051fe] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                  : "bg-[rgb(255,255,255)] dark:bg-[#1f1f1f] hover:bg-[#5bf4ff] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              }`}
            >
              Month
            </button>

            <button
              onClick={() => setView("year")}
              className={`h-12  border-2 p-2.5 border-black dark:border-white  ${
                view === "year"
                  ? "bg-[#f129ff] hover:bg-[#f051fe] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                  : "bg-[rgb(255,255,255)] dark:bg-[#1f1f1f]  hover:bg-[#5bf4ff] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              }`}
            >
              Year
            </button>
          </div>
        </div>
        <div className="flex space-x-4 mb-4 justify-end mt-2">
          <button
            onClick={handleNext}
            className="h-12 border-black dark:border-white border-2 p-2.5 bg-[#ffc235] hover:bg-[#ffd36d] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
          >
            Next
          </button>
        </div>
      </div>

      {renderDays()}
    </div>
  );
};
