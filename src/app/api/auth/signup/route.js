// import { dbConnect } from "@/lib/dbConnect";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

// export async function POST(req) {
//   try {
//     await dbConnect();

//     const { name, email, password } = await req.json();

//     if (!name || !email || !password) {
//       return Response.json(
//         { message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return Response.json(
//         { message: "User already exists" },
//         { status: 400 }
//       );
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     return Response.json(
//       { message: "User registered successfully", user },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Register error:", error);
//     return Response.json(
//       { message: "Error registering user", error: error.message },
//       { status: 500 }
//     );
//   }
// }
    




import { dbConnect } from "@/lib/dbConnect";
import User from "../../../../models/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return Response.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar: null,
      mobileNumber: null,
      panNumber: null,
      dateOfBirth: null,
      address: null,
    });

    // Return the full user object excluding password
    return Response.json(
      {
        message: "User registered successfully",
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          mobileNumber: user.mobileNumber,
          panNumber: user.panNumber,
          dateOfBirth: user.dateOfBirth,
          address: user.address,
          _id: user._id,
          __v: user.__v,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return Response.json(
      { message: "Error registering user", error: error.message },
      { status: 500 }
    );
  }
} 