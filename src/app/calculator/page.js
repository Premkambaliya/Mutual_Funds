// "use client";

// import React, { useState } from "react";
// import {
//   Container,
//   Typography,
//   Box,
//   Tabs,
//   Tab,
//   Paper,
//   TextField,
//   Button,
//   Grid,
//   Card,
//   CardContent,
//   Slider,
//   Stack,
//   Divider,
//   Alert,
// } from "@mui/material";
// import {
//   Calculate,
//   TrendingUp,
//   AccountBalance,
//   ShowChart,
//   Savings,
//   ArrowUpward,
// } from "@mui/icons-material";
// import { motion } from "framer-motion";

// const CalculatorPage = () => {
//   const [activeTab, setActiveTab] = useState(0);

//   // SIP Calculator State
//   const [sipMonthly, setSipMonthly] = useState(5000);
//   const [sipRate, setSipRate] = useState(12);
//   const [sipYears, setSipYears] = useState(10);

//   // Lumpsum Calculator State
//   const [lumpsumAmount, setLumpsumAmount] = useState(100000);
//   const [lumpsumRate, setLumpsumRate] = useState(12);
//   const [lumpsumYears, setLumpsumYears] = useState(10);

//   // SWP Calculator State
//   const [swpInitial, setSwpInitial] = useState(1000000);
//   const [swpWithdrawal, setSwpWithdrawal] = useState(10000);
//   const [swpRate, setSwpRate] = useState(10);
//   const [swpYears, setSwpYears] = useState(15);

//   // Step-up SIP State
//   const [stepupMonthly, setStepupMonthly] = useState(5000);
//   const [stepupRate, setStepupRate] = useState(12);
//   const [stepupYears, setStepupYears] = useState(10);
//   const [stepupIncrement, setStepupIncrement] = useState(10);

//   // SWP Step-up State
//   const [swpStepupInitial, setSwpStepupInitial] = useState(1000000);
//   const [swpStepupWithdrawal, setSwpStepupWithdrawal] = useState(10000);
//   const [swpStepupRate, setSwpStepupRate] = useState(10);
//   const [swpStepupYears, setSwpStepupYears] = useState(15);
//   const [swpStepupIncrement, setSwpStepupIncrement] = useState(5);

//   // SIP Calculations
//   const calculateSIP = () => {
//     const monthlyRate = sipRate / 12 / 100;
//     const months = sipYears * 12;
//     const futureValue =
//       sipMonthly *
//       (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
//         (1 + monthlyRate));
//     const invested = sipMonthly * months;
//     const returns = futureValue - invested;
//     return {
//       futureValue: Math.round(futureValue),
//       invested: Math.round(invested),
//       returns: Math.round(returns),
//     };
//   };

//   // Lumpsum Calculations
//   const calculateLumpsum = () => {
//     const futureValue =
//       lumpsumAmount * Math.pow(1 + lumpsumRate / 100, lumpsumYears);
//     const returns = futureValue - lumpsumAmount;
//     return {
//       futureValue: Math.round(futureValue),
//       invested: lumpsumAmount,
//       returns: Math.round(returns),
//     };
//   };

//   // SWP Calculations
//   const calculateSWP = () => {
//     const monthlyRate = swpRate / 12 / 100;
//     const months = swpYears * 12;
//     let balance = swpInitial;
//     let totalWithdrawn = 0;

//     for (let i = 0; i < months; i++) {
//       balance = balance * (1 + monthlyRate) - swpWithdrawal;
//       totalWithdrawn += swpWithdrawal;
//       if (balance < 0) {
//         return {
//           finalBalance: 0,
//           totalWithdrawn: totalWithdrawn - swpWithdrawal,
//           monthsLasted: i,
//           depleted: true,
//         };
//       }
//     }

//     return {
//       finalBalance: Math.round(balance),
//       totalWithdrawn: Math.round(totalWithdrawn),
//       monthsLasted: months,
//       depleted: false,
//     };
//   };

//   // SWP Step-up Calculations
//   const calculateSWPStepup = () => {
//     const monthlyRate = swpStepupRate / 12 / 100;
//     const months = swpStepupYears * 12;
//     let balance = swpStepupInitial;
//     let totalWithdrawn = 0;
//     let currentWithdrawal = swpStepupWithdrawal;

//     for (let i = 0; i < months; i++) {
//       balance = balance * (1 + monthlyRate) - currentWithdrawal;
//       totalWithdrawn += currentWithdrawal;
      
//       // Increase withdrawal every 12 months
//       if ((i + 1) % 12 === 0) {
//         currentWithdrawal = currentWithdrawal * (1 + swpStepupIncrement / 100);
//       }
      
//       if (balance < 0) {
//         return {
//           finalBalance: 0,
//           totalWithdrawn: totalWithdrawn - currentWithdrawal,
//           monthsLasted: i,
//           depleted: true,
//         };
//       }
//     }

//     return {
//       finalBalance: Math.round(balance),
//       totalWithdrawn: Math.round(totalWithdrawn),
//       monthsLasted: months,
//       depleted: false,
//     };
//   };

//   // Step-up SIP Calculations
//   const calculateStepupSIP = () => {
//     const monthlyRate = stepupRate / 12 / 100;
//     const months = stepupYears * 12;
//     let futureValue = 0;
//     let invested = 0;
//     let currentSIP = stepupMonthly;

//     for (let i = 0; i < months; i++) {
//       futureValue = (futureValue + currentSIP) * (1 + monthlyRate);
//       invested += currentSIP;

//       // Increase SIP every 12 months
//       if ((i + 1) % 12 === 0) {
//         currentSIP = currentSIP * (1 + stepupIncrement / 100);
//       }
//     }

//     return {
//       futureValue: Math.round(futureValue),
//       invested: Math.round(invested),
//       returns: Math.round(futureValue - invested),
//     };
//   };

//   const sipResults = calculateSIP();
//   const lumpsumResults = calculateLumpsum();
//   const swpResults = calculateSWP();
//   const swpStepupResults = calculateSWPStepup();
//   const stepupResults = calculateStepupSIP();

//   const formatCurrency = (num) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(num);
//   };

//   const ResultCard = ({ title, value, icon, color = "#10B981" }) => (
//     <Card
//       sx={{
//         height: "100%",
//         background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
//         border: `2px solid ${color}40`,
//         borderRadius: 3,
//         transition: "all 0.3s ease",
//         "&:hover": {
//           transform: "translateY(-5px)",
//           boxShadow: `0 8px 24px ${color}30`,
//         },
//       }}
//     >
//       <CardContent>
//         <Stack direction="row" alignItems="center" spacing={2} mb={1}>
//           <Box
//             sx={{
//               backgroundColor: color,
//               borderRadius: 2,
//               p: 1,
//               display: "flex",
//             }}
//           >
//             {icon}
//           </Box>
//           <Typography variant="caption" color="text.secondary" fontWeight={600}>
//             {title}
//           </Typography>
//         </Stack>
//         <Typography variant="h4" fontWeight="bold" sx={{ color: color, mt: 1 }}>
//           {formatCurrency(value)}
//         </Typography>
//       </CardContent>
//     </Card>
//   );

//   return (
//     <Box sx={{ backgroundColor: "#F9FAFB", minHeight: "100vh", py: 6 }}>
//       <Container maxWidth="lg">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <Box sx={{ textAlign: "center", mb: 6 }}>
//             <Typography
//               variant="h3"
//               gutterBottom
//               sx={{
//                 fontWeight: "bold",
//                 background: "linear-gradient(90deg, #047857, #10B981)",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//               }}
//             >
//               💰 Investment Calculators
//             </Typography>
//             <Typography variant="h6" color="text.secondary">
//               Plan your investments with precision and confidence
//             </Typography>
//           </Box>
//         </motion.div>

//         {/* Tabs */}
//         <Paper
//           elevation={3}
//           sx={{
//             borderRadius: 4,
//             overflow: "hidden",
//             border: "2px solid #D1FAE5",
//           }}
//         >
//           <Tabs
//             value={activeTab}
//             onChange={(e, val) => setActiveTab(val)}
//             variant="fullWidth"
//             sx={{
//               backgroundColor: "#F0FDF4",
//               "& .MuiTab-root": {
//                 fontWeight: 600,
//                 fontSize: "1rem",
//                 py: 2,
//                 transition: "all 0.3s ease",
//                 color: "#6B7280",
//                 "&:hover": {
//                   backgroundColor: "#D1FAE5",
//                   color: "#047857",
//                 },
//                 "&.Mui-selected": {
//                   color: "#047857",
//                   backgroundColor: "#FFFFFF",
//                 },
//               },
//               "& .MuiTabs-indicator": {
//                 backgroundColor: "#10B981",
//                 height: 4,
//               },
//             }}
//           >
//             <Tab icon={<Calculate />} label="SIP Calculator" />
//             <Tab icon={<AccountBalance />} label="Lumpsum" />
//             <Tab icon={<TrendingUp />} label="SWP" />
//             <Tab icon={<ArrowUpward />} label="Step-up SIP" />
//             <Tab icon={<ShowChart />} label="SWP Step-up" />
//           </Tabs>

