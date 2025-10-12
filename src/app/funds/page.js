// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Grid,
//   TextField,
//   CircularProgress,
//   Box,
//   Button,
//   Typography,
//   Paper,
//   Fade,
// } from "@mui/material";
// import Link from "next/link";
// import { TrendingUp, ArrowRight, Star, Shield, Target } from "lucide-react";
// import { motion } from "framer-motion";

// const funds = () => {
//   const [allSchemes, setAllSchemes] = useState([]);
//   const [filteredSchemes, setFilteredSchemes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [error, setError] = useState(null);

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 50;

//   useEffect(() => {
//     const fetchAllSchemes = async () => {
//       try {
//         const res = await fetch("https://api.mfapi.in/mf");
//         const data = await res.json();
//         setAllSchemes(data);
//         setFilteredSchemes(data);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch schemes from MFAPI.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAllSchemes();
//   }, []);

//   useEffect(() => {
//     const query = searchQuery.toLowerCase();
//     const filtered = allSchemes.filter((scheme) => {
//       const schemeName = scheme.schemeName || scheme.scheme_name || '';
//       const fundHouse = scheme.fundHouse || scheme.fund_house || '';
//       const category = scheme.schemeCategory || scheme.scheme_category || '';
      
//       return schemeName.toLowerCase().includes(query) ||
//              fundHouse.toLowerCase().includes(query) ||
//              category.toLowerCase().includes(query);
//     });
//     setFilteredSchemes(filtered);
//     setCurrentPage(1);
//   }, [searchQuery, allSchemes]);

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
//         <CircularProgress sx={{ color: "#059669" }} size={60} />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Container sx={{ py: 6 }}>
//         <Typography variant="h6" color="#DC2626" textAlign="center">
//           {error}
//         </Typography>
//       </Container>
//     );
//   }

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredSchemes.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredSchemes.length / itemsPerPage);

//   const groupedSchemes = currentItems.reduce((acc, scheme) => {
//     const fundHouse = scheme.fundHouse || scheme.fund_house || 'Unknown Fund House';
//     if (!fundHouse || fundHouse === 'undefined' || fundHouse === 'null') return acc;
    
//     if (!acc[fundHouse]) acc[fundHouse] = [];
//     acc[fundHouse].push(scheme);
//     return acc;
//   }, {});

//   const cardVariants = {
//     hidden: { opacity: 0, y: 10 },
//     visible: { opacity: 1, y: 0 },
//   };

//   const FundCard = ({ scheme }) => {
//     const schemeName = scheme.schemeName || scheme.scheme_name || 'Unknown Scheme';
//     const schemeCode = scheme.schemeCode || scheme.scheme_code || 'N/A';
//     const schemeCategory = scheme.schemeCategory || scheme.scheme_category || 'Unknown Category';

//     const getCategoryStyle = (category) => {
//       const styles = {
//         Equity: {
//           gradient: "linear-gradient(135deg, #059669, #10B981)", // emerald green
//           icon: <TrendingUp size={18} color="#fff" />,
//         },
//         Debt: {
//           gradient: "linear-gradient(135deg, #047857, #065F46)", // darker green
//           icon: <Shield size={18} color="#fff" />,
//         },
//         Hybrid: {
//           gradient: "linear-gradient(135deg, #10B981, #34D399)", // bright green
//           icon: <Target size={18} color="#fff" />,
//         },
//         ELSS: {
//           gradient: "linear-gradient(135deg, #059669, #6EE7B7)", // emerald to mint
//           icon: <Star size={18} color="#fff" />,
//         },
//       };

//       const matchedKey = Object.keys(styles).find((key) =>
//         category?.toLowerCase().includes(key.toLowerCase())
//       );
//       return styles[matchedKey] || styles["Equity"];
//     };

//     const seedBase = Number(String(schemeCode).replace(/\D/g, "")) || 1;
//     const seededRand = (m) => {
//       const x = Math.sin(seedBase * 9301 + m * 49297) * 233280;
//       return x - Math.floor(x);
//     };
//     const performanceIndicator = seededRand(1) > 0.5 ? "positive" : "negative";
//     const performanceValue = (seededRand(2) * 20 - 10).toFixed(2);

//     const categoryStyle = getCategoryStyle(schemeCategory);

//     return (
//       <Link href={`/scheme/${schemeCode}`}>
//         <motion.div
//           variants={cardVariants}
//           initial="hidden"
//           animate="visible"
//           whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(5, 150, 105, 0.3)" }}
//           transition={{ type: "spring", stiffness: 300, damping: 20 }}
//           style={{ textDecoration: "none", height: "100%", cursor: "pointer" }}
//         >
//           <Paper
//             elevation={3}
//             sx={{
//               height: "100%",
//               display: "flex",
//               flexDirection: "column",
//               p: 3,
//               borderRadius: 3,
//               position: "relative",
//               overflow: "hidden",
//               backgroundColor: "#FFFFFF",
//               border: "1px solid #D1FAE5",
//               transition: "all 0.3s ease",
//               "&:hover": {
//                 backgroundColor: "#F0FDF4",
//                 borderColor: "#10B981",
//               },
//             }}
//           >
//             {/* Header */}
//             <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 1,
//                   px: 2,
//                   py: 0.7,
//                   borderRadius: 2,
//                   background: categoryStyle.gradient,
//                   boxShadow: "0 2px 8px rgba(5, 150, 105, 0.25)",
//                 }}
//               >
//                 {categoryStyle.icon}
//                 <Typography
//                   variant="caption"
//                   sx={{ color: "#fff", fontWeight: 600, userSelect: "none" }}
//                 >
//                   {schemeCategory}
//                 </Typography>
//               </Box>

