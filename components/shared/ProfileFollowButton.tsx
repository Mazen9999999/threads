"use client"

import { getFollowersIds } from "@/lib/actions/user.action";
import { fetchUser, follow, unfollow } from "@/lib/actions/user.action";
import { useEffect, useState } from "react";

export const ProfileFollowButton = ({ authorId, userId }: { authorId: string, userId: string }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [doesAuthorFollow, setDoesAuthorFollow] = useState(false);
    const parsedAuthorId = JSON.parse(authorId);
    const parsedUserId = JSON.parse(userId);


    useEffect(() => {
        const checkIfCurrentUserIsFollowing = async () => {
            const userInfo = await fetchUser(parsedUserId);

            try {
                const followersList = await getFollowersIds({ authorId: parsedAuthorId });
                const isCurrentUserFollowing = followersList.includes(userInfo._id);
                setIsCurrentUser(parsedAuthorId === userInfo._id);
                setIsFollowing(isCurrentUserFollowing);

                const currentUserFollowersList = await getFollowersIds({ authorId: userInfo._id });
                const isAuthorFollowingCurrentUser = currentUserFollowersList.includes(parsedAuthorId);
                setDoesAuthorFollow(isAuthorFollowingCurrentUser);
            } catch (error) {
                console.error('Error checking if current user is following:', error);
            }
        };

        checkIfCurrentUserIsFollowing();
    }, [parsedAuthorId, userId]);


    const handleFollow = async () => {
        const userInfo = await fetchUser(parsedUserId);
        try {
            await follow({ followedUserId: parsedAuthorId, userId: userInfo._id });
            setIsFollowing(true);
        } catch (error) {
            console.error('Error during follow:', error);
        }
    };

    const handleUnfollow = async () => {
        const userInfo = await fetchUser(parsedUserId);
        try {
            await unfollow({ followedUserId: parsedAuthorId, userId: userInfo._id });
            setIsFollowing(false);
        } catch (error) {
            console.error('Error during unfollow:', error);
        }
    };

    if (isCurrentUser) {
        return (
            <button className="text-body-bold tracking-wide bg-dark-1 text-light-4 border-2 border-light-4 mt-4 px-14 py-2 rounded-md">
                Edit
            </button>
        );
    }

    const buttonText = isFollowing && doesAuthorFollow ? "Friends" : doesAuthorFollow ? "Follow back" : isFollowing ? "unfollow" : "Follow";

    return (
        <button className={`${isFollowing ? "bg-dark-1 text-light-4 border-2 border-light-4" : "bg-light-1"} mt-4 px-14 py-2 rounded-md`}
            onClick={() => {
                isFollowing ? handleUnfollow() : handleFollow()
            }}
        >
            {buttonText}
        </button>
    );
}