//           <Box sx={{ p: 4 }}>
//             {/* SIP Calculator */}
//             {activeTab === 0 && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <Grid container spacing={4}>
//                   <Grid item xs={12} md={6}>
//                     <Stack spacing={4}>
//                       <Box>
//                         <Typography
//                           variant="body1"
//                           fontWeight={600}
//                           gutterBottom
//                           color="#047857"
//                         >
//                           Monthly Investment
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           type="number"
//                           value={sipMonthly}
//                           onChange={(e) => setSipMonthly(Number(e.target.value))}
//                           InputProps={{ startAdornment: "₹" }}
//                           sx={{
//                             "& .MuiOutlinedInput-root": {
//                               "&.Mui-focused fieldset": {
//                                 borderColor: "#10B981",
//                               },
//                             },
//                           }}
//                         />
//                         <Slider
//                           value={sipMonthly}
//                           onChange={(e, val) => setSipMonthly(val)}
//                           min={500}
//                           max={100000}
//                           step={500}
//                           sx={{
//                             color: "#10B981",
//                             mt: 2,
//                           }}
//                         />
//                       </Box>

//                       <Box>
//                         <Typography
//                           variant="body1"
//                           fontWeight={600}
//                           gutterBottom
//                           color="#047857"
//                         >
//                           Expected Return Rate (% p.a.)
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           type="number"
//                           value={sipRate}
//                           onChange={(e) => setSipRate(Number(e.target.value))}
//                           InputProps={{ endAdornment: "%" }}
//                           sx={{
//                             "& .MuiOutlinedInput-root": {
//                               "&.Mui-focused fieldset": {
//                                 borderColor: "#10B981",
//                               },
//                             },
//                           }}
//                         />
//                         <Slider
//                           value={sipRate}
//                           onChange={(e, val) => setSipRate(val)}
//                           min={1}
//                           max={30}
//                           step={0.5}
//                           sx={{
//                             color: "#10B981",
//                             mt: 2,
//                           }}
//                         />
//                       </Box>

//                       <Box>
//                         <Typography
//                           variant="body1"
//                           fontWeight={600}
//                           gutterBottom
//                           color="#047857"
//                         >
//                           Investment Period (Years)
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           type="number"
//                           value={sipYears}
//                           onChange={(e) => setSipYears(Number(e.target.value))}
//                           InputProps={{ endAdornment: "Years" }}
//                           sx={{
//                             "& .MuiOutlinedInput-root": {
//                               "&.Mui-focused fieldset": {
//                                 borderColor: "#10B981",
//                               },
//                             },
//                           }}
//                         />
//                         <Slider
//                           value={sipYears}
//                           onChange={(e, val) => setSipYears(val)}
//                           min={1}
//                           max={40}
//                           step={1}
//                           sx={{
//                             color: "#10B981",
//                             mt: 2,
//                           }}
//                         />
//                       </Box>
//                     </Stack>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <Box sx={{ position: "sticky", top: 20 }}>
//                       <Typography
//                         variant="h5"
//                         fontWeight="bold"
//                         gutterBottom
//                         color="#047857"
//                       >
//                         Investment Summary
//                       </Typography>
//                       <Divider sx={{ mb: 3, borderColor: "#D1FAE5" }} />

//                       <Stack spacing={3}>
//                         <ResultCard
//                           title="Total Investment"
//                           value={sipResults.invested}
//                           icon={<Savings sx={{ color: "white" }} />}
//                           color="#059669"
//                         />
//                         <ResultCard
//                           title="Expected Returns"
//                           value={sipResults.returns}
//                           icon={<TrendingUp sx={{ color: "white" }} />}
//                           color="#10B981"
//                         />
//                         <ResultCard
//                           title="Future Value"
//                           value={sipResults.futureValue}
//                           icon={<ShowChart sx={{ color: "white" }} />}
//                           color="#34D399"
//                         />
//                       </Stack>

//                       <Alert
//                         severity="info"
//                         sx={{
//                           mt: 3,
//                           backgroundColor: "#F0FDF4",
//                           color: "#047857",
//                           "& .MuiAlert-icon": {
//                             color: "#10B981",
//                           },
//                         }}
//                       >
//                         Your investment will grow by{" "}
//                         <strong>
//                           {((sipResults.returns / sipResults.invested) * 100).toFixed(1)}%
//                         </strong>
//                       </Alert>
//                     </Box>
//                   </Grid>
//                 </Grid>
//               </motion.div>
//             )}

//             {/* Lumpsum Calculator */}
//             {activeTab === 1 && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <Grid container spacing={4}>
//                   <Grid item xs={12} md={6}>
//                     <Stack spacing={4}>
//                       <Box>
//                         <Typography
//                           variant="body1"
//                           fontWeight={600}
//                           gutterBottom
//                           color="#047857"
//                         >
//                           Investment Amount
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           type="number"
//                           value={lumpsumAmount}
//                           onChange={(e) =>
//                             setLumpsumAmount(Number(e.target.value))
//                           }
//                           InputProps={{ startAdornment: "₹" }}
//                           sx={{
//                             "& .MuiOutlinedInput-root": {
//                               "&.Mui-focused fieldset": {
//                                 borderColor: "#10B981",
//                               },
//                             },
//                           }}
//                         />
//                         <Slider
//                           value={lumpsumAmount}
//                           onChange={(e, val) => setLumpsumAmount(val)}
//                           min={10000}
//                           max={10000000}
//                           step={10000}
//                           sx={{
//                             color: "#10B981",
//                             mt: 2,
//                           }}
//                         />
//                       </Box>

//                       <Box>
//                         <Typography
//                           variant="body1"
//                           fontWeight={600}
//                           gutterBottom
//                           color="#047857"
//                         >
//                           Expected Return Rate (% p.a.)
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           type="number"
//                           value={lumpsumRate}
//                           onChange={(e) =>
//                             setLumpsumRate(Number(e.target.value))
//                           }
//                           InputProps={{ endAdornment: "%" }}
//                           sx={{
//                             "& .MuiOutlinedInput-root": {
//                               "&.Mui-focused fieldset": {
//                                 borderColor: "#10B981",
//                               },
//                             },
//                           }}
//                         />
//                         <Slider
//                           value={lumpsumRate}
//                           onChange={(e, val) => setLumpsumRate(val)}
//                           min={1}
//                           max={30}
//                           step={0.5}
//                           sx={{
//                             color: "#10B981",
//                             mt: 2,
//                           }}
//                         />
//                       </Box>

//                       <Box>
//                         <Typography
//                           variant="body1"
//                           fontWeight={600}
//                           gutterBottom
//                           color="#047857"
//                         >
//                           Investment Period (Years)
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           type="number"
//                           value={lumpsumYears}
//                           onChange={(e) =>
//                             setLumpsumYears(Number(e.target.value))
//                           }
//                           InputProps={{ endAdornment: "Years" }}
//                           sx={{
//                             "& .MuiOutlinedInput-root": {
//                               "&.Mui-focused fieldset": {
//                                 borderColor: "#10B981",
//                               },
//                             },
//                           }}
//                         />
//                         <Slider
//                           value={lumpsumYears}
//                           onChange={(e, val) => setLumpsumYears(val)}
//                           min={1}
//                           max={40}
//                           step={1}
//                           sx={{
//                             color: "#10B981",
//                             mt: 2,
//                           }}
//                         />
//                       </Box>
//                     </Stack>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <Box sx={{ position: "sticky", top: 20 }}>
//                       <Typography
//                         variant="h5"
//                         fontWeight="bold"
//                         gutterBottom
//                         color="#047857"
//                       >
//                         Investment Summary
//                       </Typography>
//                       <Divider sx={{ mb: 3, borderColor: "#D1FAE5" }} />

//                       <Stack spacing={3}>
//                         <ResultCard
//                           title="Total Investment"
//                           value={lumpsumResults.invested}
//                           icon={<Savings sx={{ color: "white" }} />}
//                           color="#059669"
//                         />
//                         <ResultCard
//                           title="Expected Returns"
//                           value={lumpsumResults.returns}
//                           icon={<TrendingUp sx={{ color: "white" }} />}
//                           color="#10B981"
//                         />
//                         <ResultCard
//                           title="Future Value"
//                           value={lumpsumResults.futureValue}
//                           icon={<ShowChart sx={{ color: "white" }} />}
//                           color="#34D399"
//                         />
//                       </Stack>

//                       <Alert
//                         severity="success"
//                         sx={{
//                           mt: 3,
//                           backgroundColor: "#F0FDF4",
//                           color: "#047857",
//                           "& .MuiAlert-icon": {
//                             color: "#10B981",
//                           },
//                         }}
//                       >
//                         CAGR:{" "}
//                         <strong>{lumpsumRate.toFixed(2)}% per annum</strong>
//                       </Alert>
//                     </Box>
//                   </Grid>
//                 </Grid>
//               </motion.div>
//             )}

//             {/* SWP Calculator */}
//             {activeTab === 2 && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <Grid container spacing={4}>
//                   <Grid item xs={12} md={6}>
//                     <Stack spacing={4}>
//                       <Box>
//                         <Typography
//                           variant="body1"
//                           fontWeight={600}
//                           gutterBottom
//                           color="#047857"
//                         >
//                           Initial Investment
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           type="number"
//                           value={swpInitial}
//                           onChange={(e) => setSwpInitial(Number(e.target.value))}
//                           InputProps={{ startAdornment: "₹" }}
//                           sx={{
//                             "& .MuiOutlinedInput-root": {
//                               "&.Mui-focused fieldset": {
//                                 borderColor: "#10B981",
//                               },
//                             },
//                           }}
//                         />
//                         <Slider
//                           value={swpInitial}
//                           onChange={(e, val) => setSwpInitial(val)}
//                           min={100000}
//                           max={10000000}
//                           step={50000}
//                           sx={{
//                             color: "#10B981",
//                             mt: 2,
//                           }}
//                         />
//                       </Box>

//                       <Box>
//                         <Typography
//                           variant="body1"
//                           fontWeight={600}
//                           gutterBottom
//                           color="#047857"
//                         >
//                           Monthly Withdrawal
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           type="number"
//                           value={swpWithdrawal}
//                           onChange={(e) => setSwpWithdrawal(Number(e.target.value))}
//                           InputProps={{ startAdornment: "₹" }}
//                           sx={{
//                             "& .MuiOutlinedInput-root": {
//                               "&.Mui-focused fieldset": {
//                                 borderColor: "#10B981",
//                               },
//                             },
//                           }}
//                         />
//                         <Slider
//                           value={swpWithdrawal}
//                           onChange={(e, val) => setSwpWithdrawal(val)}
//                           min={1000}
//                           max={100000}
//                           step={1000}
//                           sx={{
//                             color: "#10B981",
//                             mt: 2,
//                           }}
//                         />
//                       </Box>

//                       <Box>
//                         <Typography
//                           variant="body1"
//                           fontWeight={600}
//                           gutterBottom
//                           color="#047857"
//                         >
//                           Expected Return Rate (% p.a.)
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           type="number"
//                           value={swpRate}
//                           onChange={(e) => setSwpRate(Number(e.target.value))}
//                           InputProps={{ endAdornment: "%" }}
//                           sx={{
//                             "& .MuiOutlinedInput-root": {
//                               "&.Mui-focused fieldset": {
//                                 borderColor: "#10B981",
//                               },
//                             },
//                           }}
//                         />
//                         <Slider
//                           value={swpRate}
//                           onChange={(e, val) => setSwpRate(val)}
//                           min={1}
//                           max={20}
//                           step={0.5}
//                           sx={{
//                             color: "#10B981",
//                             mt: 2,
//                           }}
//                         />
//                       </Box>

//                       <Box>
//                         <Typography
//                           variant="body1"
//                           fontWeight={600}
//                           gutterBottom
//                           color="#047857"
//                         >
//                           Withdrawal Period (Years)
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           type="number"
//                           value={swpYears}
//                           onChange={(e) => setSwpYears(Number(e.target.value))}
//                           InputProps={{ endAdornment: "Years" }}
//                           sx={{
//                             "& .MuiOutlinedInput-root": {
//                               "&.Mui-focused fieldset": {
//                                 borderColor: "#10B981",
//                               },
//                             },
//                           }}
//                         />
//                         <Slider
//                           value={swpYears}
//                           onChange={(e, val) => setSwpYears(val)}
//                           min={1}
//                           max={30}
//                           step={1}
//                           sx={{
//                             color: "#10B981",
//                             mt: 2,
//                           }}
//                         />
//                       </Box>
//                     </Stack>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <Box sx={{ position: "sticky", top: 20 }}>
//                       <Typography
//                         variant="h5"
//                         fontWeight="bold"
//                         gutterBottom
//                         color="#047857"
//                       >
//                         Withdrawal Summary
//                       </Typography>
//                       <Divider sx={{ mb: 3, borderColor: "#D1FAE5" }} />

//                       <Stack spacing={3}>
//                         <ResultCard
//                           title="Total Withdrawn"
//                           value={swpResults.totalWithdrawn}
//                           icon={<TrendingUp sx={{ color: "white" }} />}
//                           color="#059669"
//                         />
//                         <ResultCard
//                           title="Final Balance"
//                           value={swpResults.finalBalance}
//                           icon={<AccountBalance sx={{ color: "white" }} />}
//                           color="#10B981"
//                         />
//                       </Stack>

//                       {swpResults.depleted ? (
//                         <Alert
//                           severity="warning"
//                           sx={{
//                             mt: 3,
//                             backgroundColor: "#FEF3C7",
//                             color: "#92400E",
//                           }}
//                         >
//                           Funds depleted after{" "}
//                           <strong>
//                             {Math.floor(swpResults.monthsLasted / 12)} years{" "}
//                             {swpResults.monthsLasted % 12} months
//                           </strong>
//                         </Alert>
//                       ) : (
//                         <Alert
//                           severity="success"
//                           sx={{
//                             mt: 3,
//                             backgroundColor: "#F0FDF4",
//                             color: "#047857",
//                             "& .MuiAlert-icon": {
//                               color: "#10B981",
//                             },
//                           }}
//                         >
//                           Your funds will last the entire{" "}
//                           <strong>{swpYears} years</strong>
//                         </Alert>
//                       )}
//                     </Box>
//                   </Grid>
//                 </Grid>
//               </motion.div>
//             )}

//             {/* Step-up SIP Calculator */}
//             {activeTab === 3 && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <Grid container spacing={4}>
//                   <Grid item xs={12} md={6}>
//                     <Stack spacing={4}>
//                       <Box>
//                         <Typography
//                           variant="body1"
//                           fontWeight={600}
//                           gutterBottom
//                           color="#047857"
//                         >
//                           Initial Monthly Investment
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           type="number"
//                           value={stepupMonthly}
//                           onChange={(e) => setStepupMonthly(Number(e.target.value))}
//                           InputProps={{ startAdornment: "₹" }}
//                           sx={{
//                             "& .MuiOutlinedInput-root": {
//                               "&.Mui-focused fieldset": {
//                                 borderColor: "#10B981",
//                               },
//                             },
//                           }}
//                         />
//                         <Slider
//                           value={stepupMonthly}
//                           onChange={(e, val) => setStepupMonthly(val)}
//                           min={500}
//                           max={100000}
//                           step={500}
//                           sx={{
//                             color: "#10B981",
//                             mt: 2,
//                           }}
//                         />
//                       </Box>

//                       <Box>
//                         <Typography
//                           variant="body1"
//                           fontWeight={600}
//                           gutterBottom
//                           color="#047857"
//                         >
//                           Annual Increment (%)
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           type="number"
//                           value={stepupIncrement}
//                           onChange={(e) => setStepupIncrement(Number(e.target.value))}
//                           InputProps={{ endAdornment: "%" }}
//                           sx={{
//                             "& .MuiOutlinedInput-root": {
//                               "&.Mui-focused fieldset": {
//                                 borderColor: "#10B981",
//                               },
//                             },
//                           }}
//                         />
//                         <Slider
//                           value={stepupIncrement}
//                           onChange={(e, val) => setStepupIncrement(val)}
//                           min={1}
//                           max={30}
//                           step={1}
//                           sx={{
//                             color: "#10B981",
//                             mt: 2,
//                           }}
//                         />
//                       </Box>

//                       <Box>
//                         <Typography
//                           variant="body1"
//                           fontWeight={600}
//                           gutterBottom
//                           color="#047857"
//                         >
//                           Expected Return Rate (% p.a.)
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           type="number"
//                           value={stepupRate}
//                           onChange={(e) => setStepupRate(Number(e.target.value))}
//                           InputProps={{ endAdornment: "%" }}
//                           sx={{
//                             "& .MuiOutlinedInput-root": {
//                               "&.Mui-focused fieldset": {
//                                 borderColor: "#10B981",
//                               },
//                             },
//                           }}
//                         />
//                         <Slider
//                           value={stepupRate}
//                           onChange={(e, val) => setStepupRate(val)}
//                           min={1}
//                           max={30}
//                           step={0.5}
//                           sx={{
//                             color: "#10B981",
//                             mt: 2,
//                           }}
//                         />
//                       </Box>

//                       <Box>
//                         <Typography
//                           variant="body1"
//                           fontWeight={600}
//                           gutterBottom
//                           color="#047857"
//                         >
//                           Investment Period (Years)
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           type="number"
//                           value={stepupYears}
//                           onChange={(e) => setStepupYears(Number(e.target.value))}
//                           InputProps={{ endAdornment: "Years" }}
//                           sx={{
//                             "& .MuiOutlinedInput-root": {
//                               "&.Mui-focused fieldset": {
//                                 borderColor: "#10B981",
//                               },
//                             },
//                           }}
//                         />
//                         <Slider
//                           value={stepupYears}
//                           onChange={(e, val) => setStepupYears(val)}
//                           min={1}
//                           max={40}
//                           step={1}
//                           sx={{
//                             color: "#10B981",
//                             mt: 2,
//                           }}
//                         />
//                       </Box>
//                     </Stack>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <Box sx={{ position: "sticky", top: 20 }}>
//                       <Typography
//                         variant="h5"
//                         fontWeight="bold"
//                         gutterBottom
//                         color="#047857"
//                       >
//                         Investment Summary
//                       </Typography>
//                       <Divider sx={{ mb: 3, borderColor: "#D1FAE5" }} />

//                       <Stack spacing={3}>
//                         <ResultCard
//                           title="Total Investment"
//                           value={stepupResults.invested}
//                           icon={<Savings sx={{ color: "white" }} />}
//                           color="#059669"
//                         />
//                         <ResultCard
//                           title="Expected Returns"
//                           value={stepupResults.returns}
//                           icon={<TrendingUp sx={{ color: "white" }} />}
//                           color="#10B981"
//                         />
//                         <ResultCard
//                           title="Future Value"
//                           value={stepupResults.futureValue}
//                           icon={<ShowChart sx={{ color: "white" }} />}
//                           color="#34D399"
//                         />
//                       </Stack>

//                       <Alert
//                         severity="info"
//                         sx={{
//                           mt: 3,
//                           backgroundColor: "#F0FDF4",
//                           color: "#047857",
//                           "& .MuiAlert-icon": {
//                             color: "#10B981",
//                           },
//                         }}
//                       >
//                         Your investment grows with an annual increment of{" "}
//                         <strong>{stepupIncrement}%</strong> and a return rate of{" "}
//                         <strong>{stepupRate}% per annum</strong>
//                       </Alert>
//                     </Box>
//                   </Grid>
//                 </Grid>
//               </motion.div>
//             )}

//             {/* SWP Step-up Calculator */}
//             {activeTab === 4 && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <Grid container spacing={4}>
//                   <Grid item xs={12} md={6}>
//                     <Stack spacing={4}>
//                       <Box>
//                         <Typography
//                           variant="body1"
//                           fontWeight={600}
//                           gutterBottom
//                           color="#047857"
//                         >
//                           Initial Investment
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           type="number"
//                           value={swpStepupInitial}
//                           onChange={(e) => setSwpStepupInitial(Number(e.target.value))}
//                           InputProps={{ startAdornment: "₹" }}
//                           sx={{
//                             "& .MuiOutlinedInput-root": {
//                               "&.Mui-focused fieldset": {
//                                 borderColor: "#10B981",
//                               },
//                             },
//                           }}
//                         />
//                         <Slider
//                           value={swpStepupInitial}
//                           onChange={(e, val) => setSwpStepupInitial(val)}
//                           min={100000}
//                           max={10000000}
//                           step={50000}
//                           sx={{
//                             color: "#10B981",
//                             mt: 2,
//                           }}
//                         />
//                       </Box>

//                       <Box>
//                         <Typography
//                           variant="body1"
//                           fontWeight={600}
//                           gutterBottom
//                           color="#047857"
//                         >
//                           Initial Monthly Withdrawal
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           type="number"
//                           value={swpStepupWithdrawal}
//                           onChange={(e) => setSwpStepupWithdrawal(Number(e.target.value))}
//                           InputProps={{ startAdornment: "₹" }}
//                           sx={{
//                             "& .MuiOutlinedInput-root": {
//                               "&.Mui-focused fieldset": {
//                                 borderColor: "#10B981",
//                               },
//                             },
//                           }}
//                         />
//                         <Slider
//                           value={swpStepupWithdrawal}
//                           onChange={(e, val) => setSwpStepupWithdrawal(val)}
//                           min={1000}
//                           max={100000}
//                           step={1000}
//                           sx={{
//                             color: "#10B981",
//                             mt: 2,
//                           }}
//                         />
//                       </Box>

//                       <Box>
//                         <Typography
//                           variant="body1"
//                           fontWeight={600}
//                           gutterBottom
//                           color="#047857"
//                         >
//                           Expected Return Rate (% p.a.)
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           type="number"
//                           value={swpStepupRate}
//                           onChange={(e) => setSwpStepupRate(Number(e.target.value))}
//                           InputProps={{ endAdornment: "%" }}
//                           sx={{
//                             "& .MuiOutlinedInput-root": {
//                               "&.Mui-focused fieldset": {
//                                 borderColor: "#10B981",
//                               },
//                             },
//                           }}
//                         />
//                         <Slider
//                           value={swpStepupRate}
//                           onChange={(e, val) => setSwpStepupRate(val)}
//                           min={1}
//                           max={20}
//                           step={0.5}
//                           sx={{
//                             color: "#10B981",
//                             mt: 2,
//                           }}
//                         />
//                       </Box>

//                       <Box>
//                         <Typography
//                           variant="body1"
//                           fontWeight={600}
//                           gutterBottom
//                           color="#047857"
//                         >
//                           Annual Withdrawal Increment (%)
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           type="number"
//                           value={swpStepupIncrement}
//                           onChange={(e) => setSwpStepupIncrement(Number(e.target.value))}
//                           InputProps={{ endAdornment: "%" }}
//                           sx={{
//                             "& .MuiOutlinedInput-root": {
//                               "&.Mui-focused fieldset": {
//                                 borderColor: "#10B981",
//                               },
//                             },
//                           }}
//                         />
//                         <Slider
//                           value={swpStepupIncrement}
//                           onChange={(e, val) => setSwpStepupIncrement(val)}
//                           min={1}
//                           max={15}
//                           step={0.5}
//                           sx={{
//                             color: "#10B981",
//                             mt: 2,
//                           }}
//                         />
//                       </Box>

//                       <Box>
//                         <Typography
//                           variant="body1"
//                           fontWeight={600}
//                           gutterBottom
//                           color="#047857"
//                         >
//                           Withdrawal Period (Years)
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           type="number"
//                           value={swpStepupYears}
//                           onChange={(e) => setSwpStepupYears(Number(e.target.value))}
//                           InputProps={{ endAdornment: "Years" }}
//                           sx={{
//                             "& .MuiOutlinedInput-root": {
//                               "&.Mui-focused fieldset": {
//                                 borderColor: "#10B981",
//                               },
//                             },
//                           }}
//                         />
//                         <Slider
//                           value={swpStepupYears}
//                           onChange={(e, val) => setSwpStepupYears(val)}
//                           min={1}
//                           max={30}
//                           step={1}
//                           sx={{
//                             color: "#10B981",
//                             mt: 2,
//                           }}
//                         />
//                       </Box>
//                     </Stack>
//                   </Grid>

//                   <Grid item xs={12} md={6}>
//                     <Box sx={{ position: "sticky", top: 20 }}>
//                       <Typography
//                         variant="h5"
//                         fontWeight="bold"
//                         gutterBottom
//                         color="#047857"
//                       >
//                         Withdrawal Summary
//                       </Typography>
//                       <Divider sx={{ mb: 3, borderColor: "#D1FAE5" }} />

//                       <Stack spacing={3}>
//                         <ResultCard
//                           title="Total Withdrawn"
//                           value={swpStepupResults.totalWithdrawn}
//                           icon={<TrendingUp sx={{ color: "white" }} />}
//                           color="#059669"
//                         />
//                         <ResultCard
//                           title="Final Balance"
//                           value={swpStepupResults.finalBalance}
//                           icon={<AccountBalance sx={{ color: "white" }} />}
//                           color="#10B981"
//                         />
//                       </Stack>

//                       {swpStepupResults.depleted ? (
//                         <Alert
//                           severity="warning"
//                           sx={{
//                             mt: 3,
//                             backgroundColor: "#FEF3C7",
//                             color: "#92400E",
//                           }}
//                         >
//                           Funds depleted after{" "}
//                           <strong>
//                             {Math.floor(swpStepupResults.monthsLasted / 12)} years{" "}
//                             {swpStepupResults.monthsLasted % 12} months
//                           </strong>
//                         </Alert>
//                       ) : (
//                         <Alert
//                           severity="success"
//                           sx={{
//                             mt: 3,
//                             backgroundColor: "#F0FDF4",
//                             color: "#047857",
//                             "& .MuiAlert-icon": {
//                               color: "#10B981",
//                             },
//                           }}
//                         >
//                           Your funds will last the entire{" "}
//                           <strong>{swpStepupYears} years</strong> with{" "}
//                           <strong>{swpStepupIncrement}% annual increment</strong>
//                         </Alert>
//                       )}
//                     </Box>
//                   </Grid>
//                 </Grid>
//               </motion.div>
//             )}
//           </Box>
//         </Paper>
//       </Container>
//     </Box>
//   );
// };

