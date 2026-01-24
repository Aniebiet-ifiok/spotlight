"use server"

import { prismaClient } from "@/lib/prismaClient";
import { currentUser } from "@clerk/nextjs/server";

export async function getAuthenticatedUser() {
  try {
    const user = await currentUser();

    if (!user) { 
      return { status: 403 };
    }

    // Check if user exists in your DB
    let userExists = await prismaClient.user.findUnique({
      where: { clerkId: user.id },
    });

    if (userExists) {
      // Update lastLoginAt whenever user logs in
      userExists = await prismaClient.user.update({
        where: { clerkId: user.id },
        data: { lastLoginAt: new Date() },
      });

      return { status: 200, user: userExists };
    }

    // Create new user if not exists
    const newUser = await prismaClient.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        name: `${user.firstName} ${user.lastName}`,
        profileImage: user.imageUrl,
        lastLoginAt: new Date(), // Set first login time
      },
    });

    return { status: 201, user: newUser };
  } catch (err) {
    console.error(err);
    return { status: 500, message: "Internal Server Error" };
  }
}
