// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import {
//   Container,
//   Typography,
//   CircularProgress,
//   Box,
//   Fade,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Tabs,
//   Tab,
// } from "@mui/material";

// import SchemeMeta from "@/components/SchemeMeta";
// import NavChart from "@/components/NavChart";
// import SIPCalculator from "@/components/SIPCalculator";
// import SWPCalculator from "@/components/SWPCalculator";
// import LumpsumCalculator from "@/components/LampsumCalculator";
// import StepupCalculator from "@/components/StepupCalculator";
// import RollingReturnsCalculator from "@/components/RollingReturns";
// import Button from '@mui/material/Button';
// import Stack from '@mui/material/Stack';

// const SchemeDetailPage = () => {
//   const { code } = useParams();
//   const [schemeData, setSchemeData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Which calculator is active
//   const [activeCalc, setActiveCalc] = useState("sip");

//   // Precompute returns helper
//   const computeReturns = (navData) => {
//     if (!navData || navData.length === 0) return null;

//     const parsed = navData
//       .map((d) => ({
//         date: new Date(d.date.split("-").reverse().join("-")),
//         nav: parseFloat(d.nav),
//       }))
//       .sort((a, b) => a.date - b.date);

//     const lastDate = parsed[parsed.length - 1].date;

//     const findNavOnOrBefore = (targetDate) => {
//       for (let i = parsed.length - 1; i >= 0; i--) {
//         if (parsed[i].date <= targetDate) return parsed[i];
//       }
//       return null;
//     };

//     const calcReturn = (months) => {
//       const startDate = new Date(lastDate);
//       startDate.setMonth(startDate.getMonth() - months);

//       const startNav = findNavOnOrBefore(startDate);
//       const endNav = parsed[parsed.length - 1];

//       if (!startNav || !endNav) return null;
//       const absReturn = ((endNav.nav - startNav.nav) / startNav.nav) * 100;
//       return absReturn.toFixed(2);
//     };

//     return {
//       "1 Month": calcReturn(1),
//       "3 Months": calcReturn(3),
//       "6 Months": calcReturn(6),
//       "1 Year": calcReturn(12),
//     };
//   };

//   const [returns, setReturns] = useState(null);

//   useEffect(() => {
//     const fetchScheme = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`https://api.mfapi.in/mf/${code}`);
//         const data = await res.json();
//         setSchemeData(data);
//         setReturns(computeReturns(data.data));
//       } catch (err) {
//         console.error("Error fetching scheme:", err);
//         setSchemeData(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (code) fetchScheme();
//   }, [code]);

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
//         <CircularProgress size={60} sx={{ color: "#10B981" }} />
//       </Box>
//     );
//   }

//   if (!schemeData) {
//     return (
//       <Container sx={{ py: 6 }}>
//         <Typography variant="h6" color="#DC2626" textAlign="center">
//           Scheme not found.
//         </Typography>
//       </Container>
//     );
//   }

//   return (
//     <Container sx={{ py: { xs: 4, md: 6 }, maxWidth: "lg", backgroundColor: "#F9FAFB" }}>
//       <Fade in timeout={600}>
//         <Box>
//           {/* Scheme Metadata */}
//           <SchemeMeta scheme={schemeData.meta} />

//           {/* Action Buttons */}
//           <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
//             <Button
//               variant="contained"
//               color="success"
//               onClick={async () => {
//                 try {
//                   const res = await fetch('/api/watchlist', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ scheme_code: Number(code) }),
//                   });
//                   if (!res.ok) throw new Error('Failed');
//                   alert('Added to watchlist');
//                 } catch (err) {
//                   console.error(err);
//                   alert('Could not add to watchlist');
//                 }
//               }}
//             >
//               Add to Watchlist
//             </Button>

//             <Button
//               variant="outlined"
//               color="primary"
//               onClick={async () => {
//                 try {
//                   // Create a default virtual portfolio if none exists, then add a small SIP entry
//                   const getRes = await fetch('/api/virtual-portfolio');
//                   const list = await getRes.json();
//                   let portfolio = list && list[0];
//                   if (!portfolio) {
//                     const createRes = await fetch('/api/virtual-portfolio', {
//                       method: 'POST',
//                       headers: { 'Content-Type': 'application/json' },
//                       body: JSON.stringify({ name: 'My Portfolio' }),
//                     });
//                     portfolio = await createRes.json();
//                   }

//                   // add a small SIP entry
//                   const patchRes = await fetch('/api/virtual-portfolio', {
//                     method: 'PATCH',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ id: portfolio._id, action: 'addSip', payload: { scheme_code: Number(code), startDate: new Date(), amount: 1000, frequency: 'monthly' } }),
//                   });
//                   if (!patchRes.ok) throw new Error('Failed adding SIP');
//                   alert('Virtual SIP added to your portfolio (simulated)');
//                 } catch (err) {
//                   console.error(err);
//                   alert('Could not add virtual SIP');
//                 }
//               }}
//             >
//               Add to Virtual Portfolio
//             </Button>
//           </Stack>