//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 0.5,
//                   px: 1.5,
//                   py: 0.5,
//                   borderRadius: 2,
//                   fontWeight: 600,
//                   fontSize: 12,
//                   userSelect: "none",
//                   color:
//                     performanceIndicator === "positive"
//                       ? "#059669"
//                       : "#DC2626",
//                   backgroundColor:
//                     performanceIndicator === "positive"
//                       ? "#D1FAE5"
//                       : "#FEE2E2",
//                 }}
//               >
//                 <TrendingUp
//                   size={16}
//                   style={{
//                     transform: performanceIndicator === "negative" ? "rotate(180deg)" : "none",
//                     transition: "transform 0.3s ease",
//                     color:
//                       performanceIndicator === "positive"
//                         ? "#059669"
//                         : "#DC2626",
//                   }}
//                 />
//                 <Typography component="span">{performanceValue}%</Typography>
//               </Box>
//             </Box>

//             {/* Scheme Name */}
//             <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: 700,
//                 mb: 2,
//                 lineHeight: 1.3,
//                 flexGrow: 1,
//                 background:
//                   "linear-gradient(90deg, #047857, #10B981)",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//                 transition: "background-position 0.5s ease",
//                 backgroundSize: "200% 100%",
//                 "&:hover": {
//                   backgroundPosition: "100% 0",
//                 },
//               }}
//               title={schemeName}
//             >
//               {schemeName}
//             </Typography>

//             {/* Scheme Code and View Details */}
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 fontSize: 12,
//                 color: "#6B7280",
//                 mt: "auto",
//               }}
//             >
//               <Typography>Code: {schemeCode}</Typography>
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 0.5,
//                   color: "#059669",
//                   opacity: 0,
//                   transition: "opacity 0.3s ease",
//                   "&:hover": {
//                     opacity: 1,
//                   },
//                 }}
//                 className="view-details"
//               >
//                 <Typography fontWeight={600}>View Details</Typography>
//                 <ArrowRight size={16} />
//               </Box>
//             </Box>
//           </Paper>
//         </motion.div>
//       </Link>
//     );
//   };

//   return (
//     <Container sx={{ py: 6, maxWidth: "lg", backgroundColor: "#F9FAFB" }}>
//       <Typography
//         variant="h3"
//         textAlign="center"
//         gutterBottom
//         sx={{
//           fontWeight: "bold",
//           background: "linear-gradient(90deg, #047857, #10B981, #34D399)",
//           WebkitBackgroundClip: "text",
//           WebkitTextFillColor: "transparent",
//           mb: 4,
//         }}
//       >
//         Mutual Fund Schemes
//       </Typography>

//       <Box sx={{ maxWidth: 400, mx: "auto", mb: 6 }}>
//         <TextField
//           fullWidth
//           label="Search by Scheme Name"
//           variant="outlined"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           sx={{
//             "& .MuiOutlinedInput-root": {
//               borderRadius: 3,
//               backgroundColor: "#FFFFFF",
//               transition: "all 0.3s ease",
//               "&.Mui-focused fieldset": {
//                 borderColor: "#10B981",
//                 borderWidth: 2,
//                 boxShadow: "0 0 8px rgba(16, 185, 129, 0.3)",
//               },
//             },
//             "& .MuiInputLabel-root.Mui-focused": {
//               color: "#059669",
//             },
//           }}
//         />
//       </Box>

//       {filteredSchemes.length === 0 && (
//         <Typography variant="h6" textAlign="center" color="#6B7280" sx={{ mt: 4 }}>
//           No schemes found matching your search.
//         </Typography>
//       )}

//       {Object.entries(groupedSchemes)
//         .filter(([fundHouse]) => fundHouse && fundHouse !== 'undefined' && fundHouse !== 'null')
//         .map(([fundHouse, schemes]) => (
//         <Fade in key={fundHouse} timeout={600}>
//           <Box sx={{ mb: 10, px: { xs: 1, sm: 2, md: 0 } }}>
//             <Typography
//               variant="h5"
//               sx={{
//                 mb: 3,
//                 color: "#047857",
//                 fontWeight: "bold",
//                 borderBottom: "3px solid",
//                 borderImage: "linear-gradient(90deg, #10B981, #34D399) 1",
//                 pb: 1,
//                 px: { xs: 1, sm: 0 },
//               }}
//             >
//               {fundHouse || 'Unknown Fund House'}
//             </Typography>
//             <Grid container spacing={4}>
//               {schemes.map((scheme) => (
//                 <Grid
//                   item
//                   key={scheme.schemeCode || scheme.scheme_code || Math.random()}
//                   xs={12}
//                   sm={6}
//                   md={4}
//                   lg={3}
//                 >
//                   <FundCard scheme={scheme} />
//                 </Grid>
//               ))}
//             </Grid>
//           </Box>
//         </Fade>
//       ))}

