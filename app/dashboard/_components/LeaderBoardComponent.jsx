"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { Crown, Medal, Star, Trophy, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils"

const RankIcon = ({ rank }) => {
  if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
  return <Star className="h-5 w-5 text-blue-500" />;
};

const LeaderboardComponent = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/leaderboard");
      setLeaderboard(response.data.result);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchLeaderboard();
    }
  }, [open]);

  // Find current user's rank if they're in the leaderboard
  const currentUserRank = user 
    ? leaderboard.findIndex(entry => entry.email === user.primaryEmailAddress?.emailAddress) + 1 
    : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-2 items-center">
          <Crown className="h-4 w-4 text-yellow-500" /> Leaderboard
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-xl">
            <Trophy className="h-5 w-5 text-yellow-500" /> Leaderboard
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : leaderboard.length > 0 ? (
            <div className="space-y-2">
              {leaderboard.map((entry, index) => {
                // Check if this entry is the current user
                const isCurrentUser = user && entry.email === user.primaryEmailAddress?.emailAddress;
                
                return (
                  <div 
                    key={entry.userId}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-md border",
                      isCurrentUser ? "bg-zinc-800 border-primary" : "hover:bg-zinc-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-zinc-800">
                        <RankIcon rank={index + 1} />
                      </div>
                      <div>
                        <p className="font-medium">
                          {entry.name}
                          {isCurrentUser && " (You)"}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {entry.email.substring(0, 3)}***{entry.email.split('@')[1]}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-zinc-800 px-3 py-1 rounded-full text-sm">
                        <BookIcon className="h-4 w-4 mr-1 text-blue-500" />
                        {entry.courseCount} {entry.courseCount === 1 ? 'course' : 'courses'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <User className="h-12 w-12 text-zinc-700 mb-4" />
              <p className="text-center text-zinc-500">No users on the leaderboard yet</p>
              <p className="text-center text-zinc-600 text-sm mt-2">
                Complete courses to be featured on the leaderboard
              </p>
            </div>
          )}
        </div>

        {user && currentUserRank === 0 && leaderboard.length > 0 && (
          <div className="mt-4 p-3 border rounded-md bg-zinc-900">
            <p className="text-center text-sm">
              You're not on the leaderboard yet. Complete more courses to rank up!
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Small component for book icon
const BookIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

export default LeaderboardComponent;