//           {/* NAV Chart */}
//           <NavChart navData={schemeData.data} />

//           {/* Returns Table */}
//           <Box sx={{ mt: 4 }}>
//             <Typography 
//               variant="h5" 
//               gutterBottom
//               sx={{
//                 color: "#047857",
//                 fontWeight: "bold",
//                 mb: 3,
//               }}
//             >
//               Precomputed Returns
//             </Typography>
//             <TableContainer 
//               component={Paper} 
//               elevation={3}
//               sx={{
//                 borderRadius: 3,
//                 border: "1px solid #D1FAE5",
//                 overflow: "hidden",
//               }}
//             >
//               <Table>
//                 <TableHead>
//                   <TableRow sx={{ background: "linear-gradient(135deg, #059669, #10B981)" }}>
//                     {returns &&
//                       Object.keys(returns).map((key) => (
//                         <TableCell 
//                           key={key} 
//                           align="center"
//                           sx={{
//                             color: "#FFFFFF",
//                             fontWeight: 700,
//                             fontSize: "1rem",
//                           }}
//                         >
//                           {key}
//                         </TableCell>
//                       ))}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   <TableRow sx={{ backgroundColor: "#F0FDF4" }}>
//                     {returns &&
//                       Object.values(returns).map((val, idx) => (
//                         <TableCell
//                           key={idx}
//                           align="center"
//                           sx={{
//                             color: val >= 0 ? "#059669" : "#DC2626",
//                             fontWeight: "bold",
//                             fontSize: "1.1rem",
//                           }}
//                         >
//                           {val !== null ? `${val}%` : "N/A"}
//                         </TableCell>
//                       ))}
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Box>

//           {/* Calculator Tabs */}
//           <Box sx={{ mt: 6 }}>
//             <Tabs
//               value={activeCalc}
//               onChange={(e, val) => setActiveCalc(val)}
//               textColor="primary"
//               indicatorColor="primary"
//               variant="scrollable"
//               scrollButtons="auto"
//               sx={{ 
//                 mb: 3,
//                 "& .MuiTab-root": {
//                   fontWeight: 600,
//                   fontSize: "0.95rem",
//                   color: "#6B7280",
//                   transition: "all 0.3s ease",
//                   "&:hover": {
//                     color: "#10B981",
//                     backgroundColor: "#F0FDF4",
//                   },
//                   "&.Mui-selected": {
//                     color: "#047857",
//                   },
//                 },
//                 "& .MuiTabs-indicator": {
//                   backgroundColor: "#10B981",
//                   height: 3,
//                   borderRadius: "3px 3px 0 0",
//                 },
//               }}
//             >
//               <Tab value="sip" label="SIP Calculator" />
//               <Tab value="swp" label="SWP Calculator" />
//               <Tab value="lumpsum" label="Lumpsum Calculator" />
//               <Tab value="stepup" label="Step-up Calculator" />
//               <Tab value="rolling" label="Rolling Returns" />
//             </Tabs>

//             {/* Conditionally render calculators */}
//             {activeCalc === "sip" && <SIPCalculator navData={schemeData.data} />}
//             {activeCalc === "swp" && <SWPCalculator navData={schemeData.data} />}
//             {activeCalc === "lumpsum" && <LumpsumCalculator navData={schemeData.data} />}
//             {activeCalc === "stepup" && <StepupCalculator navData={schemeData.data} />}
//             {activeCalc === "rolling" && <RollingReturnsCalculator navData={schemeData.data} />}
//           </Box>
//         </Box>
//       </Fade>
//     </Container>
//   );
// };

// export default SchemeDetailPage;



// "use client";
// import React, { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   Container,
//   Typography,
//   CircularProgress,
//   Box,
//   Fade,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Tabs,
//   Tab,
//   Button,
//   Stack,
// } from "@mui/material";
// import SchemeMeta from "@/components/SchemeMeta";
// import NavChart from "@/components/NavChart";
// import SIPCalculator from "@/components/SIPCalculator";
// import SWPCalculator from "@/components/SWPCalculator";
// import LumpsumCalculator from "@/components/LampsumCalculator";
// import StepupCalculator from "@/components/StepupCalculator";
// import RollingReturnsCalculator from "@/components/RollingReturns";

// const SchemeDetailPage = () => {
//   const { code } = useParams();
//   const router = useRouter();
//   const [schemeData, setSchemeData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeCalc, setActiveCalc] = useState("sip");
//   const [returns, setReturns] = useState(null);

//   const computeReturns = (navData) => {
//     if (!navData || navData.length === 0) return null;

//     const parsed = navData
//       .map((d) => ({
//         date: new Date(d.date.split("-").reverse().join("-")),
//         nav: parseFloat(d.nav),
//       }))
//       .sort((a, b) => a.date - b.date);

