import Head from "next/head";
import Calendar from "~/components/Calendar";
import {db} from '../server/db'
import { formatISO } from "date-fns";
import type { Day } from "@prisma/client";

 type HomeProps = {
	days: Day[]
	closedDays: string[]
 }
export default function Home({days, closedDays}: HomeProps) {

  return (
    <>
      <Head>
        <title>Booking Software</title>
        <meta name="description" content="by maria" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main >
          <Calendar days={days} closedDays={closedDays} />
      </main>
    </>
  );
}

export async function getServerSideProps() {
	const days = await db.day.findMany() 
	const closedDays = (await db.closedDay.findMany()).map(day => formatISO(day.date)) 
	return {props: {days, closedDays}}

}
