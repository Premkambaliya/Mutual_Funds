import { dbConnect } from "@/lib/dbConnect";
import Conversation from "@/models/conversation";
import Message from "@/models/message";
import User from "@/models/user";
import jwt from "jsonwebtoken";

// Get all conversations for the authenticated user
export async function GET(req) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find conversations where the user is a participant
    const conversations = await Conversation.find({
      "participants.user": userId,
      isActive: true,
    })
      .populate("participants.user", "name email avatar")
      .populate("createdBy", "name email avatar")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 });

    // Format the conversations for the frontend
    const formattedConversations = conversations.map(conv => {
      const otherParticipants = conv.participants
        .filter(p => p.user._id.toString() !== userId)
        .map(p => p.user);

      return {
        _id: conv._id,
        type: conv.type,
        name: conv.type === "direct" 
          ? otherParticipants[0]?.name || "Unknown User"
          : conv.name,
        description: conv.description,
        participants: conv.participants,
        createdBy: conv.createdBy,
        lastMessage: conv.lastMessage,
        lastMessageAt: conv.lastMessageAt,
        createdAt: conv.createdAt,
        unreadCount: 0, // We'll implement this later
      };
    });

    return Response.json({ conversations: formattedConversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return Response.json(
      { message: "Error fetching conversations", error: error.message },
      { status: 500 }
    );
  }
}

// Create a new conversation (direct or group)
export async function POST(req) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { type, participantIds, name, description } = await req.json();

    if (!type || !participantIds || !Array.isArray(participantIds)) {
      return Response.json(
        { message: "Type and participant IDs are required" },
        { status: 400 }
      );
    }

    // For direct conversations, ensure only 2 participants
    if (type === "direct" && participantIds.length !== 1) {
      return Response.json(
        { message: "Direct conversations must have exactly 2 participants" },
        { status: 400 }
      );
    }

    // For group conversations, ensure at least 2 participants
    if (type === "group" && participantIds.length < 1) {
      return Response.json(
        { message: "Group conversations must have at least 2 participants" },
        { status: 400 }
      );
    }

    // Check if direct conversation already exists
    if (type === "direct") {
      const existingConversation = await Conversation.findOne({
        type: "direct",
        "participants.user": { $all: [userId, participantIds[0]] },
        isActive: true,
      });

      if (existingConversation) {
        return Response.json({
          message: "Direct conversation already exists",
          conversation: existingConversation,
        });
      }
    }

    // Create participants array
    const participants = [
      {
        user: userId,
        role: type === "group" ? "admin" : "member",
      },
      ...participantIds.map(id => ({
        user: id,
        role: "member",
      })),
    ];

    // Create the conversation
    const conversation = await Conversation.create({
      type,
      name: type === "group" ? name : undefined,
      description: type === "group" ? description : undefined,
      participants,
      createdBy: userId,
    });

    // Populate the conversation data
    await conversation.populate([
      { path: "participants.user", select: "name email avatar" },
      { path: "createdBy", select: "name email avatar" },
    ]);

    return Response.json({
      message: "Conversation created successfully",
      conversation,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return Response.json(
      { message: "Error creating conversation", error: error.message },
      { status: 500 }
    );
  }
}