//       {/* Pagination Controls */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           mt: 6,
//           gap: 1,
//           flexWrap: "wrap",
//         }}
//       >
//         {Array.from({ length: totalPages }, (_, i) => (
//           <Button
//             key={i + 1}
//             variant={currentPage === i + 1 ? "contained" : "outlined"}
//             sx={{
//               minWidth: 40,
//               borderRadius: 2,
//               fontWeight: "bold",
//               transition: "all 0.3s ease",
//               color: currentPage === i + 1 ? "#FFFFFF" : "#059669",
//               backgroundColor: currentPage === i + 1 ? "#10B981" : "transparent",
//               borderColor: "#10B981",
//               "&:hover": {
//                 transform: "scale(1.1)",
//                 backgroundColor: "#059669",
//                 color: "#fff",
//                 borderColor: "#059669",
//                 boxShadow: "0 4px 12px rgba(5, 150, 105, 0.4)",
//               },
//             }}
//             onClick={() => setCurrentPage(i + 1)}
//           >
//             {i + 1}
//           </Button>
//         ))}
//       </Box>
//     </Container>
//   );
// };

// export default funds;








// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { TrendingUp, ArrowRight, Star, Shield, Target } from "lucide-react";

// const Funds = () => {
//   const [allSchemes, setAllSchemes] = useState([]);
//   const [filteredSchemes, setFilteredSchemes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
  
//   const itemsPerPage = 30;

//   useEffect(() => {
//     const fetchAllSchemes = async () => {
//       try {
//         const res = await fetch("https://api.mfapi.in/mf");
//         const data = await res.json();
//         setAllSchemes(data);
//         setFilteredSchemes(data);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch schemes from MFAPI.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAllSchemes();
//   }, []);

//   useEffect(() => {
//     const query = searchQuery.toLowerCase();
//     const filtered = allSchemes.filter((scheme) => {
//       const schemeName = scheme.schemeName || scheme.scheme_name || '';
//       const fundHouse = scheme.fundHouse || scheme.fund_house || '';
//       const category = scheme.schemeCategory || scheme.scheme_category || '';
      
//       return schemeName.toLowerCase().includes(query) ||
//              fundHouse.toLowerCase().includes(query) ||
//              category.toLowerCase().includes(query);
//     });
//     setFilteredSchemes(filtered);
//     setCurrentPage(1);
//   }, [searchQuery, allSchemes]);

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredSchemes.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredSchemes.length / itemsPerPage);

//   const getPaginationRange = () => {
//     const delta = 2;
//     const range = [];
//     const rangeWithDots = [];

//     range.push(1);

//     for (let i = currentPage - delta; i <= currentPage + delta; i++) {
//       if (i > 1 && i < totalPages) {
//         range.push(i);
//       }
//     }

//     if (totalPages > 1) {
//       range.push(totalPages);
//     }

//     let prev = 0;
//     for (const i of range) {
//       if (prev && i - prev > 1) {
//         rangeWithDots.push('...');
//       }
//       rangeWithDots.push(i);
//       prev = i;
//     }

//     return rangeWithDots;
//   };

//   const FundCard = ({ scheme }) => {
//     const [isHovered, setIsHovered] = useState(false);
    
//     const schemeName = scheme.schemeName || scheme.scheme_name || 'Unknown Scheme';
//     const schemeCode = scheme.schemeCode || scheme.scheme_code || 'N/A';
//     const schemeCategory = scheme.schemeCategory || scheme.scheme_category || 'Unknown Category';

//     const getCategoryStyle = (category) => {
//       const styles = {
//         Equity: {
//           gradient: "linear-gradient(135deg, #059669, #10B981)",
//           icon: <TrendingUp size={18} color="#fff" />,
//         },
//         Debt: {
//           gradient: "linear-gradient(135deg, #047857, #065F46)",
//           icon: <Shield size={18} color="#fff" />,
//         },
//         Hybrid: {
//           gradient: "linear-gradient(135deg, #10B981, #34D399)",
//           icon: <Target size={18} color="#fff" />,
//         },
//         ELSS: {
//           gradient: "linear-gradient(135deg, #059669, #6EE7B7)",
//           icon: <Star size={18} color="#fff" />,
//         },
//       };

//       const matchedKey = Object.keys(styles).find((key) =>
//         category?.toLowerCase().includes(key.toLowerCase())
//       );
//       return styles[matchedKey] || styles["Equity"];
//     };

