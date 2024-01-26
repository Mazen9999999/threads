"use client"

import { sidebarLinks } from "@/constants";
import { hasUnviewedActivities } from "@/lib/actions/user.action";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const BottomNav = ({ userId }: { userId: string }) => {
    const router = useRouter();
    const pathname = usePathname();

    const [hasUnviewed, setHasUnviewed] = useState(0);

    useEffect(() => {
        const checkUnviewedActivities = async () => {
            try {
                const unviewed = await hasUnviewedActivities(userId);
                setHasUnviewed(unviewed);
            } catch (error) {
                console.error('Error checking unviewed activities:', error);
            }
        };

        checkUnviewedActivities();
    }, [userId]);

    return (
        <div className="bottombar_container">
            {sidebarLinks.map((link) => {
                const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;

                return (
                    <Link
                        href={link.route}
                        key={link.label}
                        className={`bottombar_link relative ${isActive && 'bg-primary-500'}`}>
                        <Image
                            src={link.imgURL}
                            alt={link.label}
                            width={24}
                            height={24}
                        />
                        <p className="text-subtle-medium text-light-1 max-sm:hidden">
                            {link.label.split(/\s+./)[0]}
                        </p>
                        {link.label === "Activity" && hasUnviewed ?
                            (<span className="bg-red-500 absolute top-5 left-5 text-light-2 px-1.5 py-0.5 rounded-full" style={{ fontSize: "11px" }}>{hasUnviewed}</span>)
                            :
                            null}
                    </Link>
                )
            })}
        </div>
    )
}