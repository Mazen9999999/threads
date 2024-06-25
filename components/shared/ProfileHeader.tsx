import Image from "next/image";
import { ProfileFollowButton } from "./ProfileFollowButton";
import { getFollowers } from "@/lib/actions/user.action";
import { ProfileDetails } from "./ProfileDetails";

interface Props {
    accountId: string;
    authUserId: string;
    name: string;
    username: string;
    imgUrl: string;
    bio: string;
    authorId: string;
    type?: 'User' | 'Community';
}

const ProfileHeader = async ({ accountId, authUserId, authorId, name, username, imgUrl, bio, type }: Props) => {

    return (
        <div className="flex w-full flex-col items-center justify-center">
            <div className="flex items-center justify-between">
                <div className="flex flex-col items-center gap-3">
                    <div className="relative h-24 w-24 object-cover">
                        <Image
                            src={imgUrl}
                            alt="Profile Image"
                            fill
                            className="rounded-full object-cover shadow-2xl"
                        />
                    </div>

                    <div className="flex-1">
                        <h2 className="text-heading3-bold text-center text-light-1">{name}</h2>
                        <p className="text-base-medium text-center text-gray-1">@{username}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center text-light-1 mt-6 gap-3 -ml-5">

                <ProfileDetails userId={JSON.stringify(authorId)} />
            </div>

            <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>

            <ProfileFollowButton authorId={JSON.stringify(authorId)} userId={JSON.stringify(authUserId)} />

            <div className="mt-12 h-0.5 w-full bg-dark-3" />
        </div>
    )
}

export default ProfileHeader;