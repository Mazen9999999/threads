"use server";

import mongoose, { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";

import Community from "../models/community.model"
import Thread from "../models/thread.model";
import User from "../models/user.model";

import { connectToDB } from "../mongoose";
import Like from "../models/like.model";

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
    });

  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

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
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // Find all threads authored by the user with the given userId
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
        },
      ],
    }).lean();

    // Sorting threads by createdAt field in descending order
    threads.threads.sort((a, b) => b.createdAt - a.createdAt);

    return threads;
  } catch (error) {
    console.error("Error fetching user threads:", error);
    throw error;
  }
}

// Almost similar to Thead (search + pagination) and Community (search + pagination)
export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the results.
    };

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    // Find all threads created by the user
    const userThreads = await Thread.find({ author: userId });

    // Collect all the child thread ids (replies) from the 'children' field of each user thread
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    // Find and return the child threads (replies) excluding the ones created by the same user
    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    })
      .populate({
        path: 'author',
        model: User,
        select: 'name image _id',
      })
      .sort({ createdAt: 'desc' });

    // Collect all the child thread ids (replies) from the 'children' field of each user thread
    const likesIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.likes);
    }, []);

    // Find and return the likes
    const likes = await Like.find({ _id: { $in: likesIds }, likedUser: { $ne: userId } })
      .populate('likedPost likedUser')
      .sort({ createdAt: 'desc' });

    // Combine and sort replies and likes
    const activities = [...replies, ...likes].sort((a, b) => b.createdAt - a.createdAt);

    return { activities };
  } catch (error: any) {
    console.error('Error fetching activities: ', error);
    throw error;
  }
}


// Update lastViewed when user views activities
export async function updateLastViewed(userId: string, path: string) {
  try {
    connectToDB();
    await User.findByIdAndUpdate(userId, { lastViewed: new Date() });
    revalidatePath(path);
  } catch (error) {
    console.error("Error updating lastViewed: ", error);
    throw error;
  }
}

export async function hasUnviewedActivities(userId: string) {
  try {
    connectToDB();

    // Find all threads created by the user
    const userThreads = await Thread.find({ author: userId });

    // Collect all the child thread ids (replies) from the 'children' field of each user thread
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    // Fetch the user's lastViewed timestamp
    const { lastViewed } = await User.findById(userId, 'lastViewed');

    // Find new replies (comments on your posts) based on the lastViewed timestamp
    const newReplies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
      createdAt: { $gt: lastViewed },
    });

    // Collect all the child thread ids (replies) from the 'children' field of each user thread
    const likesIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.likes);
    }, []);

    // Find new likes on your posts based on the lastViewed timestamp
    const newLikes = await Like.find({
      _id: { $in: likesIds },
      likedUser: { $ne: userId },
      createdAt: { $gt: lastViewed },
    });

    // Check if there are any new activities
    return newReplies.length + newLikes.length;
  } catch (error) {
    console.error('Error checking for unviewed activities:', error);
    throw error;
  }
}

export async function follow({ followedUserId, userId }: { followedUserId: string, userId: string }) {
  try {
    if (followedUserId === userId) {
      console.log('A user cannot follow themselves.');
      return;
    }

    connectToDB();

    await User.findByIdAndUpdate(
      followedUserId,
      { $addToSet: { followers: userId } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { following: followedUserId } },
      { new: true }
    )

  } catch (error) {
    console.error('Error to follow this user:', error);
  }
}

export async function unfollow({ followedUserId, userId }: { followedUserId: string, userId: string }) {
  try {
    connectToDB();

    if (followedUserId === userId) {
      return;
    }

    await User.findByIdAndUpdate(
      followedUserId,
      { $pull: { followers: userId } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      userId,
      { $pull: { following: followedUserId } },
      { new: true }
    )
  } catch (error) {
    console.error('Error to unfollow this user:', error);
  }
}


export async function calculateTotalLikes(userId: string): Promise<number> {
  try {
    await connectToDB();

    // Fetch posts that belong to the user and do not have a parent
    const posts = await Thread.find({ author: userId, parentId: null }).lean();

    if (!posts || posts.length === 0) {
      return 0;
    }

    // Calculate total likes from top-level posts only
    const totalLikes = posts.reduce((acc, post) => {
      const postLikes = Array.isArray(post.likes) ? post.likes.length : 0;
      return acc + postLikes;
    }, 0);

    return totalLikes;
  } catch (error) {
    console.error('Error calculating total likes:', error);
    throw error;
  }
} export async function getFollowing({ userId }: { userId: string; }) {
  try {
    connectToDB();
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User Not Found');
    }

    const following = await User.find({ _id: { $in: user.following } });
    const followingNumber = following.length;

    return { following, followingNumber };
  } catch (error) {
    console.error('Error in fetching users:', error);
    throw new Error('Error in fetching users');
  }
}
export async function getFollowers({ userId }: { userId: string; }) {
  try {
    connectToDB();
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User Not Found');
    }

    const followers = await User.find({ _id: { $in: user.followers } });
    const followersNumber = followers.length;

    return { followers, followersNumber };
  } catch (error) {
    console.error('Error in fetching users:', error);
    throw new Error('Error in fetching users');
  }
}
export async function getFollowersIds({ authorId }: { authorId: string; }) {
  try {
    connectToDB();

    const author = await User.findById(authorId);

    if (!author) {
      // Return an error response when the author is not found
      throw new Error('Author not found');
    }

    // Use reduce to accumulate followers IDs
    const followersIds = author.followers.reduce((acc, follower) => {
      acc.push(follower.toString());
      return acc;
    }, []);

    return followersIds;
  } catch (error) {
    console.error('Error fetching followers ids:', error);
    throw new Error('Internal Server Error'); // You can customize this error message
  }
}

export async function initializeTotalLikes() {
  await connectToDB();

  try {
    const users = await User.find();

    for (const user of users) {
      const userId = new mongoose.Types.ObjectId(user._id); // Cast user ID to ObjectId using 'new'
      const posts = await Thread.find({ author: userId, parentId: null });
      const totalLikes = posts.reduce((acc, post) => acc + (post.likes.length || 0), 0);

      await User.findByIdAndUpdate(userId, { totalLikes });
    }

    console.log('Total likes initialized for all users.');
  } catch (error) {
    console.error('Error initializing total likes:', error);
    throw error;
  }
}