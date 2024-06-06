"use client"

import UserCard from "@/components/cards/UserCard";
import { fetchUsers } from "@/lib/actions/user.action";
import { useState } from "react";

export const SearchUsers = ({ userId, allUsers }: any) => {
    const [search, setSearch] = useState("");
    const [result, setResult] = useState(allUsers);


    const handleSearch = async (e: any) => {
        setSearch(e.target.value)

        // Fetch Users
        const data = await fetchUsers({
            userId: userId,
            searchString: search,
            pageNumber: 1,
            pageSize: 25,
        });
        setResult(data);

    }

    return (
        <>
            <input className="bg-dark-2 px-7 py-2 rounded-2xl border border-light-4 text-light-2" type="text" placeholder="Search for a user" onChange={handleSearch} />
            <div className="mt-14 flex flex-col gap-9">
                {result?.users?.length === 0 ? (
                    <p className="no-result">No users</p>
                ) : (
                    <>
                        {result?.users?.map((person: any) => (
                            <UserCard
                                key={person.id}
                                id={person.id}
                                name={person.name}
                                username={person.username}
                                imgUrl={person.image}
                                personType='User'
                            />
                        ))}
                    </>
                )}
            </div>
        </>
    )
}