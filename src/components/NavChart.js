import React, { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

// Custom Container Component
const Container = ({ children, style }) => (
  <div style={{ 
    maxWidth: '1200px', 
    margin: '0 auto', 
    padding: '24px',
    ...style 
  }}>
    {children}
  </div>
);

// Custom Box Component
const Box = ({ children, style, ref }) => (
  <div style={style} ref={ref}>
    {children}
  </div>
);

// Custom Typography Component
const Typography = ({ variant = "body1", children, style }) => {
  const styles = {
    h5: { fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px 0' },
    body1: { fontSize: '16px', margin: '16px 0' },
    subtitle1: { fontSize: '14px', fontWeight: '600' }
  };

  return (
    <div style={{ ...styles[variant], color: '#1f2937', ...style }}>
      {children}
    </div>
  );
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '12px 16px',
        border: '2px solid #10B981',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <p style={{ margin: '0 0 4px 0', fontWeight: '600', color: '#047857' }}>
          {label}
        </p>
        <p style={{ margin: 0, color: '#059669' }}>
          NAV: ₹{payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

// Main Chart Component
export default function NavChart({ navData }) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!navData || navData.length === 0) {
    return (
      <Container>
        <Typography variant="body1" style={{ color: '#6b7280', textAlign: 'center' }}>
          No NAV data available.
        </Typography>
      </Container>
    );
  }

  // Take last 365 days or all if less
  const lastYearData = navData.slice(0, 365).reverse();

  // Prepare chart data
  const chartData = lastYearData.map((d) => {
    const [dd, mm, yyyy] = d.date.split("-");
    const dateObj = new Date(`${yyyy}-${mm}-${dd}`);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });

    return {
      date: formattedDate,
      fullDate: d.date,
      nav: parseFloat(d.nav)
    };
  });

  // Calculate min/max for Y-axis
  const navValues = chartData.map(d => d.nav);
  const minNav = Math.min(...navValues);
  const maxNav = Math.max(...navValues);
  const yAxisMin = (minNav * 0.95).toFixed(2);
  const yAxisMax = (maxNav * 1.05).toFixed(2);

  // Filter data to show fewer x-axis labels (every 30 days approx)
  const tickInterval = Math.ceil(chartData.length / 12);

  return (
    <div
      ref={containerRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        marginBottom: '48px',
        padding: '0 16px'
      }}
    >
      <Container>
        <Typography variant="h5">
          NAV History (Last 1 Year)
        </Typography>

        {/* Custom Legend */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          marginBottom: '16px'
        }}>
          <div style={{
            width: '16px',
            height: '16px',
            backgroundColor: '#10B981',
            borderRadius: '4px'
          }} />
          <Typography variant="subtitle1" style={{ margin: 0, color: '#047857' }}>
            NAV
          </Typography>
        </div>

        {/* Chart Container */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '2px solid #D1FAE5'
        }}>
          <ResponsiveContainer width="100%" height={450}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#E5E7EB"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="#6B7280"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={{ stroke: '#D1D5DB' }}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={tickInterval}
                label={{ 
                  value: 'Date', 
                  position: 'insideBottom', 
                  offset: -20,
                  style: { fill: '#047857', fontWeight: '600', fontSize: 14 }
                }}
              />
              <YAxis
                stroke="#6B7280"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={{ stroke: '#D1D5DB' }}
                domain={[yAxisMin, yAxisMax]}
                tickFormatter={(value) => `₹${value}`}
                label={{ 
                  value: 'NAV Value', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: '#047857', fontWeight: '600', fontSize: 14 }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="nav"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ 
                  fill: '#059669', 
                  strokeWidth: 2, 
                  r: 4,
                  stroke: '#10B981'
                }}
                activeDot={{ 
                  r: 6, 
                  fill: '#047857',
                  stroke: '#10B981',
                  strokeWidth: 3
                }}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginTop: '24px'
        }}>
          <div style={{
            backgroundColor: '#F0FDF4',
            padding: '16px',
            borderRadius: '8px',
            border: '2px solid #D1FAE5'
          }}>
            <Typography variant="body1" style={{ 
              fontSize: '12px', 
              color: '#6B7280',
              margin: '0 0 4px 0' 
            }}>
              Current NAV
            </Typography>
            <Typography variant="h5" style={{ 
              color: '#047857',
              margin: 0,
              fontSize: '24px'
            }}>
              ₹{chartData[chartData.length - 1].nav.toFixed(2)}
            </Typography>
          </div>

          <div style={{
            backgroundColor: '#F0FDF4',
            padding: '16px',
            borderRadius: '8px',
            border: '2px solid #D1FAE5'
          }}>
            <Typography variant="body1" style={{ 
              fontSize: '12px', 
              color: '#6B7280',
              margin: '0 0 4px 0' 
            }}>
              Highest NAV
            </Typography>
            <Typography variant="h5" style={{ 
              color: '#059669',
              margin: 0,
              fontSize: '24px'
            }}>
              ₹{maxNav.toFixed(2)}
            </Typography>
          </div>

          <div style={{
            backgroundColor: '#F0FDF4',
            padding: '16px',
            borderRadius: '8px',
            border: '2px solid #D1FAE5'
          }}>
            <Typography variant="body1" style={{ 
              fontSize: '12px', 
              color: '#6B7280',
              margin: '0 0 4px 0' 
            }}>
              Lowest NAV
            </Typography>
            <Typography variant="h5" style={{ 
              color: '#10B981',
              margin: 0,
              fontSize: '24px'
            }}>
              ₹{minNav.toFixed(2)}
            </Typography>
          </div>

          <div style={{
            backgroundColor: '#F0FDF4',
            padding: '16px',
            borderRadius: '8px',
            border: '2px solid #D1FAE5'
          }}>
            <Typography variant="body1" style={{ 
              fontSize: '12px', 
              color: '#6B7280',
              margin: '0 0 4px 0' 
            }}>
              1 Year Change
            </Typography>
            <Typography variant="h5" style={{ 
              color: chartData[chartData.length - 1].nav >= chartData[0].nav ? '#059669' : '#DC2626',
              margin: 0,
              fontSize: '24px'
            }}>
              {((chartData[chartData.length - 1].nav - chartData[0].nav) / chartData[0].nav * 100).toFixed(2)}%
            </Typography>
          </div>
        </div>
      </Container>
    </div>
  );
}
