import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user";
import jwt from "jsonwebtoken";

// Get all users for starting conversations
export async function GET(req) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    // Build search query
    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
          _id: { $ne: userId }, // Exclude current user
        }
      : {
          _id: { $ne: userId }, // Exclude current user
        };

    const users = await User.find(searchQuery)
      .select("name email avatar")
      .limit(20)
      .sort({ name: 1 });

    return Response.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return Response.json(
      { message: "Error fetching users", error: error.message },
      { status: 500 }
    );
  }
}
