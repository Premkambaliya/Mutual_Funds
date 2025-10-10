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
//         <CircularProgress size={60} />
//       </Box>
//     );
//   }

//   if (!schemeData) {
//     return (
//       <Container sx={{ py: 6 }}>
//         <Typography variant="h6" color="error" textAlign="center">
//           Scheme not found.
//         </Typography>
//       </Container>
//     );
//   }

//   return (
//     <Container sx={{ py: { xs: 4, md: 6 }, maxWidth: "lg" }}>
//       <Fade in timeout={600}>
//         <Box>
//           {/* Scheme Metadata */}
//           <SchemeMeta scheme={schemeData.meta} />

//           {/* NAV Chart */}
//           <NavChart navData={schemeData.data} />

//           {/* Returns Table */}
//           <Box sx={{ mt: 4 }}>
//             <Typography variant="h5" gutterBottom>
//               Precomputed Returns
//             </Typography>
//             <TableContainer component={Paper} elevation={3}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     {returns &&
//                       Object.keys(returns).map((key) => (
//                         <TableCell key={key} align="center">
//                           {key}
//                         </TableCell>
//                       ))}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   <TableRow>
//                     {returns &&
//                       Object.values(returns).map((val, idx) => (
//                         <TableCell
//                           key={idx}
//                           align="center"
//                           sx={{
//                             color: val >= 0 ? "success.main" : "error.main",
//                             fontWeight: "bold",
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
//               sx={{ mb: 3 }}
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



"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Fade,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
} from "@mui/material";

import SchemeMeta from "@/components/SchemeMeta";
import NavChart from "@/components/NavChart";
import SIPCalculator from "@/components/SIPCalculator";
import SWPCalculator from "@/components/SWPCalculator";
import LumpsumCalculator from "@/components/LampsumCalculator";
import StepupCalculator from "@/components/StepupCalculator";
import RollingReturnsCalculator from "@/components/RollingReturns";

const SchemeDetailPage = () => {
  const { code } = useParams();
  const [schemeData, setSchemeData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Which calculator is active
  const [activeCalc, setActiveCalc] = useState("sip");

  // Precompute returns helper
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

    return {
      "1 Month": calcReturn(1),
      "3 Months": calcReturn(3),
      "6 Months": calcReturn(6),
      "1 Year": calcReturn(12),
    };
  };

  const [returns, setReturns] = useState(null);

  useEffect(() => {
    const fetchScheme = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.mfapi.in/mf/${code}`);
        const data = await res.json();
        setSchemeData(data);
        setReturns(computeReturns(data.data));
      } catch (err) {
        console.error("Error fetching scheme:", err);
        setSchemeData(null);
      } finally {
        setLoading(false);
      }
    };
    if (code) fetchScheme();
  }, [code]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress size={60} sx={{ color: "#10B981" }} />
      </Box>
    );
  }

  if (!schemeData) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography variant="h6" color="#DC2626" textAlign="center">
          Scheme not found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: { xs: 4, md: 6 }, maxWidth: "lg", backgroundColor: "#F9FAFB" }}>
      <Fade in timeout={600}>
        <Box>
          {/* Scheme Metadata */}
          <SchemeMeta scheme={schemeData.meta} />

          {/* NAV Chart */}
          <NavChart navData={schemeData.data} />

          {/* Returns Table */}
          <Box sx={{ mt: 4 }}>
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{
                color: "#047857",
                fontWeight: "bold",
                mb: 3,
              }}
            >
              Precomputed Returns
            </Typography>
            <TableContainer 
              component={Paper} 
              elevation={3}
              sx={{
                borderRadius: 3,
                border: "1px solid #D1FAE5",
                overflow: "hidden",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ background: "linear-gradient(135deg, #059669, #10B981)" }}>
                    {returns &&
                      Object.keys(returns).map((key) => (
                        <TableCell 
                          key={key} 
                          align="center"
                          sx={{
                            color: "#FFFFFF",
                            fontWeight: 700,
                            fontSize: "1rem",
                          }}
                        >
                          {key}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow sx={{ backgroundColor: "#F0FDF4" }}>
                    {returns &&
                      Object.values(returns).map((val, idx) => (
                        <TableCell
                          key={idx}
                          align="center"
                          sx={{
                            color: val >= 0 ? "#059669" : "#DC2626",
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                          }}
                        >
                          {val !== null ? `${val}%` : "N/A"}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Calculator Tabs */}
          <Box sx={{ mt: 6 }}>
            <Tabs
              value={activeCalc}
              onChange={(e, val) => setActiveCalc(val)}
              textColor="primary"
              indicatorColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              sx={{ 
                mb: 3,
                "& .MuiTab-root": {
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: "#6B7280",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#10B981",
                    backgroundColor: "#F0FDF4",
                  },
                  "&.Mui-selected": {
                    color: "#047857",
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#10B981",
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                },
              }}
            >
              <Tab value="sip" label="SIP Calculator" />
              <Tab value="swp" label="SWP Calculator" />
              <Tab value="lumpsum" label="Lumpsum Calculator" />
              <Tab value="stepup" label="Step-up Calculator" />
              <Tab value="rolling" label="Rolling Returns" />
            </Tabs>

            {/* Conditionally render calculators */}
            {activeCalc === "sip" && <SIPCalculator navData={schemeData.data} />}
            {activeCalc === "swp" && <SWPCalculator navData={schemeData.data} />}
            {activeCalc === "lumpsum" && <LumpsumCalculator navData={schemeData.data} />}
            {activeCalc === "stepup" && <StepupCalculator navData={schemeData.data} />}
            {activeCalc === "rolling" && <RollingReturnsCalculator navData={schemeData.data} />}
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};

export default SchemeDetailPage;