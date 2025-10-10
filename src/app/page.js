// "use client";

// import React from 'react';
// import Head from 'next/head';
// import {
//   Box,
//   Container,
//   Typography,
//   Grid,
//   Button,
//   Paper,
//   useTheme,
//   useMediaQuery,
//   Card,
//   CardContent,
//   Stack,
//   Chip,
// } from '@mui/material';
// import { 
//   ArrowForward as ArrowForwardIcon,
//   TrendingUp,
//   Calculate,
//   Insights,
//   Security,
//   Speed,
//   CheckCircle
// } from '@mui/icons-material';
// import { motion } from 'framer-motion';

// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import SchemeCard from '../components/SchemeCard';

// const Home = ({ featuredSchemes = [], error }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   if (error) {
//     return (
//       <Box sx={{ textAlign: 'center', py: 4 }}>
//         <Typography variant="h6" sx={{ color: "#DC2626" }}>
//           Failed to load featured funds. Please try again later.
//         </Typography>
//       </Box>
//     );
//   }

//   const features = [
//     { icon: <Calculate sx={{ fontSize: 40 }} />, title: "SIP Calculator", desc: "Calculate returns with precision" },
//     { icon: <Insights sx={{ fontSize: 40 }} />, title: "Deep Analysis", desc: "Historical NAV data insights" },
//     { icon: <Security sx={{ fontSize: 40 }} />, title: "Secure & Reliable", desc: "Trusted data sources" },
//     { icon: <Speed sx={{ fontSize: 40 }} />, title: "Fast Performance", desc: "Quick calculations & results" },
//   ];

//   const benefits = [
//     "Real-time NAV data from trusted sources",
//     "Advanced SIP & Lumpsum calculators",
//     "Rolling returns analysis",
//     "Compare multiple funds easily",
//     "Step-up SIP calculations",
//     "Comprehensive fund information"
//   ];

//   return (
//     <>
//       <Head>
//         <title>Mutual Fund Hub - Discover & Calculate SIP Returns</title>
//         <meta
//           name="description"
//           content="Explore mutual funds and calculate SIP returns with historical NAV data."
//         />
//       </Head>

//       {/* Hero Section with Enhanced Design */}
//       <Box
//         sx={{
//           background: 'linear-gradient(135deg, #047857 0%, #10B981 50%, #34D399 100%)',
//           color: 'white',
//           py: { xs: 8, md: 12 },
//           position: 'relative',
//           overflow: 'hidden',
//           '&::before': {
//             content: '""',
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
//           }
//         }}
//       >
//         <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             <Typography 
//               variant="h2" 
//               component="h1" 
//               gutterBottom 
//               fontWeight="bold"
//               sx={{
//                 fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
//                 textShadow: '0 4px 12px rgba(0,0,0,0.2)',
//                 mb: 2,
//               }}
//             >
//                Your Gateway to Smart Investing
//             </Typography>
//             <Typography 
//               variant="h5" 
//               sx={{ 
//                 mb: 5, 
//                 opacity: 0.95,
//                 fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
//                 maxWidth: '800px',
//                 mx: 'auto',
//               }}
//             >
//               Discover top mutual funds, analyze historical performance, and calculate your investment returns with precision
//             </Typography>
            
//             <Stack 
//               direction={{ xs: 'column', sm: 'row' }} 
//               spacing={2} 
//               justifyContent="center"
//               sx={{ mb: 6 }}
//             >
//               <Button
//                 variant="contained"
//                 size="large"
//                 href="/funds"
//                 endIcon={<ArrowForwardIcon />}
//                 sx={{ 
//                   px: 5, 
//                   py: 2,
//                   fontSize: '1.1rem',
//                   backgroundColor: '#FFFFFF',
//                   color: '#047857',
//                   fontWeight: 'bold',
//                   borderRadius: 3,
//                   boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
//                   transition: 'all 0.3s ease',
//                   '&:hover': {
//                     backgroundColor: '#F0FDF4',
//                     transform: 'translateY(-3px)',
//                     boxShadow: '0 12px 28px rgba(0,0,0,0.2)',
//                   }
//                 }}
//               >
//                 Explore Funds
//               </Button>
//               <Button
//                 variant="outlined"
//                 size="large"
//                 href="/calculator"
//                 endIcon={<Calculate />}
//                 sx={{ 
//                   px: 5, 
//                   py: 2,
//                   fontSize: '1.1rem',
//                   borderColor: '#FFFFFF',
//                   color: '#FFFFFF',
//                   fontWeight: 'bold',
//                   borderRadius: 3,
//                   borderWidth: 2,
//                   transition: 'all 0.3s ease',
//                   '&:hover': {
//                     backgroundColor: 'rgba(255,255,255,0.1)',
//                     borderWidth: 2,
//                     transform: 'translateY(-3px)',
//                   }
//                 }}
//               >
//                 Try Calculator
//               </Button>
//             </Stack>

