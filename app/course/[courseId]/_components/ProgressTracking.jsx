"use client";
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { Award, BookOpen, CheckCircle2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ProgressTracking = ({ courseId, totalChapters }) => {
  const [progress, setProgress] = useState(0);
  const [completedChapters, setCompletedChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isSignedIn } = useUser();

  // Fetch user progress when component mounts
  useEffect(() => {
    if (isSignedIn && courseId) {
      fetchProgress();
    } else {
      setLoading(false);
    }
  }, [isSignedIn, courseId]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/progress?courseId=${courseId}`);
      
      if (response.data.result) {
        setProgress(response.data.result.progress);
        setCompletedChapters(response.data.result.chaptersCompleted || []);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch progress:", error);
      setLoading(false);
    }
  };

  const updateProgress = async (chapterId, completed = true) => {
    if (!isSignedIn) return;
    
    // Update local state first for a responsive feel
    let newCompletedChapters;
    if (completed) {
      newCompletedChapters = [...completedChapters, chapterId];
    } else {
      newCompletedChapters = completedChapters.filter(id => id !== chapterId);
    }
    
    setCompletedChapters(newCompletedChapters);
    
    // Calculate new progress percentage
    const newProgress = Math.round((newCompletedChapters.length / totalChapters) * 100);
    setProgress(newProgress);
    
    // Update on the server
    try {
      await axios.post("/api/progress", {
        courseId,
        progress: newProgress,
        chaptersCompleted: newCompletedChapters
      });
    } catch (error) {
      console.error("Failed to update progress:", error);
      // Revert back if there's an error
      fetchProgress();
    }
  };

  // Determine if user has completed all chapters
  const isCompleted = totalChapters > 0 && completedChapters.length === totalChapters;

  return (
    <div className="mt-4">
      {loading ? (
        <div className="h-8 bg-zinc-800 rounded animate-pulse"></div>
      ) : (
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium flex items-center gap-1">
              <BookOpen className="h-4 w-4" /> Course Progress
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {completedChapters.length} / {totalChapters} chapters
              </span>
              {isCompleted && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Award className="h-5 w-5 text-yellow-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Course completed! Great job!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          <Progress className="h-2" value={progress} />
          
          {isCompleted && (
            <div className="mt-2 py-2 px-3 bg-zinc-900 rounded-md border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm">You've completed this course!</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => fetchProgress()}>
                View Certificate
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressTracking;