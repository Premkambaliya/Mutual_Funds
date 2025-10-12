import { dbConnect } from "@/lib/dbConnect";
import Message from "@/models/message";
import Conversation from "@/models/conversation";
import User from "@/models/user";
import jwt from "jsonwebtoken";

// Get messages for a conversation
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
    const conversationId = searchParams.get("conversationId");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 50;
    const skip = (page - 1) * limit;

    if (!conversationId) {
      return Response.json(
        { message: "Conversation ID is required" },
        { status: 400 }
      );
    }

    // Verify user is participant in the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      "participants.user": userId,
      isActive: true,
    });

    if (!conversation) {
      return Response.json(
        { message: "Conversation not found or access denied" },
        { status: 404 }
      );
    }

    // Get messages
    const messages = await Message.find({
      conversation: conversationId,
      isDeleted: false,
    })
      .populate("sender", "name email avatar")
      .populate("replyTo")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

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
      messages: messages.reverse(), // Reverse to get chronological order
      hasMore: messages.length === limit,
      page,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json(
      { message: "Error fetching messages", error: error.message },
      { status: 500 }
    );
  }
}

// Send a new message
export async function POST(req) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { conversationId, content, replyTo } = await req.json();

    if (!conversationId || !content) {
      return Response.json(
        { message: "Conversation ID and content are required" },
        { status: 400 }
      );
    }

    // Verify user is participant in the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      "participants.user": userId,
      isActive: true,
    });

    if (!conversation) {
      return Response.json(
        { message: "Conversation not found or access denied" },
        { status: 404 }
      );
    }

    // Create the message
    const message = await Message.create({
      conversation: conversationId,
      sender: userId,
      content: content.trim(),
      replyTo: replyTo || null,
    });

    // Populate the message data
    await message.populate([
      { path: "sender", select: "name email avatar" },
      { path: "replyTo" },
    ]);

    // Update conversation's last message
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    return Response.json({
      message: "Message sent successfully",
      message: message,
    }, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return Response.json(
      { message: "Error sending message", error: error.message },
      { status: 500 }
    );
  }
}