//             {/* Stats Section */}
//             <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
//               {[
//                 { number: "37000+ ", label: "Mutual Funds" },
//                 { number: "45", label: "Fund Houses" },
//                 { number: "100%", label: "Free to Use" },
//               ].map((stat, idx) => (
//                 <Grid item xs={4} sm={4} md={3} key={idx}>
//                   <Box sx={{ textAlign: 'center' }}>
//                     <Typography 
//                       variant="h4" 
//                       fontWeight="bold"
//                       sx={{ 
//                         fontSize: { xs: '1.5rem', md: '2.5rem' },
//                         textShadow: '0 2px 8px rgba(0,0,0,0.2)',
//                       }}
//                     >
//                       {stat.number}
//                     </Typography>
//                     <Typography 
//                       variant="body2"
//                       sx={{ 
//                         opacity: 0.9,
//                         fontSize: { xs: '0.75rem', md: '1rem' },
//                       }}
//                     >
//                       {stat.label}
//                     </Typography>
//                   </Box>
//                 </Grid>
//               ))}
//             </Grid>
//           </motion.div>
//         </Container>
//       </Box>

//       {/* Features Section */}
//       <Container maxWidth="lg" sx={{ py: 8 }}>
//         <Box sx={{ textAlign: 'center', mb: 6 }}>
//           <Typography 
//             variant="h3" 
//             component="h2" 
//             gutterBottom
//             sx={{
//               fontWeight: 'bold',
//               background: 'linear-gradient(90deg, #047857, #10B981)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//             }}
//           >
//             Why Choose Our Platform?
//           </Typography>
//           <Typography variant="h6" color="text.secondary">
//             Everything you need for smart mutual fund investing
//           </Typography>
//         </Box>

//         <Grid container spacing={4}>
//           {features.map((feature, idx) => (
//             <Grid item xs={12} sm={6} md={3} key={idx}>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: idx * 0.1 }}
//               >
//                 <Card 
//                   sx={{ 
//                     height: '100%',
//                     textAlign: 'center',
//                     p: 3,
//                     borderRadius: 3,
//                     border: '2px solid #D1FAE5',
//                     transition: 'all 0.3s ease',
//                     '&:hover': {
//                       transform: 'translateY(-10px)',
//                       boxShadow: '0 12px 28px rgba(16, 185, 129, 0.2)',
//                       borderColor: '#10B981',
//                     }
//                   }}
//                 >
//                   <Box 
//                     sx={{ 
//                       color: '#10B981',
//                       mb: 2,
//                       display: 'flex',
//                       justifyContent: 'center',
//                     }}
//                   >
//                     {feature.icon}
//                   </Box>
//                   <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#047857' }}>
//                     {feature.title}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {feature.desc}
//                   </Typography>
//                 </Card>
//               </motion.div>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>

//       {/* Featured Funds Section */}
//       <Box sx={{ backgroundColor: '#F0FDF4', py: 8 }}>
//         <Container maxWidth="lg">
//           <Box sx={{ textAlign: 'center', mb: 5 }}>
//             <Typography 
//               variant="h3" 
//               component="h2" 
//               gutterBottom
//               sx={{
//                 fontWeight: 'bold',
//                 background: 'linear-gradient(90deg, #047857, #10B981)',
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent',
//               }}
//             >
//               Featured Equity Funds
//             </Typography>
//             <Typography variant="h6" color="text.secondary">
//               Explore popular schemes with real-time data
//             </Typography>
//           </Box>

