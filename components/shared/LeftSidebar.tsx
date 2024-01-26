import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { LeftNav } from "./LeftNav";

async function LeftSidebar() {
    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);


    return (
        <section className="custom-scrollbar leftsidebar">

            <LeftNav currentUserId={userInfo._id} />

        </section>
    )
}


export default LeftSidebar;