import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return Response.json(
        { message: "Authorization token required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    return Response.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return Response.json(
      { message: "Error fetching profile", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return Response.json(
        { message: "Authorization token required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, avatar, mobileNumber, panNumber, dateOfBirth, address } = await req.json();

    const user = await User.findById(decoded.id);
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    // Update only provided fields
    if (name !== undefined) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (mobileNumber !== undefined) user.mobileNumber = mobileNumber;
    if (panNumber !== undefined) user.panNumber = panNumber;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    if (address !== undefined) user.address = address;

    await user.save();

    const updatedUser = await User.findById(decoded.id).select("-password");

    return Response.json(
      { message: "Profile updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return Response.json(
      { message: "Error updating profile", error: error.message },
      { status: 500 }
    );
  }
} 