"use client"

import { likePost, unLikePost, getInitialLikeState } from "@/lib/actions/thread.actions";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import './likeButton.css'

export const LikeButton = ({ id, currentUserId, post }: { id: string, currentUserId: string, post: any }) => {
    const path = usePathname();
    const userId = JSON.parse(currentUserId);
    const postId = JSON.parse(id);
    const parsedPost = JSON.parse(post);

    const [likeInfo, setLikeInfo] = useState(null); // Use null as an initial loading state

    // Fetch initial like state and like count from the server when the component mounts
    useEffect(() => {
        const fetchInitialLikeState = async () => {
            try {
                const { isLiked, likeCount } = await getInitialLikeState({ postId, userId });
                setLikeInfo({ isLiked, likeCount });
            } catch (error) {
                console.error('Error fetching initial like state:', error);
            }
        };

        fetchInitialLikeState();
    }, [postId, userId]);

    const handleLike = async () => {
        try {
            await likePost({ postId, userId, path });
            setLikeInfo({ isLiked: true, likeCount: likeInfo.likeCount + 1 });
        } catch (error) {
            console.error(error);
        }
    };

    const handleUnlike = async () => {
        try {
            await unLikePost({ postId, userId, path });
            setLikeInfo({ isLiked: false, likeCount: likeInfo.likeCount - 1 });
        } catch (error) {
            console.error(error);
        }
    };

    // Display loading state while fetching initial like state
    if (likeInfo === null) {
        return <span className="loader"></span>;
    }

    return (
        <>
            <div className="flex flex-col items-center gap-1.5">
              
                {likeInfo.isLiked ? (
                    <button onClick={handleUnlike} disabled={!likeInfo.isLiked}>
                         <Image
                        src={"/assets/heart-filled.svg"}
                        alt="liked"
                        width={24}
                        height={24}
                        className="cursor-pointer object-contain"
                    />
                    </button>
                ) : (
                    <button onClick={handleLike} disabled={likeInfo.isLiked}>
                    <Image
                        src={"/assets/heart-gray.svg"}
                        alt="unliked"
                        width={24}
                        height={24}
                        className="cursor-pointer object-contain"
                    />
                    </button>
                )}
                  <span  className="text-light-2 text-tiny-medium">{likeInfo.likeCount}</span>
            </div>

        </>
    )
}