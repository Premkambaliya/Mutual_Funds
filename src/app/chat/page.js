// "use client";
// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { 
//   MessageCircle, 
//   Plus, 
//   Users, 
//   Search, 
//   Send, 
//   MoreVertical,
//   Edit,
//   Trash2,
//   Smile
// } from "lucide-react";

// export default function ChatPage() {
//   const [user, setUser] = useState(null);
//   const [conversations, setConversations] = useState([]);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [messageLoading, setMessageLoading] = useState(false);
//   const [showNewChat, setShowNewChat] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [users, setUsers] = useState([]);
//   const [showUsers, setShowUsers] = useState(false);
//   const messagesEndRef = useRef(null);
//   const router = useRouter();
//   const pollIntervalRef = useRef(null);

//   // Scroll to bottom of messages
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Real-time message polling
//   useEffect(() => {
//     if (selectedConversation) {
//       // Start polling for new messages
//       pollIntervalRef.current = setInterval(async () => {
//         try {
//           const token = localStorage.getItem("token");
//           const response = await fetch(
//             `/api/chat/conversations/${selectedConversation._id}`,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );

//           if (response.ok) {
//             const data = await response.json();
//             setMessages(data.messages);
//             setSelectedConversation(data.conversation);
//           }
//         } catch (error) {
//           console.error("Error polling messages:", error);
//         }
//       }, 2000); // Poll every 2 seconds

//       return () => {
//         if (pollIntervalRef.current) {
//           clearInterval(pollIntervalRef.current);
//         }
//       };
//     }
//   }, [selectedConversation]);

//   // Check authentication and fetch user data
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/login");
//       return;
//     }

//     const fetchUserData = async () => {
//       try {
//         const response = await fetch("/api/profile", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           router.push("/login");
//           return;
//         }

//         const data = await response.json();
//         setUser(data.user);
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         router.push("/login");
//       }
//     };

//     fetchUserData();
//   }, [router]);

//   // Fetch conversations
//   const fetchConversations = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("/api/chat/conversations", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setConversations(data.conversations);
//       }
//     } catch (error) {
//       console.error("Error fetching conversations:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       fetchConversations();
      
//       // Start polling for conversation updates
//       const conversationPollInterval = setInterval(() => {
//         fetchConversations();
//       }, 5000); // Poll every 5 seconds

//       return () => {
//         clearInterval(conversationPollInterval);
//       };
//     }
//   }, [user]);

//   // Fetch messages for selected conversation
//   const fetchMessages = async (conversationId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(
//         `/api/chat/conversations/${conversationId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         setMessages(data.messages);
//         setSelectedConversation(data.conversation);
//       }
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     }
//   };

//   // Send message
//   const sendMessage = async () => {
//     if (!newMessage.trim() || !selectedConversation) return;

