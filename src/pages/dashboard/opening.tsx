import React, { useState } from "react";

import { db } from "~/server/db";
import { api } from "~/utils/api";
import { Toaster, toast } from "react-hot-toast";
import type { Day } from "@prisma/client";
import { Switch } from "@headlessui/react";
import { capitalize } from "~/utils/helper";
import TimeSelector from "~/components/TimeSelector";
import { Button } from "@chakra-ui/react";
import ReactCalendar from "react-calendar";
import { now } from "~/constants/config";
import { formatISO } from "date-fns";
const Opening = ({ days }: { days: Day[] }) => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { mutate: closeDay } = api.opening.closeDay.useMutation({
    onSuccess: () => refetch(),
  });
  const { mutate: openDay } = api.opening.openDay.useMutation({
    onSuccess: () => refetch(),
  });
  const { data: getClosedDays, refetch } = api.opening.getClosedDays.useQuery();
  const { mutate: saveOpeningHours, isLoading } =
    api.opening.changeOpeningHours.useMutation({
      onSuccess: () => toast.success("Opening hours saved"),
      onError: () => toast.error("Something went wrong"),
    });
  const [openingHours, setOpeningHours] = useState([
    {
      name: days[0]!.name,
      openTime: days[0]!.openTime,
      closeTime: days[0]!.closeTime,
    },
    {
      name: days[1]!.name,
      openTime: days[1]!.openTime,
      closeTime: days[1]!.closeTime,
    },
    {
      name: days[2]!.name,
      openTime: days[2]!.openTime,
      closeTime: days[2]!.closeTime,
    },
    {
      name: days[3]!.name,
      openTime: days[3]!.openTime,
      closeTime: days[3]!.closeTime,
    },
    {
      name: days[4]!.name,
      openTime: days[4]!.openTime,
      closeTime: days[4]!.closeTime,
    },
    {
      name: days[5]!.name,
      openTime: days[5]!.openTime,
      closeTime: days[5]!.closeTime,
    },
    {
      name: days[6]!.name,
      openTime: days[6]!.openTime,
      closeTime: days[6]!.closeTime,
    },
  ]);
  const changeTime = (
    time: string,
    type: "openTime" | "closeTime",
    day: string,
  ) => {
    const index = openingHours.findIndex((d) => d.name === day);
    const newOpeningHrs = [...openingHours];
    newOpeningHrs[index]![type] = time;
    setOpeningHours(newOpeningHrs);
  };
  const dayClosed =
    selectedDate && getClosedDays?.includes(formatISO(selectedDate));
  return (
    <div className="mx-auto max-w-xl px-2">
      <Toaster />
      <div className="mt-6 flex justify-center gap-6">
        <p className={`${enabled ? "" : "font-medium"}`}>Opening times</p>
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={`${
            enabled ? "bg-green-800" : "bg-gray-200"
          } relative flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out `}
        >
          <span className="sr-only">Enable Notifications</span>
          <span
            className={`${
              enabled ? "translate-x-5" : "translate-x-0"
            } pointer-events-none  h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
        <p className={`${enabled ? "font-medium" : ""}`}>Opening days</p>
      </div>
      {!enabled ? (
        <div className="mt-16 flex flex-col gap-8">
          {days.map((day) => (
            <div key={day.id} className="grid grid-cols-3 items-center gap-4">
              <h3 className="font-bold">{capitalize(day.name)}</h3>
              <div>
                <TimeSelector
                  type="openTime"
                  selected={
                    openingHours[
                      openingHours.findIndex((d) => d.name === day.name)
                    ]!.openTime
                  }
                  changeTime={changeTime}
                  day={day.name}
                />
              </div>
              <div>
                <TimeSelector
                  type="closeTime"
                  selected={
                    openingHours[
                      openingHours.findIndex((d) => d.name === day.name)
                    ]!.closeTime
                  }
                  changeTime={changeTime}
                  day={day.name}
                />
              </div>
            </div>
          ))}
          <Button
            onClick={() => {
              const withId = openingHours.map((day) => ({
                ...day,
                id: days[days.findIndex((d) => d.name === day.name)]!.id,
              }));
              saveOpeningHours(withId);
            }}
            isLoading={isLoading}
            colorScheme="green"
            variant="solid"
          >
            Save
          </Button>
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center gap-6">
          <div>
            <ReactCalendar
              minDate={now}
              className="react-calendar"
              view="month"
              onClickDay={(date) => setSelectedDate(date)}
              tileClassName={({ date }) => {
                return getClosedDays?.includes(formatISO(date))
                  ? "closed-day"
                  : null;
              }}
            />
          </div>
          <Button
            colorScheme="green"
            variant="solid"
            onClick={() => {
              if (dayClosed) openDay({ date: selectedDate });
              else if (selectedDate) closeDay({ date: selectedDate });
            }}
            disabled={!selectedDate}
          >
            {dayClosed ? "Open shop this day" : "Close shop this day"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Opening;

export async function getServerSideProps() {
  const days = await db.day.findMany();
  if (days.length !== 7) throw new Error("Insert all dates into the db");
  return {
    props: {
      days,
    },
  };
}
