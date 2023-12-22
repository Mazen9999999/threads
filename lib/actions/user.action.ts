"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import { SortOrder } from "mongoose";
import { FilterQuery } from "mongoose";
import { Limelight } from "next/font/google";
import { AnyParams } from "uploadthing/server";

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
}

export async function updateUser({
    userId,
    path,
    username,
    name,
    bio,
    image,
}: Params): Promise<void> {
    connectToDB();

    try {
        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true
            },
            { upsert: true }
        );

        if (path === '/profile/edit') {
            revalidatePath(path);
        }
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`)
    }
}

export async function fetchUser(userId: string) {
    try {
        connectToDB();

        return await User.findOne({ id: userId })
        // .populate({
        //     path: "communities",
        //     model: "communinty"
        // })
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`)
    }
}

export async function fetchUserPosts(userId: string) {
    try {
        connectToDB();

        // Find all threads authored by user with the given userId
        const threads = await User.findOne({ id: userId })
            .populate({
                path: 'threads',
                model: Thread,
                populate: {
                    path: "children",
                    model: Thread,
                    populate: {
                        path: "author",
                        model: User,
                        select: 'name image id'
                    }
                }
            })

        return threads;
    } catch (error: any) {
        throw new Error(`Failed to fetch user posts: ${error.message}`)
    }
}

export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc"
}: {
    userId: string;
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;
}) {
    try {
        connectToDB();

        // Calculate the number of items to skip based on the page number and page size
        const skipAmount = (pageNumber - 1) * pageSize;

        // Create a regular expression for case-insensitive searching
        const regex = new RegExp(searchString, "i");

        // Define the initial query to find users excluding the specified userId
        const query: FilterQuery<typeof User> = {
            id: { $ne: userId }
        }

        // If a search string is provided, add conditions for username and name
        if (searchString.trim() !== '') {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } }
            ]
        }

        // Define the sorting options based on the sortBy parameter
        const sortOptions = { createdAt: sortBy };

        // Execute the query to find users, sort them, skip specified items, and limit the results
        const usersQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize)

        // Count the total number of users that match the query (excluding skipped items)
        const totalUsersCount = await User.countDocuments(query);

        // Execute the users query to retrieve the actual user data
        const users = await usersQuery.exec();

        // Determine if there are more users beyond the current page
        const isNext = totalUsersCount > skipAmount + users.length;

        // Return the retrieved users and whether there are more users

        return { users, isNext };
    } catch (error: any) {
        throw new Error(`Failed to fetch users: ${error.message}`)
    }
}

export async function getActivity(userId: string) {
    try {
        connectToDB();

        // find all threads created by the user
        const userThreads = await Thread.find({ author: userId });

        // Collect all the child thread ids (comments) from the 'children' field
        const childThreadIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children);
        }, [])

        const replies = await Thread.find({
            _id: { $in: childThreadIds },
            author: { $ne: userId }
        }).populate({
            path: "author",
            model: User,
            select: "name image _id"
        })

        return replies;
    } catch (error: any) {
        throw new Error(`Failed to fetch activity: ${error.message}`);
    }
}