//     const lastDate = parsed[parsed.length - 1].date;

//     const findNavOnOrBefore = (targetDate) => {
//       for (let i = parsed.length - 1; i >= 0; i--) {
//         if (parsed[i].date <= targetDate) return parsed[i];
//       }
//       return null;
//     };

//     const calcReturn = (months) => {
//       const startDate = new Date(lastDate);
//       startDate.setMonth(startDate.getMonth() - months);

//       const startNav = findNavOnOrBefore(startDate);
//       const endNav = parsed[parsed.length - 1];

//       if (!startNav || !endNav) return null;
//       const absReturn = ((endNav.nav - startNav.nav) / startNav.nav) * 100;
//       return absReturn.toFixed(2);
//     };

//     const oneDay = () => {
//       const startDate = new Date(lastDate);
//       startDate.setDate(startDate.getDate() - 1);
//       const startNav = findNavOnOrBefore(startDate);
//       const endNav = parsed[parsed.length - 1];
//       if (!startNav || !endNav) return null;
//       const absReturn = ((endNav.nav - startNav.nav) / startNav.nav) * 100;
//       return absReturn.toFixed(2);
//     };

//     return {
//       "1 Day": oneDay(),
//       "1 Month": calcReturn(1),
//       "3 Months": calcReturn(3),
//       "6 Months": calcReturn(6),
//       "1 Year": calcReturn(12),
//     };
//   };

//   useEffect(() => {
//     const fetchScheme = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`https://api.mfapi.in/mf/${code}`);
//         if (!res.ok) throw new Error("Failed to fetch scheme");
//         const data = await res.json();
//         setSchemeData(data);
//         setReturns(computeReturns(data.data));
//       } catch (err) {
//         console.error("Error fetching scheme:", err);
//         setError("Scheme not found.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (code) fetchScheme();
//   }, [code]);

//   const addToWatchlist = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         router.push("/login");
//         return;
//       }

//       const res = await fetch("/api/watchlist", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           schemeCode: Number(code),
//           schemeName: schemeData?.meta?.scheme_name || "Unknown Fund",
//         }),
//       });

//       if (res.status === 401) {
//         localStorage.removeItem("token");
//         router.push("/login");
//         return;
//       }

//       if (!res.ok) throw new Error("Failed to add to watchlist");

//       alert("Added to watchlist");
//     } catch (err) {
//       console.error("Add to watchlist error:", err);
//       alert(`Could not add to watchlist: ${err.message}`);
//     }
//   };

//   const addToVirtualPortfolio = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         router.push("/login");
//         return;
//       }

//       const res = await fetch("/api/virtual-portfolio", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           schemeCode: Number(code),
//           schemeName: schemeData?.meta?.scheme_name || "Unknown Fund",
//           type: "SIP",
//           amount: 1000,
//           date: new Date().toISOString(),
//         }),
//       });

//       if (res.status === 401) {
//         localStorage.removeItem("token");
//         router.push("/login");
//         return;
//       }

//       if (!res.ok) throw new Error("Failed to add virtual SIP");

//       alert("Virtual SIP added to your portfolio (simulated)");
//     } catch (err) {
//       console.error("Add to virtual portfolio error:", err);
//       alert(`Could not add virtual SIP: ${err.message}`);
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
//         <CircularProgress size={60} sx={{ color: "#10B981" }} />
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

//   return (
//     <Container sx={{ py: { xs: 4, md: 6 }, maxWidth: "lg", backgroundColor: "#F9FAFB" }}>
//       <Fade in timeout={600}>
//         <Box>
//           {/* Scheme Metadata */}
//           <SchemeMeta scheme={schemeData.meta} />

//           {/* Action Buttons */}
//           <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
//             <Button variant="contained" color="success" onClick={addToWatchlist}>
//               Add to Watchlist
//             </Button>
//             <Button variant="outlined" color="primary" onClick={addToVirtualPortfolio}>
//               Add to Virtual Portfolio
//             </Button>
//           </Stack>

//           {/* NAV Chart */}
//           <NavChart navData={schemeData.data} />

