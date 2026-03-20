"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * CREATE: Adds a new user to the database
 */
export const addUser = async (name: string, email: string) => {
  try {
    const res = await prisma.user.create({
      data: { name, email },
    });
    // Refresh the cache for the current path to show new data
    revalidatePath("/");
    return { success: true, data: res };
  } catch (error) {
    console.error("Create Error:", error);
    return { success: false, error: "Email already exists or Database error." };
  }
};

/**
 * READ: Fetches all users from the database
 */
export const getAllUser = async () => {
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" }, // Show newest users first
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};

/**
 * UPDATE: Updates the name of an existing user
 */
export const updateUser = async (id: string, name: string) => {
  try {
    const res = await prisma.user.update({
      where: { id },
      data: { name },
    });
    revalidatePath("/");
    return { success: true, data: res };
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false, error: "Failed to update user." };
  }
};

/**
 * DELETE: Removes a user by ID
 */
export const deleteUser = async (id: string) => {
  try {
    await prisma.user.delete({
      where: { id },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, error: "Failed to delete user." };
  }
};