// "use client";
// import React from "react";
// import { 
//   Box, 
//   Container, 
//   Typography, 
//   Paper, 
//   Grid,
//   Card,
//   CardContent,
//   Stack,
//   Divider,
//   Chip,
// } from "@mui/material";
// import { 
//   TrendingUp, 
//   Security, 
//   Speed, 
//   Insights,
//   CheckCircle,
//   AccountBalance,
//   Calculate,
//   ShowChart,
//   Groups,
//   Verified,
//   CloudDownload,
// } from "@mui/icons-material";
// import { motion } from "framer-motion";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";

// const About = () => {
//   const features = [
//     {
//       icon: <TrendingUp sx={{ fontSize: 40, color: "#10B981" }} />,
//       title: "Real-Time Data",
//       description: "Access up-to-date mutual fund information and NAV data from trusted sources.",
//     },
//     {
//       icon: <Calculate sx={{ fontSize: 40, color: "#10B981" }} />,
//       title: "Advanced Calculators",
//       description: "SIP, Lumpsum, SWP, and Step-up calculators for precise investment planning.",
//     },
//     {
//       icon: <Security sx={{ fontSize: 40, color: "#10B981" }} />,
//       title: "Secure & Reliable",
//       description: "Your data security is our priority with industry-standard protection.",
//     },
//     {
//       icon: <Speed sx={{ fontSize: 40, color: "#10B981" }} />,
//       title: "Fast Performance",
//       description: "Lightning-fast load times and instant calculations for seamless experience.",
//     },
//     {
//       icon: <Insights sx={{ fontSize: 40, color: "#10B981" }} />,
//       title: "Deep Analytics",
//       description: "Historical data analysis, rolling returns, and comprehensive fund insights.",
//     },
//     {
//       icon: <ShowChart sx={{ fontSize: 40, color: "#10B981" }} />,
//       title: "Visual Charts",
//       description: "Interactive charts and graphs to visualize fund performance over time.",
//     },
//   ];

//   const stats = [
//     { number: "18040", label: "Mutual Funds", icon: <AccountBalance /> },
//     { number: "45", label: "Fund Houses", icon: <Groups /> },
//     { number: "100%", label: "Free to Use", icon: <Verified /> },
//     { number: "Real-time", label: "Data Updates", icon: <CloudDownload /> },
//   ];

//   const values = [
//     "Transparent and accurate fund information",
//     "User-friendly interface for all investors",
//     "Comprehensive analytical tools",
//     "No hidden charges or subscriptions",
//     "Regular data updates from MFAPI.in",
//     "Educational resources for investors",
//   ];

//   return (
//     <>
//       <Box sx={{ backgroundColor: "#F9FAFB", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
//         {/* Hero Section */}
//         <Box
//           sx={{
//             background: "linear-gradient(135deg, #047857 0%, #10B981 50%, #34D399 100%)",
//             color: "white",
//             py: { xs: 8, md: 12 },
//             position: "relative",
//             overflow: "hidden",
//             "&::before": {
//               content: '""',
//               position: "absolute",
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               background: "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)",
//             },
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Container maxWidth="lg" sx={{ textAlign: "center" }}>
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//             >
//               <Typography
//                 variant="h2"
//                 component="h1"
//                 gutterBottom
//                 fontWeight="bold"
//                 sx={{
//                   fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
//                   textShadow: "0 4px 12px rgba(0,0,0,0.2)",
//                 }}
//               >
//                 About Mutual Fund Hub
//               </Typography>
//               <Typography
//                 variant="h5"
//                 sx={{
//                   opacity: 0.95,
//                   maxWidth: "800px",
//                   mx: "auto",
//                   fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
//                 }}
//               >
//                 Your trusted partner for smart mutual fund investments and financial planning
//               </Typography>
//             </motion.div>
//           </Container>
//         </Box>

//         {/* Stats Section */}
//         <Container maxWidth="lg" sx={{ py: 8 }}>
//           <Grid container spacing={2} justifyContent="center">
//             {stats.map((stat, idx) => (
//               <Grid item xs={12} sm={6} md={3} key={idx}>
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: idx * 0.1 }}
//                 >
//                   <Card
//                     sx={{
//                       textAlign: "center",
//                       p: 3,
//                       borderRadius: 3,
//                       border: "2px solid #D1FAE5",
//                       background: "#FFFFFF",
//                       transition: "all 0.3s ease",
//                       "&:hover": {
//                         transform: "translateY(-10px)",
//                         boxShadow: "0 12px 28px rgba(16, 185, 129, 0.3)",
//                         borderColor: "#10B981",
//                       },
//                       height: "100%",
//                     }}
//                   >
//                     <Box sx={{ color: "#10B981", mb: 1, display: "flex", justifyContent: "center" }}>
//                       {React.cloneElement(stat.icon, { sx: { fontSize: 40 } })}
//                     </Box>
//                     <Typography
//                       variant="h4"
//                       fontWeight="bold"
//                       sx={{
//                         background: "linear-gradient(90deg, #047857, #10B981)",
//                         WebkitBackgroundClip: "text",
//                         WebkitTextFillColor: "transparent",
//                         fontSize: { xs: "1.5rem", md: "2rem" },
//                       }}
//                     >
//                       {stat.number}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary" fontWeight={600}>
//                       {stat.label}
//                     </Typography>
//                   </Card>
//                 </motion.div>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>

//         {/* Main Content */}
//         <Container maxWidth="lg" sx={{ py: 6 }}>
//           {/* Mission Statement */}
//           <Paper
//             elevation={3}
//             sx={{
//               p: { xs: 4, md: 6 },
//               mb: 6,
//               borderRadius: 4,
//               background: "linear-gradient(135deg, #FFFFFF 0%, #F0FDF4 100%)",
//               border: "2px solid #D1FAE5",
//               textAlign: "center",
//             }}
//           >
//             <Stack spacing={3} alignItems="center">
//               <Chip
//                 label="OUR MISSION"
//                 sx={{
//                   backgroundColor: "#10B981",
//                   color: "white",
//                   fontWeight: 600,
//                   px: 2,
//                   py: 0.5,
//                   fontSize: "0.9rem",
//                 }}
//               />
//               <Typography
//                 variant="h4"
//                 gutterBottom
//                 sx={{
//                   fontWeight: "bold",
//                   background: "linear-gradient(90deg, #047857, #10B981)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                 }}
//               >
//                 Empowering Investors with Knowledge
//               </Typography>
//               <Typography
//                 variant="body1"
//                 sx={{
//                   fontSize: { xs: "1rem", md: "1.1rem" },
//                   lineHeight: 1.8,
//                   color: "#374151",
//                   maxWidth: "900px",
//                 }}
//               >
//                 Mutual Fund Hub is a professional platform designed to help investors make informed
//                 decisions about mutual fund investments. We provide real-time data, powerful
//                 calculators, and comprehensive analytics to ensure you have all the tools needed
//                 for successful investing.
//               </Typography>
//               <Divider sx={{ my: 3, borderColor: "#D1FAE5", width: "50%", mx: "auto" }} />
//               <Typography
//                 variant="body1"
//                 sx={{
//                   fontSize: { xs: "1rem", md: "1.1rem" },
//                   lineHeight: 1.8,
//                   color: "#374151",
//                   maxWidth: "900px",
//                 }}
//               >
//                 We leverage real-time data from MFAPI.in to deliver accurate insights and analytics,
//                 ensuring you always have access to the latest information for your investment
//                 decisions. Our platform is built with simplicity and accuracy in mind, making it
//                 perfect for both beginners and experienced investors.
//               </Typography>
//             </Stack>
//           </Paper>

