import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ActionsMenu } from "./ActionsMenu";
import { DeleteButton } from "./DeleteButton";
import { LikeButton } from "./LikeButton";
import { fetchUser } from "@/lib/actions/user.action";
import { fetchThreadById } from "@/lib/actions/thread.actions";

interface Props {
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: string;
    image?: string;
    author: {
        name: string;
        image: string;
        id: string;
    }
    community: {
        id: string;
        name: string;
        image: string;
    } | null;
    createdAt: string;
    comments: {
        author: {
            image: string;
        }
    }[]
    isComment?: boolean;
}

const ThreadCard = async ({
    id,
    currentUserId,
    parentId,
    content,
    image,
    author,
    community,
    createdAt,
    comments,
    isComment,
}: Props) => {
    const userInfo = await fetchUser(currentUserId)
    const post = await fetchThreadById(id)

    return (
        <article className={`flex w-full flex-col relative rounded-xl ${isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'} ${ image && "md:pb-16"}`}>
            <div className="flex items-start justify-between relative">
                <div className="flex w-full flex-1 flex-row gap-4">
                    <div className="flex flex-col items-center">
                        <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
                            <Image
                                src={author.image}
                                alt={"profile image"}
                                fill
                                className="cursor-pointer rounded-full "
                            />
                        </Link>

                        <div className="thread-card_bar" />
                    </div>

                    <div className="flex w-full flex-col">
                        <Link href={`/profile/${author.id}`} className="w-fit">
                            <h4 className="cursor-pointer text-base-semibold text-light-1">{author.name}</h4>
                        </Link>

                        <p className="mt-2 text-small-regular text-light-2">{content}</p>


                        <div className={`${image && "xs:h-80 md:h-96 max-w-4xl md:mb-4"} mt-5 flex flex-col gap-3`}>

                            {image ? (
                                <Image
                                    src={image}
                                    alt="post image"
                                    width={450}
                                    height={500}
                                    className="w-full h-full rounded-lg mt-1"
                                />
                            ) : null}


                            <div className={`flex relative gap-3.5 `}>

                                <LikeButton id={JSON.stringify(id)} currentUserId={JSON.stringify(userInfo._id)} post={JSON.stringify(post)} />

                                <Link className="flex flex-col gap-1.5 items-center" href={`/thread/${id}`}>
                                    <Image
                                        src={"/assets/reply.svg"}
                                        alt="comment"
                                        width={24}
                                        height={24}
                                        className="cursor-pointer object-contain"
                                    />
                                    <span className="text-light-2 text-tiny-medium"> {comments?.length || 0} </span>
                                </Link>
                                <div className="flex flex-col gap-1.5 items-center">

                                    <Image
                                        src={"/assets/repost.svg"}
                                        alt="repost"
                                        width={24}
                                        height={24}
                                        className="cursor-pointer object-contain"
                                    />
                                    <span className="text-light-2 text-tiny-medium"> 0 </span>

                                </div>

                                {author.id === currentUserId && (
                                    <DeleteButton postId={id} />
                                )}

                            </div>
                            {isComment && comments.length > 0 && (
                                <Link href={`/thread/${id}`}>
                                    <p className="mt-1 text-subtle-medium text-gray-1">{comments.length} replies</p>
                                </Link>
                            )}


                        </div>
                    </div>
                </div>

            </div>


            {author.id === currentUserId && (
                <ActionsMenu />
            )}


            {!isComment && community && (
                <Link href={`/communities/${community.id}`} className="mt-5 flex items-center">
                    <p className='text-subtle-medium text-gray-1'>
                        {formatDateString(createdAt)}
                        - {" "} {community.name} Community
                    </p>

                    <Image
                        src={community.image}
                        alt={community.name}
                        width={14}
                        height={14}
                        className="ml-1 rounded-full object-cover"
                    />
                </Link>
            )}
        </article>
    )
}

export default ThreadCard;