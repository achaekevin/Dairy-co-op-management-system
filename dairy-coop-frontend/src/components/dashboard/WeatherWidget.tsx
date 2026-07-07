import { motion } from 'framer-motion';
import {
  HiSun,
  HiCloud,
} from 'react-icons/hi2';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';

interface WeatherWidgetProps {
  temperature?: number;
  condition?: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  humidity?: number;
  location?: string;
}

const WeatherWidget = ({
  temperature = 28,
  condition = 'sunny',
  humidity = 65,
  location = 'Mumbai, Maharashtra',
}: WeatherWidgetProps) => {
  const weatherIcons = {
    sunny: <HiSun className="w-12 h-12 text-amber-500" />,
    cloudy: <HiCloud className="w-12 h-12 text-slate-400" />,
    rainy: <HiCloud className="w-12 h-12 text-blue-500" />,
    snowy: <HiCloud className="w-12 h-12 text-blue-300" />,
  };

  const weatherColors = {
    sunny: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
    cloudy: 'from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800',
    rainy: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
    snowy: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
  };

  return (
    <Card className={`bg-gradient-to-br ${weatherColors[condition]}`}>
      <CardHeader>
        <CardTitle>Weather</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {weatherIcons[condition]}
            </motion.div>
            <p className="text-4xl font-bold text-slate-900 dark:text-white mt-2">
              {temperature}°C
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 capitalize">
              {condition}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {location}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Humidity
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {humidity}%
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Wind</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                12 km/h
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Rain</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                0%
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">UV</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                High
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
