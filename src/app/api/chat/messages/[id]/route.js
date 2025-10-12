import { dbConnect } from "@/lib/dbConnect";
import Message from "@/models/message";
import Conversation from "@/models/conversation";
import jwt from "jsonwebtoken";

// Get a specific message
export async function GET(req, { params }) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const messageId = params.id;

    const message = await Message.findOne({
      _id: messageId,
      isDeleted: false,
    })
      .populate("sender", "name email avatar")
      .populate("replyTo")
      .populate("conversation");

    if (!message) {
      return Response.json(
        { message: "Message not found" },
        { status: 404 }
      );
    }

    // Verify user is participant in the conversation
    const conversation = await Conversation.findOne({
      _id: message.conversation._id,
      "participants.user": userId,
      isActive: true,
    });

    if (!conversation) {
      return Response.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    return Response.json({ message });
  } catch (error) {
    console.error("Error fetching message:", error);
    return Response.json(
      { message: "Error fetching message", error: error.message },
      { status: 500 }
    );
  }
}

// Edit a message
export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const messageId = params.id;
    const { content } = await req.json();

    if (!content) {
      return Response.json(
        { message: "Content is required" },
        { status: 400 }
      );
    }

    const message = await Message.findOne({
      _id: messageId,
      sender: userId,
      isDeleted: false,
    });

    if (!message) {
      return Response.json(
        { message: "Message not found or you don't have permission to edit it" },
        { status: 404 }
      );
    }

    // Update message
    message.content = content.trim();
    message.edited = true;
    message.editedAt = new Date();
    await message.save();

    // Populate the updated message
    await message.populate([
      { path: "sender", select: "name email avatar" },
      { path: "replyTo" },
    ]);

    return Response.json({
      message: "Message updated successfully",
      message: message,
    });
  } catch (error) {
    console.error("Error updating message:", error);
    return Response.json(
      { message: "Error updating message", error: error.message },
      { status: 500 }
    );
  }
}

// Delete a message
export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const messageId = params.id;

    const message = await Message.findOne({
      _id: messageId,
      sender: userId,
      isDeleted: false,
    });

    if (!message) {
      return Response.json(
        { message: "Message not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    // Soft delete the message
    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    return Response.json({
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json(
      { message: "Error deleting message", error: error.message },
      { status: 500 }
    );
  }
}
