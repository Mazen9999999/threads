"use client"

import { useEffect } from "react";
import { ActivityCard } from "./page"
import { updateLastViewed } from "@/lib/actions/user.action";
import { usePathname } from "next/navigation";

export const ActivityContent = ({ hasActs, activities, userId }:
    { hasActs: boolean, activities: any, userId: string }) => {

        const acts = JSON.parse(activities);

        const path = usePathname();

        useEffect(() => {
            // Call the function to update lastViewed when the component mounts
            updateLastViewed(userId, path);
          }, [userId, path]);

    return (
        <section className="mt-10 flex flex-col gap-5">
            {hasActs ? (
                acts.map((act: any) => (
                    <ActivityCard
                        key={act._id}
                        user={act.author || act.likedUser}
                        action={act.parentId ? "replied on your post" : "liked your post"}
                        parentId={act.parentId || act.likedPost._id}
                    />
                ))
            ) : (
                <p className="text-base-regular text-light-3">No activities yet</p>
            )}
        </section>
    )
}