// import React from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   Stack,
//   Divider,
//   useTheme,
//   Fade,
// } from "@mui/material";
// import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
// import CategoryIcon from "@mui/icons-material/Category";
// import StyleIcon from "@mui/icons-material/Style";
// import PaymentIcon from "@mui/icons-material/Payment";
// import ReplayIcon from "@mui/icons-material/Replay";

// export default function SchemeMeta({ scheme }) {
//   const theme = useTheme();

//   if (!scheme) {
//     return (
//       <Card sx={{ mb: 4, minHeight: 150, display: "flex", alignItems: "center", justifyContent: "center" }}>
//         <CardContent>
//           <Typography variant="body1" color="text.secondary" align="center">
//             Loading scheme metadata...
//           </Typography>
//         </CardContent>
//       </Card>
//     );
//   }

//   // Helper to check if a field is non-empty and meaningful
//   const isValidField = (field) => field !== undefined && field !== null && field.trim() !== "";

//   return (
//     <Fade in timeout={700}>
//       <Card
//         sx={{
//           mb: 4,
//           boxShadow: 6,
//           borderRadius: 3,
//           background: theme.palette.mode === "light"
//             ? "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
//             : "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)",
//           transition: "transform 0.3s ease",
//           "&:hover": {
//             transform: "scale(1.03)",
//             boxShadow: 12,
//           },
//         }}
//       >
//         <CardContent>
//           <Typography
//             variant="h4"
//             gutterBottom
//             sx={{ fontWeight: "bold", color: theme.palette.primary.dark }}
//           >
//             {scheme.scheme_name}
//           </Typography>

//           <Divider sx={{ mb: 3, borderColor: theme.palette.divider }} />

//           <Stack spacing={2} direction={{ xs: "column", sm: "row" }} flexWrap="wrap" gap={3}>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 220 }}>
//               <AccountBalanceIcon color="primary" />
//               <Typography variant="body1" color="text.primary">
//                 <strong>Fund House:</strong> {scheme.fund_house}
//               </Typography>
//             </Box>

//             <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 220 }}>
//               <CategoryIcon color="primary" />
//               <Typography variant="body1" color="text.primary">
//                 <strong>Category:</strong> {scheme.scheme_category}
//               </Typography>
//             </Box>

//             <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 220 }}>
//               <StyleIcon color="primary" />
//               <Typography variant="body1" color="text.primary">
//                 <strong>Scheme Type:</strong> {scheme.scheme_type}
//               </Typography>
//             </Box>

//             {isValidField(scheme.isin_div_payout) && (
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 220 }}>
//                 <PaymentIcon color="primary" />
//                 <Typography variant="body1" color="text.primary">
//                   <strong>ISIN Div Payout:</strong> {scheme.isin_div_payout}
//                 </Typography>
//               </Box>
//             )}

//             {isValidField(scheme.isin_div_reinvestment) && (
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 220 }}>
//                 <ReplayIcon color="primary" />
//                 <Typography variant="body1" color="text.primary">
//                   <strong>ISIN Div Reinvestment:</strong> {scheme.isin_div_reinvestment}
//                 </Typography>
//               </Box>
//             )}
//           </Stack>
//         </CardContent>
//       </Card>
//     </Fade>
//   );
// }




import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Divider,
  Chip,
  Fade,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CategoryIcon from "@mui/icons-material/Category";
import StyleIcon from "@mui/icons-material/Style";
import PaymentIcon from "@mui/icons-material/Payment";
import ReplayIcon from "@mui/icons-material/Replay";

export default function SchemeMeta({ scheme }) {
  if (!scheme) {
    return (
      <Card 
        sx={{ 
          mb: 4, 
          minHeight: 150, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          borderRadius: 3,
          border: '2px solid #D1FAE5',
        }}
      >
        <CardContent>
          <Typography variant="body1" color="text.secondary" align="center">
            Loading scheme metadata...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const isValidField = (field) => field !== undefined && field !== null && field.trim() !== "";

  return (
    <Fade in timeout={700}>
      <Card
        sx={{
          mb: 4,
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15)',
          borderRadius: 4,
          border: '2px solid #D1FAE5',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F0FDF4 100%)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 32px rgba(16, 185, 129, 0.25)',
            borderColor: '#10B981',
          },
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #059669, #10B981)',
            p: 3,
            color: 'white',
          }}
        >
          <Typography
            variant="h4"
            sx={{ 
              fontWeight: "bold",
              textShadow: '0 2px 8px rgba(0,0,0,0.15)',
              mb: 1,
            }}
          >
            {scheme.scheme_name}
          </Typography>
          <Chip
            label={scheme.scheme_category}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.25)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          />
        </Box>

        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            {/* Fund House */}
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: '#F0FDF4',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#D1FAE5',
                  transform: 'translateX(5px)',
                }
              }}
            >
              <Box
                sx={{
                  backgroundColor: '#10B981',
                  borderRadius: 2,
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AccountBalanceIcon sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Fund House
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#047857' }}>
                  {scheme.fund_house}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ borderColor: '#D1FAE5' }} />

            {/* Other Details in Grid */}
            <Stack spacing={2}>
              <Box 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: '#F9FAFB',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#F0FDF4',
                  }
                }}
              >
                <CategoryIcon sx={{ color: '#10B981', fontSize: 28 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#047857' }}>
                    {scheme.scheme_category}
                  </Typography>
                </Box>
              </Box>

              <Box 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: '#F9FAFB',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#F0FDF4',
                  }
                }}
              >
                <StyleIcon sx={{ color: '#10B981', fontSize: 28 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Scheme Type
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#047857' }}>
                    {scheme.scheme_type}
                  </Typography>
                </Box>
              </Box>

              {isValidField(scheme.isin_div_payout) && (
                <Box 
                  sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: '#F9FAFB',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#F0FDF4',
                    }
                  }}
                >
                  <PaymentIcon sx={{ color: '#10B981', fontSize: 28 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      ISIN Div Payout
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#059669', fontFamily: 'monospace' }}>
                      {scheme.isin_div_payout}
                    </Typography>
                  </Box>
                </Box>
              )}

              {isValidField(scheme.isin_div_reinvestment) && (
                <Box 
                  sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: '#F9FAFB',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#F0FDF4',
                    }
                  }}
                >
                  <ReplayIcon sx={{ color: '#10B981', fontSize: 28 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      ISIN Div Reinvestment
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#059669', fontFamily: 'monospace' }}>
                      {scheme.isin_div_reinvestment}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Fade>
  );
}