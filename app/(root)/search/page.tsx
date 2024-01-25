import { fetchUser, fetchUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { SearchUsers } from "./SearchUsers";

async function Page() {
    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");


    // Fetch All Users
    const result = await fetchUsers({
        userId: user.id,
        searchString: '',
        pageNumber: 1,
        pageSize: 25
    });

    return (
        <section>
            <h1 className="head-text mb-10">Search</h1>

            <SearchUsers userId={user.id} allUsers={result} />


        </section>
    )
}

export default Page;