//     const seedBase = Number(String(schemeCode).replace(/\D/g, "")) || 1;
//     const seededRand = (m) => {
//       const x = Math.sin(seedBase * 9301 + m * 49297) * 233280;
//       return x - Math.floor(x);
//     };
//     const performanceIndicator = seededRand(1) > 0.5 ? "positive" : "negative";
//     const performanceValue = (seededRand(2) * 20 - 10).toFixed(2);
//     const categoryStyle = getCategoryStyle(schemeCategory);

//     return (
//       <Link 
//         href={`/scheme/${schemeCode}`}
//         style={{ textDecoration: "none", display: "block", height: "100%" }}
//       >
//         <div
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//           style={{
//             height: "100%",
//             display: "flex",
//             flexDirection: "column",
//             padding: "24px",
//             borderRadius: "12px",
//             backgroundColor: isHovered ? "#F0FDF4" : "#FFFFFF",
//             border: `1px solid ${isHovered ? "#10B981" : "#D1FAE5"}`,
//             boxShadow: isHovered 
//               ? "0 10px 30px rgba(5, 150, 105, 0.3)" 
//               : "0 4px 6px rgba(0, 0, 0, 0.1)",
//             cursor: "pointer",
//             transition: "all 0.3s ease",
//             transform: isHovered ? "scale(1.02)" : "scale(1)",
//           }}
//         >
//           {/* Header */}
//           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//                 padding: "6px 16px",
//                 borderRadius: "8px",
//                 background: categoryStyle.gradient,
//                 boxShadow: "0 2px 8px rgba(5, 150, 105, 0.25)",
//               }}
//             >
//               {categoryStyle.icon}
//               <span style={{ color: "#fff", fontWeight: 600, fontSize: "12px" }}>
//                 {schemeCategory}
//               </span>
//             </div>

//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "4px",
//                 padding: "4px 12px",
//                 borderRadius: "8px",
//                 fontWeight: 600,
//                 fontSize: "12px",
//                 color: performanceIndicator === "positive" ? "#059669" : "#DC2626",
//                 backgroundColor: performanceIndicator === "positive" ? "#D1FAE5" : "#FEE2E2",
//               }}
//             >
//               <TrendingUp
//                 size={16}
//                 style={{
//                   transform: performanceIndicator === "negative" ? "rotate(180deg)" : "none",
//                   transition: "transform 0.3s ease",
//                 }}
//               />
//               <span>{performanceValue}%</span>
//             </div>
//           </div>

//           {/* Scheme Name */}
//           <h3
//             style={{
//               fontWeight: 700,
//               fontSize: "18px",
//               marginBottom: "16px",
//               lineHeight: 1.3,
//               flexGrow: 1,
//               background: "linear-gradient(90deg, #047857, #10B981)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               backgroundClip: "text",
//             }}
//             title={schemeName}
//           >
//             {schemeName}
//           </h3>

//           {/* Scheme Code and View Details */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               fontSize: "12px",
//               color: "#6B7280",
//               marginTop: "auto",
//             }}
//           >
//             <span>Code: {schemeCode}</span>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "4px",
//                 color: "#059669",
//                 opacity: isHovered ? 1 : 0,
//                 transition: "opacity 0.3s ease",
//                 fontWeight: 600,
//               }}
//             >
//               <span>View Details</span>
//               <ArrowRight size={16} />
//             </div>
//           </div>
//         </div>
//       </Link>
//     );
//   };

//   if (loading) {
//     return (
//       <div style={{ 
//         display: "flex", 
//         justifyContent: "center", 
//         alignItems: "center",
//         minHeight: "400px" 
//       }}>
//         <div style={{
//           width: "60px",
//           height: "60px",
//           border: "4px solid #D1FAE5",
//           borderTop: "4px solid #059669",
//           borderRadius: "50%",
//           animation: "spin 1s linear infinite",
//         }} />
//         <style>{`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}</style>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{ padding: "48px 20px", textAlign: "center" }}>
//         <h2 style={{ color: "#DC2626", fontSize: "20px" }}>{error}</h2>
//       </div>
//     );
//   }

//   return (
//     <div style={{ 
//       maxWidth: "1400px", 
//       margin: "0 auto", 
//       padding: "48px 20px",
//       backgroundColor: "#F9FAFB"
//     }}>
//       {/* Title */}
//       <h1
//         style={{
//           textAlign: "center",
//           fontSize: "clamp(28px, 5vw, 42px)",
//           fontWeight: "bold",
//           background: "linear-gradient(90deg, #047857, #10B981, #34D399)",
//           WebkitBackgroundClip: "text",
//           WebkitTextFillColor: "transparent",
//           backgroundClip: "text",
//           marginBottom: "32px",
//         }}
//       >
//         Mutual Fund Schemes
//       </h1>

