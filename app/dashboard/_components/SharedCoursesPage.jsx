"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { Share2, RefreshCcw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseCardItem from "../_components/CourseCardItem";
import Link from "next/link";

function SharedCoursesPage() {
  const [sharedCourses, setSharedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    user && getSharedCourses();
  }, [user]);

  const getSharedCourses = async () => {
    try {
      setLoading(true);
      const result = await axios.get("/api/shared-courses");
      setSharedCourses(result.data.result);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch shared courses:", error);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Share2 className="h-6 w-6 text-blue-500" />
          <h1 className="text-3xl font-bold">Shared With You</h1>
        </div>
        <Button variant="outline" onClick={getSharedCourses}>
          <RefreshCcw />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-5 md:mt-10 gap-5 md:gap-10">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="h-60 w-full animate-pulse bg-zinc-800 rounded-lg"
            ></div>
          ))}
        </div>
      ) : sharedCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-5 md:mt-10 gap-5 md:gap-10">
          {sharedCourses.map((course, index) => (
            <CourseCardItem key={index} course={course} isShared={true} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-16 py-10 border border-dashed rounded-lg">
          <Share2 className="h-12 w-12 text-zinc-700 mb-4" />
          <h3 className="text-xl font-medium mb-2">No shared courses found</h3>
          <p className="text-zinc-500 text-center max-w-md mb-6">
            When someone shares a course with you, it will appear here.
            You can also share your own courses for others to explore!
          </p>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="outline">Go to Dashboard</Button>
            </Link>
            <Link href="/create">
              <Button>Create a Course</Button>
            </Link>
          </div>
        </div>
      )}

      <div className="mt-10 p-5 border rounded-lg bg-zinc-900">
        <h2 className="font-medium text-lg mb-2 flex items-center gap-2">
          <ExternalLink className="h-5 w-5 text-blue-500" /> Share Your Knowledge
        </h2>
        <p className="text-zinc-400">
          Create and share your own courses with friends, classmates, or colleagues. 
          Click the share button on any of your courses to generate a shareable link.
        </p>
      </div>
    </div>
  );
}

export default SharedCoursesPage;