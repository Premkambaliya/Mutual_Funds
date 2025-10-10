// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { User, Mail, Lock, UserPlus } from "lucide-react";

// export default function Signup() {
//   const [form, setForm] = useState({ name: "", email: "", password: "" });
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const res = await fetch("/api/auth/signup", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });

//     const data = await res.json();
//     setMessage(data.message);

//     if (res.ok) {
//       localStorage.setItem(
//         "user",
//         JSON.stringify({ name: form.name, email: form.email })
//       );
//       localStorage.setItem("token", data.token || "");

//       setForm({ name: "", email: "", password: "" });

//       setTimeout(() => {
//         router.push("/profile");
//       }, 1000);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-emerald-50 via-green-100 to-emerald-200 p-5">
//       <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
//         <div className="flex justify-center mb-6">
//           <div className="w-[70px] h-[70px] rounded-full bg-gradient-to-br from-emerald-600 to-green-500 flex items-center justify-center shadow-lg">
//             <UserPlus size={32} className="text-white" />
//           </div>
//         </div>

//         <h2 className="text-3xl font-bold text-center text-emerald-800 mb-2">
//           Create Account
//         </h2>
//         <p className="text-center text-gray-600 mb-8 text-sm">
//           Join us to get started
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="relative">
//             <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none" />
//             <input
//               type="text"
//               placeholder="Full Name"
//               className="w-full pl-12 pr-4 py-3.5 text-[15px] border-2 border-emerald-100 rounded-xl outline-none transition-all duration-300 bg-gray-50 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white"
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//               required
//             />
//           </div>

//           <div className="relative">
//             <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none" />
//             <input
//               type="email"
//               placeholder="Email Address"
//               className="w-full pl-12 pr-4 py-3.5 text-[15px] border-2 border-emerald-100 rounded-xl outline-none transition-all duration-300 bg-gray-50 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white"
//               value={form.email}
//               onChange={(e) => setForm({ ...form, email: e.target.value })}
//               required
//             />
//           </div>

//           <div className="relative">
//             <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none" />
//             <input
//               type="password"
//               placeholder="Password"
//               className="w-full pl-12 pr-4 py-3.5 text-[15px] border-2 border-emerald-100 rounded-xl outline-none transition-all duration-300 bg-gray-50 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white"
//               value={form.password}
//               onChange={(e) => setForm({ ...form, password: e.target.value })}
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-3.5 text-base font-bold text-white bg-gradient-to-r from-emerald-600 to-green-500 rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-green-600 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
//           >
//             {loading ? "Creating Account..." : "Sign Up"}
//           </button>

//           {message && (
//             <p className={`text-center text-sm font-medium mt-4 ${message.includes("success") ? "text-emerald-600" : "text-red-600"}`}>
//               {message}
//             </p>
//           )}

//           <p className="text-center text-sm text-gray-600 mt-6">
//             Already have an account?{" "}
//             <a href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors">
//               Login
//             </a>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }



"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, UserPlus } from "lucide-react";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Signup API call
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Perform login to get token
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        throw new Error(loginData.message || "Auto-login failed");
      }

      // Store token
      localStorage.setItem("token", loginData.token);

      // Fetch full user profile
      const profileRes = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${loginData.token}`,
        },
      });

      if (!profileRes.ok) {
        throw new Error("Failed to fetch user profile");
      }

      // Dispatch event to update Navbar
      window.dispatchEvent(new Event("userUpdated"));

      setMessage("Signup successful!");
      setForm({ name: "", email: "", password: "" });
      setTimeout(() => {
        router.push("/profile");
      }, 1000);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-emerald-50 via-green-100 to-emerald-200 p-5">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-[70px] h-[70px] rounded-full bg-gradient-to-br from-emerald-600 to-green-500 flex items-center justify-center shadow-lg">
            <UserPlus size={32} className="text-white" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-emerald-800 mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Join us to get started
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-12 pr-4 py-3.5 text-[15px] border-2 border-emerald-100 rounded-xl outline-none transition-all duration-300 bg-gray-50 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="relative">
            <Mail
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-3.5 text-[15px] border-2 border-emerald-100 rounded-xl outline-none transition-all duration-300 bg-gray-50 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="relative">
            <Lock
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-12 pr-4 py-3.5 text-[15px] border-2 border-emerald-100 rounded-xl outline-none transition-all duration-300 bg-gray-50 focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:bg-white"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-base font-bold text-white bg-gradient-to-r from-emerald-600 to-green-500 rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-green-600 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          {message && (
            <p
              className={`text-center text-sm font-medium mt-4 ${
                message.includes("successful")
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors"
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
