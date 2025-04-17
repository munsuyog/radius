"use client";
import { CourseCountContext } from "@/app/_context/CourseCountContext";
import { Button } from "@/components/ui/button";
import { Crown, LayoutDashboard, Share2, UserCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext } from "react";
import LeaderboardComponent from "./LeaderBoardComponent";

function SideBar() {
  const MenuList = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Profile",
      icon: UserCircle,
      path: "/dashboard/profile",
    },
    {
      name: "Shared",
      icon: Share2,
      path: "/dashboard/shared",
    }
  ];

  const { totalCourse, setTotalCourse } = useContext(CourseCountContext);

  const path = usePathname();
  return (
    <div className="h-screen shadow-md p-5">
      <Link href={"/"}>
        <Image src="/logos/logowword.svg" alt="logo" width={120} height={50} />
      </Link>

      <div className="mt-10">
        <Link className="w-full" href={"/create"}>
          <Button className="w-full">+ Create New</Button>
        </Link>

        <div className="mt-5">
          {MenuList.map((menu, index) => (
            <Link
              href={menu.path}
              key={index}
              className={`flex items-center gap-5 p-3 hover:bg-zinc-800 
                cursor-pointer rounded-md mt-3 ${
                  path == menu.path && "bg-zinc-800"
                }`}
            >
              <menu.icon />
              <h2>{menu.name}</h2>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="p-4 border border-zinc-800 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-yellow-500" />
              <h3 className="font-medium">Leaderboard</h3>
            </div>
            <LeaderboardComponent />
          </div>
          <p className="text-sm text-zinc-400">See how your progress compares to other learners!</p>
        </div>
      </div>
    </div>
  );
}

export default SideBar;