//     const messageContent = newMessage.trim();
//     setNewMessage("");
//     setMessageLoading(true);

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("/api/chat/messages", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           conversationId: selectedConversation._id,
//           content: messageContent,
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setMessages(prev => [...prev, data.message]);
//         fetchConversations(); // Refresh conversations to update last message
//       }
//     } catch (error) {
//       console.error("Error sending message:", error);
//     } finally {
//       setMessageLoading(false);
//     }
//   };

//   // Handle enter key press
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   // Search users for new chat
//   const searchUsers = async (query) => {
//     if (!query.trim()) {
//       setUsers([]);
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`/api/chat/users?search=${encodeURIComponent(query)}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setUsers(data.users);
//       }
//     } catch (error) {
//       console.error("Error searching users:", error);
//     }
//   };

//   // Start new conversation
//   const startConversation = async (userId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("/api/chat/conversations", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           type: "direct",
//           participantIds: [userId],
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         const conversation = data.conversation;
//         setSelectedConversation(conversation);
//         setMessages([]);
//         fetchConversations();
//         setShowNewChat(false);
//         setSearchQuery("");
//         setUsers([]);
//       }
//     } catch (error) {
//       console.error("Error starting conversation:", error);
//     }
//   };

//   // Create group conversation
//   const createGroup = async () => {
//     const groupName = prompt("Enter group name:");
//     if (!groupName) return;

//     const description = prompt("Enter group description (optional):") || "";

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("/api/chat/conversations", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           type: "group",
//           participantIds: users.map(u => u._id),
//           name: groupName,
//           description: description,
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         const conversation = data.conversation;
//         setSelectedConversation(conversation);
//         setMessages([]);
//         fetchConversations();
//         setShowNewChat(false);
//         setSearchQuery("");
//         setUsers([]);
//       }
//     } catch (error) {
//       console.error("Error creating group:", error);
//     }
//   };

//   // Add member to group
//   const addMemberToGroup = async () => {
//     if (!selectedConversation || selectedConversation.type !== "group") return;

//     const searchTerm = prompt("Enter user email or name to add:");
//     if (!searchTerm) return;

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`/api/chat/users?search=${encodeURIComponent(searchTerm)}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         const foundUsers = data.users.filter(u => 
//           !selectedConversation.participants.some(p => p.user._id === u._id)
//         );

//         if (foundUsers.length === 0) {
//           alert("No users found or user already in group");
//           return;
//         }

//         const userToAdd = foundUsers[0];
//         if (confirm(`Add ${userToAdd.name} to the group?`)) {
//           try {
//             const addResponse = await fetch(`/api/chat/conversations/${selectedConversation._id}/members`, {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//               },
//               body: JSON.stringify({
//                 userId: userToAdd._id,
//               }),
//             });

//             if (addResponse.ok) {
//               alert("User added to group successfully!");
//               fetchMessages(selectedConversation._id);
//               fetchConversations();
//             } else {
//               const errorData = await addResponse.json();
//               alert(`Error: ${errorData.message}`);
//             }
//           } catch (error) {
//             console.error("Error adding member:", error);
//             alert("Error adding member to group");
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error adding member:", error);
//     }
//   };

//   // Remove member from group
//   const removeMemberFromGroup = async (userId) => {
//     if (!selectedConversation || selectedConversation.type !== "group") return;
    
//     if (confirm("Are you sure you want to remove this member from the group?")) {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(`/api/chat/conversations/${selectedConversation._id}/members?memberId=${userId}`, {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           alert("Member removed from group successfully!");
//           fetchMessages(selectedConversation._id);
//           fetchConversations();
//         } else {
//           const errorData = await response.json();
//           alert(`Error: ${errorData.message}`);
//         }
//       } catch (error) {
//         console.error("Error removing member:", error);
//         alert("Error removing member from group");
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading chat...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto h-screen flex">
//         {/* Sidebar */}
//         <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
//           {/* Header */}
//           <div className="p-4 border-b border-gray-200">
//             <div className="flex items-center justify-between mb-4">
//               <h1 className="text-xl font-bold text-gray-900">Chats</h1>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setShowNewChat(true)}
//                   className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
//                 >
//                   <Plus size={20} />
//                 </button>
//                 <button
//                   onClick={() => setShowUsers(true)}
//                   className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
//                 >
//                   <Users size={20} />
//                 </button>
//               </div>
//             </div>
            
//             {/* Search */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//               <input
//                 type="text"
//                 placeholder="Search conversations..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Conversations List */}
//           <div className="flex-1 overflow-y-auto">
//             {conversations.length === 0 ? (
//               <div className="p-4 text-center text-gray-500">
//                 <MessageCircle className="mx-auto mb-2" size={48} />
//                 <p>No conversations yet</p>
//                 <p className="text-sm">Start a new chat to begin!</p>
//               </div>
//             ) : (
//               <div className="space-y-1">
//                 {conversations.map((conversation) => (
//                   <div
//                     key={conversation._id}
//                     onClick={() => fetchMessages(conversation._id)}
//                     className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
//                       selectedConversation?._id === conversation._id
//                         ? "bg-emerald-50 border-r-2 border-emerald-600"
//                         : ""
//                     }`}
//                   >
//                     <div className="flex items-center space-x-3">
//                       <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
//                         {conversation.type === "direct"
//                           ? conversation.participants
//                               .find(p => p.user._id !== user?._id)
//                               ?.user?.name?.charAt(0) || "U"
//                           : conversation.name?.charAt(0) || "G"}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="font-medium text-gray-900 truncate">
//                           {conversation.type === "direct"
//                             ? conversation.participants
//                                 .find(p => p.user._id !== user?._id)
//                                 ?.user?.name || "Unknown User"
//                             : conversation.name}
//                         </p>
//                         <p className="text-sm text-gray-500 truncate">
//                           {conversation.lastMessage?.content || "No messages yet"}
//                         </p>
//                       </div>
//                       <div className="text-xs text-gray-400">
//                         {conversation.lastMessageAt
//                           ? new Date(conversation.lastMessageAt).toLocaleDateString()
//                           : ""}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Chat Area */}
//         <div className="flex-1 flex flex-col">
//           {selectedConversation ? (
//             <>
//               {/* Chat Header */}
//               <div className="p-4 border-b border-gray-200 bg-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
//                       {selectedConversation.type === "direct"
//                         ? selectedConversation.participants
//                             .find(p => p.user._id !== user?._id)
//                             ?.user?.name?.charAt(0) || "U"
//                         : selectedConversation.name?.charAt(0) || "G"}
//                     </div>
//                     <div>
//                       <h2 className="font-semibold text-gray-900">
//                         {selectedConversation.type === "direct"
//                           ? selectedConversation.participants
//                               .find(p => p.user._id !== user?._id)
//                               ?.user?.name || "Unknown User"
//                           : selectedConversation.name}
//                       </h2>
//                       <p className="text-sm text-gray-500">
//                         {selectedConversation.type === "direct" ? "Online" : `${selectedConversation.participants.length} members`}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     {selectedConversation.type === "group" && user?._id === selectedConversation.createdBy._id && (
//                       <>
//                         <button
//                           onClick={addMemberToGroup}
//                           className="p-2 text-gray-400 hover:text-gray-600"
//                           title="Add member"
//                         >
//                           <Plus size={20} />
//                         </button>
//                         <button
//                           onClick={() => setShowUsers(true)}
//                           className="p-2 text-gray-400 hover:text-gray-600"
//                           title="View members"
//                         >
//                           <Users size={20} />
//                         </button>
//                       </>
//                     )}
//                     <button className="p-2 text-gray-400 hover:text-gray-600">
//                       <MoreVertical size={20} />
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Messages */}
//               <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                 {messages.length === 0 ? (
//                   <div className="text-center text-gray-500 py-8">
//                     <MessageCircle className="mx-auto mb-2" size={48} />
//                     <p>No messages yet</p>
//                     <p className="text-sm">Start the conversation!</p>
//                   </div>
//                 ) : (
//                   messages.map((message) => (
//                     <div
//                       key={message._id}
//                       className={`flex ${
//                         message.sender._id === user?._id ? "justify-end" : "justify-start"
//                       }`}
//                     >
//                       <div
//                         className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
//                           message.sender._id === user?._id
//                             ? "bg-emerald-600 text-white"
//                             : "bg-white border border-gray-200 text-gray-900"
//                         }`}
//                       >
//                         <p className="text-sm">{message.content}</p>
//                         <p className={`text-xs mt-1 ${
//                           message.sender._id === user?._id
//                             ? "text-emerald-100"
//                             : "text-gray-500"
//                         }`}>
//                           {new Date(message.createdAt).toLocaleTimeString([], {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })}
//                         </p>
//                       </div>
//                     </div>
//                   ))
//                 )}
//                 <div ref={messagesEndRef} />
//               </div>

//               {/* Message Input */}
//               <div className="p-4 border-t border-gray-200 bg-white">
//                 <div className="flex space-x-2">
//                   <div className="flex-1 relative">
//                     <input
//                       type="text"
//                       placeholder="Type a message..."
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
//                       value={newMessage}
//                       onChange={(e) => setNewMessage(e.target.value)}
//                       onKeyPress={handleKeyPress}
//                       disabled={messageLoading}
//                     />
//                   </div>
//                   <button
//                     onClick={sendMessage}
//                     disabled={!newMessage.trim() || messageLoading}
//                     className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <Send size={20} />
//                   </button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="flex-1 flex items-center justify-center">
//               <div className="text-center text-gray-500">
//                 <MessageCircle className="mx-auto mb-4" size={64} />
//                 <h2 className="text-xl font-semibold mb-2">Welcome to Chat</h2>
//                 <p>Select a conversation or start a new chat to begin messaging.</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* New Chat Modal */}
//       {showNewChat && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold">Start New Chat</h3>
//               <button
//                 onClick={() => setShowNewChat(false)}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 ×
//               </button>
//             </div>
            
//             <div className="space-y-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//                 <input
//                   type="text"
//                   placeholder="Search users..."
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
//                   value={searchQuery}
//                   onChange={(e) => {
//                     setSearchQuery(e.target.value);
//                     searchUsers(e.target.value);
//                   }}
//                 />
//               </div>

//               {users.length > 0 && (
//                 <div className="max-h-60 overflow-y-auto space-y-2">
//                   {users.map((user) => (
//                     <div
//                       key={user._id}
//                       onClick={() => startConversation(user._id)}
//                       className="flex items-center space-x-3 p-2 hover:bg-gray-50 cursor-pointer rounded-lg"
//                     >
//                       <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
//                         {user.name?.charAt(0) || "U"}
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-900">{user.name}</p>
//                         <p className="text-sm text-gray-500">{user.email}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {users.length > 1 && (
//                 <button
//                   onClick={createGroup}
//                   className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
//                 >
//                   Create Group ({users.length} members)
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Group Members Modal */}
//       {showUsers && selectedConversation && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold">
//                 {selectedConversation.type === "group" ? "Group Members" : "Chat Info"}
//               </h3>
//               <button
//                 onClick={() => setShowUsers(false)}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 ×
//               </button>
//             </div>
            