//           {/* Returns Table */}
//           <Box sx={{ mt: 4 }}>
//             <Typography
//               variant="h5"
//               gutterBottom
//               sx={{
//                 color: "#047857",
//                 fontWeight: "bold",
//                 mb: 3,
//               }}
//             >
//               Precomputed Returns
//             </Typography>
//             <TableContainer
//               component={Paper}
//               elevation={3}
//               sx={{
//                 borderRadius: 3,
//                 border: "1px solid #D1FAE5",
//                 overflow: "hidden",
//               }}
//             >
//               <Table>
//                 <TableHead>
//                   <TableRow sx={{ background: "linear-gradient(135deg, #059669, #10B981)" }}>
//                     {returns &&
//                       Object.keys(returns).map((key) => (
//                         <TableCell
//                           key={key}
//                           align="center"
//                           sx={{
//                             color: "#FFFFFF",
//                             fontWeight: 700,
//                             fontSize: "1rem",
//                           }}
//                         >
//                           {key}
//                         </TableCell>
//                       ))}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   <TableRow sx={{ backgroundColor: "#F0FDF4" }}>
//                     {returns &&
//                       Object.values(returns).map((val, idx) => (
//                         <TableCell
//                           key={idx}
//                           align="center"
//                           sx={{
//                             color: val >= 0 ? "#059669" : "#DC2626",
//                             fontWeight: "bold",
//                             fontSize: "1.1rem",
//                           }}
//                         >
//                           {val !== null ? `${val}%` : "N/A"}
//                         </TableCell>
//                       ))}
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Box>

//           {/* Calculator Tabs */}
//           <Box sx={{ mt: 6 }}>
//             <Tabs
//               value={activeCalc}
//               onChange={(e, val) => setActiveCalc(val)}
//               textColor="primary"
//               indicatorColor="primary"
//               variant="scrollable"
//               scrollButtons="auto"
//               sx={{
//                 mb: 3,
//                 "& .MuiTab-root": {
//                   fontWeight: 600,
//                   fontSize: "0.95rem",
//                   color: "#6B7280",
//                   transition: "all 0.3s ease",
//                   "&:hover": {
//                     color: "#10B981",
//                     backgroundColor: "#F0FDF4",
//                   },
//                   "&.Mui-selected": {
//                     color: "#047857",
//                   },
//                 },
//                 "& .MuiTabs-indicator": {
//                   backgroundColor: "#10B981",
//                   height: 3,
//                   borderRadius: "3px 3px 0 0",
//                 },
//               }}
//             >
//               <Tab value="sip" label="SIP Calculator" />
//               <Tab value="swp" label="SWP Calculator" />
//               <Tab value="lumpsum" label="Lumpsum Calculator" />
//               <Tab value="stepup" label="Step-up Calculator" />
//               <Tab value="rolling" label="Rolling Returns" />
//             </Tabs>

//             {activeCalc === "sip" && <SIPCalculator navData={schemeData.data} />}
//             {activeCalc === "swp" && <SWPCalculator navData={schemeData.data} />}
//             {activeCalc === "lumpsum" && <LumpsumCalculator navData={schemeData.data} />}
//             {activeCalc === "stepup" && <StepupCalculator navData={schemeData.data} />}
//             {activeCalc === "rolling" && <RollingReturnsCalculator navData={schemeData.data} />}
//           </Box>
//         </Box>
//       </Fade>
//     </Container>
//   );
// };

// export default SchemeDetailPage;



// "use client";
// import React, { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   Container,
//   Typography,
//   CircularProgress,
//   Box,
//   Fade,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Tabs,
//   Tab,
//   Button,
//   Stack,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   TextField,
// } from "@mui/material";
// import SchemeMeta from "@/components/SchemeMeta";
// import NavChart from "@/components/NavChart";
// import SIPCalculator from "@/components/SIPCalculator";
// import SWPCalculator from "@/components/SWPCalculator";
// import LumpsumCalculator from "@/components/LampsumCalculator";
// import StepupCalculator from "@/components/StepupCalculator";
// import RollingReturnsCalculator from "@/components/RollingReturns";

// const SchemeDetailPage = () => {
//   const { code } = useParams();
//   const router = useRouter();
//   const [schemeData, setSchemeData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeCalc, setActiveCalc] = useState("sip");
//   const [returns, setReturns] = useState(null);
//   const [portfolios, setPortfolios] = useState([]);
//   const [selectedPortfolio, setSelectedPortfolio] = useState("");
//   const [newPortfolioName, setNewPortfolioName] = useState("");

//   const computeReturns = (navData) => {
//     if (!navData || navData.length === 0) return null;

//     const parsed = navData
//       .map((d) => ({
//         date: new Date(d.date.split("-").reverse().join("-")),
//         nav: parseFloat(d.nav),
//       }))
//       .sort((a, b) => a.date - b.date);

//     const lastDate = parsed[parsed.length - 1].date;

//     const findNavOnOrBefore = (targetDate) => {
//       for (let i = parsed.length - 1; i >= 0; i--) {
//         if (parsed[i].date <= targetDate) return parsed[i];
//       }
//       return null;
//     };

//     const calcReturn = (months) => {
//       const startDate = new Date(lastDate);
//       startDate.setMonth(startDate.getMonth() - months);

//       const startNav = findNavOnOrBefore(startDate);
//       const endNav = parsed[parsed.length - 1];

//       if (!startNav || !endNav) return null;
//       const absReturn = ((endNav.nav - startNav.nav) / startNav.nav) * 100;
//       return absReturn.toFixed(2);
//     };

