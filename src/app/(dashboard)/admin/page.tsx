"use client"

import Link from "next/link"
import Announcements from "@/components/Announcements"
import AttendanceChartContainer from "@/components/AttendanceChartContainer"
import CountChartContainer from "@/components/CountChartContainer"
import EventCalendarContainer from "@/components/EventCalendarContainer"
import FinanceChart from "@/components/FinanceChart"
import UserCard from "@/components/UserCard"

const AdminPage = ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined }
}) => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
       <div className="flex gap-4 justify-between flex-wrap">
  <Link href="/admin" className="block flex-1 min-w-[130px]">
    <UserCard type="admin" />
  </Link>
  <Link href="/admin/teachers" className="block flex-1 min-w-[130px]">
    <UserCard type="teacher" />
  </Link>
  <Link href="/admin/students" className="block flex-1 min-w-[130px]">
    <UserCard type="student" />
  </Link>
  <Link href="/admin/parents" className="block flex-1 min-w-[130px]">
    <UserCard type="parent" />
  </Link>
</div>


        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer />
          </div>
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChartContainer />
          </div>
        </div>

        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendarContainer searchParams={searchParams} />
        <Announcements />
      </div>
    </div>
  )
}

export default AdminPage
