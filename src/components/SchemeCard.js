// import React from 'react';
// import { Card, CardContent, Typography, Button, Chip } from '@mui/material';

// const SchemeCard = ({ scheme }) => {
//   const { schemeName, schemeCategory, aum, nav, schemeCode } = scheme || {};

//   return (
//     <Card sx={{ maxWidth: 300, height: '100%', display: 'flex', flexDirection: 'column' }}>
//       <CardContent sx={{ flexGrow: 1 }}>
//         <Typography gutterBottom variant="h6" component="div" color="primary">
//           {schemeName}
//         </Typography>
//         <Chip label={schemeCategory} size="small" color="secondary" sx={{ mb: 1 }} />
//         <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//           AUM: ₹{aum ? (aum / 10000000).toFixed(2) + ' Cr' : 'N/A'}
//         </Typography>
//         <Typography variant="body1" fontWeight="bold">
//           NAV: ₹{nav || 'N/A'}
//         </Typography>
//       </CardContent>
//       <Button
//         variant="contained"
//         href={`/fund/${schemeCode}`} // Link to fund detail page
//         sx={{ mt: 'auto', borderRadius: 0 }}
//       >
//         Explore Fund
//       </Button>
//     </Card>
//   );
// };

// export default SchemeCard;



import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Chip,
  Box,
  Stack,
} from '@mui/material';
import { TrendingUp, ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';

const SchemeCard = ({ scheme }) => {
  const { schemeName, schemeCategory, aum, nav, schemeCode } = scheme || {};

  // Generate random performance for demo
  const seedBase = Number(String(schemeCode).replace(/\D/g, "")) || 1;
  const seededRand = () => {
    const x = Math.sin(seedBase * 9301) * 233280;
    return x - Math.floor(x);
  };
  const performanceValue = (seededRand() * 20 - 5).toFixed(2);
  const isPositive = performanceValue >= 0;

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ height: '100%' }}
    >
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 3,
          border: '2px solid #D1FAE5',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          '&:hover': {
            borderColor: '#10B981',
            boxShadow: '0 12px 28px rgba(16, 185, 129, 0.25)',
          }
        }}
      >
        {/* Header with Category */}
        <Box 
          sx={{ 
            background: 'linear-gradient(135deg, #059669, #10B981)',
            p: 2,
            color: 'white',
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Chip 
              label={schemeCategory || 'Equity'} 
              size="small" 
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.25)',
                color: 'white',
                fontWeight: 600,
              }} 
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: 12,
                color: isPositive ? '#D1FAE5' : '#FEE2E2',
                backgroundColor: isPositive 
                  ? 'rgba(209, 250, 229, 0.2)' 
                  : 'rgba(254, 226, 226, 0.2)',
              }}
            >
              <TrendingUp
                size={16}
                style={{
                  transform: !isPositive ? "rotate(180deg)" : "none",
                }}
              />
              <Typography component="span">{performanceValue}%</Typography>
            </Box>
          </Stack>
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div" 
            sx={{
              fontWeight: 700,
              color: '#047857',
              mb: 2,
              lineHeight: 1.3,
              minHeight: 60,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {schemeName || 'Scheme Name'}
          </Typography>
          
          <Stack spacing={1.5} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                AUM
              </Typography>
              <Typography variant="body1" fontWeight="bold" sx={{ color: '#059669' }}>
                ₹{aum ? (aum / 10000000).toFixed(2) + ' Cr' : 'N/A'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Current NAV
              </Typography>
              <Typography variant="body1" fontWeight="bold" sx={{ color: '#047857' }}>
                ₹{nav || 'N/A'}
              </Typography>
            </Box>
          </Stack>
        </CardContent>

        <Button
          variant="contained"
          href={`/scheme/${schemeCode}`}
          endIcon={<ArrowForward />}
          sx={{ 
            mt: 'auto', 
            borderRadius: 0,
            py: 1.5,
            backgroundColor: '#10B981',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#059669',
            }
          }}
        >
          View Details
        </Button>
      </Card>
    </motion.div>
  );
};

export default SchemeCard;