//             {selectedConversation.type === "group" && (
//               <>
//                 <div className="mb-4">
//                   <h4 className="font-medium text-gray-900">{selectedConversation.name}</h4>
//                   {selectedConversation.description && (
//                     <p className="text-sm text-gray-500">{selectedConversation.description}</p>
//                   )}
//                 </div>
                
//                 <div className="space-y-2">
//                   <h5 className="font-medium text-gray-700">Members ({selectedConversation.participants.length})</h5>
//                   <div className="max-h-60 overflow-y-auto space-y-2">
//                     {selectedConversation.participants.map((participant) => (
//                       <div
//                         key={participant.user._id}
//                         className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
//                       >
//                         <div className="flex items-center space-x-3">
//                           <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
//                             {participant.user.name?.charAt(0) || "U"}
//                           </div>
//                           <div>
//                             <p className="font-medium text-gray-900">{participant.user.name}</p>
//                             <p className="text-sm text-gray-500">{participant.user.email}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
//                             {participant.role}
//                           </span>
//                           {user?._id === selectedConversation.createdBy._id && participant.user._id !== user?._id && (
//                             <button
//                               onClick={() => removeMemberFromGroup(participant.user._id)}
//                               className="p-1 text-red-400 hover:text-red-600"
//                               title="Remove member"
//                             >
//                               <Trash2 size={16} />
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </>
//             )}
            
