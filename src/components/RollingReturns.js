import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function RollingReturnsCalculator({ navData }) {
  const [selectedPeriod, setSelectedPeriod] = useState("1Y");
  const [customPeriod, setCustomPeriod] = useState(3);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);

  const periodOptions = [
    { label: "1 Day", value: "1D", days: 1 },
    { label: "1 Week", value: "1W", days: 7 },
    { label: "1 Month", value: "1M", days: 30 },
    { label: "3 Months", value: "3M", days: 90 },
    { label: "6 Months", value: "6M", days: 182 },
    { label: "1 Year", value: "1Y", days: 365 },
    { label: "3 Years", value: "3Y", days: 1095 },
    { label: "5 Years", value: "5Y", days: 1825 },
    { label: "Custom", value: "custom", days: null },
  ];

  const calculateRollingReturns = () => {
    setError("");
    setShowResult(false);
    
    if (!navData || navData.length === 0) {
      setError("NAV data not available.");
      return;
    }

    let daysInPeriod;
    let periodLabel;
    
    if (selectedPeriod === "custom") {
      if (customPeriod <= 0) {
        setError("Rolling period must be greater than 0.");
        return;
      }
      daysInPeriod = customPeriod * 365;
      periodLabel = `${customPeriod} Years`;
    } else {
      const selected = periodOptions.find(p => p.value === selectedPeriod);
      daysInPeriod = selected.days;
      periodLabel = selected.label;
    }

    // Parse and sort data
    const parsedData = navData
      .map((d) => {
        let dateObj;
        if (typeof d.date === 'string') {
          if (d.date.includes("-")) {
            const parts = d.date.split("-");
            if (parts[0].length === 4) {
              dateObj = new Date(d.date);
            } else {
              dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            }
          } else if (d.date.includes("/")) {
            const parts = d.date.split("/");
            dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          } else {
            dateObj = new Date(d.date);
          }
        } else {
          dateObj = new Date(d.date);
        }
        
        return {
          date: dateObj,
          nav: parseFloat(d.nav),
        };
      })
      .filter(d => !isNaN(d.date.getTime()) && !isNaN(d.nav) && d.nav > 0)
      .sort((a, b) => a.date - b.date);

    if (parsedData.length === 0) {
      setError("No valid NAV data found.");
      return;
    }

    if (parsedData.length < 2) {
      setError("Need at least 2 data points to calculate returns.");
      return;
    }

    const rollingReturns = [];
    const yearsInPeriod = daysInPeriod / 365;

    // Calculate rolling returns - each point represents the return for the SELECTED period ending on that date
    for (let i = 0; i < parsedData.length; i++) {
      const endDate = parsedData[i];
      
      // Look backwards to find the start point for this period
      let startIndex = -1;
      let minDiff = Infinity;
      
      for (let j = i - 1; j >= 0; j--) {
        const daysDiff = (endDate.date - parsedData[j].date) / (1000 * 60 * 60 * 24);
        const diff = Math.abs(daysDiff - daysInPeriod);
        
        // Accept if within reasonable range (±15% of period or at least reached minimum)
        if (daysDiff >= daysInPeriod * 0.85 && daysDiff <= daysInPeriod * 1.15) {
          if (diff < minDiff) {
            minDiff = diff;
            startIndex = j;
          }
          // If we found exact or very close match, use it
          if (diff < daysInPeriod * 0.05) {
            break;
          }
        }
        
        // If we've gone too far back, stop searching
        if (daysDiff > daysInPeriod * 1.2) {
          break;
        }
      }

      if (startIndex === -1) continue;

      const startDate = parsedData[startIndex];
      const actualDays = (endDate.date - startDate.date) / (1000 * 60 * 60 * 24);
      const actualYears = actualDays / 365;
      
      // Calculate annualized return
      let annReturn;
      const totalReturn = (endDate.nav - startDate.nav) / startDate.nav;
      
      if (actualYears < 1) {
        // For periods less than 1 year, annualize the return
        annReturn = (Math.pow(1 + totalReturn, 365 / actualDays) - 1) * 100;
      } else {
        // For periods >= 1 year, use CAGR
        annReturn = (Math.pow(endDate.nav / startDate.nav, 1 / actualYears) - 1) * 100;
      }

      // Only include valid returns
      if (isFinite(annReturn)) {
        rollingReturns.push({
          date: endDate.date.toISOString().split("T")[0],
          annReturn: annReturn,
          startDate: startDate.date.toISOString().split("T")[0],
          endDate: endDate.date.toISOString().split("T")[0],
          startNav: startDate.nav,
          endNav: endDate.nav,
          actualDays: Math.round(actualDays),
          totalReturn: totalReturn * 100,
        });
      }
    }

    if (rollingReturns.length === 0) {
      setError(`Not enough data for ${periodLabel} rolling period. Please select a shorter period or ensure you have sufficient historical data.`);
      return;
    }

    // Calculate statistics
    const returns = rollingReturns.map(d => d.annReturn);
    const avg = returns.reduce((a, b) => a + b, 0) / returns.length;
    const best = Math.max(...returns);
    const worst = Math.min(...returns);
    
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avg, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);

    // Calculate median
    const sortedReturns = [...returns].sort((a, b) => a - b);
    const median = sortedReturns.length % 2 === 0
      ? (sortedReturns[sortedReturns.length / 2 - 1] + sortedReturns[sortedReturns.length / 2]) / 2
      : sortedReturns[Math.floor(sortedReturns.length / 2)];

    // Calculate positive and negative return percentages
    const positiveReturns = returns.filter(r => r > 0).length;
    const negativeReturns = returns.filter(r => r < 0).length;
    const positivePercentage = (positiveReturns / returns.length) * 100;

    setResult({
      rollingReturns,
      avg,
      best,
      worst,
      stdDev,
      median,
      positivePercentage,
      positiveReturns,
      negativeReturns,
      periodLabel,
      periodDays: daysInPeriod,
    });
    
    setTimeout(() => setShowResult(true), 100);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '14px', 
          border: '2px solid #1976d2',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          minWidth: '220px'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', fontSize: '15px', color: '#1a1a1a', borderBottom: '1px solid #e0e0e0', paddingBottom: '6px' }}>
            Period Ending: {data.date}
          </p>
          <p style={{ margin: '6px 0', color: data.annReturn >= 0 ? '#2e7d32' : '#c62828', fontSize: '16px', fontWeight: 'bold' }}>
            Annualized Return: {data.annReturn.toFixed(2)}%
          </p>
          <p style={{ margin: '4px 0', color: '#666', fontSize: '13px' }}>
            Total Return: {data.totalReturn.toFixed(2)}%
          </p>
          <p style={{ margin: '4px 0', color: '#666', fontSize: '13px' }}>
            Duration: {data.actualDays} days
          </p>
          <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #e0e0e0' }}>
            <p style={{ margin: '2px 0', color: '#666', fontSize: '12px' }}>
              From: {data.startDate}
            </p>
            <p style={{ margin: '2px 0', color: '#666', fontSize: '12px' }}>
              To: {data.endDate}
            </p>
          </div>
          <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #e0e0e0' }}>
            <p style={{ margin: '2px 0', color: '#666', fontSize: '12px' }}>
              NAV: {data.startNav.toFixed(4)} → {data.endNav.toFixed(4)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const formatXAxis = (date) => {
    const d = new Date(date);
    if (selectedPeriod === "1D" || selectedPeriod === "1W") {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
    }
    return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: '#1a1a1a' }}>
          Rolling Returns Calculator
        </h2>
        <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.5' }}>
          Analyze returns for a specific time period rolled forward across your entire dataset
        </p>
      </div>

      <div style={{ marginBottom: '24px', backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <p style={{ fontSize: '15px', fontWeight: '600', marginBottom: '14px', color: '#333' }}>
          Select Rolling Period:
        </p>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px', fontStyle: 'italic' }}>
          This will calculate returns for every {selectedPeriod === "custom" ? `${customPeriod} year` : periodOptions.find(p => p.value === selectedPeriod)?.label.toLowerCase() || ""} period in your data
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {periodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedPeriod(option.value)}
              style={{
                padding: '12px 20px',
                border: selectedPeriod === option.value ? '2px solid #1976d2' : '1px solid #ddd',
                backgroundColor: selectedPeriod === option.value ? '#1976d2' : 'white',
                color: selectedPeriod === option.value ? 'white' : '#333',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: selectedPeriod === option.value ? '600' : '500',
                fontSize: '14px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (selectedPeriod !== option.value) {
                  e.target.style.backgroundColor = '#f5f5f5';
                  e.target.style.borderColor = '#999';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedPeriod !== option.value) {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#ddd';
                }
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        {selectedPeriod === "custom" && (
          <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: '600', color: '#333' }}>
              Custom Period (Years):
            </label>
            <input
              type="number"
              value={customPeriod}
              onChange={(e) => setCustomPeriod(Number(e.target.value))}
              min="0.01"
              step="0.1"
              style={{
                padding: '12px',
                width: '220px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '15px',
                fontFamily: 'inherit'
              }}
            />
            <p style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
              Enter the number of years for your custom rolling period
            </p>
          </div>
        )}

        <button
          onClick={calculateRollingReturns}
          style={{
            padding: '14px 36px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            marginTop: '20px',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(25,118,210,0.3)'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#1565c0';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 8px rgba(25,118,210,0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#1976d2';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(25,118,210,0.3)';
          }}
        >
          📊 Calculate Rolling Returns
        </button>
      </div>

      {error && (
        <div style={{ 
          padding: '18px', 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          borderRadius: '8px',
          marginBottom: '20px',
          fontWeight: '500',
          border: '1px solid #ef9a9a',
          fontSize: '14px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div style={{
          opacity: showResult ? 1 : 0,
          transform: showResult ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.5s ease',
          backgroundColor: 'white',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          borderRadius: '12px',
          padding: '32px',
          marginTop: '24px'
        }}>
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#1a1a1a' }}>
              {result.periodLabel} Rolling Returns Analysis
            </h3>
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
              Showing {result.rollingReturns.length} rolling {result.periodLabel.toLowerCase()} periods • 
              {result.positiveReturns} positive, {result.negativeReturns} negative ({result.positivePercentage.toFixed(1)}% positive)
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px', 
            marginBottom: '32px' 
          }}>
            <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '10px', border: '2px solid #90caf9' }}>
              <p style={{ color: '#1565c0', fontSize: '13px', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Average Return
              </p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#1976d2' }}>
                {result.avg.toFixed(2)}%
              </p>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: '#f3e5f5', borderRadius: '10px', border: '2px solid #ce93d8' }}>
              <p style={{ color: '#7b1fa2', fontSize: '13px', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Median Return
              </p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#8e24aa' }}>
                {result.median.toFixed(2)}%
              </p>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '10px', border: '2px solid #81c784' }}>
              <p style={{ color: '#2e7d32', fontSize: '13px', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Best Return
              </p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#2e7d32', margin: 0 }}>
                {result.best.toFixed(2)}%
              </p>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: '#ffebee', borderRadius: '10px', border: '2px solid #e57373' }}>
              <p style={{ color: '#c62828', fontSize: '13px', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Worst Return
              </p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#c62828', margin: 0 }}>
                {result.worst.toFixed(2)}%
              </p>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: '#fff3e0', borderRadius: '10px', border: '2px solid #ffb74d' }}>
              <p style={{ color: '#e65100', fontSize: '13px', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Volatility (Std Dev)
              </p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#ef6c00' }}>
                {result.stdDev.toFixed(2)}%
              </p>
            </div>
          </div>

          <div style={{ marginTop: '40px' }}>
            <h4 style={{ fontSize: '19px', fontWeight: '600', marginBottom: '12px', color: '#333' }}>
              {result.periodLabel} Rolling Returns Over Time
            </h4>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
              Each point shows the annualized return for a {result.periodLabel.toLowerCase()} period ending on that date
            </p>
            <ResponsiveContainer width="100%" height={480}>
              <LineChart
                data={result.rollingReturns}
                margin={{ top: 10, right: 40, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="date" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 11, fill: '#666' }}
                  tickFormatter={formatXAxis}
                  interval={Math.max(0, Math.floor(result.rollingReturns.length / 15))}
                />
                <YAxis 
                  label={{ 
                    value: `Annualized Return (%)`, 
                    angle: -90, 
                    position: 'insideLeft', 
                    style: { fill: '#666', fontWeight: '600', fontSize: '13px' } 
                  }}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                <ReferenceLine y={0} stroke="#999" strokeDasharray="3 3" strokeWidth={1.5} />
                <ReferenceLine 
                  y={result.avg} 
                  stroke="#ff7300" 
                  strokeDasharray="5 5" 
                  strokeWidth={2}
                  label={{ 
                    value: `Avg: ${result.avg.toFixed(2)}%`, 
                    position: 'right', 
                    fill: '#ff7300', 
                    fontSize: 13,
                    fontWeight: 'bold'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="annReturn" 
                  stroke="#1976d2" 
                  strokeWidth={2.5}
                  dot={false}
                  name={`${result.periodLabel} Return`}
                  activeDot={{ r: 7, fill: '#1976d2', stroke: 'white', strokeWidth: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginTop: '28px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
            <p style={{ color: '#333', fontSize: '14px', margin: 0, lineHeight: '1.7' }}>
              <strong>📌 Understanding This Chart:</strong> Each point represents the annualized return for a {result.periodLabel.toLowerCase()} period ending on that date. 
              For example, if you selected &quot;1 Year&quot;, each point shows what return you would have earned if you held the investment for exactly 1 year ending on that date. 
              This helps identify when the investment performed well or poorly over your chosen time frame.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}