//           {/* Features Grid */}
//           <Box sx={{ mb: 8, textAlign: "center" }}>
//             <Typography
//               variant="h4"
//               gutterBottom
//               sx={{
//                 fontWeight: "bold",
//                 mb: 5,
//                 background: "linear-gradient(90deg, #047857, #10B981)",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//               }}
//             >
//               Why Choose Us?
//             </Typography>
//             <Grid container spacing={3} justifyContent="center">
//               {features.map((feature, idx) => (
//                 <Grid item xs={12} sm={6} md={4} key={idx}>
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: idx * 0.1 }}
//                   >
//                     <Card
//                       sx={{
//                         height: "100%",
//                         p: 3,
//                         borderRadius: 3,
//                         border: "2px solid #D1FAE5",
//                         transition: "all 0.3s ease",
//                         "&:hover": {
//                           transform: "translateY(-10px)",
//                           boxShadow: "0 12px 28px rgba(16, 185, 129, 0.25)",
//                           borderColor: "#10B981",
//                           backgroundColor: "#F0FDF4",
//                         },
//                       }}
//                     >
//                       <CardContent>
//                         <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
//                           {feature.icon}
//                         </Box>
//                         <Typography
//                           variant="h6"
//                           fontWeight="bold"
//                           gutterBottom
//                           sx={{ color: "#047857", textAlign: "center" }}
//                         >
//                           {feature.title}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, textAlign: "center" }}>
//                           {feature.description}
//                         </Typography>
//                       </CardContent>
//                     </Card>
//                   </motion.div>
//                 </Grid>
//               ))}
//             </Grid>
//           </Box>

//           {/* Our Values */}
//           <Paper
//             elevation={3}
//             sx={{
//               p: { xs: 4, md: 6 },
//               borderRadius: 4,
//               background: "linear-gradient(135deg, #F0FDF4 0%, #D1FAE5 100%)",
//               border: "2px solid #10B981",
//               textAlign: "center",
//             }}
//           >
//             <Typography
//               variant="h4"
//               gutterBottom
//               sx={{
//                 fontWeight: "bold",
//                 mb: 4,
//                 color: "#047857",
//               }}
//             >
//               Our Core Values
//             </Typography>
//             <Grid container spacing={2} justifyContent="center">
//               {values.map((value, idx) => (
//                 <Grid item xs={12} sm={6} md={4} key={idx}>
//                   <motion.div
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: idx * 0.1 }}
//                   >
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 2,
//                         p: 2,
//                         borderRadius: 2,
//                         backgroundColor: "#FFFFFF",
//                         transition: "all 0.3s ease",
//                         "&:hover": {
//                           transform: "translateX(10px)",
//                           boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
//                         },
//                       }}
//                     >
//                       <CheckCircle sx={{ color: "#10B981", fontSize: 28 }} />
//                       <Typography variant="body1" sx={{ fontWeight: 500, color: "#374151" }}>
//                         {value}
//                       </Typography>
//                     </Box>
//                   </motion.div>
//                 </Grid>
//               ))}
//             </Grid>
//           </Paper>

//           {/* Call to Action */}
//           <Box
//             sx={{
//               mt: 8,
//               p: { xs: 4, md: 6 },
//               borderRadius: 4,
//               background: "linear-gradient(135deg, #059669, #10B981)",
//               textAlign: "center",
//               color: "white",
//               boxShadow: "0 12px 32px rgba(16, 185, 129, 0.3)",
//             }}
//           >
//             <Typography variant="h4" fontWeight="bold" gutterBottom>
//               Ready to Start Your Investment Journey?
//             </Typography>
//             <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
//               Explore thousands of mutual funds and make informed investment decisions today
//             </Typography>
//             <Stack
//               direction={{ xs: "column", sm: "row" }}
//               spacing={2}
//               justifyContent="center"
//             >
//               <Box
//                 component="a"
//                 href="/funds"
//                 sx={{
//                   display: "inline-block",
//                   px: 5,
//                   py: 2,
//                   backgroundColor: "#FFFFFF",
//                   color: "#047857",
//                   fontWeight: "bold",
//                   borderRadius: 3,
//                   fontSize: "1.1rem",
//                   textDecoration: "none",
//                   transition: "all 0.3s ease",
//                   "&:hover": {
//                     backgroundColor: "#F0FDF4",
//                     transform: "scale(1.05)",
//                     boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
//                   },
//                 }}
//               >
//                 Browse All Funds
//               </Box>
//               <Box
//                 component="a"
//                 href="/calculator"
//                 sx={{
//                   display: "inline-block",
//                   px: 5,
//                   py: 2,
//                   backgroundColor: "transparent",
//                   color: "#FFFFFF",
//                   fontWeight: "bold",
//                   borderRadius: 3,
//                   fontSize: "1.1rem",
//                   textDecoration: "none",
//                   border: "2px solid #FFFFFF",
//                   transition: "all 0.3s ease",
//                   "&:hover": {
//                     backgroundColor: "rgba(255,255,255,0.1)",
//                     transform: "scale(1.05)",
//                   },
//                 }}
//               >
//                 Try Calculator
//               </Box>
//             </Stack>
//           </Box>
//         </Container>
//       </Box>
//       {/* <Footer /> */}
//     </>
//   );
// };

