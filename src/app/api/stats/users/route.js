import { dbConnect } from "@/lib/dbConnect"; // Your MongoDB connection utility
import User from "../../../../models/user"; // Your User model
import { NextResponse } from "next/server"; // Use NextResponse for Next.js API routes

export async function GET() {
  try {
    await dbConnect(); // Connect to MongoDB
    const count = await User.countDocuments({}); // Count all users in the User collection
    return NextResponse.json(
      { 
        count: count,
        message: "User count fetched successfully"
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user count:", error);
    return NextResponse.json(
      { 
        count: 0,
        message: "Error fetching user count"
      }, 
      { status: 500 }
    );
  }
}