//     const oneDay = () => {
//       const startDate = new Date(lastDate);
//       startDate.setDate(startDate.getDate() - 1);
//       const startNav = findNavOnOrBefore(startDate);
//       const endNav = parsed[parsed.length - 1];
//       if (!startNav || !endNav) return null;
//       const absReturn = ((endNav.nav - startNav.nav) / startNav.nav) * 100;
//       return absReturn.toFixed(2);
//     };

//     return {
//       "1 Day": oneDay(),
//       "1 Month": calcReturn(1),
//       "3 Months": calcReturn(3),
//       "6 Months": calcReturn(6),
//       "1 Year": calcReturn(12),
//     };
//   };

//   useEffect(() => {
//     const fetchSchemeAndPortfolios = async () => {
//       setLoading(true);
//       try {
//         // Fetch scheme data
//         const res = await fetch(`https://api.mfapi.in/mf/${code}`);
//         if (!res.ok) {
//           throw new Error(`Failed to fetch scheme: ${res.status}`);
//         }
//         const data = await res.json();
//         setSchemeData(data);
//         setReturns(computeReturns(data.data));

//         // Fetch portfolios
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("Please log in to view portfolios");
//           router.push("/login");
//           return;
//         }

//         const portfolioRes = await fetch("/api/virtual-portfolio", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (portfolioRes.status === 401) {
//           localStorage.removeItem("token");
//           setError("Session expired. Please log in again.");
//           router.push("/login");
//           return;
//         }

//         if (!portfolioRes.ok) {
//           throw new Error(`Failed to fetch portfolios: ${portfolioRes.status}`);
//         }

//         const portfolioData = await portfolioRes.json();
//         if (!portfolioData.portfolios) {
//           console.warn("No portfolios field in response:", portfolioData);
//           setPortfolios([]);
//         } else {
//           setPortfolios(portfolioData.portfolios);
//           if (portfolioData.portfolios.length > 0) {
//             setSelectedPortfolio(portfolioData.portfolios[0].name);
//           }
//         }
//       } catch (err) {
//         console.error("Error in fetchSchemeAndPortfolios:", err.message);
//         setError(`Failed to load data: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (code) fetchSchemeAndPortfolios();
//   }, [code, router]);

//   const addToWatchlist = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Please log in to add to watchlist");
//         router.push("/login");
//         return;
//       }

//       const res = await fetch("/api/watchlist", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           schemeCode: Number(code),
//           schemeName: schemeData?.meta?.scheme_name || "Unknown Fund",
//         }),
//       });

//       if (res.status === 401) {
//         localStorage.removeItem("token");
//         setError("Session expired. Please log in again.");
//         router.push("/login");
//         return;
//       }

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Failed to add to watchlist");
//       }

//       alert("Added to watchlist");
//     } catch (err) {
//       console.error("Add to watchlist error:", err);
//       alert(`Could not add to watchlist: ${err.message}`);
//     }
//   };

//   const addToVirtualPortfolio = async () => {
//     if (!selectedPortfolio && !newPortfolioName) {
//       alert("Please select a portfolio or enter a new portfolio name");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Please log in to add to portfolio");
//         router.push("/login");
//         return;
//       }

//       const portfolioName = selectedPortfolio || newPortfolioName;
//       const res = await fetch("/api/virtual-portfolio", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           portfolioName,
//           schemeCode: Number(code),
//           schemeName: schemeData?.meta?.scheme_name || "Unknown Fund",
//           type: "SIP",
//           amount: 1000,
//           date: new Date().toISOString(),
//         }),
//       });

//       if (res.status === 401) {
//         localStorage.removeItem("token");
//         setError("Session expired. Please log in again.");
//         router.push("/login");
//         return;
//       }

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Failed to add virtual SIP");
//       }

//       const data = await res.json();
//       setPortfolios(data.portfolios || []);
//       setSelectedPortfolio(portfolioName);
//       setNewPortfolioName("");
//       alert(`Virtual SIP added to ${portfolioName}`);
//     } catch (err) {
//       console.error("Add to virtual portfolio error:", err);
//       alert(`Could not add virtual SIP: ${err.message}`);
//     }
//   };

//   const createPortfolio = async () => {
//     if (!newPortfolioName) {
//       alert("Please enter a portfolio name");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Please log in to create a portfolio");
//         router.push("/login");
//         return;
//       }

//       const res = await fetch("/api/virtual-portfolio", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ portfolioName: newPortfolioName }),
//       });

//       if (res.status === 401) {
//         localStorage.removeItem("token");
//         setError("Session expired. Please log in again.");
//         router.push("/login");
//         return;
//       }

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Failed to create portfolio");
//       }

