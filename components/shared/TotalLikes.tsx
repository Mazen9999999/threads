"use client"

import { calculateTotalLikes, fetchUser, fetchUserPosts } from "@/lib/actions/user.action";
import { useEffect, useState } from "react";

export const TotalLikes = ({ userId, accountId }: { userId: string, accountId: string }) => {
  const [totalLikes, setTotalLikes] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const parsedUserId = JSON.parse(userId)
  const parsedAccountId = JSON.parse(accountId)
  useEffect(() => {
    const fetchTotalLikes = async () => {
      try {
        const user = await fetchUser(parsedAccountId);
        setTotalLikes(user.totalLikes || 0);
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