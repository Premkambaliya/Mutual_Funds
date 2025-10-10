import { dbConnect } from "@/lib/dbConnect";
import User from "../../../../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json(
        { message: "User not found" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return Response.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      { message: "Error logging in", error: error.message },
      { status: 500 }
    );
  }
}
 