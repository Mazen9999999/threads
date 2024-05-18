"use client"

import { getFollowers } from '@/lib/actions/thread.actions';
import { useState, useEffect } from 'react';

export const ProfileDetails = ({ userId }: { userId: string }) => {

    const [followers, setFollowers] = useState([]);
    const [followersCount, setFollowersCount] = useState(0);
    const parsedId = JSON.parse(userId)
    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const data = await getFollowers({ userId: parsedId })

                setFollowers(data.followers);
                setFollowersCount(data.followersNumber);

            } catch (error) {
                console.error('Error fetching followers:', error);
            }
        };

        fetchFollowers();
    }, [userId]);


    return (
        <>
            <div className="flex flex-col items-center gap-1.5 px-3">
                <span className="font-bold">10</span>
                <span className="text-light-3">Following</span>
            </div>

            <div className="thread-card_bar h-8 w-0.5" />

            <div className="flex flex-col items-center gap-1.5 px-3">
                <span className="font-bold">{followersCount}</span>
                <span className="text-light-3">Followers</span>
            </div>

            <div className="thread-card_bar h-8 w-0.5" />

            <div className="flex flex-col items-center gap-1.5 px-3">
                <span className="font-bold">10</span>
                <span className="text-light-3">Likes</span>
            </div>
        </>
    )
}