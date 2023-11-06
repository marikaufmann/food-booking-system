import Link from "next/link";
import React from "react";

const Dashboard = () => {
	return <div className="h-screen flex justify-center items-center gap-8 font-medium w-full bg-gray-300">
		<Link href='/dashboard/opening' className="rounded-md bg-[#939a64] hover:bg-[#c2cb80] text-[#ececee] shadow-md py-2 px-4">Opening Hours</Link>
		<Link href='/dashboard/menu' className="rounded-md bg-[#939a64] hover:bg-[#c2cb80] text-[#ececee] shadow-md py-2 px-4">Menu</Link>
	</div>;
};

export default Dashboard;
