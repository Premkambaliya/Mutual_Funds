// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   MenuItem,
//   Button,
//   Card,
//   CardContent,
//   useTheme,
//   Grow,
// } from "@mui/material";
// import { LineChart } from "@mui/x-charts/LineChart";

// export default function SIPCalculator({ navData }) {
//   const theme = useTheme();

//   // Responsive chart width state and ref
//   const containerRef = useRef(null);
//   const [chartWidth, setChartWidth] = useState(900);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     const handleResize = () => {
//       const w = containerRef.current.clientWidth;
//       setChartWidth(w);
//     };

//     handleResize();

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const [sipAmount, setSipAmount] = useState(5000);
//   const [frequency, setFrequency] = useState("Monthly");
//   const [startDate, setStartDate] = useState(() => {
//     if (!navData || navData.length === 0) return "2020-01-01";
//     const earliest = navData[navData.length - 1].date; // navData is reversed
//     return earliest;
//   });
//   const [endDate, setEndDate] = useState(() => {
//     if (!navData || navData.length === 0) return new Date().toISOString().split("T")[0];
//     return navData[0].date;
//   });
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState("");

//   const calculateReturns = () => {
//     setError("");
//     if (sipAmount <= 0) {
//       setError("SIP Amount must be greater than zero.");
//       return;
//     }
//     if (new Date(startDate) > new Date(endDate)) {
//       setError("Start date must be before end date.");
//       return;
//     }
//     if (!navData || navData.length === 0) {
//       setError("NAV data not available.");
//       return;
//     }

//     const freqDays = frequency === "Monthly" ? 30 : 7;

//     let totalInvested = 0;
//     let totalUnits = 0;
//     const growth = [];

//     // Parse navData with Date objects, sorted ascending
//     const parsedData = navData
//       .map((d) => ({
//         date: new Date(d.date.split("-").reverse().join("-")),
//         nav: parseFloat(d.nav),
//       }))
//       .sort((a, b) => a.date - b.date);

//     const start = new Date(startDate);
//     const end = new Date(endDate);

//     // Helper: find nav on or before given date
//     const findNavOnOrBefore = (targetDate) => {
//       for (let i = parsedData.length - 1; i >= 0; i--) {
//         if (parsedData[i].date <= targetDate) return parsedData[i];
//       }
//       return null;
//     };

//     for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + freqDays)) {
//       const navEntry = findNavOnOrBefore(dt);
//       if (!navEntry) continue;

//       const units = sipAmount / navEntry.nav;
//       totalUnits += units;
//       totalInvested += sipAmount;

//       const currentValue = totalUnits * navEntry.nav;
//       growth.push({ date: dt.toISOString().split("T")[0], value: currentValue });
//     }

//     if (totalInvested === 0) {
//       setError("No investments made in the selected period.");
//       return;
//     }

//     const lastNav = findNavOnOrBefore(end);
//     const currentValue = totalUnits * (lastNav?.nav || 0);
//     const absReturn = ((currentValue - totalInvested) / totalInvested) * 100;
//     const years = (end - start) / (365 * 24 * 60 * 60 * 1000);
//     const annReturn = years > 0 ? Math.pow(currentValue / totalInvested, 1 / years) - 1 : 0;

//     setResult({
//       totalInvested,
//       totalUnits,
//       currentValue,
//       absReturn,
//       annReturn: annReturn * 100,
//       growth,
//     });
//   };

//   return (
//     <Box ref={containerRef}>
//       <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
//         SIP Calculator
//       </Typography>

//       {/* Input Form */}
//       <Box
//         component="form"
//         sx={{
//           display: "flex",
//           gap: 2,
//           mb: 3,
//           flexWrap: "wrap",
//           alignItems: "center",
//           maxWidth: 900,
//         }}
//         noValidate
//         autoComplete="off"
//         onSubmit={(e) => {
//           e.preventDefault();
//           calculateReturns();
//         }}
//       >
//         <TextField
//           label="SIP Amount (₹)"
//           type="number"
//           value={sipAmount}
//           onChange={(e) => setSipAmount(Number(e.target.value))}
//           inputProps={{ min: 1 }}
//           required
//           sx={{ flex: "1 1 150px" }}
//         />
//         <TextField
//           select
//           label="Frequency"
//           value={frequency}
//           onChange={(e) => setFrequency(e.target.value)}
//           sx={{ flex: "1 1 150px" }}
//         >
//           <MenuItem value="Monthly">Monthly</MenuItem>
//           <MenuItem value="Weekly">Weekly</MenuItem>
//         </TextField>
//         <TextField
//           label="From"
//           type="date"
//           value={startDate}
//           onChange={(e) => setStartDate(e.target.value)}
//           InputLabelProps={{ shrink: true }}
//           sx={{ flex: "1 1 180px" }}
//           inputProps={{ max: endDate }}
//           required
//         />
//         <TextField
//           label="To"
//           type="date"
//           value={endDate}
//           onChange={(e) => setEndDate(e.target.value)}
//           InputLabelProps={{ shrink: true }}
//           sx={{ flex: "1 1 180px" }}
//           inputProps={{ min: startDate, max: navData?.[0]?.date || undefined }}
//           required
//         />
//         <Button
//           variant="contained"
//           type="submit"
//           sx={{ height: 56, flex: "1 1 150px" }}
//           size="large"
//         >
//           Calculate Returns
//         </Button>
//       </Box>

