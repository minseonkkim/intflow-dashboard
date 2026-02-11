import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface ChartEntry {
  index: number;
  timestamp: string;
  activity: number;
  feeding: number;
}

interface Props {
  chartData: ChartEntry[];
}

export default function ActivityChart({ chartData }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow h-100">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="activity"
            stroke="#8B5CF6"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={false}
          />
          <Line
            type="monotone"
            dataKey="feeding"
            stroke="#F97316"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
