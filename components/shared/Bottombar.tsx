import { currentUser } from "@clerk/nextjs";
import { BottomNav } from "./BottomNav";
import { fetchUser } from "@/lib/actions/user.action";

async function Bottombar() {
   
    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);

    return (
        <section className="bottombar">
          <BottomNav userId={userInfo._id} />
        </section>
    )
}

export default Bottombar;