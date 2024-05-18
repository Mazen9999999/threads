"use client"

import { getFollowersIds } from "@/lib/actions/thread.actions";
import { fetchUser, follow, unfollow } from "@/lib/actions/user.action";
import { useEffect, useState } from "react";

export const ProfileFollowButton = ({ authorId, userId }: { authorId: string, userId: string }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const parsedAuthorId = JSON.parse(authorId);

    useEffect(() => {
        const checkIfCurrentUserIsFollowing = async () => {
            const userInfo = await fetchUser(userId);

            try {
                const followersList = await getFollowersIds({ authorId: parsedAuthorId });
                const isCurrentUserFollowing = followersList.includes(userInfo._id);
                setIsFollowing(isCurrentUserFollowing);
            } catch (error) {
                console.error('Error checking if current user is following:', error);
            }
        };

        checkIfCurrentUserIsFollowing();
    }, [parsedAuthorId, userId]);


     const handleFollow = async () => {
        const userInfo = await fetchUser(userId);
        try {
            await follow({ followedUserId: parsedAuthorId, userId: userInfo._id });
            setIsFollowing(true);
        } catch (error) {
            console.error('Error during follow:', error);
        }
    };

    const handleUnfollow = async () => {
        const userInfo = await fetchUser(userId);
        try {
            await unfollow({ followedUserId: parsedAuthorId, userId: userInfo._id });
            setIsFollowing(false);
        } catch (error) {
            console.error('Error during unfollow:', error);
        }
    };

    return (
        <button className={`${isFollowing ? "bg-dark-1 text-light-4 border-2 border-light-4" : "bg-light-1"} mt-4 px-14 py-2 rounded-md`}
        onClick={() => isFollowing ? handleUnfollow() : handleFollow()}
        >
            {isFollowing ? "Following" : "Follow"}
            </button>
    )
}