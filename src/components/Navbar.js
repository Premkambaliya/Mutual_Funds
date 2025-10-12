// "use client";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { User, Menu, X } from "lucide-react";

// export default function Navbar() {
//   const [user, setUser] = useState(null);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     // Check if user info exists in localStorage
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     if (storedUser) {
//       setUser(storedUser);
//     }

//     // Listen for storage changes (for cross-tab sync)
//     const handleStorageChange = () => {
//       const updatedUser = JSON.parse(localStorage.getItem("user"));
//       setUser(updatedUser);
//     };

//     window.addEventListener("storage", handleStorageChange);
    
//     // Custom event for same-tab updates
//     window.addEventListener("userUpdated", handleStorageChange);

//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//       window.removeEventListener("userUpdated", handleStorageChange);
//     };
//   }, []);

//   // Close mobile menu when route changes
//   useEffect(() => {
//     setMobileMenuOpen(false);
//   }, [pathname]);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     setUser(null);
//     window.dispatchEvent(new Event("userUpdated"));
//     setMobileMenuOpen(false);
//     router.push("/");
//   };

//   const getInitial = (name) => {
//     return name ? name.charAt(0).toUpperCase() : "U";
//   };

//   return (
//     <nav className="bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 shadow-lg">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link href="/" className="flex items-center z-50">
//             <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide drop-shadow-md hover:scale-105 transition-transform duration-300">
//               Mutual Funds Hub
//             </h1>
//           </Link>

//           {/* Desktop Navigation Links */}
//           <div className="hidden lg:flex items-center gap-2">
//             <Link
//               href="/"
//               className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
//                 pathname === "/"
//                   ? "bg-white/20 text-white"
//                   : "text-white hover:bg-white/15 hover:-translate-y-0.5"
//               }`}
//             >
//               Home
//             </Link>
//             <Link
//               href="/funds"
//               className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
//                 pathname === "/funds"
//                   ? "bg-white/20 text-white"
//                   : "text-white hover:bg-white/15 hover:-translate-y-0.5"
//               }`}
//             >
//               Funds
//             </Link>
//             <Link
//               href="/about"
//               className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
//                 pathname === "/about"
//                   ? "bg-white/20 text-white"
//                   : "text-white hover:bg-white/15 hover:-translate-y-0.5"
//               }`}
//             >
//               About
//             </Link>

//             {/* Conditional Rendering: Login or Profile */}
//             {user ? (
//               <div className="flex items-center gap-3 ml-2">
//                 {/* Profile Button with Avatar */}
//                 <Link
//                   href="/profile"
//                   className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 group"
//                 >
//                   {/* Avatar Circle */}
//                   <div className="relative">
//                     {user.profileImage ? (
//                       <img
//                         src={user.profileImage}
//                         alt={user.name}
//                         className="w-9 h-9 rounded-full border-2 border-white object-cover group-hover:scale-110 transition-transform duration-300"
//                       />
//                     ) : (
//                       <div className="w-9 h-9 rounded-full border-2 border-white bg-emerald-700 flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300">
//                         {getInitial(user.name)}
//                       </div>
//                     )}
//                     <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
//                   </div>
//                   <span className="text-white font-semibold">
//                     {user.name?.split(" ")[0] || "Profile"}
//                   </span>
//                 </Link>

//                 {/* Logout Button */}
//                 <button
//                   onClick={handleLogout}
//                   className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
//                 >
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <Link
//                 href="/login"
//                 className="ml-2 px-5 py-2 bg-white text-emerald-600 font-bold rounded-lg hover:bg-emerald-50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
//               >
//                 Login
//               </Link>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="lg:hidden p-2 rounded-lg text-white hover:bg-white/15 transition-all duration-300 z-50"
//           >
//             {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <div
//         className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
//           mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
//         }`}
//         onClick={() => setMobileMenuOpen(false)}
//       >
//         <div
//           className={`fixed right-0 top-0 h-full w-80 max-w-[85%] bg-gradient-to-b from-emerald-600 to-green-600 shadow-2xl transform transition-transform duration-300 ${
//             mobileMenuOpen ? "translate-x-0" : "translate-x-full"
//           }`}
//           onClick={(e) => e.stopPropagation()}
//         >
//           <div className="flex flex-col h-full p-6 pt-20">
//             {/* User Profile Section (if logged in) */}
//             {user && (
//               <div className="mb-8 pb-6 border-b-2 border-white/20">
//                 <div className="flex items-center gap-3">
//                   <div className="relative">
//                     {user.profileImage ? (
//                       <img
//                         src={user.profileImage}
//                         alt={user.name}
//                         className="w-16 h-16 rounded-full border-3 border-white object-cover"
//                       />
//                     ) : (
//                       <div className="w-16 h-16 rounded-full border-3 border-white bg-emerald-700 flex items-center justify-center text-white font-bold text-2xl">
//                         {getInitial(user.name)}
//                       </div>
//                     )}
//                     <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-3 border-white"></div>
//                   </div>
//                   <div>
//                     <p className="text-white font-bold text-lg">{user.name}</p>
//                     <p className="text-white/80 text-sm">{user.email}</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Navigation Links */}
//             <div className="flex-1 space-y-2">
//               <Link
//                 href="/"
//                 className={`block px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
//                   pathname === "/"
//                     ? "bg-white text-emerald-600"
//                     : "text-white hover:bg-white/15"
//                 }`}
//               >
//                 Home
//               </Link>
//               <Link
//                 href="/funds"
//                 className={`block px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
//                   pathname === "/funds"
//                     ? "bg-white text-emerald-600"
//                     : "text-white hover:bg-white/15"
//                 }`}
//               >
//                 Funds
//               </Link>
//               <Link
//                 href="/about"
//                 className={`block px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
//                   pathname === "/about"
//                     ? "bg-white text-emerald-600"
//                     : "text-white hover:bg-white/15"
//                 }`}
//               >
//                 About
//               </Link>

//               {user && (
//                 <Link
//                   href="/profile"
//                   className={`block px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
//                     pathname === "/profile"
//                       ? "bg-white text-emerald-600"
//                       : "text-white hover:bg-white/15"
//                   }`}
//                 >
//                   Profile
//                 </Link>
//               )}
//             </div>

//             {/* Login/Logout Button */}
//             <div className="pt-6 border-t-2 border-white/20">
//               {user ? (
//                 <button
//                   onClick={handleLogout}
//                   className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg"
//                 >
//                   Logout
//                 </button>
//               ) : (
//                 <Link
//                   href="/login"
//                   className="block w-full px-4 py-3 bg-white text-emerald-600 font-bold rounded-lg hover:bg-emerald-50 transition-all duration-300 text-center shadow-lg"
//                 >
//                   Login
//                 </Link>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }






"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, Menu, X } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Fetch user data from API using token
  const fetchUserData = async (token) => {
    try {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUser(data.user); // data.user contains avatar, name, email, etc.
    } catch (error) {
      console.error("Error fetching user data:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetchUserData(token);

    // Poll for token changes (faster interval for immediate updates)
    const tokenPollInterval = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      if (currentToken && !user && !loading) {
        fetchUserData(currentToken);
      } else if (!currentToken && user) {
        setUser(null);
      }
    }, 500); // Reduced to 500ms for faster detection

    // Listen for userUpdated and storage events
    const handleUserUpdate = () => {
      fetchUserData(localStorage.getItem("token"));
    };

    window.addEventListener("userUpdated", handleUserUpdate);
    window.addEventListener("storage", handleUserUpdate);

    return () => {
      clearInterval(tokenPollInterval);
      window.removeEventListener("userUpdated", handleUserUpdate);
      window.removeEventListener("storage", handleUserUpdate);
    };
  }, [user, loading]); // Re-run if user or loading changes

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setMobileMenuOpen(false);
    window.dispatchEvent(new Event("userUpdated"));
    router.push("/");
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "U");

  if (loading) {
    return (
      <nav className="bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center z-50">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide drop-shadow-md">
                Mutual Funds Hub
              </h1>
            </Link>
            <div className="flex items-center">
              <div className="w-8 h-8 border border-white/30 rounded-full animate-pulse bg-white/20"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center z-50">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide drop-shadow-md hover:scale-105 transition-transform duration-300">
              Mutual Funds Hub
            </h1>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                pathname === "/"
                  ? "bg-white/20 text-white"
                  : "text-white hover:bg-white/15 hover:-translate-y-0.5"
              }`}
            >
              Home
            </Link>
            <Link
              href="/funds"
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                pathname === "/funds"
                  ? "bg-white/20 text-white"
                  : "text-white hover:bg-white/15 hover:-translate-y-0.5"
              }`}
            >
              Funds
            </Link>
            <Link
              href="/watchlist"
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                pathname === "/watchlist"
                  ? "bg-white/20 text-white"
                  : "text-white hover:bg-white/15 hover:-translate-y-0.5"
              }`}
            >
              Watchlist
            </Link>
            <Link
              href="/virtual-portfolio"
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                pathname === "/virtual-portfolio"
                  ? "bg-white/20 text-white"
                  : "text-white hover:bg-white/15 hover:-translate-y-0.5"
              }`}
            >
              Virtual Portfolio
            </Link>
            <Link
              href="/chat"
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                pathname === "/chat"
                  ? "bg-white/20 text-white"
                  : "text-white hover:bg-white/15 hover:-translate-y-0.5"
              }`}
            >
              Chat
            </Link>
            <Link
              href="/about"
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                pathname === "/about"
                  ? "bg-white/20 text-white"
                  : "text-white hover:bg-white/15 hover:-translate-y-0.5"
              }`}
            >
              About
            </Link>

            {/* Conditional Rendering: Login or Profile */}
            {user ? (
              <div className="flex items-center gap-3 ml-2">
                {/* Profile Button with Avatar */}
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 group"
                >
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 rounded-full border-2 border-white object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-9 h-9 rounded-full border-2 border-white bg-emerald-700 flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300 ${
                        user.avatar ? "hidden" : ""
                      }`}
                      style={{ display: user.avatar ? "none" : "flex" }}
                    >
                      {getInitial(user.name)}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <span className="text-white font-semibold max-w-[120px] truncate">
                    {user.name?.split(" ")[0] || "Profile"}
                  </span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-2 px-5 py-2 bg-white text-emerald-600 font-bold rounded-lg hover:bg-emerald-50 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/15 transition-all duration-300 z-50"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`fixed right-0 top-0 h-full w-80 max-w-[85%] bg-gradient-to-b from-emerald-600 to-green-600 shadow-2xl transform transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full p-6 pt-20">
            {/* User Profile Section (if logged in) */}
            {user && (
              <div className="mb-8 pb-6 border-b-2 border-white/20">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-16 h-16 rounded-full border-3 border-white object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="w-16 h-16 rounded-full border-3 border-white bg-emerald-700 flex items-center justify-center text-white font-bold text-2xl"
                      style={{ display: user.avatar ? "none" : "flex" }}
                    >
                      {getInitial(user.name)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-3 border-white"></div>
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">{user.name}</p>
                    <p className="text-white/80 text-sm">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="flex-1 space-y-2">
              <Link
                href="/"
                className={`block px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  pathname === "/"
                    ? "bg-white text-emerald-600"
                    : "text-white hover:bg-white/15"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/funds"
                className={`block px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  pathname === "/funds"
                    ? "bg-white text-emerald-600"
                    : "text-white hover:bg-white/15"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Funds
              </Link>
              <Link
                href="/chat"
                className={`block px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  pathname === "/chat"
                    ? "bg-white text-emerald-600"
                    : "text-white hover:bg-white/15"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Chat
              </Link>
              <Link
                href="/about"
                className={`block px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  pathname === "/about"
                    ? "bg-white text-emerald-600"
                    : "text-white hover:bg-white/15"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              {user && (
                <Link
                  href="/profile"
                  className={`block px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    pathname === "/profile"
                      ? "bg-white text-emerald-600"
                      : "text-white hover:bg-white/15"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              )}
            </div>

            {/* Login/Logout Button */}
            <div className="pt-6 border-t-2 border-white/20">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block w-full px-4 py-3 bg-white text-emerald-600 font-bold rounded-lg hover:bg-emerald-50 transition-all duration-300 text-center shadow-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
