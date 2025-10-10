"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
  Image as ImageIcon,
} from "lucide-react";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    panNumber: "",
    address: "",
    avatar: "",
    dateOfBirth: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setUser(data.user);
        setEditForm({
          name: data.user.name || "",
          email: data.user.email || "",
          mobileNumber: data.user.mobileNumber || "",
          panNumber: data.user.panNumber || "",
          address: data.user.address || "",
          avatar: data.user.avatar || "",
          dateOfBirth: data.user.dateOfBirth ? new Date(data.user.dateOfBirth).toISOString().split('T')[0] : "",
        });
      } catch (err) {
        setError(err.message);
        router.push("/login");
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      setUser(data.user);
      setIsEditing(false);
      window.dispatchEvent(new Event("userUpdated"));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="w-[60px] h-[60px] border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 py-10 px-5">
      {error && (
        <div className="max-w-5xl mx-auto mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-emerald-600 to-green-500 p-10 flex flex-col items-center gap-6 relative">
          {/* Profile Image */}
          <div className="flex flex-col items-center gap-4">
            {editForm.avatar ? (
              <img
                src={editForm.avatar}
                alt="Profile"
                className="w-36 h-36 rounded-full border-[6px] border-white object-cover shadow-xl"
              />
            ) : (
              <div className="w-36 h-36 rounded-full border-[6px] border-white bg-emerald-50 flex items-center justify-center shadow-xl">
                <User size={60} className="text-emerald-600" />
              </div>
            )}
            
            {isEditing && (
              <div className="relative w-[300px]">
                <ImageIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none" />
                <input
                  type="url"
                  placeholder="Profile Image URL"
                  className="w-full pl-10 pr-3 py-2.5 text-sm border-2 border-emerald-100 rounded-lg outline-none bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  value={editForm.avatar}
                  onChange={(e) =>
                    setEditForm({ ...editForm, avatar: e.target.value })
                  }
                />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
            <p className="text-lg opacity-90 mb-3">{user.email}</p>
            <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold">
              Active Member
            </div>
          </div>

          {/* Edit/Save/Cancel Buttons */}
          <div className="flex gap-3 flex-wrap justify-center">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 rounded-xl font-semibold shadow-lg hover:bg-emerald-50 hover:scale-105 transition-all duration-300"
              >
                <Edit2 size={18} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 rounded-xl font-semibold shadow-lg hover:bg-emerald-50 hover:scale-105 transition-all duration-300"
                >
                  <Save size={18} />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-6 py-3 bg-white/80 text-gray-700 rounded-xl font-semibold shadow-lg hover:bg-white hover:scale-105 transition-all duration-300"
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="p-10">
          <h3 className="text-2xl font-bold text-emerald-800 mb-6 pb-3 border-b-[3px] border-emerald-100">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <User size={20} className="text-emerald-600" />
                <span>Full Name</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  className="px-4 py-3 text-base border-2 border-emerald-100 rounded-lg outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
              ) : (
                <p className="px-4 py-3 text-base font-medium text-gray-800 bg-gray-50 rounded-lg border border-gray-200">
                  {user.name || "Not provided"}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <Mail size={20} className="text-emerald-600" />
                <span>Email Address</span>
              </div>
              <p className="px-4 py-3 text-base font-medium text-gray-800 bg-gray-50 rounded-lg border border-gray-200">
                {user.email}
              </p>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <Phone size={20} className="text-emerald-600" />
                <span>Phone Number</span>
              </div>
              {isEditing ? (
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  className="px-4 py-3 text-base border-2 border-emerald-100 rounded-lg outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white"
                  value={editForm.mobileNumber}
                  onChange={(e) =>
                    setEditForm({ ...editForm, mobileNumber: e.target.value })
                  }
                />
              ) : (
                <p className="px-4 py-3 text-base font-medium text-gray-800 bg-gray-50 rounded-lg border border-gray-200">
                  {user.mobileNumber || "Not provided"}
                </p>
              )}
            </div>

            {/* PAN Number */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <CreditCard size={20} className="text-emerald-600" />
                <span>PAN Number</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  placeholder="Enter PAN number"
                  className="px-4 py-3 text-base border-2 border-emerald-100 rounded-lg outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white uppercase"
                  value={editForm.panNumber}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      panNumber: e.target.value.toUpperCase(),
                    })
                  }
                  maxLength={10}
                />
              ) : (
                <p className="px-4 py-3 text-base font-medium text-gray-800 bg-gray-50 rounded-lg border border-gray-200">
                  {user.panNumber || "Not provided"}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <Calendar size={20} className="text-emerald-600" />
                <span>Date of Birth</span>
              </div>
              {isEditing ? (
                <input
                  type="date"
                  className="px-4 py-3 text-base border-2 border-emerald-100 rounded-lg outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white"
                  value={editForm.dateOfBirth}
                  onChange={(e) =>
                    setEditForm({ ...editForm, dateOfBirth: e.target.value })
                  }
                />
              ) : (
                <p className="px-4 py-3 text-base font-medium text-gray-800 bg-gray-50 rounded-lg border border-gray-200">
                  {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "Not provided"}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <MapPin size={20} className="text-emerald-600" />
                <span>Address</span>
              </div>
              {isEditing ? (
                <textarea
                  placeholder="Enter your address"
                  className="px-4 py-3 text-base border-2 border-emerald-100 rounded-lg outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white min-h-[80px] resize-y"
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm({ ...editForm, address: e.target.value })
                  }
                />
              ) : (
                <p className="px-4 py-3 text-base font-medium text-gray-800 bg-gray-50 rounded-lg border border-gray-200">
                  {user.address || "Not provided"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-10 bg-gray-50 border-t border-gray-200">
          <div className="text-center p-6 bg-white rounded-xl border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
            <p className="text-3xl font-bold text-emerald-600 mb-2">0</p>
            <p className="text-sm text-gray-600 font-medium">Investments</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
            <p className="text-3xl font-bold text-emerald-600 mb-2">₹0</p>
            <p className="text-sm text-gray-600 font-medium">Total Value</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
            <p className="text-3xl font-bold text-emerald-600 mb-2">0%</p>
            <p className="text-sm text-gray-600 font-medium">Returns</p>
          </div>
        </div>
      </div>
    </div>
  );
}