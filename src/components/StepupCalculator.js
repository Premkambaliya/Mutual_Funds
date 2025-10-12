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

export default function StepUpSIPCalculator({ navData }) {
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
  const [stepUpPercent, setStepUpPercent] = useState(10); // yearly increase %
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

  const calculateReturns = () => {
    setError("");
    if (sipAmount <= 0) {
      setError("SIP Amount must be greater than zero.");
      return;
    }
    if (stepUpPercent < 0) {
      setError("Step-up percentage must be non-negative.");
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

    const findNavOnOrBefore = (targetDate) => {
      for (let i = parsedData.length - 1; i >= 0; i--) {
        if (parsedData[i].date <= targetDate) return parsedData[i];
      }
      return null;
    };

    let totalInvested = 0;
    let totalUnits = 0;
    const growth = [];
    let currentSip = sipAmount;

    for (let dt = new Date(start), yearCount = 0; dt <= end; dt.setDate(dt.getDate() + freqDays)) {
      const navEntry = findNavOnOrBefore(dt);
      if (!navEntry) continue;

      // Apply step-up every 12 months (if frequency is monthly)
      if (frequency === "Monthly") {
        if (dt.getMonth() === start.getMonth() && dt.getDate() === start.getDate() && yearCount > 0) {
          currentSip += (currentSip * stepUpPercent) / 100;
        }
      }
      if (frequency === "Weekly") {
        // Approx: every 52 weeks = 1 year
        const weeksSinceStart = Math.floor((dt - start) / (7 * 24 * 60 * 60 * 1000));
        if (weeksSinceStart % 52 === 0 && weeksSinceStart > 0) {
          currentSip += (currentSip * stepUpPercent) / 100;
        }
      }

      const units = currentSip / navEntry.nav;
      totalUnits += units;
      totalInvested += currentSip;

      const currentValue = totalUnits * navEntry.nav;
      growth.push({ date: dt.toISOString().split("T")[0], value: currentValue });

      // track yearly step count
      if (frequency === "Monthly" && dt.getMonth() === start.getMonth() && dt.getDate() === start.getDate()) {
        yearCount++;
      }
    }

    if (totalInvested === 0) {
      setError("No investments made in the selected period.");
      return;
    }

    const lastNav = findNavOnOrBefore(end);
    const currentValue = totalUnits * (lastNav?.nav || 0);
    const absReturn = ((currentValue - totalInvested) / totalInvested) * 100;
    const years = (end - start) / (365 * 24 * 60 * 60 * 1000);
    const annReturn = years > 0 ? Math.pow(currentValue / totalInvested, 1 / years) - 1 : 0;

    setResult({
      totalInvested,
      totalUnits,
      currentValue,
      absReturn,
      annReturn: annReturn * 100,
      growth,
    });
  };

  return (
    <Box ref={containerRef}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        Step-Up SIP Calculator
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
          calculateReturns();
        }}
      >
        <TextField
          label="Initial SIP Amount (₹)"
          type="number"
          value={sipAmount}
          onChange={(e) => setSipAmount(Number(e.target.value))}
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
          label="Step-Up % (per year)"
          type="number"
          value={stepUpPercent}
          onChange={(e) => setStepUpPercent(Number(e.target.value))}
          inputProps={{ min: 0 }}
          required
          sx={{ flex: "1 1 180px" }}
        />
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
          Calculate
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
