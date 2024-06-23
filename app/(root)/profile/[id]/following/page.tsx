import UserCard from "@/components/cards/UserCard";
import { getFollowers } from "@/lib/actions/user.action";
import { getFollowing } from "@/lib/actions/user.action";
import { fetchUser } from "@/lib/actions/user.action";

async function Page({ params }: { params: { id: string } }) {

    const userInfo = await fetchUser(params.id);
    const result = await getFollowing({ userId: userInfo._id })
    return (
        <>
            <h5 className="text-light-2 text-heading4-medium">
                <span className="text-gray-1">{userInfo.username}</span> following list
            </h5>
            <div className="mt-14 flex flex-col gap-9">
                {result.following.map((following: any) => (
                    <UserCard
                        key={following.id}
                        id={following.id}
                        name={following.name}
                        username={following.username}
                        imgUrl={following.image}
                        personType='User'
                    />
                ))}
            </div>
        </>
    )
}

export default Page;