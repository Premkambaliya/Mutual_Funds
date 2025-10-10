// import React, { useState, useRef, useEffect } from "react";
// import { Box, Typography, TextField, Button, Card, CardContent, useTheme, Grow, MenuItem, Select } from "@mui/material";
// import { LineChart } from "@mui/x-charts/LineChart";

// const periodOptions = [
//   { label: "Monthly", value: "monthly" },
//   { label: "Quarterly", value: "quarterly" },
//   { label: "Yearly", value: "yearly" },
// ];

// function getGrowthData(investment, years, period) {
//   let points = [];
//   let n = 0;
//   let periods = 0;
//   let label = "";
//   let annualRate = 0.12;
//   let rate = 0;

//   if (period === "monthly") {
//     periods = years * 12;
//     rate = Math.pow(1 + annualRate, 1 / 12) - 1;
//     label = "Month";
//   } else if (period === "quarterly") {
//     periods = years * 4;
//     rate = Math.pow(1 + annualRate, 1 / 4) - 1;
//     label = "Quarter";
//   } else {
//     periods = years;
//     rate = annualRate;
//     label = "Year";
//   }

//   let value = investment;
//   for (let i = 0; i <= periods; i++) {
//     points.push({
//       x: `${label} ${i}`,
//       y: parseFloat(value.toFixed(2)),
//     });
//     value *= 1 + rate;
//   }
//   return points;
// }

// export default function StockCAGRCalculator() {
//   const theme = useTheme();
//   const containerRef = useRef(null);
//   const [chartWidth, setChartWidth] = useState(900);
//   useEffect(() => {
//     if (!containerRef.current) return;
//     const handleResize = () => setChartWidth(containerRef.current.clientWidth);
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const [investment, setInvestment] = useState(100000);
//   const [years, setYears] = useState(5);
//   const [period, setPeriod] = useState("yearly");
//   const [result, setResult] = useState(null);

//   const handleCalculate = () => {
//     const growth = getGrowthData(investment, years, period);
//     setResult({
//       investment,
//       years,
//       period,
//       finalValue: growth[growth.length-1].y,
//       growth,
//     });
//   };

//   return (
//     <Box ref={containerRef}>
//       <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
//         Stock CAGR Growth Calculator
//       </Typography>
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
//         onSubmit={e => {
//           e.preventDefault();
//           handleCalculate();
//         }}
//       >
//         <TextField
//           label="Investment Amount (₹)"
//           type="number"
//           value={investment}
//           onChange={e => setInvestment(Number(e.target.value))}
//           inputProps={{ min: 1 }}
//           required
//           sx={{ flex: "1 1 200px" }}
//         />
//         <TextField
//           label="Years"
//           type="number"
//           value={years}
//           onChange={e => setYears(Number(e.target.value))}
//           inputProps={{ min: 1 }}
//           required
//           sx={{ flex: "1 1 120px" }}
//         />
//         <Select
//           value={period}
//           onChange={e => setPeriod(e.target.value)}
//           sx={{ minWidth: 120 }}
//         >
//           {periodOptions.map(opt => (
//             <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
//           ))}
//         </Select>
//         <Button
//           variant="contained"
//           type="submit"
//           sx={{ height: 56, flex: "1 1 150px" }}
//           size="large"
//         >
//           Calculate
//         </Button>
//       </Box>
//       {result && (
//         <Grow in timeout={800}>
//           <Card sx={{ mt: 3, maxWidth: 900, boxShadow: 6 }}>
//             <CardContent>
//               <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
//                 Results
//               </Typography>
//               <Typography>
//                 <strong>Invested Amount:</strong> ₹{result.investment.toFixed(2)}
//               </Typography>
//               <Typography>
//                 <strong>Final Value ({result.years} years):</strong> ₹{result.finalValue.toFixed(2)}
//               </Typography>
//               <Box sx={{ mt: 4 }}>
//                 <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
//                   Investment Growth Chart
//                 </Typography>
//                 <LineChart
//                   xAxis={[{
//                     scaleType: "point",
//                     data: result.growth.map(d => d.x),
//                     label: "Period",
//                     labelProps: { fill: theme.palette.text.primary },
//                   }]}
//                   series={[{
//                     data: result.growth.map(d => d.y),
//                     label: "Investment Value (₹)",
//                     color: theme.palette.primary.main,
//                     lineProps: { strokeWidth: 2 },
//                   }]}
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