//       {error && (
//         <Typography color="error" sx={{ mb: 2, fontWeight: "medium" }}>
//           {error}
//         </Typography>
//       )}

//       {/* Results */}
//       {result && (
//         <Grow in timeout={800}>
//           <Card sx={{ mt: 3, maxWidth: 900, boxShadow: 6 }}>
//             <CardContent>
//               <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
//                 Results
//               </Typography>
//               <Typography>
//                 <strong>Total Invested:</strong> ₹{result.totalInvested.toFixed(2)}
//               </Typography>
//               <Typography>
//                 <strong>Total Units:</strong> {result.totalUnits.toFixed(4)}
//               </Typography>
//               <Typography>
//                 <strong>Current Value:</strong> ₹{result.currentValue.toFixed(2)}
//               </Typography>
//               <Typography
//                 sx={{ color: result.absReturn >= 0 ? "success.main" : "error.main" }}
//               >
//                 <strong>Absolute Return:</strong> {result.absReturn.toFixed(2)}%
//               </Typography>
//               <Typography
//                 sx={{ color: result.annReturn >= 0 ? "success.main" : "error.main" }}
//               >
//                 <strong>Annualized Return:</strong> {result.annReturn.toFixed(2)}%
//               </Typography>

//               <Box sx={{ mt: 4 }}>
//                 <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
//                   Investment Growth Chart
//                 </Typography>
//                 <LineChart
//                   xAxis={[
//                     {
//                       scaleType: "point",
//                       data: result.growth.map((d) => d.date),
//                       label: "Date",
//                       labelProps: { fill: theme.palette.text.primary },
//                     },
//                   ]}
//                   series={[
//                     {
//                       data: result.growth.map((d) => d.value),
//                       label: "Investment Value (₹)",
//                       color: theme.palette.primary.main,
//                       lineProps: { strokeWidth: 2 },
//                     },
//                   ]}
//                   width={chartWidth}
//                   height={400}
//                 />
//               </Box>
//             </CardContent>
//           </Card>
//         </Grow>
//       )}
//     </Box>
//   );
// }



"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  useTheme,
  Grow,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

