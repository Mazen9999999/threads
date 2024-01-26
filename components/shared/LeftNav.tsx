"use client"

import Link from "next/link";
import { sidebarLinks } from "@/constants/index"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from 'react';
import { hasUnviewedActivities } from "@/lib/actions/user.action";

export const LeftNav = ({ currentUserId }: { currentUserId: string }) => {

    const router = useRouter();
    const pathname = usePathname();
    const { userId } = useAuth();

    const [hasUnviewed, setHasUnviewed] = useState(0);

    useEffect(() => {
        const checkUnviewedActivities = async () => {
            try {
                const unviewed = await hasUnviewedActivities(currentUserId);
                setHasUnviewed(unviewed);
            } catch (error) {
                console.error('Error checking unviewed activities:', error);
            }
        };

        checkUnviewedActivities();

         // Set up a timer to periodically check for new activities (adjust the interval as needed)
         const intervalId = setInterval(() => {
            checkUnviewedActivities();
        }, 180000); // Check every 30 seconds

        // Clean up the interval when the component is unmounted
        return () => clearInterval(intervalId);
    }, [currentUserId, pathname]);

    return (
        <>
            <div className="flex w-full flex-1 flex-col gap-6 px-6">
                {sidebarLinks.map((link) => {
                    const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;

                    if (link.route === '/profile') link.route = `${link.route}/${userId}`

                    return (
                        <Link
                            href={link.route}
                            key={link.label}
                            className={`leftsidebar_link relative ${isActive && 'bg-primary-500 items-center'}`}>
                            <Image
                                src={link.imgURL}
                                alt={link.label}
                                width={24}
                                height={24}
                            />
                            <p className={`text-light-1 max-lg:hidden ${link.label === "Activity" && hasUnviewed && 'ml-2'}`}>{link.label}</p>
                            {link.label === "Activity" && hasUnviewed ?
                                (<span className="bg-red-500 absolute top-6 left-7 text-light-2 px-1.5 py-0.5 rounded-full" style={{ fontSize: "11px" }}>{hasUnviewed}</span>)
                                :
                                null}
                        </Link>
                    )
                })}
            </div>
            <div className="mt-10 px-6">
                <SignedIn>
                    <SignOutButton signOutCallback={() => router.push('/sign-in')}>
                        <div className="flex cursor-pointer gap-4 p-4">
                            <Image
                                src={"/assets/logout.svg"}
                                alt="logout"
                                width={24}
                                height={24} />
                            <p className="text-light-2 max-lg:hidden">Logout</p>
                        </div>
                    </SignOutButton>
                </SignedIn>
            </div>
        </>
    )
}