//           <Grid container spacing={4} justifyContent="center">
//             {Array.isArray(featuredSchemes) && featuredSchemes.length > 0 ? (
//               featuredSchemes.slice(0, 6).map((scheme) => (
//                 <Grid item xs={12} sm={6} md={4} key={scheme.schemeCode}>
//                   <SchemeCard scheme={scheme} />
//                 </Grid>
//               ))
//             ) : (
//               <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', width: '100%', py: 4 }}>
//                 Loading featured schemes...
//               </Typography>
//             )}
//           </Grid>

//           <Box sx={{ textAlign: 'center', mt: 5 }}>
//             <Button
//               variant="contained"
//               size="large"
//               href="/funds"
//               endIcon={<ArrowForwardIcon />}
//               sx={{
//                 px: 5,
//                 py: 1.5,
//                 fontSize: '1.1rem',
//                 backgroundColor: '#10B981',
//                 borderRadius: 3,
//                 fontWeight: 'bold',
//                 boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)',
//                 '&:hover': {
//                   backgroundColor: '#059669',
//                   transform: 'translateY(-2px)',
//                   boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
//                 }
//               }}
//             >
//               View All Funds
//             </Button>
//           </Box>
//         </Container>
//       </Box>

//       {/* Benefits Section */}
//       <Container maxWidth="lg" sx={{ py: 8 }}>
//         <Grid container spacing={6} alignItems="center">
//           <Grid item xs={12} md={6}>
//             <Typography 
//               variant="h3" 
//               gutterBottom
//               sx={{
//                 fontWeight: 'bold',
//                 background: 'linear-gradient(90deg, #047857, #10B981)',
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent',
//               }}
//             >
//               Everything You Need
//             </Typography>
//             <Typography variant="h6" color="text.secondary" paragraph>
//               Comprehensive tools for analyzing and investing in mutual funds
//             </Typography>
            
//             <Stack spacing={2} sx={{ mt: 4 }}>
//               {benefits.map((benefit, idx) => (
//                 <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                   <CheckCircle sx={{ color: '#10B981', fontSize: 28 }} />
//                   <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
//                     {benefit}
//                   </Typography>
//                 </Box>
//               ))}
//             </Stack>
//           </Grid>

//           <Grid item xs={12} md={6}>
//             <Paper
//               elevation={6}
//               sx={{
//                 p: 5,
//                 borderRadius: 4,
//                 background: 'linear-gradient(135deg, #F0FDF4 0%, #D1FAE5 100%)',
//                 border: '2px solid #10B981',
//               }}
//             >
//               <Typography variant="h4" gutterBottom sx={{ color: '#047857', fontWeight: 'bold' }}>
//                 Start Calculating Today
//               </Typography>
//               <Typography variant="body1" paragraph color="text.secondary" sx={{ mb: 3 }}>
//                 Use our advanced calculators to plan your investments and track returns with historical NAV data.
//               </Typography>
//               <Stack spacing={2}>
//                 <Button
//                   variant="contained"
//                   size="large"
//                   href="/calculator"
//                   fullWidth
//                   startIcon={<Calculate />}
//                   sx={{
//                     py: 1.5,
//                     backgroundColor: '#10B981',
//                     fontWeight: 'bold',
//                     fontSize: '1rem',
//                     borderRadius: 2,
//                     '&:hover': {
//                       backgroundColor: '#059669',
//                     }
//                   }}
//                 >
//                   SIP Calculator
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   size="large"
//                   href="/funds"
//                   fullWidth
//                   startIcon={<TrendingUp />}
//                   sx={{
//                     py: 1.5,
//                     borderColor: '#10B981',
//                     color: '#047857',
//                     fontWeight: 'bold',
//                     fontSize: '1rem',
//                     borderWidth: 2,
//                     borderRadius: 2,
//                     '&:hover': {
//                       borderWidth: 2,
//                       backgroundColor: '#F0FDF4',
//                     }
//                   }}
//                 >
//                   Browse Funds
//                 </Button>
//               </Stack>
//             </Paper>
//           </Grid>
//         </Grid>
//       </Container>