import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, TextField, Button, Card, CardContent, useTheme, Grow, MenuItem, Select } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

const periodOptions = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Yearly", value: "yearly" },
];

// Utility to generate a random float between min and max
function getRandomRate(min = 10, max = 15) {
  return Math.random() * (max - min) + min;
}

function getGrowthData(investment, years, period, annualRate) {
  let points = [];
  let n = 0;
  let periods = 0;
  let label = "";
  let rate = 0;

  annualRate = annualRate / 100; // convert to decimal

  if (period === "monthly") {
    periods = years * 12;
    rate = Math.pow(1 + annualRate, 1 / 12) - 1;
    label = "Month";
  } else if (period === "quarterly") {
    periods = years * 4;
    rate = Math.pow(1 + annualRate, 1 / 4) - 1;
    label = "Quarter";
  } else {
    periods = years;
    rate = annualRate;
    label = "Year";
  }

  let value = investment;
  for (let i = 0; i <= periods; i++) {
    points.push({
      x: `${label} ${i}`,
      y: parseFloat(value.toFixed(2)),
    });
    value *= 1 + rate;
  }
  return points;
}

export default function StockCAGRCalculator() {
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

  const [investment, setInvestment] = useState(100000);
  const [years, setYears] = useState(10);
  const [period, setPeriod] = useState("quarterly");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const annualReturnPercent = parseFloat(getRandomRate(10, 15).toFixed(2));
    const growth = getGrowthData(investment, years, period, annualReturnPercent);
    const finalValue = growth[growth.length-1].y;
    const totalReturn = finalValue - investment;
    setResult({
      investment,
      years,
      period,
      finalValue,
      annualReturnPercent,
      totalReturn,
      growth,
    });
  };

  return (
    <Box ref={containerRef}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        Stock CAGR Growth Calculator
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
        onSubmit={e => {
          e.preventDefault();
          handleCalculate();
        }}
      >
        <TextField
          label="Investment Amount (₹)"
          type="number"
          value={investment}
          onChange={e => setInvestment(Number(e.target.value))}
          inputProps={{ min: 1 }}
          required
          sx={{ flex: "1 1 200px" }}
        />
        <TextField
          label="Years"
          type="number"
          value={years}
          onChange={e => setYears(Number(e.target.value))}
          inputProps={{ min: 1 }}
          required
          sx={{ flex: "1 1 120px" }}
        />
        <Select
          value={period}
          onChange={e => setPeriod(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          {periodOptions.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          type="submit"
          sx={{ height: 56, flex: "1 1 150px" }}
          size="large"
        >
          Calculate
        </Button>
      </Box>
      {result && (
        <Grow in timeout={800}>
          <Card sx={{ mt: 3, maxWidth: 900, boxShadow: 6 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Results
              </Typography>
              <Typography>
                <strong>Invested Amount:</strong> ₹{result.investment.toFixed(2)}
              </Typography>
              <Typography>
                <strong>Annual Return Used:</strong> {result.annualReturnPercent}% per annum
              </Typography>
              <Typography>
                <strong>Final Value ({result.years} years):</strong> ₹{result.finalValue.toFixed(2)}
              </Typography>
              <Typography>
                <strong>Total Return:</strong> ₹{result.totalReturn.toFixed(2)}
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Investment Growth Chart
                </Typography>
                <LineChart
                  xAxis={[{
                    scaleType: "point",
                    data: result.growth.map(d => d.x),
                    label: "Period",
                    labelProps: { fill: theme.palette.text.primary },
                  }]}
                  series={[{
                    data: result.growth.map(d => d.y),
                    label: "Investment Value (₹)",
                    color: theme.palette.primary.main,
                    lineProps: { strokeWidth: 2 },
                  }]}
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