//       const data = await res.json();
//       setPortfolios(data.portfolios || []);
//       setSelectedPortfolio(newPortfolioName);
//       setNewPortfolioName("");
//       alert(`Portfolio ${newPortfolioName} created`);
//     } catch (err) {
//       console.error("Create portfolio error:", err);
//       alert(`Could not create portfolio: ${err.message}`);
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
//         <CircularProgress size={60} sx={{ color: "#10B981" }} />
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

//   return (
//     <Container sx={{ py: { xs: 4, md: 6 }, maxWidth: "lg", backgroundColor: "#F9FAFB" }}>
//       <Fade in timeout={600}>
//         <Box>
//           <SchemeMeta scheme={schemeData.meta} />
//           <Stack direction="row" spacing={2} sx={{ mt: 3, alignItems: "center" }}>
//             <Button variant="contained" color="success" onClick={addToWatchlist}>
//               Add to Watchlist
//             </Button>
//             <FormControl sx={{ minWidth: 200 }}>
//               <InputLabel>Select Portfolio</InputLabel>
//               <Select
//                 value={selectedPortfolio}
//                 onChange={(e) => setSelectedPortfolio(e.target.value)}
//               >
//                 <MenuItem value="">
//                   <em>Create or Select Portfolio</em>
//                 </MenuItem>
//                 {portfolios.map((portfolio) => (
//                   <MenuItem key={portfolio.name} value={portfolio.name}>
//                     {portfolio.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <TextField
//               label="New Portfolio Name"
//               value={newPortfolioName}
//               onChange={(e) => setNewPortfolioName(e.target.value)}
//               size="small"
//               sx={{ minWidth: 200 }}
//             />
//             <Button variant="outlined" color="secondary" onClick={createPortfolio}>
//               Create Portfolio
//             </Button>
//             <Button variant="outlined" color="primary" onClick={addToVirtualPortfolio}>
//               Add to Virtual Portfolio
//             </Button>
//           </Stack>
//           <NavChart navData={schemeData.data} />
//           <Box sx={{ mt: 4 }}>
//             <Typography
//               variant="h5"
//               gutterBottom
//               sx={{
//                 color: "#047857",
//                 fontWeight: "bold",
//                 mb: 3,
//               }}
//             >
//               Precomputed Returns
//             </Typography>
//             <TableContainer
//               component={Paper}
//               elevation={3}
//               sx={{
//                 borderRadius: 3,
//                 border: "1px solid #D1FAE5",
//                 overflow: "hidden",
//               }}
//             >
//               <Table>
//                 <TableHead>
//                   <TableRow sx={{ background: "linear-gradient(135deg, #059669, #10B981)" }}>
//                     {returns &&
//                       Object.keys(returns).map((key) => (
//                         <TableCell
//                           key={key}
//                           align="center"
//                           sx={{
//                             color: "#FFFFFF",
//                             fontWeight: 700,
//                             fontSize: "1rem",
//                           }}
//                         >
//                           {key}
//                         </TableCell>
//                       ))}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   <TableRow sx={{ backgroundColor: "#F0FDF4" }}>
//                     {returns &&
//                       Object.values(returns).map((val, idx) => (
//                         <TableCell
//                           key={idx}
//                           align="center"
//                           sx={{
//                             color: val >= 0 ? "#059669" : "#DC2626",
//                             fontWeight: "bold",
//                             fontSize: "1.1rem",
//                           }}
//                         >
//                           {val !== null ? `${val}%` : "N/A"}
//                         </TableCell>
//                       ))}
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Box>
//           <Box sx={{ mt: 6 }}>
//             <Tabs
//               value={activeCalc}
//               onChange={(e, val) => setActiveCalc(val)}
//               textColor="primary"
//               indicatorColor="primary"
//               variant="scrollable"
//               scrollButtons="auto"
//               sx={{
//                 mb: 3,
//                 "& .MuiTab-root": {
//                   fontWeight: 600,
//                   fontSize: "0.95rem",
//                   color: "#6B7280",
//                   transition: "all 0.3s ease",
//                   "&:hover": {
//                     color: "#10B981",
//                     backgroundColor: "#F0FDF4",
//                   },
//                   "&.Mui-selected": {
//                     color: "#047857",
//                   },
//                 },
//                 "& .MuiTabs-indicator": {
//                   backgroundColor: "#10B981",
//                   height: 3,
//                   borderRadius: "3px 3px 0 0",
//                 },
//               }}
//             >
//               <Tab value="sip" label="SIP Calculator" />
//               <Tab value="swp" label="SWP Calculator" />
//               <Tab value="lumpsum" label="Lumpsum Calculator" />
//               <Tab value="stepup" label="Step-up Calculator" />
//               <Tab value="rolling" label="Rolling Returns" />
//             </Tabs>
//             {activeCalc === "sip" && <SIPCalculator navData={schemeData.data} />}
//             {activeCalc === "swp" && <SWPCalculator navData={schemeData.data} />}
//             {activeCalc === "lumpsum" && <LumpsumCalculator navData={schemeData.data} />}
//             {activeCalc === "stepup" && <StepupCalculator navData={schemeData.data} />}
//             {activeCalc === "rolling" && <RollingReturnsCalculator navData={schemeData.data} />}
//           </Box>
//         </Box>
//       </Fade>
//     </Container>
//   );
// };

