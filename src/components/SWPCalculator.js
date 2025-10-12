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

export default function SWPCalculator({ navData }) {
  const theme = useTheme();
  const containerRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(900);

  useEffect(() => {
    if (!containerRef.current) return;
    const handleResize = () => {
      setChartWidth(containerRef.current.clientWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [lumpSum, setLumpSum] = useState(500000); // Initial investment
  const [withdrawAmount, setWithdrawAmount] = useState(5000); // Withdrawal per interval
  const [frequency, setFrequency] = useState("Monthly");
  const [startDate, setStartDate] = useState(() => {
    if (!navData || navData.length === 0) return "2020-01-01";
    const d = navData[navData.length - 1].date;
    const parts = d.split('-');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  });
  const [endDate, setEndDate] = useState(() => {
    if (!navData || navData.length === 0) return new Date().toISOString().split("T")[0];
    const d = navData[0].date;
    const parts = d.split('-');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const calculateSWP = () => {
    setError("");
    if (lumpSum <= 0) {
      setError("Initial investment must be greater than zero.");
      return;
    }
    if (withdrawAmount <= 0) {
      setError("Withdrawal amount must be greater than zero.");
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

    // Validate endDate against latest NAV
    const latestNavRaw = navData[0].date; // dd-mm-yyyy
    const lp = latestNavRaw.split('-');
    const latestISO = `${lp[2]}-${lp[1]}-${lp[0]}`;
    if (new Date(endDate) > new Date(latestISO)) {
      setError(`No NAV data available for selected end date. Latest NAV available: ${latestISO}`);
      return;
    }

    // Validate startDate against earliest NAV
    const earliestNavRaw = navData[navData.length - 1].date;
    const ep = earliestNavRaw.split('-');
    const earliestISO = `${ep[2]}-${ep[1]}-${ep[0]}`;
    if (new Date(startDate) < new Date(earliestISO)) {
      setError(`Start date is before earliest available NAV (${earliestISO}). Please choose a later date.`);
      return;
    }

    const freqDays = frequency === "Monthly" ? 30 : 7;

    const parsedData = navData
      .map((d) => ({
        date: new Date(d.date.split("-").reverse().join("-")),
        nav: parseFloat(d.nav),
      }))
      .sort((a, b) => a.date - b.date);

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Helper to find NAV on or before date
    const findNavOnOrBefore = (targetDate) => {
      for (let i = parsedData.length - 1; i >= 0; i--) {
        if (parsedData[i].date <= targetDate) return parsedData[i];
      }
      return null;
    };

    let totalUnits = lumpSum / (findNavOnOrBefore(start)?.nav || 1);
    let totalWithdrawn = 0;
    const growth = [];

    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + freqDays)) {
      const navEntry = findNavOnOrBefore(dt);
      if (!navEntry) continue;

      const currentValue = totalUnits * navEntry.nav;

      if (currentValue <= 0) break;

      // withdraw if enough value
      if (currentValue >= withdrawAmount) {
        const unitsToSell = withdrawAmount / navEntry.nav;
        totalUnits -= unitsToSell;
        totalWithdrawn += withdrawAmount;
      } else {
        // Insufficient value → break (investment exhausted)
        totalWithdrawn += currentValue;
        totalUnits = 0;
        growth.push({ date: dt.toISOString().split("T")[0], value: 0 });
        break;
      }

      growth.push({
        date: dt.toISOString().split("T")[0],
        value: totalUnits * navEntry.nav,
      });
    }

    const lastNav = findNavOnOrBefore(end);
    const finalValue = totalUnits * (lastNav?.nav || 0);

    setResult({
      lumpSum,
      withdrawAmount,
      totalWithdrawn,
      finalValue,
      growth,
    });
  };

  return (
    <Box ref={containerRef}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        SWP Calculator
      </Typography>

      {/* Input Form */}
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
          calculateSWP();
        }}
      >
        <TextField
          label="Initial Investment (₹)"
          type="number"
          value={lumpSum}
          onChange={(e) => setLumpSum(Number(e.target.value))}
          inputProps={{ min: 1 }}
          required
          sx={{ flex: "1 1 180px" }}
        />
        <TextField
          label="Withdrawal Amount (₹)"
          type="number"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(Number(e.target.value))}
          inputProps={{ min: 1 }}
          required
          sx={{ flex: "1 1 180px" }}
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
          Calculate SWP
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2, fontWeight: "medium" }}>
          {error}
        </Typography>
      )}

      {/* Results */}
      {result && (
        <Grow in timeout={800}>
          <Card sx={{ mt: 3, maxWidth: 900, boxShadow: 6 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Results
              </Typography>
              <Typography>
                <strong>Initial Investment:</strong> ₹{result.lumpSum.toFixed(2)}
              </Typography>
              <Typography>
                <strong>Total Withdrawn:</strong> ₹{result.totalWithdrawn.toFixed(2)}
              </Typography>
              <Typography>
                <strong>Final Value:</strong> ₹{result.finalValue.toFixed(2)}
              </Typography>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Portfolio Value Over Time
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
                      label: "Portfolio Value (₹)",
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
