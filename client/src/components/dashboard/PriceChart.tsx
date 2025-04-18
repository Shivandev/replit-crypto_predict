import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { type Cryptocurrency } from "@shared/schema";

interface PriceChartProps {
  cryptocurrency?: Cryptocurrency;
  timeframe: string;
}

// Generate mock historical data for the chart
function generateMockPriceData(base: number, timeframe: string, volatility: number = 0.02) {
  let dataPoints: number;
  let initialDate: Date = new Date();
  
  switch (timeframe) {
    case "1d":
      dataPoints = 24; // Hourly for 1 day
      break;
    case "1w":
      dataPoints = 7; // Daily for 1 week
      initialDate = new Date(initialDate.getTime() - 6 * 24 * 60 * 60 * 1000);
      break;
    case "1m":
      dataPoints = 30; // Daily for 1 month
      initialDate = new Date(initialDate.getTime() - 29 * 24 * 60 * 60 * 1000);
      break;
    case "all":
      dataPoints = 30; // Monthly for all time (simplified)
      initialDate = new Date(initialDate.getTime() - 29 * 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      dataPoints = 24;
  }
  
  const data = [];
  let currentPrice = base;
  
  for (let i = 0; i < dataPoints; i++) {
    const change = currentPrice * (Math.random() * volatility * 2 - volatility);
    currentPrice += change;
    
    const date = new Date(initialDate);
    if (timeframe === "1d") {
      date.setHours(date.getHours() + i);
    } else if (timeframe === "1w" || timeframe === "1m") {
      date.setDate(date.getDate() + i);
    } else {
      date.setMonth(date.getMonth() + i);
    }
    
    data.push({
      time: timeframe === "1d" 
        ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      price: currentPrice
    });
  }
  
  return data;
}

export default function PriceChart({ cryptocurrency, timeframe }: PriceChartProps) {
  const [data, setData] = useState<any[]>([]);
  
  useEffect(() => {
    if (cryptocurrency) {
      const historicalData = generateMockPriceData(cryptocurrency.currentPrice, timeframe);
      setData(historicalData);
    }
  }, [cryptocurrency, timeframe]);
  
  if (!cryptocurrency) {
    return (
      <div className="h-80 w-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
        Select a cryptocurrency to view chart
      </div>
    );
  }
  
  const minPrice = Math.min(...data.map(item => item.price)) * 0.998;
  const maxPrice = Math.max(...data.map(item => item.price)) * 1.002;
  
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 50, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12 }} 
            tickMargin={10}
            stroke="#888"
          />
          <YAxis 
            domain={[minPrice, maxPrice]}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
            tick={{ fontSize: 12 }}
            width={50}
            stroke="#888"
          />
          <Tooltip 
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