//       {/* Search Box */}
//       <div style={{ maxWidth: "400px", margin: "0 auto 48px" }}>
//         <input
//           type="text"
//           placeholder="Search by Scheme Name, Fund House, or Category"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           style={{
//             width: "100%",
//             padding: "14px 20px",
//             fontSize: "16px",
//             border: "2px solid #D1FAE5",
//             borderRadius: "12px",
//             outline: "none",
//             transition: "all 0.3s ease",
//             backgroundColor: "#FFFFFF",
//           }}
//           onFocus={(e) => {
//             e.target.style.borderColor = "#10B981";
//             e.target.style.boxShadow = "0 0 8px rgba(16, 185, 129, 0.3)";
//           }}
//           onBlur={(e) => {
//             e.target.style.borderColor = "#D1FAE5";
//             e.target.style.boxShadow = "none";
//           }}
//         />
//       </div>

//       {/* Results Info */}
//       <p style={{ 
//         textAlign: "center", 
//         color: "#6B7280",
//         fontSize: "14px",
//         marginBottom: "32px" 
//       }}>
//         Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredSchemes.length)} of {filteredSchemes.length} schemes
//       </p>

//       {/* No Results */}
//       {filteredSchemes.length === 0 && (
//         <p style={{ 
//           textAlign: "center", 
//           color: "#6B7280",
//           fontSize: "20px",
//           marginTop: "32px" 
//         }}>
//           No schemes found matching your search.
//         </p>
//       )}

//       {/* Grid - 3 items per row */}
//       <div style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
//         gap: "24px",
//         marginBottom: "48px",
//       }}>
//         {currentItems.map((scheme) => (
//           <FundCard 
//             key={scheme.schemeCode || scheme.scheme_code || Math.random()} 
//             scheme={scheme} 
//           />
//         ))}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             gap: "8px",
//             flexWrap: "wrap",
//             marginTop: "70px",
//           }}
//         >
//           {/* Previous Button */}
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//             style={{
//               minWidth: "90px",
//               padding: "10px 20px",
//               borderRadius: "8px",
//               fontWeight: "bold",
//               fontSize: "14px",
//               cursor: currentPage === 1 ? "not-allowed" : "pointer",
//               border: "2px solid",
//               borderColor: currentPage === 1 ? "#D1D5DB" : "#10B981",
//               color: currentPage === 1 ? "#9CA3AF" : "#059669",
//               backgroundColor: "transparent",
//               transition: "all 0.3s ease",
//             }}
//             onMouseEnter={(e) => {
//               if (currentPage !== 1) {
//                 e.target.style.backgroundColor = "#059669";
//                 e.target.style.color = "#fff";
//                 e.target.style.boxShadow = "0 4px 12px rgba(5, 150, 105, 0.4)";
//               }
//             }}
//             onMouseLeave={(e) => {
//               if (currentPage !== 1) {
//                 e.target.style.backgroundColor = "transparent";
//                 e.target.style.color = "#059669";
//                 e.target.style.boxShadow = "none";
//               }
//             }}
//           >
//             Previous
//           </button>

//           {/* Page Numbers */}
//           {getPaginationRange().map((page, index) => (
//             page === '...' ? (
//               <span 
//                 key={`ellipsis-${index}`}
//                 style={{ 
//                   padding: "0 8px",
//                   color: "#6B7280",
//                   fontWeight: "bold",
//                 }}
//               >
//                 ...
//               </span>
//             ) : (
//               <button
//                 key={page}
//                 onClick={() => setCurrentPage(page)}
//                 style={{
//                   minWidth: "40px",
//                   height: "40px",
//                   borderRadius: "8px",
//                   fontWeight: "bold",
//                   fontSize: "14px",
//                   cursor: "pointer",
//                   border: "2px solid #10B981",
//                   color: currentPage === page ? "#FFFFFF" : "#059669",
//                   backgroundColor: currentPage === page ? "#10B981" : "transparent",
//                   transition: "all 0.3s ease",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.target.style.transform = "scale(1.1)";
//                   e.target.style.backgroundColor = "#059669";
//                   e.target.style.color = "#fff";
//                   e.target.style.boxShadow = "0 4px 12px rgba(5, 150, 105, 0.4)";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.transform = "scale(1)";
//                   if (currentPage !== page) {
//                     e.target.style.backgroundColor = "transparent";
//                     e.target.style.color = "#059669";
//                   } else {
//                     e.target.style.backgroundColor = "#10B981";
//                     e.target.style.color = "#FFFFFF";
//                   }
//                   e.target.style.boxShadow = "none";
//                 }}
//               >
//                 {page}
//               </button>
//             )
//           ))}

//           {/* Next Button */}
//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//             style={{
//               minWidth: "90px",
//               padding: "10px 20px",
//               borderRadius: "8px",
//               fontWeight: "bold",
//               fontSize: "14px",
//               cursor: currentPage === totalPages ? "not-allowed" : "pointer",
//               border: "2px solid",
//               borderColor: currentPage === totalPages ? "#D1D5DB" : "#10B981",
//               color: currentPage === totalPages ? "#9CA3AF" : "#059669",
//               backgroundColor: "transparent",
//               transition: "all 0.3s ease",
//             }}
//             onMouseEnter={(e) => {
//               if (currentPage !== totalPages) {
//                 e.target.style.backgroundColor = "#059669";
//                 e.target.style.color = "#fff";
//                 e.target.style.boxShadow = "0 4px 12px rgba(5, 150, 105, 0.4)";
//               }
//             }}
//             onMouseLeave={(e) => {
//               if (currentPage !== totalPages) {
//                 e.target.style.backgroundColor = "transparent";
//                 e.target.style.color = "#059669";
//                 e.target.style.boxShadow = "none";
//               }
//             }}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Funds;













// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { TrendingUp, ArrowRight, Star, Shield, Target } from "lucide-react";

// const Funds = () => {
//   const [allSchemes, setAllSchemes] = useState([]);
//   const [filteredSchemes, setFilteredSchemes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterStatus, setFilterStatus] = useState("active"); // dropdown state
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 30;

//   useEffect(() => {
//     const fetchAllSchemes = async () => {
//       try {
//         const res = await fetch("https://api.mfapi.in/mf");
//         const data = await res.json();
//         setAllSchemes(data);
//         setFilteredSchemes(data);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch schemes from MFAPI.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAllSchemes();
//   }, []);

//   // Filter based on search query and dropdown
//   useEffect(() => {
//     const query = searchQuery.toLowerCase();
//     const filtered = allSchemes
//       .filter((scheme) => {
//         const schemeName = scheme.schemeName || scheme.scheme_name || '';
//         const fundHouse = scheme.fundHouse || scheme.fund_house || '';
//         const category = scheme.schemeCategory || scheme.scheme_category || '';
//         return schemeName.toLowerCase().includes(query) ||
//                fundHouse.toLowerCase().includes(query) ||
//                category.toLowerCase().includes(query);
//       })
//       .filter((scheme) => {
//         if (filterStatus === "active") return scheme.isinGrowth !== null;
//         if (filterStatus === "inactive") return scheme.isinGrowth === null;
//         return true; // all
//       });

//     setFilteredSchemes(filtered);
//     setCurrentPage(1);
//   }, [searchQuery, filterStatus, allSchemes]);

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredSchemes.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredSchemes.length / itemsPerPage);

//   const getPaginationRange = () => {
//     const delta = 2;
//     const range = [];
//     const rangeWithDots = [];

//     range.push(1);
//     for (let i = currentPage - delta; i <= currentPage + delta; i++) {
//       if (i > 1 && i < totalPages) range.push(i);
//     }
//     if (totalPages > 1) range.push(totalPages);

//     let prev = 0;
//     for (const i of range) {
//       if (prev && i - prev > 1) rangeWithDots.push('...');
//       rangeWithDots.push(i);
//       prev = i;
//     }
//     return rangeWithDots;
//   };

//   // FundCard component (same as before)
//   const FundCard = ({ scheme }) => {
//     const [isHovered, setIsHovered] = useState(false);
//     const schemeName = scheme.schemeName || scheme.scheme_name || 'Unknown Scheme';
//     const schemeCode = scheme.schemeCode || scheme.scheme_code || 'N/A';
//     const schemeCategory = scheme.schemeCategory || scheme.scheme_category || 'Unknown Category';

//     const getCategoryStyle = (category) => {
//       const styles = {
//         Equity: { gradient: "linear-gradient(135deg, #059669, #10B981)", icon: <TrendingUp size={18} color="#fff" /> },
//         Debt: { gradient: "linear-gradient(135deg, #047857, #065F46)", icon: <Shield size={18} color="#fff" /> },
//         Hybrid: { gradient: "linear-gradient(135deg, #10B981, #34D399)", icon: <Target size={18} color="#fff" /> },
//         ELSS: { gradient: "linear-gradient(135deg, #059669, #6EE7B7)", icon: <Star size={18} color="#fff" /> },
//       };
//       const matchedKey = Object.keys(styles).find((key) => category?.toLowerCase().includes(key.toLowerCase()));
//       return styles[matchedKey] || styles["Equity"];
//     };

//     const seedBase = Number(String(schemeCode).replace(/\D/g, "")) || 1;
//     const seededRand = (m) => {
//       const x = Math.sin(seedBase * 9301 + m * 49297) * 233280;
//       return x - Math.floor(x);
//     };
//     const performanceIndicator = seededRand(1) > 0.5 ? "positive" : "negative";
//     const performanceValue = (seededRand(2) * 20 - 10).toFixed(2);
//     const categoryStyle = getCategoryStyle(schemeCategory);

