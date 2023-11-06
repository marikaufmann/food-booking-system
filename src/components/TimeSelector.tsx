import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { HiCheck, HiSelector } from "react-icons/hi";
type TimeSelectorProps = {
  type: "openTime" | "closeTime";
  day: string;
  selected: string;
  changeTime: (
    time: string,
    type: "openTime" | "closeTime",
    day: string,
  ) => void;
};

const timeOptions: string[] = [];
for (let i = 5; i < 24; i++) {
  for (let j = 0; j < 60; j += 30) {
    timeOptions.push(
      `${i.toString().padStart(2, "0")}:${j.toString().padStart(2, "0")}`,
    );
  }
}

const TimeSelector = ({
  type,
  day,
  selected,
  changeTime,
}: TimeSelectorProps) => {
  const handleChangeTime = (e: string) => {
    if (type === "openTime") e = e.replace(/^0/, "");
    changeTime(e, type, day);
  };

  if (!selected) return <p>none selected</p>;

  if (type === "openTime") selected = selected.padStart(5, "0");

  return (
    <Listbox value={selected} onChange={handleChangeTime}>
      <Listbox.Label className="block text-sm font-medium text-gray-700">
        {type === "openTime" ? "Opening time" : "Closing time"}
      </Listbox.Label>
      <div className="relative">
        <Listbox.Button className="relative mt-2 w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-green-700 focus:outline-none focus:ring-1 focus:ring-green-700">
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-700" />
            <span className="ml-2">{selected}</span>
          </div>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2">
            <HiSelector className="h-5 w-5 text-gray-400" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full  overflow-auto rounded-md bg-white py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
            {timeOptions.map((time) => (
              <Listbox.Option
                value={time}
                className={({ active }) =>
                  `relative cursor-default py-2 pl-3 pr-9 items-center flex ${
                    active ? "bg-green-700 text-white" : " text-gray-900"
                  }`
                }
                key={time}
              >
                {({ selected: selectedOption }) => (
                  <>
                    <span
                      className={`h-2 w-2 rounded-full absolute    ${
                        time === selected ? "bg-green-700" : "bg-gray-300"
                      }`}
                    />
										<span className={`ml-4  ${selectedOption ? 'font-semibold' : 'font-normal'}`}>{time}</span>
										<span className={`${selectedOption ? 'text-green-700' : 'text-gray-500'} absolute right-4`}><HiCheck className='h-4 w-4'/></span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default TimeSelector;
