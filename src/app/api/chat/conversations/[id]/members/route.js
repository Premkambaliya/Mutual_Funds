import { dbConnect } from "@/lib/dbConnect";
import Conversation from "@/models/conversation";
import jwt from "jsonwebtoken";

// Add member to group
export async function POST(req, { params }) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const conversationId = params.id;
    const { userId: newUserId } = await req.json();

    if (!newUserId) {
      return Response.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      type: "group",
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

    // Check if user is already a participant
    const existingParticipant = conversation.participants.find(
      p => p.user.toString() === newUserId
    );

    if (existingParticipant) {
      return Response.json(
        { message: "User is already a member of this group" },
        { status: 400 }
      );
    }

    // Add new participant
    conversation.participants.push({
      user: newUserId,
      role: "member",
    });

    await conversation.save();

    // Populate the updated conversation
    await conversation.populate([
      { path: "participants.user", select: "name email avatar" },
      { path: "createdBy", select: "name email avatar" },
    ]);

    return Response.json({
      message: "Member added successfully",
      conversation,
    });
  } catch (error) {
    console.error("Error adding member:", error);
    return Response.json(
      { message: "Error adding member", error: error.message },
      { status: 500 }
    );
  }
}

// Remove member from group
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
    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("memberId");

    if (!memberId) {
      return Response.json(
        { message: "Member ID is required" },
        { status: 400 }
      );
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      type: "group",
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

    // Remove the member
    conversation.participants = conversation.participants.filter(
      p => p.user.toString() !== memberId
    );

    // If no participants left, deactivate the conversation
    if (conversation.participants.length === 0) {
      conversation.isActive = false;
    }

    await conversation.save();

    // Populate the updated conversation
    await conversation.populate([
      { path: "participants.user", select: "name email avatar" },
      { path: "createdBy", select: "name email avatar" },
    ]);

    return Response.json({
      message: "Member removed successfully",
      conversation,
    });
  } catch (error) {
    console.error("Error removing member:", error);
    return Response.json(
      { message: "Error removing member", error: error.message },
      { status: 500 }
    );
  }
}
