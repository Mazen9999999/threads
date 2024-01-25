import { fetchUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import UserCard from "../cards/UserCard";

async function RightSidebar() {
    const user = await currentUser();

    if (!user) return null;

    // Fetch Users
    const result = await fetchUsers({
        userId: user.id,
        searchString: '',
        pageNumber: 1,
        pageSize: 25
    });

    return (
        <section className="custom-scrollbar rightsidebar">
            <div className="flex flex-1 flex-col justify-start">
                <h3 className="text-heading4-medium text-light-1">Suggested Communities</h3>
            </div>
            <div className="flex flex-1 flex-col justify-start">
                <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>

                <div className="mt-7 flex flex-col gap-5">
                {result.users.map((person) => (
                    <UserCard
                        key={person.id}
                        id={person.id}
                        name={person.name}
                        username={person.username}
                        imgUrl={person.image}
                        personType='User'
                    />
                ))}
                </div>
            </div>
        </section>
    )
}

export default RightSidebar;