//     return (
//       <Link href={`/scheme/${schemeCode}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
//         <div
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//           style={{
//             height: "100%",
//             display: "flex",
//             flexDirection: "column",
//             padding: "24px",
//             borderRadius: "12px",
//             backgroundColor: isHovered ? "#F0FDF4" : "#FFFFFF",
//             border: `1px solid ${isHovered ? "#10B981" : "#D1FAE5"}`,
//             boxShadow: isHovered ? "0 10px 30px rgba(5, 150, 105, 0.3)" : "0 4px 6px rgba(0, 0, 0, 0.1)",
//             cursor: "pointer",
//             transition: "all 0.3s ease",
//             transform: isHovered ? "scale(1.02)" : "scale(1)",
//           }}
//         >
//           {/* Header */}
//           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
//             <div style={{
//               display: "flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "8px",
//               background: categoryStyle.gradient, boxShadow: "0 2px 8px rgba(5, 150, 105, 0.25)"
//             }}>
//               {categoryStyle.icon}
//               <span style={{ color: "#fff", fontWeight: 600, fontSize: "12px" }}>{schemeCategory}</span>
//             </div>
//             <div style={{
//               display: "flex", alignItems: "center", gap: "4px", padding: "4px 12px", borderRadius: "8px",
//               fontWeight: 600, fontSize: "12px",
//               color: performanceIndicator === "positive" ? "#059669" : "#DC2626",
//               backgroundColor: performanceIndicator === "positive" ? "#D1FAE5" : "#FEE2E2"
//             }}>
//               <TrendingUp size={16} style={{ transform: performanceIndicator === "negative" ? "rotate(180deg)" : "none", transition: "transform 0.3s ease" }} />
//               <span>{performanceValue}%</span>
//             </div>
//           </div>

//           <h3 style={{ fontWeight: 700, fontSize: "18px", marginBottom: "16px", lineHeight: 1.3, flexGrow: 1, background: "linear-gradient(90deg, #047857, #10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }} title={schemeName}>
//             {schemeName}
//           </h3>

//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#6B7280", marginTop: "auto" }}>
//             <span>Code: {schemeCode}</span>
//             <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#059669", opacity: isHovered ? 1 : 0, transition: "opacity 0.3s ease", fontWeight: 600 }}>
//               <span>View Details</span>
//               <ArrowRight size={16} />
//             </div>
//           </div>
//         </div>
//       </Link>
//     );
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "48px 20px", backgroundColor: "#F9FAFB" }}>
//       <h1 style={{ textAlign: "center", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: "bold", marginBottom: "32px" }}>Mutual Fund Schemes</h1>

//       {/* Search + Dropdown */}
//       <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
//         <input
//           type="text"
//           placeholder="Search by Scheme Name, Fund House, or Category"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           style={{ width: "300px", padding: "12px", fontSize: "16px", borderRadius: "8px", border: "2px solid #D1FAE5" }}
//         />
//         <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: "12px", fontSize: "16px", borderRadius: "8px", border: "2px solid #D1FAE5" }}>
//           <option value="active">Active Funds</option>
//           <option value="inactive">Inactive Funds</option>
//           <option value="all">All Funds</option>
//         </select>
//       </div>

//       {/* Count of filtered funds */}
//       <p style={{ textAlign: "center", color: "#6B7280", fontSize: "14px", marginBottom: "32px" }}>
//         Showing {filteredSchemes.length} fund{filteredSchemes.length !== 1 ? 's' : ''}
//       </p>

//       {/* Grid */}
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
//         {currentItems.map((scheme) => (
//           <FundCard key={scheme.schemeCode || scheme.scheme_code || Math.random()} scheme={scheme} />
//         ))}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", flexWrap: "wrap", marginTop: "32px" }}>
//           {/* Previous */}
//           <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
//             Previous
//           </button>

//           {/* Page Numbers */}
//           {getPaginationRange().map((page, index) =>
//             page === "..." ? (
//               <span key={`ellipsis-${index}`} style={{ padding: "0 8px" }}>...</span>
//             ) : (
//               <button key={page} onClick={() => setCurrentPage(page)} style={{ fontWeight: currentPage === page ? "bold" : "normal" }}>
//                 {page}
//               </button>
//             )
//           )}

//           {/* Next */}
//           <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Funds;







"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  ArrowRight, 
  Star, 
  Shield, 
  Target, 
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";

