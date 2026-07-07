import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCheckCircle, HiPlus } from 'react-icons/hi2';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

const TasksWidget = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Review pending loan applications',
      completed: false,
      priority: 'high',
    },
    {
      id: '2',
      title: 'Check morning milk collection',
      completed: true,
      priority: 'high',
    },
    {
      id: '3',
      title: 'Update farmer records',
      completed: false,
      priority: 'medium',
    },
    {
      id: '4',
      title: 'Prepare monthly report',
      completed: false,
      priority: 'low',
    },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  const priorityColors = {
    high: 'border-l-red-500',
    medium: 'border-l-amber-500',
    low: 'border-l-blue-500',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Today's Tasks</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {completedCount}/{tasks.length}
            </span>
            <Button variant="ghost" size="sm">
              <HiPlus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${
                  priorityColors[task.priority]
                } ${
                  task.completed
                    ? 'bg-slate-50 dark:bg-slate-800'
                    : 'bg-white dark:bg-slate-900'
                } transition-colors`}
              >
                <Checkbox
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm ${
                      task.completed
                        ? 'line-through text-slate-500 dark:text-slate-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {task.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {completedCount === tasks.length && tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center gap-2 text-green-700 dark:text-green-400"
          >
            <HiCheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">All tasks completed!</span>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default TasksWidget;
