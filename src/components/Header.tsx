import { CheckCircle2, ListTodo, Award, Activity } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  totalCount: number;
  completedCount: number;
  pendingCount: number;
  completionRate: number;
}

export function Header({ totalCount, completedCount, pendingCount, completionRate }: HeaderProps) {
  // Determine motivational message based on completion rate
  const getMotivationMessage = () => {
    if (totalCount === 0) return "Add your first task above to start your journey! ✨";
    if (completionRate === 0) return "Let's make some progress today! You've got this! 💪";
    if (completionRate < 40) return "Off to a solid start, keep the momentum! 🚀";
    if (completionRate < 75) return "Over halfway there! Look at you go! ⭐";
    if (completionRate < 100) return "So close! Just a few more to crush it! 🔥";
    return "Incredible! All tasks completed today! Take a bow! 👑🏆";
  };

  return (
    <header className="space-y-6 w-full">
      {/* Top Bar Branding */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center shadow-lg shadow-primary/20 ring-1 ring-white/10">
            <ListTodo className="h-5 w-5 sm:h-6 sm:w-6 text-white stroke-[2.5px]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-primary to-purple-500 dark:from-primary dark:to-purple-300 bg-clip-text text-transparent">
              PriorityTask
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Organize your life elegantly
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Stats Summary Dashboard Card */}
      <Card className="border-border/60 bg-gradient-to-br from-card/30 to-card/50 overflow-hidden relative shadow-md">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Motivation and Stats */}
            <div className="md:col-span-8 space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-primary" /> Daily Overview
                </h3>
                <p className="text-base sm:text-lg font-bold text-foreground transition-all duration-300">
                  {getMotivationMessage()}
                </p>
              </div>

              {/* Counts row */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="bg-secondary/40 backdrop-blur-xs p-2.5 sm:p-3.5 rounded-xl border border-border/40 text-center">
                  <div className="text-xs text-muted-foreground font-medium mb-1">Total</div>
                  <div className="text-lg sm:text-2xl font-black text-foreground">{totalCount}</div>
                </div>
                <div className="bg-emerald-500/5 backdrop-blur-xs p-2.5 sm:p-3.5 rounded-xl border border-emerald-500/10 text-center">
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1">Completed</div>
                  <div className="text-lg sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">{completedCount}</div>
                </div>
                <div className="bg-primary/5 backdrop-blur-xs p-2.5 sm:p-3.5 rounded-xl border border-primary/10 text-center">
                  <div className="text-xs text-primary dark:text-purple-400 font-medium mb-1">Pending</div>
                  <div className="text-lg sm:text-2xl font-black text-primary dark:text-purple-400">{pendingCount}</div>
                </div>
              </div>
            </div>

            {/* Circular Progress Ring */}
            <div className="md:col-span-4 flex items-center justify-center border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-6">
              <div className="relative flex items-center justify-center">
                {/* SVG Progress Ring */}
                <svg className="w-24 h-24 sm:w-28 sm:h-28 transform -rotate-90">
                  {/* Background Track */}
                  <circle
                    cx="56"
                    cy="56"
                    r="44"
                    className="stroke-secondary"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Foreground Animated Bar */}
                  <circle
                    cx="56"
                    cy="56"
                    r="44"
                    className="stroke-primary transition-all duration-500 ease-out"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={276.4} // 2 * PI * R (44)
                    strokeDashoffset={276.4 - (276.4 * completionRate) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                {/* Text inside */}
                <div className="absolute text-center">
                  <span className="text-lg sm:text-xl font-extrabold text-foreground">{completionRate}%</span>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Done</p>
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </header>
  );
}
