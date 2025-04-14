import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface MiniChartProps {
  type: "green" | "red" | "orange" | "gradient";
  change: number;
}

// Generate random data for mini charts
const generateChartData = (change: number, points = 20) => {
  const data = [];
  let value = 50;
  const trend = change >= 0 ? 1 : -1;
  
  for (let i = 0; i < points; i++) {
    // Add some randomness but maintain the overall trend
    const randomFactor = Math.random() * 10 - 5;
    value += trend * (Math.random() * 3) + randomFactor;
    value = Math.max(0, Math.min(100, value)); // Keep within 0-100 range
    data.push({ value });
  }
  
  return data;
};

export default function MiniChart({ type, change }: MiniChartProps) {
  const data = generateChartData(change);
  
  // Define colors based on the type
  let fillColor, strokeColor;
  
  switch(type) {
    case "green":
      fillColor = "rgba(16, 185, 129, 0.2)";
      strokeColor = "rgb(16, 185, 129)";
      break;
    case "red":
      fillColor = "rgba(239, 68, 68, 0.2)";
      strokeColor = "rgb(239, 68, 68)";
      break;
    case "orange":
      fillColor = "rgba(249, 115, 22, 0.2)";
      strokeColor = "rgb(249, 115, 22)";
      break;
    case "gradient":
      // For the Fear & Greed index, just use a gradient background
      return (
        <div className="w-full h-full bg-gradient-to-r from-red-400 via-yellow-300 to-green-400 rounded">
          <div 
            className="h-full bg-white dark:bg-gray-800 rounded-full w-1 absolute" 
            style={{ left: `${data[data.length - 1].value}%`, transform: "translateX(-50%)" }}
          ></div>
        </div>
      );
    default:
      fillColor = "rgba(59, 130, 246, 0.2)";
      strokeColor = "rgb(59, 130, 246)";
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`colorFill-${type}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={strokeColor} 
          fillOpacity={1} 
          fill={`url(#colorFill-${type})`} 
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