const Funds = () => {
  const [allSchemes, setAllSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("active");
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  useEffect(() => {
    const fetchAllSchemes = async () => {
      try {
        const res = await fetch("https://api.mfapi.in/mf");
        const data = await res.json();
        setAllSchemes(data);
        setFilteredSchemes(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch schemes from MFAPI.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllSchemes();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = allSchemes
      .filter((scheme) => {
        const schemeName = scheme.schemeName || scheme.scheme_name || '';
        const fundHouse = scheme.fundHouse || scheme.fund_house || '';
        const category = scheme.schemeCategory || scheme.scheme_category || '';
        return schemeName.toLowerCase().includes(query) ||
               fundHouse.toLowerCase().includes(query) ||
               category.toLowerCase().includes(query);
      })
      .filter((scheme) => {
        if (filterStatus === "active") return scheme.isinGrowth !== null;
        if (filterStatus === "inactive") return scheme.isinGrowth === null;
        return true;
      });

    setFilteredSchemes(filtered);
    setCurrentPage(1);
  }, [searchQuery, filterStatus, allSchemes]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSchemes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSchemes.length / itemsPerPage);

  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    range.push(1);
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) range.push(i);
    }
    if (totalPages > 1) range.push(totalPages);

    let prev = 0;
    for (const i of range) {
      if (prev && i - prev > 1) rangeWithDots.push('...');
      rangeWithDots.push(i);
      prev = i;
    }
    return rangeWithDots;
  };

  const FundCard = ({ scheme }) => {
    const [isHovered, setIsHovered] = useState(false);
    const schemeName = scheme.schemeName || scheme.scheme_name || 'Unknown Scheme';
    const schemeCode = scheme.schemeCode || scheme.scheme_code || 'N/A';
    const schemeCategory = scheme.schemeCategory || scheme.scheme_category || 'Unknown Category';

    const getCategoryStyle = (category) => {
      const styles = {
        Equity: { 
          gradient: "from-emerald-600 to-teal-600", 
          bg: "bg-emerald-100",
          text: "text-emerald-700",
          icon: <TrendingUp size={16} /> 
        },
        Debt: { 
          gradient: "from-blue-600 to-indigo-600", 
          bg: "bg-blue-100",
          text: "text-blue-700",
          icon: <Shield size={16} /> 
        },
        Hybrid: { 
          gradient: "from-purple-600 to-pink-600", 
          bg: "bg-purple-100",
          text: "text-purple-700",
          icon: <Target size={16} /> 
        },
        ELSS: { 
          gradient: "from-amber-600 to-orange-600", 
          bg: "bg-amber-100",
          text: "text-amber-700",
          icon: <Star size={16} /> 
        },
      };
      const matchedKey = Object.keys(styles).find((key) => category?.toLowerCase().includes(key.toLowerCase()));
      return styles[matchedKey] || styles["Equity"];
    };

    const seedBase = Number(String(schemeCode).replace(/\D/g, "")) || 1;
    const seededRand = (m) => {
      const x = Math.sin(seedBase * 9301 + m * 49297) * 233280;
      return x - Math.floor(x);
    };
    const performanceIndicator = seededRand(1) > 0.5 ? "positive" : "negative";
    const performanceValue = (seededRand(2) * 20 - 10).toFixed(2);
    const categoryStyle = getCategoryStyle(schemeCategory);

    return (
      <Link href={`/scheme/${schemeCode}`} className="block h-full group">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`h-full flex flex-col p-6 rounded-2xl border-2 transition-all duration-300 ${
            isHovered 
              ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-400 shadow-2xl scale-[1.02]' 
              : 'bg-white border-gray-200 shadow-lg hover:shadow-xl'
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${categoryStyle.gradient} text-white shadow-lg`}>
              {categoryStyle.icon}
              <span className="font-semibold text-xs">{schemeCategory}</span>
            </div>
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-sm ${
              performanceIndicator === "positive" 
                ? "bg-emerald-100 text-emerald-700" 
                : "bg-red-100 text-red-700"
            }`}>
              <TrendingUp 
                size={16} 
                className={`transition-transform duration-300 ${
                  performanceIndicator === "negative" ? "rotate-180" : ""
                }`}
              />
              <span>{performanceValue}%</span>
            </div>
          </div>

          {/* Scheme Name */}
          <h3 
            className="font-bold text-lg mb-4 line-clamp-3 flex-grow bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-relaxed"
            title={schemeName}
          >
            {schemeName}
          </h3>

          {/* Footer */}
          <div className="flex justify-between items-center text-sm text-gray-600 mt-auto pt-4 border-t border-gray-200">
            <span className="font-medium">Code: {schemeCode}</span>
            <div className={`flex items-center gap-1 text-emerald-600 font-semibold transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <span>View Details</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    );
  };

  // Modern Loader Component
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-8 border-emerald-200 rounded-full"></div>
            <div className="absolute inset-0 border-8 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-3 border-8 border-teal-400 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Mutual Funds</h3>
          <p className="text-gray-600">Fetching the latest schemes for you...</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Mutual Fund Schemes
          </h1>
          <p className="text-gray-600 text-lg">
            Discover and invest in the best mutual funds
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by scheme name, fund house, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-12 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white cursor-pointer font-medium transition-all min-w-[180px]"
              >
                <option value="active">Active Funds</option>
                <option value="inactive">Inactive Funds</option>
                <option value="all">All Funds</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <p className="text-gray-600">
              Showing <span className="font-bold text-emerald-600">{filteredSchemes.length}</span> fund{filteredSchemes.length !== 1 ? 's' : ''}
            </p>
            <p className="text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>

        {/* Funds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentItems.map((scheme) => (
            <FundCard 
              key={scheme.schemeCode || scheme.scheme_code || Math.random()} 
              scheme={scheme} 
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 flex-wrap">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 transition-all font-medium flex items-center gap-2 shadow-sm"
            >
              <ChevronLeft size={18} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page Numbers */}
            {getPaginationRange().map((page, index) =>
              page === "..." ? (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-[44px] px-4 py-2 rounded-xl font-semibold transition-all shadow-sm ${
                    currentPage === page
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-110"
                      : "bg-white border-2 border-gray-200 text-gray-700 hover:bg-emerald-50 hover:border-emerald-400"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 transition-all font-medium flex items-center gap-2 shadow-sm"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Funds;