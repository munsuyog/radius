"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BookOpen, Lightbulb, Lock } from "lucide-react";
import Link from "next/link";
import CourseHeader from "@/app/course/[courseId]/_components/CourseHeader";
import { toast } from "sonner";


function SharedCoursePage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState();
  const [loading, setLoading] = useState(true);
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    courseId && getCourseDetails();
  }, [courseId]);

  const getCourseDetails = async () => {
    try {
      setLoading(true);
      const result = await axios.get(`/api/courses?courseId=${courseId}`);
      setCourse(result.data.result);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch course details:", error);
      setLoading(false);
    }
  };

  const cloneCourse = async () => {
    if (!isSignedIn) {
      // Redirect to sign in if not logged in
      router.push("/sign-in");
      return;
    }

    try {
      // Clone the course for the current user
      await axios.post("/api/clone-course", {
        courseId: courseId,
        userId: user?.id,
        email: user?.primaryEmailAddress?.emailAddress
      });
      
      // Show success message and redirect to dashboard
      toast.success("Course added to your dashboard!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to clone course:", error);
      toast.error("Failed to add course to your dashboard");
    }
  };

  return (
    <div>
      <CourseHeader />
      <div className="mx-10 md:mx-36 lg:mx-60 mt-10 mb-20 md:mb-28">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4">Loading course details...</p>
          </div>
        ) : course ? (
          <div>
            <Link href="/" className="flex items-center gap-2 mb-6 text-primary">
              <ArrowLeft className="h-4 w-4" /> Back to home
            </Link>
            
            <div className="flex gap-5 items-center p-5 md:p-10 border rounded-lg">
              <Image
                src={"/knowledge.png"}
                alt="book"
                width={90}
                height={90}
                className="hidden md:block"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h2 className="font-bold text-2xl">
                    {course?.courseLayout?.course_name}
                  </h2>
                  <div className="flex items-center gap-2 text-sm bg-blue-600 text-white px-3 py-1 rounded-full">
                    <BookOpen className="h-4 w-4" />
                    <span>Shared Course</span>
                  </div>
                </div>
                <p className="mt-3">{course?.courseLayout?.summary}</p>
                <Progress className="mt-3" value="40" />
                <div className="flex justify-between items-center mt-3">
                  <h2 className="text-lg">
                    Total Chapters: {course?.courseLayout?.chapters?.length}
                  </h2>
                  <Button onClick={cloneCourse} className="bg-blue-600 hover:bg-blue-500">
                    {isSignedIn ? "Add to My Courses" : "Sign in to add"}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <h2 className="font-medium text-2xl mb-4">Chapter Preview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {course?.courseLayout?.chapters?.slice(0, 2).map((chapter, index) => (
                  <div key={index} className="flex gap-3 border p-5 rounded-lg">
                    <h2 className="text-xl font-semibold">{index + 1}.</h2>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-xl font-semibold">{chapter?.chapter_title}</h2>
                      <p className="text-lg">{chapter?.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {course?.courseLayout?.chapters?.length > 2 && (
                <div className="flex flex-col items-center justify-center mt-8 p-6 border rounded-lg bg-zinc-900">
                  <Lock className="h-8 w-8 mb-3 text-blue-600" />
                  <h3 className="text-xl font-semibold">More Chapters Available</h3>
                  <p className="mb-4 text-center text-zinc-400 max-w-lg">
                    Add this course to your dashboard to access all {course?.courseLayout?.chapters?.length} chapters and study materials
                  </p>
                  <Button onClick={cloneCourse} className="bg-blue-600 hover:bg-blue-500">
                    {isSignedIn ? "Add to My Courses" : "Sign in to add"}
                  </Button>
                </div>
              )}
            </div>
            
            <div className="mt-10 flex flex-col items-center justify-center p-6 border rounded-lg">
              <Lightbulb className="h-8 w-8 mb-3 text-yellow-500" />
              <h3 className="text-xl font-semibold">About Radius</h3>
              <p className="mb-4 text-center text-zinc-400 max-w-lg">
                Radius is an AI-powered learning platform that helps you create and 
                explore personalized study materials through notes, flashcards, quizzes, and more.
              </p>
              <Link href="/sign-up">
                <Button variant="outline">Create Your Own Courses</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
            <p className="mb-6">The course you're looking for doesn't exist or has been removed.</p>
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default SharedCoursePage;