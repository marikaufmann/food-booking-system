import {Calendar as ReactCalendar} from "react-calendar";
import { format, formatISO, isBefore, parse } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Day } from "@prisma/client";
import { OPENING_HOURS_INTERVAL, now } from "~/constants/config";
import { getOpeningTimes, roundToNearestMinutes } from "~/utils/helper";
import { useEffect, useState } from "react";
type CalendarProps = {
  days: Day[];
  closedDays: string[];
};

type DateType = {
  justDate: Date | null;
  dateTime: Date | null;
};
const Calendar = ({ days, closedDays }: CalendarProps) => {
  const router = useRouter();

  const today = (days.find((d) => d.dayOfWeek === now.getDay()))
  const rounded = roundToNearestMinutes(now, OPENING_HOURS_INTERVAL);
  const closing = parse(today!.closeTime, "kk:mm", now);
  const tooLate = !isBefore(rounded, closing);
  if (tooLate) closedDays.push(formatISO(new Date().setHours(0, 0, 0, 0)));

  const [date, setDate] = useState<DateType>({
    justDate: null,
    dateTime: null,
  });
  const times = date.justDate && getOpeningTimes(date.justDate, days);
	useEffect(() => {
		if (date.dateTime) {
			localStorage.setItem('selectedTime',  date.dateTime.toISOString())
			console.log(date.dateTime);
			
			router.push('/menu')
		}
	}, [router, date.dateTime])
  return (
    <div className="flex h-screen items-center justify-center max-sm:p-2">
      <div className="fixed  right-1 top-2 sm:right-5">
        <Image
          src="/logo.png"
          alt="logo"
          width={80}
          height={80}
          className="object-contain"
        />
      </div>
      <div className="fixed -z-10 h-screen w-screen ">
        <Image
          src="/calendar.jpg"
          fill
          className="object-cover"
          alt="background-image"
					priority
        />
        <div className="fixed h-screen w-screen bg-black/80"></div>
        Image
      </div>
      {date.justDate ? (
        <div className="flex flex-wrap items-center justify-center gap-4 p-6">
          {times?.map((time, i) => (
            <div
              key={`time-${i}`}
              className="flex w-16 cursor-pointer items-center justify-center rounded-md bg-[#939a64] py-2 text-[#ececee] hover:bg-[#c2cb80]"
            >
              <button
                type="button"
                onClick={() => setDate((prev) => ({ ...prev, dateTime: time }))}
              >
                {format(time, "kk:mm")}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <ReactCalendar
          minDate={new Date()}
          view="month"
          onClickDay={(day) => setDate((prev) => ({ ...prev, justDate: day }))}
          tileDisabled={({ date }) => closedDays.includes(formatISO(date))}
        />
      )}
    </div>
  );
};

export default Calendar;