// export default CalculatorPage;





// "use client";

// import React, { useState } from "react";
// import { motion } from "framer-motion";

// const CalculatorPage = () => {
//   const [activeTab, setActiveTab] = useState(0);

//   // SIP Calculator State
//   const [sipMonthly, setSipMonthly] = useState(5000);
//   const [sipRate, setSipRate] = useState(12);
//   const [sipYears, setSipYears] = useState(10);

//   // Lumpsum Calculator State
//   const [lumpsumAmount, setLumpsumAmount] = useState(100000);
//   const [lumpsumRate, setLumpsumRate] = useState(12);
//   const [lumpsumYears, setLumpsumYears] = useState(10);

//   // SWP Calculator State
//   const [swpInitial, setSwpInitial] = useState(1000000);
//   const [swpWithdrawal, setSwpWithdrawal] = useState(10000);
//   const [swpRate, setSwpRate] = useState(10);
//   const [swpYears, setSwpYears] = useState(15);

//   // Step-up SIP State
//   const [stepupMonthly, setStepupMonthly] = useState(5000);
//   const [stepupRate, setStepupRate] = useState(12);
//   const [stepupYears, setStepupYears] = useState(10);
//   const [stepupIncrement, setStepupIncrement] = useState(10);

//   // SWP Step-up State
//   const [swpStepupInitial, setSwpStepupInitial] = useState(1000000);
//   const [swpStepupWithdrawal, setSwpStepupWithdrawal] = useState(10000);
//   const [swpStepupRate, setSwpStepupRate] = useState(10);
//   const [swpStepupYears, setSwpStepupYears] = useState(15);
//   const [swpStepupIncrement, setSwpStepupIncrement] = useState(5);

//   // SIP Calculations
//   const calculateSIP = () => {
//     const monthlyRate = sipRate / 12 / 100;
//     const months = sipYears * 12;
//     const futureValue =
//       sipMonthly *
//       (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
//         (1 + monthlyRate));
//     const invested = sipMonthly * months;
//     const returns = futureValue - invested;
//     return {
//       futureValue: Math.round(futureValue),
//       invested: Math.round(invested),
//       returns: Math.round(returns),
//     };
//   };

//   // Lumpsum Calculations
//   const calculateLumpsum = () => {
//     const futureValue =
//       lumpsumAmount * Math.pow(1 + lumpsumRate / 100, lumpsumYears);
//     const returns = futureValue - lumpsumAmount;
//     return {
//       futureValue: Math.round(futureValue),
//       invested: lumpsumAmount,
//       returns: Math.round(returns),
//     };
//   };

//   // SWP Calculations
//   const calculateSWP = () => {
//     const monthlyRate = swpRate / 12 / 100;
//     const months = swpYears * 12;
//     let balance = swpInitial;
//     let totalWithdrawn = 0;

//     for (let i = 0; i < months; i++) {
//       balance = balance * (1 + monthlyRate) - swpWithdrawal;
//       totalWithdrawn += swpWithdrawal;
//       if (balance < 0) {
//         return {
//           finalBalance: 0,
//           totalWithdrawn: totalWithdrawn - swpWithdrawal,
//           monthsLasted: i,
//           depleted: true,
//         };
//       }
//     }

//     return {
//       finalBalance: Math.round(balance),
//       totalWithdrawn: Math.round(totalWithdrawn),
//       monthsLasted: months,
//       depleted: false,
//     };
//   };

//   // SWP Step-up Calculations
//   const calculateSWPStepup = () => {
//     const monthlyRate = swpStepupRate / 12 / 100;
//     const months = swpStepupYears * 12;
//     let balance = swpStepupInitial;
//     let totalWithdrawn = 0;
//     let currentWithdrawal = swpStepupWithdrawal;

//     for (let i = 0; i < months; i++) {
//       balance = balance * (1 + monthlyRate) - currentWithdrawal;
//       totalWithdrawn += currentWithdrawal;
      
//       if ((i + 1) % 12 === 0) {
//         currentWithdrawal = currentWithdrawal * (1 + swpStepupIncrement / 100);
//       }
      
//       if (balance < 0) {
//         return {
//           finalBalance: 0,
//           totalWithdrawn: totalWithdrawn - currentWithdrawal,
//           monthsLasted: i,
//           depleted: true,
//         };
//       }
//     }

//     return {
//       finalBalance: Math.round(balance),
//       totalWithdrawn: Math.round(totalWithdrawn),
//       monthsLasted: months,
//       depleted: false,
//     };
//   };

//   // Step-up SIP Calculations
//   const calculateStepupSIP = () => {
//     const monthlyRate = stepupRate / 12 / 100;
//     const months = stepupYears * 12;
//     let futureValue = 0;
//     let invested = 0;
//     let currentSIP = stepupMonthly;

//     for (let i = 0; i < months; i++) {
//       futureValue = (futureValue + currentSIP) * (1 + monthlyRate);
//       invested += currentSIP;

//       if ((i + 1) % 12 === 0) {
//         currentSIP = currentSIP * (1 + stepupIncrement / 100);
//       }
//     }

//     return {
//       futureValue: Math.round(futureValue),
//       invested: Math.round(invested),
//       returns: Math.round(futureValue - invested),
//     };
//   };

//   const sipResults = calculateSIP();
//   const lumpsumResults = calculateLumpsum();
//   const swpResults = calculateSWP();
//   const swpStepupResults = calculateSWPStepup();
//   const stepupResults = calculateStepupSIP();

//   const formatCurrency = (num) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(num);
//   };

//   const tabs = [
//     { id: 0, label: "SIP Calculator", icon: "📊" },
//     { id: 1, label: "Lumpsum", icon: "🏦" },
//     { id: 2, label: "SWP", icon: "📈" },
//     { id: 3, label: "Step-up SIP", icon: "⬆️" },
//     { id: 4, label: "SWP Step-up", icon: "📉" },
//   ];

//   const InputField = ({ label, value, onChange, min, max, step, prefix = "", suffix = "" }) => (
//     <div style={{ marginBottom: '24px' }}>
//       <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#047857', marginBottom: '8px' }}>
//         {label}
//       </label>
//       <div style={{ position: 'relative' }}>
//         <input
//           type="number"
//           value={value}
//           onChange={(e) => onChange(Number(e.target.value))}
//           min={min}
//           max={max}
//           step={step}
//           style={{
//             width: '100%',
//             padding: '12px 16px',
//             fontSize: '16px',
//             border: '2px solid #D1FAE5',
//             borderRadius: '8px',
//             outline: 'none',
//             transition: 'all 0.2s',
//             paddingLeft: prefix ? '32px' : '16px',
//             paddingRight: suffix ? '48px' : '16px',
//           }}
//           onFocus={(e) => e.target.style.borderColor = '#10B981'}
//           onBlur={(e) => e.target.style.borderColor = '#D1FAE5'}
//         />
//         {prefix && (
//           <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280', fontWeight: '500' }}>
//             {prefix}
//           </span>
//         )}
//         {suffix && (
//           <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280', fontWeight: '500' }}>
//             {suffix}
//           </span>
//         )}
//       </div>
//       <input
//         type="range"
//         value={value}
//         onChange={(e) => onChange(Number(e.target.value))}
//         min={min}
//         max={max}
//         step={step}
//         style={{
//           width: '100%',
//           marginTop: '12px',
//           accentColor: '#10B981',
//         }}
//       />
//     </div>
//   );

//   const ResultCard = ({ title, value, icon, color }) => (
//     <div style={{
//       background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
//       border: `2px solid ${color}40`,
//       borderRadius: '12px',
//       padding: '24px',
//       transition: 'all 0.3s ease',
//     }}>
//       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
//         <div style={{
//           backgroundColor: color,
//           borderRadius: '8px',
//           padding: '8px',
//           fontSize: '24px',
//         }}>
//           {icon}
//         </div>
//         <span style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
//           {title}
//         </span>
//       </div>
//       <div style={{ fontSize: '32px', fontWeight: 'bold', color: color }}>
//         {formatCurrency(value)}
//       </div>
//     </div>
//   );

//   return (
//     <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', padding: '40px 20px' }}>
//       <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <div style={{ textAlign: 'center', marginBottom: '48px' }}>
//             <h1 style={{
//               fontSize: '42px',
//               fontWeight: 'bold',
//               background: 'linear-gradient(90deg, #047857, #10B981)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               marginBottom: '12px',
//             }}>
//               Investment Calculators
//             </h1>
//             <p style={{ fontSize: '18px', color: '#6B7280' }}>
//               Plan your investments with precision and confidence
//             </p>
//           </div>
//         </motion.div>

