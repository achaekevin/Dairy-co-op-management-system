import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts';
import { cn } from '../../utils/cn';

export interface LineChartProps {
  data: Record<string, string | number>[];
  lines: {
    dataKey: string;
    name: string;
    color: string;
    strokeWidth?: number;
  }[];
  xAxisKey: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  curved?: boolean;
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string> & { payload?: Array<{ name?: string; value?: number | string; color?: string }>; label?: string }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
      <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
        {label}
      </p>
      {payload.map((entry: { name?: string; value?: number | string; color?: string }, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-600 dark:text-slate-300">
            {entry.name}:
          </span>
          <span className="font-medium text-slate-900 dark:text-white">
            {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const LineChart = ({
  data,
  lines,
  xAxisKey,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  curved = true,
  className,
}: LineChartProps) => {
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data}>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-slate-200 dark:stroke-slate-700"
            />
          )}
          <XAxis
            dataKey={xAxisKey}
            className="text-xs text-slate-600 dark:text-slate-400"
            tick={{ fill: 'currentColor' }}
          />
          <YAxis
            className="text-xs text-slate-600 dark:text-slate-400"
            tick={{ fill: 'currentColor' }}
          />
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && (
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
              }}
              iconType="circle"
            />
          )}
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type={curved ? 'monotone' : 'linear'}
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={line.strokeWidth || 2}
              dot={{ fill: line.color, r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