//       {/* CTA Section */}
//       <Box
//         sx={{
//           background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
//           py: 8,
//           textAlign: 'center',
//           color: 'white',
//         }}
//       >
//         <Container maxWidth="md">
//           <Typography variant="h3" gutterBottom fontWeight="bold">
//             Ready to Start Your Investment Journey?
//           </Typography>
//           <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
//             Explore thousands of mutual funds and make informed investment decisions
//           </Typography>
//           <Button
//             variant="contained"
//             size="large"
//             href="/funds"
//             endIcon={<ArrowForwardIcon />}
//             sx={{
//               px: 6,
//               py: 2,
//               fontSize: '1.1rem',
//               backgroundColor: '#FFFFFF',
//               color: '#047857',
//               fontWeight: 'bold',
//               borderRadius: 3,
//               '&:hover': {
//                 backgroundColor: '#F0FDF4',
//                 transform: 'scale(1.05)',
//               }
//             }}
//           >
            
//             Get Started Now
//           </Button>
//         </Container>
//       </Box>
//     </>
//   );
// };

// export default Home;



"use client";

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Paper,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Stack,
  CircularProgress,
} from '@mui/material';
import { 
  ArrowForward as ArrowForwardIcon,
  TrendingUp,
  Calculate,
  Insights,
  Security,
  Speed,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SchemeCard from '../components/SchemeCard';

const Home = ({ featuredSchemes = [], error: initialError }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [schemes, setSchemes] = useState(featuredSchemes);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(!featuredSchemes.length && !initialError);

  // Example API fetch for featured schemes (if not passed as prop)
  useEffect(() => {
    if (!featuredSchemes.length && !initialError) {
      const fetchFeaturedSchemes = async () => {
        try {
          setLoading(true);
          const response = await fetch('https://api.mfapi.in/mf');
          const data = await response.json();
          // Filter top 6 equity funds (example logic, adjust as needed)
          const equityFunds = data
            .filter(scheme => scheme.schemeName.toLowerCase().includes('equity'))
            .slice(0, 6);
          setSchemes(equityFunds);
          setError(null);
        } catch (err) {
          setError('Failed to fetch featured schemes');
        } finally {
          setLoading(false);
        }
      };
      fetchFeaturedSchemes();
    }
  }, [featuredSchemes, initialError]);

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ color: "#DC2626" }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => window.location.reload()}
          sx={{
            mt: 2,
            px: 4,
            py: 1,
            backgroundColor: '#10B981',
            borderRadius: 3,
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#059669',
            },
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  const features = [
    { icon: <Calculate sx={{ fontSize: 40, color: '#10B981' }} />, title: "SIP Calculator", desc: "Calculate returns with precision" },
    { icon: <Insights sx={{ fontSize: 40, color: '#10B981' }} />, title: "Deep Analysis", desc: "Historical NAV data insights" },
    { icon: <Security sx={{ fontSize: 40, color: '#10B981' }} />, title: "Secure & Reliable", desc: "Trusted data sources" },
    { icon: <Speed sx={{ fontSize: 40, color: '#10B981' }} />, title: "Fast Performance", desc: "Quick calculations & results" },
  ];

  const benefits = [
    "Real-time NAV data from trusted sources",
    "Advanced SIP & Lumpsum calculators",
    "Rolling returns analysis",
    "Compare multiple funds easily",
    "Step-up SIP calculations",
    "Comprehensive fund information",
  ];

  return (
    <>
      <Head>
        <title>Mutual Fund Hub - Discover & Calculate SIP Returns</title>
        <meta
          name="description"
          content="Explore mutual funds and calculate SIP returns with historical NAV data."
        />
      </Head>
      {/* <Navbar /> */}
      <Box sx={{ backgroundColor: "#F9FAFB", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #047857 0%, #10B981 50%, #34D399 100%)',
            color: 'white',
            py: { xs: 8, md: 12 },
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            },
          }}
        >
          <Container maxWidth="lg" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
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
                  fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3.5rem' },
                  textShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  mb: 3,
                }}
              >
                Your Gateway to Smart Investing
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 5, 
                  opacity: 0.95,
                  fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                  maxWidth: '800px',
                  mx: 'auto',
                }}
              >
                Discover top mutual funds, analyze historical performance, and calculate your investment returns with precision
              </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                justifyContent="center"
                sx={{ mb: 6 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  href="/funds"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ 
                    px: 5, 
                    py: 1.5,
                    fontSize: '1.1rem',
                    backgroundColor: '#FFFFFF',
                    color: '#047857',
                    fontWeight: 'bold',
                    borderRadius: 3,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#F0FDF4',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 28px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  Explore Funds
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  href="/calculator"
                  endIcon={<Calculate />}
                  sx={{ 
                    px: 5, 
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderColor: '#FFFFFF',
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    borderRadius: 3,
                    borderWidth: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderWidth: 2,
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  Try Calculator
                </Button>
              </Stack>
              {/* Stats Section */}
              <Grid container spacing={2} justifyContent="center">
                {[
                  { number: "18040", label: "Mutual Funds" },
                  { number: "45", label: "Fund Houses" },
                  { number: "100%", label: "Free to Use" },
                ].map((stat, idx) => (
                  <Grid item xs={12} sm={4} md={3} key={idx}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography 
                        variant="h4" 
                        fontWeight="bold"
                        sx={{ 
                          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                          textShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography 
                        variant="body2"
                        sx={{ 
                          opacity: 0.9,
                          fontSize: { xs: '0.75rem', sm: '0.9rem', md: '1rem' },
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Container>
        </Box>

        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #047857, #10B981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Why Choose Our Platform?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>
            Everything you need for smart mutual fund investing
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {features.map((feature, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card 
                    sx={{ 
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 3,
                      border: '2px solid #D1FAE5',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: '0 12px 28px rgba(16, 185, 129, 0.2)',
                        borderColor: '#10B981',
                        backgroundColor: '#F0FDF4',
                      },
                    }}
                  >
                    <CardContent>
                      <Box 
                        sx={{ 
                          color: '#10B981',
                          mb: 2,
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#047857' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {feature.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>

      

        {/* Benefits Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h3" 
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  background: 'linear-gradient(90deg, #047857, #10B981)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                Everything You Need
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                paragraph
                sx={{ textAlign: { xs: 'center', md: 'left' }, mb: 4 }}
              >
                Comprehensive tools for analyzing and investing in mutual funds
              </Typography>
              <Stack spacing={2}>
                {benefits.map((benefit, idx) => (
                  <Box 
                    key={idx} 
                    sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}
                  >
                    <CheckCircle sx={{ color: '#10B981', fontSize: 28 }} />
                    <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                      {benefit}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={6}
                sx={{
                  p: { xs: 4, md: 5 },
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #F0FDF4 0%, #D1FAE5 100%)',
                  border: '2px solid #10B981',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h4" gutterBottom sx={{ color: '#047857', fontWeight: 'bold' }}>
                  Start Calculating Today
                </Typography>
                <Typography variant="body1" paragraph color="text.secondary" sx={{ mb: 3 }}>
                  Use our advanced calculators to plan your investments and track returns with historical NAV data.
                </Typography>
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    href="/calculator"
                    fullWidth
                    startIcon={<Calculate />}
                    sx={{
                      py: 1.5,
                      backgroundColor: '#10B981',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: '#059669',
                      },
                    }}
                  >
                    SIP Calculator
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    href="/funds"
                    fullWidth
                    startIcon={<TrendingUp />}
                    sx={{
                      py: 1.5,
                      borderColor: '#10B981',
                      color: '#047857',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      borderWidth: 2,
                      borderRadius: 2,
                      '&:hover': {
                        borderWidth: 2,
                        backgroundColor: '#F0FDF4',
                      },
                    }}
                  >
                    Browse Funds
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* CTA Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
            py: 8,
            textAlign: 'center',
            color: 'white',
          }}
        >
          <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              gutterBottom 
              fontWeight="bold"
              sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' } }}
            >
              Ready to Start Your Investment Journey?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ mb: 4, opacity: 0.95, fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}
            >
              Explore thousands of mutual funds and make informed investment decisions
            </Typography>
            <Button
              variant="contained"
              size="large"
              href="/funds"
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 6,
                py: 1.5,
                fontSize: '1.1rem',
                backgroundColor: '#FFFFFF',
                color: '#047857',
                fontWeight: 'bold',
                borderRadius: 3,
                boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#F0FDF4',
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                },
              }}
            >
              Get Started Now
            </Button>
          </Container>
        </Box>
      </Box>

    </>
  );
};

export default Home;