//         {/* Main Content */}
//         <div style={{
//           backgroundColor: 'white',
//           borderRadius: '16px',
//           boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
//           overflow: 'hidden',
//           border: '2px solid #D1FAE5',
//         }}>
//           {/* Tabs */}
//           <div style={{ backgroundColor: '#F0FDF4', display: 'flex', borderBottom: '2px solid #D1FAE5' }}>
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 style={{
//                   flex: 1,
//                   padding: '20px',
//                   fontSize: '15px',
//                   fontWeight: '600',
//                   border: 'none',
//                   backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
//                   color: activeTab === tab.id ? '#047857' : '#6B7280',
//                   borderBottom: activeTab === tab.id ? '4px solid #10B981' : '4px solid transparent',
//                   cursor: 'pointer',
//                   transition: 'all 0.3s ease',
//                 }}
//                 onMouseEnter={(e) => {
//                   if (activeTab !== tab.id) {
//                     e.target.style.backgroundColor = '#D1FAE5';
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   if (activeTab !== tab.id) {
//                     e.target.style.backgroundColor = 'transparent';
//                   }
//                 }}
//               >
//                 <span style={{ marginRight: '8px' }}>{tab.icon}</span>
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           <div style={{ padding: '40px' }}>
//             {/* SIP Calculator */}
//             {activeTab === 0 && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 {/* Input Section */}
//                 <div style={{ marginBottom: '48px' }}>
//                   <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#047857', marginBottom: '32px' }}>
//                     Input Parameters
//                   </h2>
//                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
//                     <InputField
//                       label="Monthly Investment"
//                       value={sipMonthly}
//                       onChange={setSipMonthly}
//                       min={500}
//                       max={100000}
//                       step={500}
//                       prefix="₹"
//                     />
//                     <InputField
//                       label="Expected Return Rate (% p.a.)"
//                       value={sipRate}
//                       onChange={setSipRate}
//                       min={1}
//                       max={30}
//                       step={0.5}
//                       suffix="%"
//                     />
//                     <InputField
//                       label="Investment Period (Years)"
//                       value={sipYears}
//                       onChange={setSipYears}
//                       min={1}
//                       max={40}
//                       step={1}
//                       suffix="Years"
//                     />
//                   </div>
//                 </div>

//                 {/* Output Section */}
//                 <div>
//                   <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#047857', marginBottom: '24px' }}>
//                     Investment Summary
//                   </h2>
//                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
//                     <ResultCard
//                       title="Total Investment"
//                       value={sipResults.invested}
//                       icon="💰"
//                       color="#059669"
//                     />
//                     <ResultCard
//                       title="Expected Returns"
//                       value={sipResults.returns}
//                       icon="📈"
//                       color="#10B981"
//                     />
//                     <ResultCard
//                       title="Future Value"
//                       value={sipResults.futureValue}
//                       icon="🎯"
//                       color="#34D399"
//                     />
//                   </div>
//                   <div style={{
//                     marginTop: '24px',
//                     padding: '16px',
//                     backgroundColor: '#F0FDF4',
//                     border: '2px solid #D1FAE5',
//                     borderRadius: '8px',
//                     color: '#047857',
//                   }}>
//                     <strong>Growth:</strong> Your investment will grow by <strong>{((sipResults.returns / sipResults.invested) * 100).toFixed(1)}%</strong>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {/* Lumpsum Calculator */}
//             {activeTab === 1 && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <div style={{ marginBottom: '48px' }}>
//                   <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#047857', marginBottom: '32px' }}>
//                     Input Parameters
//                   </h2>
//                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
//                     <InputField
//                       label="Investment Amount"
//                       value={lumpsumAmount}
//                       onChange={setLumpsumAmount}
//                       min={10000}
//                       max={10000000}
//                       step={10000}
//                       prefix="₹"
//                     />
//                     <InputField
//                       label="Expected Return Rate (% p.a.)"
//                       value={lumpsumRate}
//                       onChange={setLumpsumRate}
//                       min={1}
//                       max={30}
//                       step={0.5}
//                       suffix="%"
//                     />
//                     <InputField
//                       label="Investment Period (Years)"
//                       value={lumpsumYears}
//                       onChange={setLumpsumYears}
//                       min={1}
//                       max={40}
//                       step={1}
//                       suffix="Years"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#047857', marginBottom: '24px' }}>
//                     Investment Summary
//                   </h2>
//                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
//                     <ResultCard
//                       title="Total Investment"
//                       value={lumpsumResults.invested}
//                       icon="💰"
//                       color="#059669"
//                     />
//                     <ResultCard
//                       title="Expected Returns"
//                       value={lumpsumResults.returns}
//                       icon="📈"
//                       color="#10B981"
//                     />
//                     <ResultCard
//                       title="Future Value"
//                       value={lumpsumResults.futureValue}
//                       icon="🎯"
//                       color="#34D399"
//                     />
//                   </div>
//                   <div style={{
//                     marginTop: '24px',
//                     padding: '16px',
//                     backgroundColor: '#F0FDF4',
//                     border: '2px solid #D1FAE5',
//                     borderRadius: '8px',
//                     color: '#047857',
//                   }}>
//                     <strong>CAGR:</strong> {lumpsumRate.toFixed(2)}% per annum
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {/* SWP Calculator */}
//             {activeTab === 2 && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <div style={{ marginBottom: '48px' }}>
//                   <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#047857', marginBottom: '32px' }}>
//                     Input Parameters
//                   </h2>
//                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
//                     <InputField
//                       label="Initial Investment"
//                       value={swpInitial}
//                       onChange={setSwpInitial}
//                       min={100000}
//                       max={10000000}
//                       step={50000}
//                       prefix="₹"
//                     />
//                     <InputField
//                       label="Monthly Withdrawal"
//                       value={swpWithdrawal}
//                       onChange={setSwpWithdrawal}
//                       min={1000}
//                       max={100000}
//                       step={1000}
//                       prefix="₹"
//                     />
//                     <InputField
//                       label="Expected Return Rate (% p.a.)"
//                       value={swpRate}
//                       onChange={setSwpRate}
//                       min={1}
//                       max={20}
//                       step={0.5}
//                       suffix="%"
//                     />
//                     <InputField
//                       label="Withdrawal Period (Years)"
//                       value={swpYears}
//                       onChange={setSwpYears}
//                       min={1}
//                       max={30}
//                       step={1}
//                       suffix="Years"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#047857', marginBottom: '24px' }}>
//                     Withdrawal Summary
//                   </h2>
//                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
//                     <ResultCard
//                       title="Total Withdrawn"
//                       value={swpResults.totalWithdrawn}
//                       icon="💸"
//                       color="#059669"
//                     />
//                     <ResultCard
//                       title="Final Balance"
//                       value={swpResults.finalBalance}
//                       icon="🏦"
//                       color="#10B981"
//                     />
//                   </div>
//                   <div style={{
//                     marginTop: '24px',
//                     padding: '16px',
//                     backgroundColor: swpResults.depleted ? '#FEF3C7' : '#F0FDF4',
//                     border: `2px solid ${swpResults.depleted ? '#FDE68A' : '#D1FAE5'}`,
//                     borderRadius: '8px',
//                     color: swpResults.depleted ? '#92400E' : '#047857',
//                   }}>
//                     {swpResults.depleted ? (
//                       <span><strong>Warning:</strong> Funds depleted after {Math.floor(swpResults.monthsLasted / 12)} years {swpResults.monthsLasted % 12} months</span>
//                     ) : (
//                       <span><strong>Success:</strong> Your funds will last the entire {swpYears} years</span>
//                     )}
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {/* Step-up SIP Calculator */}
//             {activeTab === 3 && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <div style={{ marginBottom: '48px' }}>
//                   <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#047857', marginBottom: '32px' }}>
//                     Input Parameters
//                   </h2>
//                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
//                     <InputField
//                       label="Initial Monthly Investment"
//                       value={stepupMonthly}
//                       onChange={setStepupMonthly}
//                       min={500}
//                       max={100000}
//                       step={500}
//                       prefix="₹"
//                     />
//                     <InputField
//                       label="Annual Increment (%)"
//                       value={stepupIncrement}
//                       onChange={setStepupIncrement}
//                       min={1}
//                       max={30}
//                       step={1}
//                       suffix="%"
//                     />
//                     <InputField
//                       label="Expected Return Rate (% p.a.)"
//                       value={stepupRate}
//                       onChange={setStepupRate}
//                       min={1}
//                       max={30}
//                       step={0.5}
//                       suffix="%"
//                     />
//                     <InputField
//                       label="Investment Period (Years)"
//                       value={stepupYears}
//                       onChange={setStepupYears}
//                       min={1}
//                       max={40}
//                       step={1}
//                       suffix="Years"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#047857', marginBottom: '24px' }}>
//                     Investment Summary
//                   </h2>
//                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
//                     <ResultCard
//                       title="Total Investment"
//                       value={stepupResults.invested}
//                       icon="💰"
//                       color="#059669"
//                     />
//                     <ResultCard
//                       title="Expected Returns"
//                       value={stepupResults.returns}
//                       icon="📈"
//                       color="#10B981"
//                     />
//                     <ResultCard
//                       title="Future Value"
//                       value={stepupResults.futureValue}
//                       icon="🎯"
//                       color="#34D399"
//                     />
//                   </div>
//                   <div style={{
//                     marginTop: '24px',
//                     padding: '16px',
//                     backgroundColor: '#F0FDF4',
//                     border: '2px solid #D1FAE5',
//                     borderRadius: '8px',
//                     color: '#047857',
//                   }}>
//                     <strong>Info:</strong> Your investment grows with an annual increment of <strong>{stepupIncrement}%</strong> and a return rate of <strong>{stepupRate}% per annum</strong>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {/* SWP Step-up Calculator */}
//             {activeTab === 4 && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <div style={{ marginBottom: '48px' }}>
//                   <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#047857', marginBottom: '32px' }}>
//                     Input Parameters
//                   </h2>
//                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
//                     <InputField
//                       label="Initial Investment"
//                       value={swpStepupInitial}
//                       onChange={setSwpStepupInitial}
//                       min={100000}
//                       max={10000000}
//                       step={50000}
//                       prefix="₹"
//                     />
//                     <InputField
//                       label="Initial Monthly Withdrawal"
//                       value={swpStepupWithdrawal}
//                       onChange={setSwpStepupWithdrawal}
//                       min={1000}
//                       max={100000}
//                       step={1000}
//                       prefix="₹"
//                     />
//                     <InputField
//                       label="Expected Return Rate (% p.a.)"
//                       value={swpStepupRate}
//                       onChange={setSwpStepupRate}
//                       min={1}
//                       max={20}
//                       step={0.5}
//                       suffix="%"
//                     />
//                     <InputField
//                       label="Annual Withdrawal Increment (%)"
//                       value={swpStepupIncrement}
//                       onChange={setSwpStepupIncrement}
//                       min={1}
//                       max={15}
//                       step={0.5}
//                       suffix="%"
//                     />
//                     <InputField
//                       label="Withdrawal Period (Years)"
//                       value={swpStepupYears}
//                       onChange={setSwpStepupYears}
//                       min={1}
//                       max={30}
//                       step={1}
//                       suffix="Years"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#047857', marginBottom: '24px' }}>
//                     Withdrawal Summary
//                   </h2>
//                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
//                     <ResultCard
//                       title="Total Withdrawn"
//                       value={swpStepupResults.totalWithdrawn}
//                       icon="💸"
//                       color="#059669"
//                     />
//                     <ResultCard
//                       title="Final Balance"
//                       value={swpStepupResults.finalBalance}
//                       icon="🏦"
//                       color="#10B981"
//                     />
//                   </div>
//                   <div style={{
//                     marginTop: '24px',
//                     padding: '16px',
//                     backgroundColor: swpStepupResults.depleted ? '#FEF3C7' : '#F0FDF4',
//                     border: `2px solid ${swpStepupResults.depleted ? '#FDE68A' : '#D1FAE5'}`,
//                     borderRadius: '8px',
//                     color: swpStepupResults.depleted ? '#92400E' : '#047857',
//                   }}>
//                     {swpStepupResults.depleted ? (
//                       <span><strong>Warning:</strong> Funds depleted after {Math.floor(swpStepupResults.monthsLasted / 12)} years {swpStepupResults.monthsLasted % 12} months</span>
//                     ) : (
//                       <span><strong>Success:</strong> Your funds will last the entire {swpStepupYears} years with {swpStepupIncrement}% annual increment</span>
//                     )}
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CalculatorPage;




"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const CalculatorPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  // SIP Calculator State
  const [sipMonthly, setSipMonthly] = useState(5000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);

  // Lumpsum Calculator State
  const [lumpsumAmount, setLumpsumAmount] = useState(100000);
  const [lumpsumRate, setLumpsumRate] = useState(12);
  const [lumpsumYears, setLumpsumYears] = useState(10);

  // SWP Calculator State
  const [swpInitial, setSwpInitial] = useState(1000000);
  const [swpWithdrawal, setSwpWithdrawal] = useState(10000);
  const [swpRate, setSwpRate] = useState(10);
  const [swpYears, setSwpYears] = useState(15);

  // Step-up SIP State
  const [stepupMonthly, setStepupMonthly] = useState(5000);
  const [stepupRate, setStepupRate] = useState(12);
  const [stepupYears, setStepupYears] = useState(10);
  const [stepupIncrement, setStepupIncrement] = useState(10);

  // SWP Step-up State
  const [swpStepupInitial, setSwpStepupInitial] = useState(1000000);
  const [swpStepupWithdrawal, setSwpStepupWithdrawal] = useState(10000);
  const [swpStepupRate, setSwpStepupRate] = useState(10);
  const [swpStepupYears, setSwpStepupYears] = useState(15);
  const [swpStepupIncrement, setSwpStepupIncrement] = useState(5);

  // Calculations
  const calculateSIP = () => {
    const monthlyRate = sipRate / 12 / 100;
    const months = sipYears * 12;
    const futureValue = sipMonthly * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const invested = sipMonthly * months;
    const returns = futureValue - invested;
    return { futureValue: Math.round(futureValue), invested: Math.round(invested), returns: Math.round(returns) };
  };

  const calculateLumpsum = () => {
    const futureValue = lumpsumAmount * Math.pow(1 + lumpsumRate / 100, lumpsumYears);
    const returns = futureValue - lumpsumAmount;
    return { futureValue: Math.round(futureValue), invested: lumpsumAmount, returns: Math.round(returns) };
  };

  const calculateSWP = () => {
    const monthlyRate = swpRate / 12 / 100;
    const months = swpYears * 12;
    let balance = swpInitial;
    let totalWithdrawn = 0;

    for (let i = 0; i < months; i++) {
      balance = balance * (1 + monthlyRate) - swpWithdrawal;
      totalWithdrawn += swpWithdrawal;
      if (balance < 0) {
        return { finalBalance: 0, totalWithdrawn: totalWithdrawn - swpWithdrawal, monthsLasted: i, depleted: true };
      }
    }
    return { finalBalance: Math.round(balance), totalWithdrawn: Math.round(totalWithdrawn), monthsLasted: months, depleted: false };
  };

  const calculateSWPStepup = () => {
    const monthlyRate = swpStepupRate / 12 / 100;
    const months = swpStepupYears * 12;
    let balance = swpStepupInitial;
    let totalWithdrawn = 0;
    let currentWithdrawal = swpStepupWithdrawal;

    for (let i = 0; i < months; i++) {
      balance = balance * (1 + monthlyRate) - currentWithdrawal;
      totalWithdrawn += currentWithdrawal;
      if ((i + 1) % 12 === 0) currentWithdrawal = currentWithdrawal * (1 + swpStepupIncrement / 100);
      if (balance < 0) {
        return { finalBalance: 0, totalWithdrawn: totalWithdrawn - currentWithdrawal, monthsLasted: i, depleted: true };
      }
    }
    return { finalBalance: Math.round(balance), totalWithdrawn: Math.round(totalWithdrawn), monthsLasted: months, depleted: false };
  };

  const calculateStepupSIP = () => {
    const monthlyRate = stepupRate / 12 / 100;
    const months = stepupYears * 12;
    let futureValue = 0;
    let invested = 0;
    let currentSIP = stepupMonthly;

    for (let i = 0; i < months; i++) {
      futureValue = (futureValue + currentSIP) * (1 + monthlyRate);
      invested += currentSIP;
      if ((i + 1) % 12 === 0) currentSIP = currentSIP * (1 + stepupIncrement / 100);
    }
    return { futureValue: Math.round(futureValue), invested: Math.round(invested), returns: Math.round(futureValue - invested) };
  };

  const sipResults = calculateSIP();
  const lumpsumResults = calculateLumpsum();
  const swpResults = calculateSWP();
  const swpStepupResults = calculateSWPStepup();
  const stepupResults = calculateStepupSIP();

  const formatCurrency = (num) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(num);
  };

  const tabs = [
    { id: 0, label: "SIP Calculator", icon: "📊" },
    { id: 1, label: "Lumpsum", icon: "🏦" },
    { id: 2, label: "SWP", icon: "📈" },
    { id: 3, label: "Step-up SIP", icon: "⬆️" },
    { id: 4, label: "SWP Step-up", icon: "📉" },
  ];

  const InputField = ({ label, value, onChange, min, max, step, prefix = "", suffix = "" }) => (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-emerald-800 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className={`w-full px-4 py-3 text-base border-2 border-emerald-100 rounded-lg outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-16' : ''}`}
        />
        {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">{prefix}</span>}
        {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">{suffix}</span>}
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full mt-3 accent-emerald-500"
      />
    </div>
  );

  const ResultCard = ({ title, value, icon, color }) => (
    <motion.div
      whileHover={{ y: -5, boxShadow: `0 8px 24px ${color}30` }}
      transition={{ duration: 0.3 }}
      className="h-full rounded-xl p-6 transition-all duration-300"
      style={{
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `2px solid ${color}40`,
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="rounded-lg p-2 text-2xl" style={{ backgroundColor: color }}>
          {icon}
        </div>
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{title}</span>
      </div>
      <div className="text-3xl md:text-4xl font-bold mt-2" style={{ color: color }}>
        {formatCurrency(value)}
      </div>
    </motion.div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-6 md:py-10 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-emerald-800 to-green-500 bg-clip-text text-transparent mb-3">
              💰 Investment Calculators
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              Plan your investments with precision and confidence
            </p>
          </div>
        </motion.div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl overflow-hidden border-2 border-emerald-100">
          {/* Tabs - Toggle Buttons */}
          <div className="bg-emerald-50 border-b-2 border-emerald-100 overflow-x-auto">
            <div className="flex min-w-max md:min-w-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[140px] md:min-w-0 px-4 md:px-6 py-4 md:py-5 text-sm md:text-base font-semibold transition-all duration-300 border-b-4 ${
                    activeTab === tab.id
                      ? 'bg-white text-emerald-800 border-emerald-500'
                      : 'bg-transparent text-gray-600 border-transparent hover:bg-emerald-100 hover:text-emerald-700'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 md:p-8 lg:p-10">
            {/* SIP Calculator */}
            {activeTab === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  {/* Input Section */}
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-emerald-800 mb-6">Input Parameters</h2>
                    <InputField label="Monthly Investment" value={sipMonthly} onChange={setSipMonthly} min={500} max={100000} step={500} prefix="₹" />
                    <InputField label="Expected Return Rate (% p.a.)" value={sipRate} onChange={setSipRate} min={1} max={30} step={0.5} suffix="%" />
                    <InputField label="Investment Period (Years)" value={sipYears} onChange={setSipYears} min={1} max={40} step={1} suffix="Years" />
                  </div>

                  {/* Output Section */}
                  <div className="lg:sticky lg:top-6">
                    <h2 className="text-xl md:text-2xl font-bold text-emerald-800 mb-6">Investment Summary</h2>
                    <div className="space-y-4">
                      <ResultCard title="Total Investment" value={sipResults.invested} icon="💰" color="#059669" />
                      <ResultCard title="Expected Returns" value={sipResults.returns} icon="📈" color="#10B981" />
                      <ResultCard title="Future Value" value={sipResults.futureValue} icon="🎯" color="#34D399" />
                    </div>
                    <div className="mt-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl text-emerald-800">
                      <strong>Growth:</strong> Your investment will grow by <strong>{((sipResults.returns / sipResults.invested) * 100).toFixed(1)}%</strong>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Lumpsum Calculator */}
            {activeTab === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-emerald-800 mb-6">Input Parameters</h2>
                    <InputField label="Investment Amount" value={lumpsumAmount} onChange={setLumpsumAmount} min={10000} max={10000000} step={10000} prefix="₹" />
                    <InputField label="Expected Return Rate (% p.a.)" value={lumpsumRate} onChange={setLumpsumRate} min={1} max={30} step={0.5} suffix="%" />
                    <InputField label="Investment Period (Years)" value={lumpsumYears} onChange={setLumpsumYears} min={1} max={40} step={1} suffix="Years" />
                  </div>

                  <div className="lg:sticky lg:top-6">
                    <h2 className="text-xl md:text-2xl font-bold text-emerald-800 mb-6">Investment Summary</h2>
                    <div className="space-y-4">
                      <ResultCard title="Total Investment" value={lumpsumResults.invested} icon="💰" color="#059669" />
                      <ResultCard title="Expected Returns" value={lumpsumResults.returns} icon="📈" color="#10B981" />
                      <ResultCard title="Future Value" value={lumpsumResults.futureValue} icon="🎯" color="#34D399" />
                    </div>
                    <div className="mt-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl text-emerald-800">
                      <strong>CAGR:</strong> {lumpsumRate.toFixed(2)}% per annum
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SWP Calculator */}
            {activeTab === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-emerald-800 mb-6">Input Parameters</h2>
                    <InputField label="Initial Investment" value={swpInitial} onChange={setSwpInitial} min={100000} max={10000000} step={50000} prefix="₹" />
                    <InputField label="Monthly Withdrawal" value={swpWithdrawal} onChange={setSwpWithdrawal} min={1000} max={100000} step={1000} prefix="₹" />
                    <InputField label="Expected Return Rate (% p.a.)" value={swpRate} onChange={setSwpRate} min={1} max={20} step={0.5} suffix="%" />
                    <InputField label="Withdrawal Period (Years)" value={swpYears} onChange={setSwpYears} min={1} max={30} step={1} suffix="Years" />
                  </div>

                  <div className="lg:sticky lg:top-6">
                    <h2 className="text-xl md:text-2xl font-bold text-emerald-800 mb-6">Withdrawal Summary</h2>
                    <div className="space-y-4">
                      <ResultCard title="Total Withdrawn" value={swpResults.totalWithdrawn} icon="💸" color="#059669" />
                      <ResultCard title="Final Balance" value={swpResults.finalBalance} icon="🏦" color="#10B981" />
                    </div>
                    <div className={`mt-6 p-4 rounded-xl border-2 ${swpResults.depleted ? 'bg-yellow-50 border-yellow-300 text-yellow-900' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                      {swpResults.depleted ? (
                        <span><strong>⚠️ Warning:</strong> Funds depleted after {Math.floor(swpResults.monthsLasted / 12)} years {swpResults.monthsLasted % 12} months</span>
                      ) : (
                        <span><strong>✓ Success:</strong> Your funds will last the entire {swpYears} years</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step-up SIP Calculator */}
            {activeTab === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-emerald-800 mb-6">Input Parameters</h2>
                    <InputField label="Initial Monthly Investment" value={stepupMonthly} onChange={setStepupMonthly} min={500} max={100000} step={500} prefix="₹" />
                    <InputField label="Annual Increment (%)" value={stepupIncrement} onChange={setStepupIncrement} min={1} max={30} step={1} suffix="%" />
                    <InputField label="Expected Return Rate (% p.a.)" value={stepupRate} onChange={setStepupRate} min={1} max={30} step={0.5} suffix="%" />
                    <InputField label="Investment Period (Years)" value={stepupYears} onChange={setStepupYears} min={1} max={40} step={1} suffix="Years" />
                  </div>

                  <div className="lg:sticky lg:top-6">
                    <h2 className="text-xl md:text-2xl font-bold text-emerald-800 mb-6">Investment Summary</h2>
                    <div className="space-y-4">
                      <ResultCard title="Total Investment" value={stepupResults.invested} icon="💰" color="#059669" />
                      <ResultCard title="Expected Returns" value={stepupResults.returns} icon="📈" color="#10B981" />
                      <ResultCard title="Future Value" value={stepupResults.futureValue} icon="🎯" color="#34D399" />
                    </div>
                    <div className="mt-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl text-emerald-800">
                      <strong>ℹ️ Info:</strong> Your investment grows with an annual increment of <strong>{stepupIncrement}%</strong> and a return rate of <strong>{stepupRate}% per annum</strong>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SWP Step-up Calculator */}
            {activeTab === 4 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-emerald-800 mb-6">Input Parameters</h2>
                    <InputField label="Initial Investment" value={swpStepupInitial} onChange={setSwpStepupInitial} min={100000} max={10000000} step={50000} prefix="₹" />
                    <InputField label="Initial Monthly Withdrawal" value={swpStepupWithdrawal} onChange={setSwpStepupWithdrawal} min={1000} max={100000} step={1000} prefix="₹" />
                    <InputField label="Expected Return Rate (% p.a.)" value={swpStepupRate} onChange={setSwpStepupRate} min={1} max={20} step={0.5} suffix="%" />
                    <InputField label="Annual Withdrawal Increment (%)" value={swpStepupIncrement} onChange={setSwpStepupIncrement} min={1} max={15} step={0.5} suffix="%" />
                    <InputField label="Withdrawal Period (Years)" value={swpStepupYears} onChange={setSwpStepupYears} min={1} max={30} step={1} suffix="Years" />
                  </div>

                  <div className="lg:sticky lg:top-6">
                    <h2 className="text-xl md:text-2xl font-bold text-emerald-800 mb-6">Withdrawal Summary</h2>
                    <div className="space-y-4">
                      <ResultCard title="Total Withdrawn" value={swpStepupResults.totalWithdrawn} icon="💸" color="#059669" />
                      <ResultCard title="Final Balance" value={swpStepupResults.finalBalance} icon="🏦" color="#10B981" />
                    </div>
                    <div className={`mt-6 p-4 rounded-xl border-2 ${swpStepupResults.depleted ? 'bg-yellow-50 border-yellow-300 text-yellow-900' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                      {swpStepupResults.depleted ? (
                        <span><strong>⚠️ Warning:</strong> Funds depleted after {Math.floor(swpStepupResults.monthsLasted / 12)} years {swpStepupResults.monthsLasted % 12} months</span>
                      ) : (
                        <span><strong>✓ Success:</strong> Your funds will last the entire {swpStepupYears} years with {swpStepupIncrement}% annual increment</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;