//             {selectedConversation.type === "direct" && (
//               <div className="space-y-4">
//                 {selectedConversation.participants
//                   .filter(p => p.user._id !== user?._id)
//                   .map((participant) => (
//                     <div key={participant.user._id} className="flex items-center space-x-3">
//                       <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
//                         {participant.user.name?.charAt(0) || "U"}
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-900">{participant.user.name}</p>
//                         <p className="text-sm text-gray-500">{participant.user.email}</p>
//                       </div>
//                     </div>
//                   ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  MessageCircle, 
  Plus, 
  Users, 
  Search, 
  Send, 
  MoreVertical,
  Trash2,
  X,
  Check,
  CheckCheck,
  LogOut,
  UserPlus,
  Info,
  ArrowLeft
} from "lucide-react";

export default function ChatPage() {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);
  const router = useRouter();
  const pollIntervalRef = useRef(null);
  const conversationPollRef = useRef(null);
  const textareaRef = useRef(null);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [newMessage]);

  // Real-time message polling
  useEffect(() => {
    if (selectedConversation) {
      const pollMessages = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `/api/chat/conversations/${selectedConversation._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setMessages(data.messages);
            setSelectedConversation(data.conversation);
          }
        } catch (error) {
          console.error("Error polling messages:", error);
        }
      };

      pollMessages();
      pollIntervalRef.current = setInterval(pollMessages, 2000);

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [selectedConversation?._id]);

  // Check authentication and fetch user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          router.push("/login");
          return;
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/login");
      }
    };

    fetchUserData();
  }, [router]);

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/chat/conversations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
      
      conversationPollRef.current = setInterval(() => {
        fetchConversations();
      }, 5000);

      return () => {
        if (conversationPollRef.current) {
          clearInterval(conversationPollRef.current);
        }
      };
    }
  }, [user]);

  // Fetch messages for selected conversation
  const fetchMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/chat/conversations/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        setSelectedConversation(data.conversation);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || messageLoading) return;

    const messageContent = newMessage.trim();
    setNewMessage("");
    setMessageLoading(true);

    // Optimistic UI update
    const tempMessage = {
      _id: Date.now(),
      content: messageContent,
      sender: user,
      createdAt: new Date().toISOString(),
      sending: true
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId: selectedConversation._id,
          content: messageContent,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => prev.map(msg => 
          msg._id === tempMessage._id ? data.message : msg
        ));
        fetchConversations();
      } else {
        setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
    } finally {
      setMessageLoading(false);
    }
  };

  // Handle enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Search users for new chat
  const searchUsers = async (query) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/chat/users?search=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users.filter(u => u._id !== user._id));
      }
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  // Toggle user selection for group
  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Start new conversation
  const startConversation = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/chat/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "direct",
          participantIds: [userId],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedConversation(data.conversation);
        setMessages([]);
        fetchConversations();
        closeNewChatModal();
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  // Create group conversation
  const createGroup = async () => {
    if (selectedUsers.length < 2) {
      alert("Please select at least 2 members for a group");
      return;
    }

    const groupName = prompt("Enter group name:");
    if (!groupName) return;

    const description = prompt("Enter group description (optional):") || "";

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/chat/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "group",
          participantIds: selectedUsers,
          name: groupName,
          description: description,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedConversation(data.conversation);
        setMessages([]);
        fetchConversations();
        closeNewChatModal();
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  // Close new chat modal
  const closeNewChatModal = () => {
    setShowNewChat(false);
    setSearchQuery("");
    setUsers([]);
    setSelectedUsers([]);
  };

  // Add member to group
  const addMemberToGroup = async () => {
    if (!selectedConversation || selectedConversation.type !== "group") return;

    const searchTerm = prompt("Enter user email or name to add:");
    if (!searchTerm) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/chat/users?search=${encodeURIComponent(searchTerm)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const foundUsers = data.users.filter(u => 
          !selectedConversation.participants.some(p => p.user._id === u._id)
        );

        if (foundUsers.length === 0) {
          alert("No users found or user already in group");
          return;
        }

        const userToAdd = foundUsers[0];
        if (confirm(`Add ${userToAdd.name} to the group?`)) {
          const addResponse = await fetch(`/api/chat/conversations/${selectedConversation._id}/members`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId: userToAdd._id,
            }),
          });

          if (addResponse.ok) {
            alert("User added successfully!");
            fetchMessages(selectedConversation._id);
            fetchConversations();
          } else {
            const errorData = await addResponse.json();
            alert(`Error: ${errorData.message}`);
          }
        }
      }
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  // Remove member from group
  const removeMemberFromGroup = async (userId) => {
    if (!selectedConversation || selectedConversation.type !== "group") return;
    
    if (confirm("Remove this member from the group?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/chat/conversations/${selectedConversation._id}/members?memberId=${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          alert("Member removed successfully!");
          fetchMessages(selectedConversation._id);
          fetchConversations();
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error removing member:", error);
      }
    }
  };

  // Format time
  const formatTime = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else if (today - messageDate < 7 * 24 * 60 * 60 * 1000) {
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Get conversation name
  const getConversationName = (conversation) => {
    if (conversation.type === "direct") {
      const otherUser = conversation.participants?.find(p => p.user._id !== user?._id);
      return otherUser?.user?.name || "Unknown User";
    }
    return conversation.name || "Unnamed Group";
  };

  // Get conversation avatar
  const getConversationAvatar = (conversation) => {
    if (conversation.type === "direct") {
      const otherUser = conversation.participants?.find(p => p.user._id !== user?._id);
      return otherUser?.user?.name?.charAt(0).toUpperCase() || "U";
    }
    return conversation.name?.charAt(0).toUpperCase() || "G";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden">
      <div className="h-full max-w-7xl mx-auto flex shadow-2xl">
        {/* Sidebar */}
        <div className={`${isMobile && selectedConversation ? 'hidden' : 'flex'} ${isMobile ? 'w-full' : 'w-96'} bg-white flex-col border-r border-gray-200`}>
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-2xl font-bold">Messages</h1>
                <p className="text-sm text-emerald-100">{conversations.length} conversation{conversations.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowNewChat(true)}
                  className="p-2.5 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 backdrop-blur-sm"
                  title="New chat"
                >
                  <Plus size={20} />
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="p-2.5 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 backdrop-blur-sm"
                  title="Back to dashboard"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-800" size={18} />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/90 text-gray-800 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="text-emerald-600" size={36} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
                <p className="text-sm text-gray-500 mb-4">Start chatting with your team members</p>
                <button
                  onClick={() => setShowNewChat(true)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Start New Chat
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {conversations
                  .filter(conv => 
                    getConversationName(conv).toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((conversation) => (
                    <div
                      key={conversation._id}
                      onClick={() => fetchMessages(conversation._id)}
                      className={`p-4 cursor-pointer hover:bg-emerald-50 transition-all duration-150 ${
                        selectedConversation?._id === conversation._id
                          ? "bg-emerald-50 border-l-4 border-emerald-600"
                          : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {getConversationAvatar(conversation)}
                          </div>
                          {conversation.type === "direct" && (
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-gray-900 truncate">
                              {getConversationName(conversation)}
                            </p>
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                              {conversation.lastMessageAt && formatTime(conversation.lastMessageAt)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">
                              {conversation.lastMessage?.content || "No messages yet"}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="ml-2 px-2 py-0.5 bg-emerald-600 text-white text-xs font-bold rounded-full">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${isMobile && !selectedConversation ? 'hidden' : 'flex'} flex-1 flex-col bg-white`}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isMobile && (
                      <button
                        onClick={() => setSelectedConversation(null)}
                        className="p-2 hover:bg-gray-100 rounded-full mr-1"
                      >
                        <ArrowLeft size={20} />
                      </button>
                    )}
                    <div className="relative">
                      <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        {getConversationAvatar(selectedConversation)}
                      </div>
                      {selectedConversation.type === "direct" && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900 text-lg">
                        {getConversationName(selectedConversation)}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {selectedConversation.type === "direct" 
                          ? "Active now" 
                          : `${selectedConversation.participants?.length || 0} members`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {selectedConversation.type === "group" && user?._id === selectedConversation.createdBy?._id && (
                      <button
                        onClick={addMemberToGroup}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        title="Add member"
                      >
                        <UserPlus size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => setShowInfo(true)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                      title="Chat info"
                    >
                      <Info size={20} />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                      <MessageCircle className="text-emerald-600" size={36} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
                    <p className="text-sm text-gray-500">Send a message to start the conversation</p>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => {
                      const isOwn = message.sender._id === user?._id;
                      const showAvatar = index === 0 || messages[index - 1].sender._id !== message.sender._id;
                      const showName = !isOwn && selectedConversation.type === "group" && showAvatar;
                      
                      return (
                        <div
                          key={message._id}
                          className={`flex ${isOwn ? "justify-end" : "justify-start"} ${showAvatar ? "mt-4" : "mt-1"}`}
                        >
                          <div className={`flex ${isOwn ? "flex-row-reverse" : "flex-row"} items-end space-x-2 max-w-[75%]`}>
                            {!isOwn && showAvatar && (
                              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {message.sender.name?.charAt(0).toUpperCase() || "U"}
                              </div>
                            )}
                            {!isOwn && !showAvatar && <div className="w-8" />}
                            
                            <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                              {showName && (
                                <span className="text-xs text-gray-600 font-medium mb-1 px-3">
                                  {message.sender.name}
                                </span>
                              )}
                              <div
                                className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                                  isOwn
                                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-md"
                                    : "bg-white border border-gray-200 text-gray-900 rounded-bl-md"
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                                <div className={`flex items-center justify-end space-x-1 mt-1 ${
                                  isOwn ? "text-emerald-100" : "text-gray-500"
                                }`}>
                                  <span className="text-xs">
                                    {new Date(message.createdAt).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                  {isOwn && (
                                    message.sending ? (
                                      <Check size={14} className="opacity-60" />
                                    ) : (
                                      <CheckCheck size={14} />
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-end space-x-3">
                  <div className="flex-1 relative">
                    <textarea
                      ref={textareaRef}
                      rows="1"
                      placeholder="Type a message..."
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none max-h-32 transition-all"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={messageLoading}
                      style={{ minHeight: '44px' }}
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || messageLoading}
                    className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg disabled:shadow-none flex-shrink-0"
                  >
                    {messageLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send size={20} />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
              <div className="text-center">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="text-emerald-600" size={48} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Chat</h2>
                <p className="text-gray-600 mb-6">Select a conversation to start messaging</p>
                {!isMobile && (
                  <button
                    onClick={() => setShowNewChat(true)}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg"
                  >
                    Start New Chat
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Start New Chat</h3>
              <button
                onClick={closeNewChatModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      searchUsers(e.target.value);
                    }}
                    autoFocus
                  />
                </div>

                {searchQuery && users.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users size={48} className="mx-auto mb-2 opacity-50" />
                    <p>No users found</p>
                  </div>
                )}

                {users.length > 0 && (
                  <>
                    <div className="max-h-96 overflow-y-auto space-y-1">
                      {users.map((user) => {
                        const isSelected = selectedUsers.includes(user._id);
                        return (
                          <div
                            key={user._id}
                            onClick={() => {
                              if (selectedUsers.length > 0) {
                                toggleUserSelection(user._id);
                              } else {
                                startConversation(user._id);
                              }
                            }}
                            className={`flex items-center justify-between p-3 hover:bg-emerald-50 cursor-pointer rounded-lg transition-all ${
                              isSelected ? "bg-emerald-50 ring-2 ring-emerald-500" : ""
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                                {user.name?.charAt(0).toUpperCase() || "U"}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                            {selectedUsers.length > 0 && (
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                isSelected 
                                  ? "bg-emerald-600 border-emerald-600" 
                                  : "border-gray-300"
                              }`}>
                                {isSelected && <Check size={14} className="text-white" />}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {selectedUsers.length === 0 && (
                      <button
                        onClick={() => setSelectedUsers([])}
                        className="w-full px-4 py-2.5 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
                      >
                        Select Multiple for Group
                      </button>
                    )}

                    {selectedUsers.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{selectedUsers.length} member{selectedUsers.length !== 1 ? 's' : ''} selected</span>
                          <button
                            onClick={() => setSelectedUsers([])}
                            className="text-emerald-600 hover:text-emerald-700 font-medium"
                          >
                            Clear
                          </button>
                        </div>
                        {selectedUsers.length >= 2 ? (
                          <button
                            onClick={createGroup}
                            className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg font-medium"
                          >
                            Create Group Chat
                          </button>
                        ) : (
                          <p className="text-sm text-center text-gray-500 py-2">
                            Select at least 2 members to create a group
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Info Modal */}
      {showInfo && selectedConversation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedConversation.type === "group" ? "Group Info" : "Chat Info"}
              </h3>
              <button
                onClick={() => setShowInfo(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              {selectedConversation.type === "group" ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-3 shadow-lg">
                      {selectedConversation.name?.charAt(0).toUpperCase() || "G"}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">{selectedConversation.name}</h4>
                    {selectedConversation.description && (
                      <p className="text-sm text-gray-600 mt-1">{selectedConversation.description}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      Created {new Date(selectedConversation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-semibold text-gray-900">
                        Members ({selectedConversation.participants?.length || 0})
                      </h5>
                      {user?._id === selectedConversation.createdBy?._id && (
                        <button
                          onClick={addMemberToGroup}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                          title="Add member"
                        >
                          <UserPlus size={18} />
                        </button>
                      )}
                    </div>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {selectedConversation.participants?.map((participant) => (
                        <div
                          key={participant.user._id}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold">
                              {participant.user.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {participant.user.name}
                                {participant.user._id === user?._id && (
                                  <span className="text-emerald-600 text-sm ml-1">(You)</span>
                                )}
                              </p>
                              <p className="text-sm text-gray-500">{participant.user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-medium">
                              {participant.role}
                            </span>
                            {user?._id === selectedConversation.createdBy?._id && 
                             participant.user._id !== user?._id && (
                              <button
                                onClick={() => removeMemberFromGroup(participant.user._id)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                title="Remove member"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedConversation.participants
                    ?.filter(p => p.user._id !== user?._id)
                    .map((participant) => (
                      <div key={participant.user._id} className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-3 shadow-lg">
                          {participant.user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">{participant.user.name}</h4>
                        <p className="text-sm text-gray-600">{participant.user.email}</p>
                        <div className="mt-4 flex items-center justify-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">Active now</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}