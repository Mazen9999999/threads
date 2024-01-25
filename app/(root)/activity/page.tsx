import { fetchUser, getActivity, getLikedPost } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

function ActivityCard({ user, action, parentId }: { user: any, action: string, parentId?: string }) {
    return (
        <Link key={user._id} href={`/thread/${parentId}`}>
            <article className="activity-card">
                <Image
                    src={user.image}
                    alt="Profile picture"
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                />
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

    const { replies, likes } = await getActivity(userInfo._id);

    const hasReplies = replies.length > 0;
    const hasliked = likes.length > 0;

    return (
        <section>
            <h1 className="head-text mb-10">Activity</h1>

            <section className="mt-10 flex flex-col gap-5">
                {hasReplies ? (
                    replies.map((comment) => (
                        <ActivityCard
                            key={comment._id}
                            user={comment.author}
                            action="replied to your post"
                            parentId={comment.parentId}
                        />
                    ))
                ) : (
                    <p className="text-base-regular text-light-3">No comments yet</p>
                )}

                {hasliked ? (
                    likes.map((like) => {
                        return (
                            <ActivityCard
                                key={like._id}
                                user={like.likedUser}
                                action="liked your post"
                                parentId={like.likedPost._id}
                            />
                        )
                    }

                    )
                ) : (
                    <p className="text-base-regular text-light-3">No likes yet</p>
                )}
            </section>
        </section>
    );
}

export default Page;