import UserCard from "@/components/cards/UserCard";
import { getFollowers } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.action";

async function Page({ params }: { params: { id: string } }) {

    const userInfo = await fetchUser(params.id);
    const result = await getFollowers({userId: userInfo._id})
    return (
        <>
        <h5 className="text-light-2">
           {userInfo.username}'s followers
        </h5>
        <div className="mt-14 flex flex-col gap-9">
            {result.followers.map((follower: any) => (
              <UserCard 
              key={follower.id}
              id={follower.id}
              name={follower.name}
              username={follower.username}
              imgUrl={follower.image}
              personType='User'
              />
            )) }
        </div>
        </>
    )
}

export default Page;