// export default About;





"use client";
import React, { useState, useEffect } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid,
  Card,
  CardContent,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import { 
  TrendingUp, 
  Security, 
  Speed, 
  Insights,
  CheckCircle,
  AccountBalance,
  Calculate,
  ShowChart,
  Groups,
  Verified,
  CloudDownload,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const About = () => {
  const [userCount, setUserCount] = useState(0);
  const [userCountLoading, setUserCountLoading] = useState(true);

  // Fetch user count from backend
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        setUserCountLoading(true);
        const response = await fetch("/api/stats/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user count");
        }

        const data = await response.json();
        setUserCount(data.count || 0);
      } catch (error) {
        console.error("Error fetching user count:", error);
        setUserCount(0);
      } finally {
        setUserCountLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  const features = [
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: "#10B981" }} />,
      title: "Real-Time Data",
      description: "Access up-to-date mutual fund information and NAV data from trusted sources.",
    },
    {
      icon: <Calculate sx={{ fontSize: 40, color: "#10B981" }} />,
      title: "Advanced Calculators",
      description: "SIP, Lumpsum, SWP, and Step-up calculators for precise investment planning.",
    },
    {
      icon: <Security sx={{ fontSize: 40, color: "#10B981" }} />,
      title: "Secure & Reliable",
      description: "Your data security is our priority with industry-standard protection.",
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: "#10B981" }} />,
      title: "Fast Performance",
      description: "Lightning-fast load times and instant calculations for seamless experience.",
    },
    {
      icon: <Insights sx={{ fontSize: 40, color: "#10B981" }} />,
      title: "Deep Analytics",
      description: "Historical data analysis, rolling returns, and comprehensive fund insights.",
    },
    {
      icon: <ShowChart sx={{ fontSize: 40, color: "#10B981" }} />,
      title: "Visual Charts",
      description: "Interactive charts and graphs to visualize fund performance over time.",
    },
  ];

  const stats = [
    { number: "18040", label: "Mutual Funds", icon: <AccountBalance /> },
    { number: "45", label: "Fund Houses", icon: <Groups /> },
    { 
      number: userCountLoading ? "..." : userCount, 
      label: "Happy Users", 
      icon: <Verified /> 
    },
    { number: "Real-time", label: "Data Updates", icon: <CloudDownload /> },
  ];

  const values = [
    "Transparent and accurate fund information",
    "User-friendly interface for all investors",
    "Comprehensive analytical tools",
    "No hidden charges or subscriptions",
    "Regular data updates from MFAPI.in",
    "Educational resources for investors",
  ];

  return (
    <>
      <Box sx={{ backgroundColor: "#F9FAFB", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #047857 0%, #10B981 50%, #34D399 100%)",
            color: "white",
            py: { xs: 8, md: 12 },
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Container maxWidth="lg" sx={{ textAlign: "center" }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                fontWeight="bold"
                sx={{
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
                  textShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                About Mutual Fund Hub
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  opacity: 0.95,
                  maxWidth: "800px",
                  mx: "auto",
                  fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                }}
              >
                Your trusted partner for smart mutual fund investments and financial planning
              </Typography>
            </motion.div>
          </Container>
        </Box>

        {/* Stats Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={2} justifyContent="center">
            {stats.map((stat, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card
                    sx={{
                      textAlign: "center",
                      p: 3,
                      borderRadius: 3,
                      border: "2px solid #D1FAE5",
                      background: "#FFFFFF",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-10px)",
                        boxShadow: "0 12px 28px rgba(16, 185, 129, 0.3)",
                        borderColor: "#10B981",
                      },
                      height: "100%",
                    }}
                  >
                    <Box sx={{ color: "#10B981", mb: 1, display: "flex", justifyContent: "center" }}>
                      {React.cloneElement(stat.icon, { sx: { fontSize: 40 } })}
                    </Box>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      sx={{
                        background: "linear-gradient(90deg, #047857, #10B981)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontSize: { xs: "1.5rem", md: "2rem" },
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      {stat.label}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 6 }}>
          {/* Mission Statement */}
          <Paper
            elevation={3}
            sx={{
              p: { xs: 4, md: 6 },
              mb: 6,
              borderRadius: 4,
              background: "linear-gradient(135deg, #FFFFFF 0%, #F0FDF4 100%)",
              border: "2px solid #D1FAE5",
              textAlign: "center",
            }}
          >
            <Stack spacing={3} alignItems="center">
              <Chip
                label="OUR MISSION"
                sx={{
                  backgroundColor: "#10B981",
                  color: "white",
                  fontWeight: 600,
                  px: 2,
                  py: 0.5,
                  fontSize: "0.9rem",
                }}
              />
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  background: "linear-gradient(90deg, #047857, #10B981)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Empowering Investors with Knowledge
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  lineHeight: 1.8,
                  color: "#374151",
                  maxWidth: "900px",
                }}
              >
                Mutual Fund Hub is a professional platform designed to help investors make informed
                decisions about mutual fund investments. We provide real-time data, powerful
                calculators, and comprehensive analytics to ensure you have all the tools needed
                for successful investing.
              </Typography>
              <Divider sx={{ my: 3, borderColor: "#D1FAE5", width: "50%", mx: "auto" }} />
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  lineHeight: 1.8,
                  color: "#374151",
                  maxWidth: "900px",
                }}
              >
                We leverage real-time data from MFAPI.in to deliver accurate insights and analytics,
                ensuring you always have access to the latest information for your investment
                decisions. Our platform is built with simplicity and accuracy in mind, making it
                perfect for both beginners and experienced investors.
              </Typography>
            </Stack>
          </Paper>

          {/* Features Grid */}
          <Box sx={{ mb: 8, textAlign: "center" }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: "bold",
                mb: 5,
                background: "linear-gradient(90deg, #047857, #10B981)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Why Choose Us?
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {features.map((feature, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        p: 3,
                        borderRadius: 3,
                        border: "2px solid #D1FAE5",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-10px)",
                          boxShadow: "0 12px 28px rgba(16, 185, 129, 0.25)",
                          borderColor: "#10B981",
                          backgroundColor: "#F0FDF4",
                        },
                      }}
                    >
                      <CardContent>
                        <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                          {feature.icon}
                        </Box>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          gutterBottom
                          sx={{ color: "#047857", textAlign: "center" }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, textAlign: "center" }}>
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Our Values */}
          <Paper
            elevation={3}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              background: "linear-gradient(135deg, #F0FDF4 0%, #D1FAE5 100%)",
              border: "2px solid #10B981",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: "bold",
                mb: 4,
                color: "#047857",
              }}
            >
              Our Core Values
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              {values.map((value, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "#FFFFFF",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateX(10px)",
                          boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
                        },
                      }}
                    >
                      <CheckCircle sx={{ color: "#10B981", fontSize: 28 }} />
                      <Typography variant="body1" sx={{ fontWeight: 500, color: "#374151" }}>
                        {value}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Call to Action */}
          <Box
            sx={{
              mt: 8,
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              background: "linear-gradient(135deg, #059669, #10B981)",
              textAlign: "center",
              color: "white",
              boxShadow: "0 12px 32px rgba(16, 185, 129, 0.3)",
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Ready to Start Your Investment Journey?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
              Explore thousands of mutual funds and make informed investment decisions today
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
            >
              <Box
                component="a"
                href="/funds"
                sx={{
                  display: "inline-block",
                  px: 5,
                  py: 2,
                  backgroundColor: "#FFFFFF",
                  color: "#047857",
                  fontWeight: "bold",
                  borderRadius: 3,
                  fontSize: "1.1rem",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#F0FDF4",
                    transform: "scale(1.05)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                  },
                }}
              >
                Browse All Funds
              </Box>
              <Box
                component="a"
                href="/calculator"
                sx={{
                  display: "inline-block",
                  px: 5,
                  py: 2,
                  backgroundColor: "transparent",
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  borderRadius: 3,
                  fontSize: "1.1rem",
                  textDecoration: "none",
                  border: "2px solid #FFFFFF",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                    transform: "scale(1.05)",
                  },
                }}
              >
                Try Calculator
              </Box>
            </Stack>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default About;