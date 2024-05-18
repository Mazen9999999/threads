"use client"

import { follow } from '@/lib/actions/user.action';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from 'next/link';
import { getFollowersIds } from '@/lib/actions/thread.actions';
import { revalidatePath } from 'next/cache';

const ProfileImage = ({ userId, author }: { userId: string, author: any }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const parsedUserId = JSON.parse(userId);
    const parsedAuthor = JSON.parse(author);

    useEffect(() => {
        const checkIfCurrentUserIsFollowing = async () => {
            try {
                const followersList = await getFollowersIds({ authorId: parsedAuthor._id });
                const isCurrentUserFollowing = followersList.includes(parsedUserId);
                setIsFollowing(isCurrentUserFollowing);
            } catch (error) {
                console.error('Error checking if current user is following:', error);
            }
        };

        checkIfCurrentUserIsFollowing();
    }, [parsedAuthor._id, parsedUserId]);

    const handleFollow = async () => {
        try {
            await follow({ followedUserId: parsedAuthor._id, userId: parsedUserId });
            setIsFollowing(true);
        } catch (error) {
            console.error('Error during follow:', error);
        }
    };

  
    return (
        <button className="relative h-11 w-11">
            {!isFollowing ? (
                <AlertDialog>
                    <AlertDialogTrigger>
                        <Image
                            src={parsedAuthor.image}
                            alt={"profile image"}
                            fill
                            className="cursor-pointer rounded-full "
                        />
                        {!isFollowing && (
                            <span className="bg-white text-dark-2 px-2 border border-dark-2 rounded-full absolute -right-1.5 -bottom-2">
                                +
                            </span>
                        )}
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you want to follow this user?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => {
                                handleFollow()
                                revalidatePath("/");
                            }}>Follow</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            ) : (
                <Link href={`/profile/${parsedAuthor.id}`}>
                    <Image
                        src={parsedAuthor.image}
                        alt={"profile image"}
                        fill
                        className="cursor-pointer rounded-full "
                    />
                </Link>
            )}
        </button>
    )
};

export default ProfileImage;
