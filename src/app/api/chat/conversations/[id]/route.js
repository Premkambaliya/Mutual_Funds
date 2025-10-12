import { dbConnect } from "@/lib/dbConnect";
import Conversation from "@/models/conversation";
import Message from "@/models/message";
import User from "@/models/user";
import jwt from "jsonwebtoken";

// Get a specific conversation by ID
export async function GET(req, { params }) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const conversationId = params.id;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      "participants.user": userId,
      isActive: true,
    })
      .populate("participants.user", "name email avatar")
      .populate("createdBy", "name email avatar")
      .populate("lastMessage");

    if (!conversation) {
      return Response.json(
        { message: "Conversation not found" },
        { status: 404 }
      );
    }

    // Get messages for this conversation
    const messages = await Message.find({
      conversation: conversationId,
      isDeleted: false,
    })
      .populate("sender", "name email avatar")
      .populate("replyTo")
      .sort({ createdAt: 1 });

    // Mark messages as read for this user
    await Message.updateMany(
      {
        conversation: conversationId,
        "readBy.user": { $ne: userId },
        sender: { $ne: userId },
      },
      {
        $push: {
          readBy: {
            user: userId,
            readAt: new Date(),
          },
        },
      }
    );

    return Response.json({
      conversation,
      messages,
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return Response.json(
      { message: "Error fetching conversation", error: error.message },
      { status: 500 }
    );
  }
}

// Update a conversation (for group name, description, etc.)
export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const conversationId = params.id;
    const { name, description } = await req.json();

    const conversation = await Conversation.findOne({
      _id: conversationId,
      "participants.user": userId,
      "participants.role": "admin",
      isActive: true,
    });

    if (!conversation) {
      return Response.json(
        { message: "Conversation not found or insufficient permissions" },
        { status: 404 }
      );
    }

    // Update conversation
    if (name !== undefined) conversation.name = name;
    if (description !== undefined) conversation.description = description;

    await conversation.save();

    return Response.json({
      message: "Conversation updated successfully",
      conversation,
    });
  } catch (error) {
    console.error("Error updating conversation:", error);
    return Response.json(
      { message: "Error updating conversation", error: error.message },
      { status: 500 }
    );
  }
}

// Delete/leave a conversation
export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const conversationId = params.id;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      "participants.user": userId,
      isActive: true,
    });

    if (!conversation) {
      return Response.json(
        { message: "Conversation not found" },
        { status: 404 }
      );
    }

    // If it's a direct conversation, deactivate it
    if (conversation.type === "direct") {
      conversation.isActive = false;
      await conversation.save();
    } else {
      // For group conversations, remove the user from participants
      conversation.participants = conversation.participants.filter(
        p => p.user.toString() !== userId
      );
      await conversation.save();
    }

    return Response.json({
      message: "Left conversation successfully",
    });
  } catch (error) {
    console.error("Error leaving conversation:", error);
    return Response.json(
      { message: "Error leaving conversation", error: error.message },
      { status: 500 }
    );
  }
}
