import { fetchUser, getActivity } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ActivityContent } from './ActivityContent';

export function ActivityCard({ user, action, parentId }: { user: any, action: string, parentId?: string }) {
    return (
        <Link key={user._id} href={`/thread/${parentId}`}>

            <article className="activity-card">
                <Link key={user._id} href={`/profile/${user.id}`}>
                    <Image
                        src={user.image}
                        alt="Profile picture"
                        width={20}
                        height={20}
                        className="rounded-full object-cover"
                    />
                </Link>

                <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                        {user.name}
                    </span>{" "}
                    {action}
                </p>
            </article>
        </Link>
    );
}

async function Page() {
    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect('/onboarding');

    const { activities } = await getActivity(userInfo._id);

   const hasActivities = activities.length > 0;
   
    return (
        <section>
            <h1 className="head-text mb-10">Activity</h1>

            <ActivityContent userId={userInfo._id} activities={JSON.stringify(activities)} hasActs={hasActivities} />

        </section>
    );
}

export default Page;