// export default SchemeDetailPage;

















"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Plus,
  Calculator,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  PieChart,
  Wallet,
  Loader2,
  AlertCircle,
  ChevronRight
} from "lucide-react";
import SchemeMeta from "@/components/SchemeMeta";
import NavChart from "@/components/NavChart";
import SIPCalculator from "@/components/SIPCalculator";
import SWPCalculator from "@/components/SWPCalculator";
import LumpsumCalculator from "@/components/LampsumCalculator";
import StepupCalculator from "@/components/StepupCalculator";
import RollingReturnsCalculator from "@/components/RollingReturns";

const SchemeDetailPage = () => {
  const { code } = useParams();
  const router = useRouter();
  const [schemeData, setSchemeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCalc, setActiveCalc] = useState("sip");
  const [returns, setReturns] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState("");
  const [newPortfolioName, setNewPortfolioName] = useState("");

  const computeReturns = (navData) => {
    if (!navData || navData.length === 0) return null;

    const parsed = navData
      .map((d) => ({
        date: new Date(d.date.split("-").reverse().join("-")),
        nav: parseFloat(d.nav),
      }))
      .sort((a, b) => a.date - b.date);

    const lastDate = parsed[parsed.length - 1].date;

    const findNavOnOrBefore = (targetDate) => {
      for (let i = parsed.length - 1; i >= 0; i--) {
        if (parsed[i].date <= targetDate) return parsed[i];
      }
      return null;
    };

    const calcReturn = (months) => {
      const startDate = new Date(lastDate);
      startDate.setMonth(startDate.getMonth() - months);

      const startNav = findNavOnOrBefore(startDate);
      const endNav = parsed[parsed.length - 1];

      if (!startNav || !endNav) return null;
      const absReturn = ((endNav.nav - startNav.nav) / startNav.nav) * 100;
      return absReturn.toFixed(2);
    };

    const oneDay = () => {
      const startDate = new Date(lastDate);
      startDate.setDate(startDate.getDate() - 1);
      const startNav = findNavOnOrBefore(startDate);
      const endNav = parsed[parsed.length - 1];
      if (!startNav || !endNav) return null;
      const absReturn = ((endNav.nav - startNav.nav) / startNav.nav) * 100;
      return absReturn.toFixed(2);
    };

    return {
      "1D": oneDay(),
      "1M": calcReturn(1),
      "3M": calcReturn(3),
      "6M": calcReturn(6),
      "1Y": calcReturn(12),
    };
  };

  useEffect(() => {
    const fetchSchemeAndPortfolios = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/scheme/${code}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch scheme: ${res.status}`);
        }
        const data = await res.json();
        setSchemeData(data);
        setReturns(computeReturns(data.data));

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view portfolios");
          router.push("/login");
          return;
        }

        const portfolioRes = await fetch("/api/virtual-portfolio", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (portfolioRes.status === 401) {
          localStorage.removeItem("token");
          setError("Session expired. Please log in again.");
          router.push("/login");
          return;
        }

        if (!portfolioRes.ok) {
          throw new Error(`Failed to fetch portfolios: ${portfolioRes.status}`);
        }

        const portfolioData = await portfolioRes.json();
        if (!portfolioData.portfolios) {
          setPortfolios([]);
        } else {
          setPortfolios(portfolioData.portfolios);
          if (portfolioData.portfolios.length > 0) {
            setSelectedPortfolio(portfolioData.portfolios[0].name);
          }
        }
      } catch (err) {
        console.error("Error in fetchSchemeAndPortfolios:", err.message);
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (code) fetchSchemeAndPortfolios();
  }, [code, router]);

  const addToWatchlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to add to watchlist");
        router.push("/login");
        return;
      }

      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          schemeCode: Number(code),
          schemeName: schemeData?.meta?.scheme_name || "Unknown Fund",
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        setError("Session expired. Please log in again.");
        router.push("/login");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add to watchlist");
      }

      alert("Added to watchlist successfully!");
    } catch (err) {
      console.error("Add to watchlist error:", err);
      alert(`Could not add to watchlist: ${err.message}`);
    }
  };

  const addToVirtualPortfolio = async () => {
    if (!selectedPortfolio && !newPortfolioName) {
      alert("Please select a portfolio or enter a new portfolio name");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to add to portfolio");
        router.push("/login");
        return;
      }

      const portfolioName = selectedPortfolio || newPortfolioName;
      const res = await fetch("/api/virtual-portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          portfolioName,
          schemeCode: Number(code),
          schemeName: schemeData?.meta?.scheme_name || "Unknown Fund",
          type: "SIP",
          amount: 1000,
          date: new Date().toISOString(),
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        setError("Session expired. Please log in again.");
        router.push("/login");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add virtual SIP");
      }

      const data = await res.json();
      setPortfolios(data.portfolios || []);
      setSelectedPortfolio(portfolioName);
      setNewPortfolioName("");
      alert(`Virtual SIP added to ${portfolioName} successfully!`);
    } catch (err) {
      console.error("Add to virtual portfolio error:", err);
      alert(`Could not add virtual SIP: ${err.message}`);
    }
  };

  const createPortfolio = async () => {
    if (!newPortfolioName) {
      alert("Please enter a portfolio name");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to create a portfolio");
        router.push("/login");
        return;
      }

      const res = await fetch("/api/virtual-portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ portfolioName: newPortfolioName }),
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        setError("Session expired. Please log in again.");
        router.push("/login");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create portfolio");
      }

      const data = await res.json();
      setPortfolios(data.portfolios || []);
      setSelectedPortfolio(newPortfolioName);
      setNewPortfolioName("");
      alert(`Portfolio ${newPortfolioName} created successfully!`);
    } catch (err) {
      console.error("Create portfolio error:", err);
      alert(`Could not create portfolio: ${err.message}`);
    }
  };

  const calculators = [
    { id: "sip", label: "SIP Calculator", icon: Calculator },
    { id: "swp", label: "SWP Calculator", icon: TrendingDown },
    { id: "lumpsum", label: "Lumpsum", icon: Wallet },
    { id: "stepup", label: "Step-up SIP", icon: TrendingUp },
    { id: "rolling", label: "Rolling Returns", icon: PieChart },
  ];

  // Modern Loader
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-8 border-emerald-200 rounded-full"></div>
            <div className="absolute inset-0 border-8 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-3 border-8 border-teal-400 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Scheme Details</h3>
          <p className="text-gray-600">Fetching latest NAV and performance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-600" size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Data</h3>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Scheme Meta Component */}
        <div className="mb-6">
          <SchemeMeta scheme={schemeData.meta} />
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="text-emerald-600" size={20} />
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Add to Watchlist */}
            <button
              onClick={addToWatchlist}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              <Eye size={20} />
              Add to Watchlist
            </button>

            {/* Create Portfolio */}
            <button
              onClick={createPortfolio}
              disabled={!newPortfolioName}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Create New Portfolio
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Portfolio Selection */}
            <div className="relative">
              <select
                value={selectedPortfolio}
                onChange={(e) => setSelectedPortfolio(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white cursor-pointer font-medium transition-all"
              >
                <option value="">Select Portfolio</option>
                {portfolios.map((portfolio) => (
                  <option key={portfolio.name} value={portfolio.name}>
                    {portfolio.name}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" size={20} />
            </div>

            {/* New Portfolio Name */}
            <input
              type="text"
              placeholder="New portfolio name"
              value={newPortfolioName}
              onChange={(e) => setNewPortfolioName(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />

            {/* Add to Portfolio */}
            <button
              onClick={addToVirtualPortfolio}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              <Wallet size={20} />
              Add to Portfolio
            </button>
          </div>
        </div>

        {/* NAV Chart */}
        <div className="mb-8">
          <NavChart navData={schemeData.data} />
        </div>

        {/* Returns Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 mb-8">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp size={24} />
              Performance Returns
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {returns && Object.entries(returns).map(([period, value]) => {
                const isPositive = value >= 0;
                const isNull = value === null;
                
                return (
                  <div key={period} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                    <div className="text-sm text-gray-600 mb-2 font-medium">{period}</div>
                    <div className="flex items-center gap-2">
                      {!isNull && (
                        <>
                          {isPositive ? (
                            <ArrowUpRight size={20} className="text-emerald-600" />
                          ) : (
                            <ArrowDownRight size={20} className="text-red-600" />
                          )}
                        </>
                      )}
                      <span className={`text-2xl font-bold ${
                        isNull ? 'text-gray-400' : isPositive ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {isNull ? 'N/A' : `${value > 0 ? '+' : ''}${value}%`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Calculators Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Calculator size={24} />
              Investment Calculators
            </h3>
          </div>

          {/* Calculator Tabs */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex">
              {calculators.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveCalc(id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                    activeCalc === id
                      ? 'text-emerald-600 border-b-4 border-emerald-600 bg-emerald-50'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Calculator Content */}
          <div className="p-6">
            {activeCalc === "sip" && <SIPCalculator navData={schemeData.data} />}
            {activeCalc === "swp" && <SWPCalculator navData={schemeData.data} />}
            {activeCalc === "lumpsum" && <LumpsumCalculator navData={schemeData.data} />}
            {activeCalc === "stepup" && <StepupCalculator navData={schemeData.data} />}
            {activeCalc === "rolling" && <RollingReturnsCalculator navData={schemeData.data} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetailPage;