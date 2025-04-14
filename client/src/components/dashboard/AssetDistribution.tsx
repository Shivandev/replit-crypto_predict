import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";

interface DistributionItem {
  name: string;
  value: number;
  color: string;
}

interface AssetDistributionProps {
  distributionData: DistributionItem[];
}

export default function AssetDistribution({ distributionData }: AssetDistributionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="font-semibold mb-4">Asset Distribution</h3>
      
      {/* Distribution Chart */}
      <div className="h-32 w-full mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={distributionData}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={50}
              paddingAngle={2}
              dataKey="value"
            >
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Distribution Legend */}
      <div className="space-y-2">
        {distributionData.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm">{item.name}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-mono">{item.value}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
