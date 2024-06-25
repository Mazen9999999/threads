"use client"

import { calculateUserTotalLikes } from "@/lib/actions/thread.actions";
import { useEffect, useState } from "react";

export const TotalLikes = ({ userId }: { userId: string}) => {
  const [totalLikes, setTotalLikes] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const parsedUserId = JSON.parse(userId)
  useEffect(() => {
    const fetchTotalLikes = async () => {
      try {
      setTotalLikes(await calculateUserTotalLikes(parsedUserId))
      } catch (error) {
        console.error('Error fetching total likes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalLikes();
  }, [userId]);

  if (isLoading) {
    return <span className="loader"></span>;
  }

  return (
    <div className="flex flex-col items-center gap-1.5 px-3">
      <span className="font-bold">{totalLikes}</span>
      <span className="text-light-3">Likes</span>
    </div>
  )
}