import type { Day } from "@prisma/client";
import { add, addMinutes, getHours, getMinutes, isBefore, isEqual, parse } from "date-fns";
import { OPENING_HOURS_INTERVAL, categories, now } from "~/constants/config";

export const capitalize = (cat: string) => cat.charAt(0).toUpperCase() + cat.slice(1)

export const selectOptions = categories.map(category => ({ value: category, label: capitalize(category) }))

export const getWeekdayByIndex = (index: number) => {
	const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
	return weekdays[index]
}

export const roundToNearestMinutes = (date: Date, interval: number) => {
	const minutesLeftUntilNextInterval = interval - (getMinutes(date) % interval)
	return addMinutes(date, minutesLeftUntilNextInterval)
}

export const getOpeningTimes = (startDate: Date, dbDays: Day[]) => {
	const dayOfWeek = startDate.getDay()
	const isToday = isEqual(startDate, new Date().setHours(0, 0, 0, 0))

	const today = dbDays.find((d) => d.dayOfWeek === dayOfWeek)
	if (!today) throw new Error('This day does not exist in the database')

	const opening = parse(today.openTime, 'kk:mm', startDate)
	console.log(opening);
	const closing = parse(today.closeTime, 'kk:mm', startDate)
	console.log(opening);

	let hours: number
	let minutes: number

	if (isToday) {
		const rounded = roundToNearestMinutes(now, OPENING_HOURS_INTERVAL)
		const tooLate = !isBefore(rounded, closing)
		if (tooLate) throw new Error('No more bookings today')

		const beforeOpening = isBefore(rounded, opening)
		hours = getHours(beforeOpening ? opening : rounded)
		minutes = getMinutes(beforeOpening ? opening : rounded)

	} else {
		hours = getHours(opening)
		minutes = getMinutes(opening)
	}
	const beginning = add(startDate, { hours, minutes })
	const end = add(startDate, { hours: getHours(closing), minutes: getMinutes(closing) })
	const interval = OPENING_HOURS_INTERVAL
	const times = []
	for (let i = beginning; i <= end; i = add(i, { minutes: interval })) {
		times.push(i)
	}
	return times
}