export default function SIPCalculator({ navData }) {
  const theme = useTheme();
  const containerRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(900);

  useEffect(() => {
    if (!containerRef.current) return;
    const handleResize = () => setChartWidth(containerRef.current.clientWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [sipAmount, setSipAmount] = useState(5000);
  const [frequency, setFrequency] = useState("Monthly");
  const [startDate, setStartDate] = useState(() => {
    if (!navData || navData.length === 0) return "2020-01-01";
    return navData[navData.length - 1].date;
  });
  const [endDate, setEndDate] = useState(() => {
    if (!navData || navData.length === 0)
      return new Date().toISOString().split("T")[0];
    return navData[0].date;
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const calculateReturns = () => {
    setError("");
    if (sipAmount <= 0) {
      setError("SIP Amount must be greater than zero.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError("Start date must be before end date.");
      return;
    }
    if (!navData || navData.length === 0) {
      setError("NAV data not available.");
      return;
    }

    // Parse NAV data, sort ascending, and parse dates correctly
    const parsedData = navData
      .map((d) => ({
        dateObj: new Date(d.date.split("-").reverse().join("-")),
        dateStr: d.date,
        nav: parseFloat(d.nav),
      }))
      .sort((a, b) => a.dateObj - b.dateObj);

    const freqDays = frequency === "Monthly" ? 30 : 7;

    let totalInvested = 0;
    let totalUnits = 0;
    let growth = [];

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Find NAV on or before given date and nav > 0
    const findNavOnOrBefore = (targetDate) => {
      for (let i = parsedData.length - 1; i >= 0; i--) {
        if (parsedData[i].dateObj <= targetDate && parsedData[i].nav > 0) {
          return parsedData[i];
        }
      }
      return null;
    };

    // Generate SIP dates
    let sipDates = [];
    for (
      let dt = new Date(start);
      dt <= end;
      dt.setDate(dt.getDate() + freqDays)
    ) {
      sipDates.push(new Date(dt));
    }

    let validSIPCount = 0;

    for (let sipDate of sipDates) {
      const navEntry = findNavOnOrBefore(sipDate);
      if (!navEntry) continue;

      const units = sipAmount / navEntry.nav;
      if (!isFinite(units)) continue;

      totalUnits += units;
      totalInvested += sipAmount;
      validSIPCount++;

      const currentValue = totalUnits * navEntry.nav;
      growth.push({
        date: navEntry.dateStr,
        value: currentValue,
      });
    }

    if (totalInvested === 0 || validSIPCount < 2) {
      setError(
        "No valid investments made in the selected period or insufficient NAV data."
      );
      setResult(null);
      return;
    }

    const lastNavEntry = findNavOnOrBefore(sipDates[sipDates.length - 1]) || findNavOnOrBefore(end);
    if (!lastNavEntry) {
      setError("Insufficient NAV data for chosen end date.");
      setResult(null);
      return;
    }

    const currentValue = totalUnits * lastNavEntry.nav;

    // Calculate years invested based on first SIP date to last NAV entry date
    const years =
      (lastNavEntry.dateObj - sipDates[0]) / (365 * 24 * 60 * 60 * 1000);

    const absReturn =
      totalInvested > 0
        ? ((currentValue - totalInvested) / totalInvested) * 100
        : 0;

    const annReturn =
      totalInvested > 0 && years > 0
        ? (Math.pow(currentValue / totalInvested, 1 / years) - 1) * 100
        : 0;

    setResult({
      totalInvested,
      totalUnits,
      currentValue,
      absReturn,
      annReturn,
      growth,
      validSIPCount,
    });
  };

  return (
    <Box ref={containerRef}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        SIP Calculator
      </Typography>
      <Box
        component="form"
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
          alignItems: "center",
          maxWidth: 900,
        }}
        noValidate
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          calculateReturns();
        }}
      >
        <TextField
          label="SIP Amount (₹)"
          type="number"
          value={sipAmount}
          onChange={(e) => setSipAmount(Number(e.target.value))}
          inputProps={{ min: 1 }}
          required
          sx={{ flex: "1 1 150px" }}
        />
        <TextField
          select
          label="Frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          sx={{ flex: "1 1 150px" }}
        >
          <MenuItem value="Monthly">Monthly</MenuItem>
          <MenuItem value="Weekly">Weekly</MenuItem>
        </TextField>
        <TextField
          label="From"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ flex: "1 1 180px" }}
          inputProps={{ max: endDate }}
          required
        />
        <TextField
          label="To"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ flex: "1 1 180px" }}
          inputProps={{ min: startDate, max: navData?.[0]?.date || undefined }}
          required
        />
        <Button
          variant="contained"
          type="submit"
          sx={{ height: 56, flex: "1 1 150px" }}
          size="large"
        >
          Calculate Returns
        </Button>
      </Box>
      {error && (
        <Typography color="error" sx={{ mb: 2, fontWeight: "medium" }}>
          {error}
        </Typography>
      )}
      {result && (
        <Grow in timeout={800}>
          <Card sx={{ mt: 3, maxWidth: 900, boxShadow: 6 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Results
              </Typography>
              <Typography>
                <strong>Total Invested:</strong> ₹{result.totalInvested.toFixed(2)}
              </Typography>
              <Typography>
                <strong>Total Units:</strong> {result.totalUnits.toFixed(4)}
              </Typography>
              <Typography>
                <strong>Current Value:</strong> ₹{result.currentValue.toFixed(2)}
              </Typography>
              <Typography
                sx={{ color: result.absReturn >= 0 ? "success.main" : "error.main" }}
              >
                <strong>Absolute Return:</strong> {result.absReturn.toFixed(2)}%
              </Typography>
              <Typography
                sx={{ color: result.annReturn >= 0 ? "success.main" : "error.main" }}
              >
                <strong>Annualized Return:</strong> {result.annReturn.toFixed(2)}%
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>SIPs made:</strong> {result.validSIPCount}
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Investment Growth Chart
                </Typography>
                <LineChart
                  xAxis={[
                    {
                      scaleType: "point",
                      data: result.growth.map((d) => d.date),
                      label: "Date",
                      labelProps: { fill: theme.palette.text.primary },
                    },
                  ]}
                  series={[
                    {
                      data: result.growth.map((d) => d.value),
                      label: "Investment Value (₹)",
                      color: theme.palette.primary.main,
                      lineProps: { strokeWidth: 2 },
                    },
                  ]}
                  width={chartWidth}
                  height={400}
                />
              </Box>
            </CardContent>
          </Card>
        </Grow>
      )}
    </Box>
  );
}
