import React, { useState } from 'react';
import { Edit2, Trash2, Calendar, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog } from './ui/dialog';
import { TodoForm } from './TodoForm';
import type { Todo, TodoCategory } from '../types';
import { cn } from '@/utils/cn';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, fields: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
}

export const TodoItem = React.memo(function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  
  const getDueDateInfo = (dateStr?: string) => {
    if (!dateStr) return null;
    
    // Normalize times to midnight for date-only comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    if (todo.completed) {
      return { 
        label: new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), 
        variant: 'secondary' as const,
        icon: Calendar
      };
    }
    
    if (diffDays === 0) {
      return { 
        label: 'Today', 
        variant: 'shopping' as const, 
        icon: Clock
      };
    }
    
    if (diffDays === 1) {
      return { 
        label: 'Tomorrow', 
        variant: 'outline' as const,
        icon: Calendar
      };
    }
    
    if (diffDays < 0) {
      const overdueLabel = diffDays === -1 ? 'Yesterday' : `${Math.abs(diffDays)}d overdue`;
      return { 
        label: overdueLabel, 
        variant: 'destructive' as const, 
        icon: AlertCircle
      };
    }
    
    return { 
      label: new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), 
      variant: 'outline' as const,
      icon: Calendar
    };
  };

  const dateInfo = getDueDateInfo(todo.dueDate);

  const handleEditSubmit = (title: string, category: TodoCategory, description?: string, dueDate?: string) => {
    onUpdate(todo.id, {
      title,
      description: description || undefined,
      category,
      dueDate: dueDate || undefined
    });
    setIsEditDialogOpen(false);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96, y: -8 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-full"
      >
        <Card className={cn(
          "border-border/60 transition-all duration-300 relative group overflow-hidden bg-card/25 dark:bg-card/20",
          todo.completed && "border-border/30 opacity-75 shadow-none hover:shadow-none"
        )}>
          {/* Subtle accent border on active tasks based on category */}
          {!todo.completed && (
            <div className={cn(
              "absolute left-0 top-0 bottom-0 w-[4px] transition-all",
              {
                "bg-blue-500": todo.category === 'work',
                "bg-green-500": todo.category === 'personal',
                "bg-amber-500": todo.category === 'shopping',
                "bg-purple-500": todo.category === 'learning',
                "bg-emerald-500": todo.category === 'wellness',
                "bg-slate-400": todo.category === 'other',
              }
            )} />
          )}

          <CardContent className="p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
            
            {/* Completion Checkbox */}
            <div className="pt-0.5">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
                id={`todo-${todo.id}`}
                className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
              />
            </div>

            {/* Todo Info Center */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
                <span className={cn(
                  "font-bold text-sm sm:text-base text-foreground break-words leading-tight transition-all duration-300",
                  todo.completed && "line-through text-muted-foreground/80 font-semibold"
                )}>
                  {todo.title}
                </span>
                
                {/* Badges container */}
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  {/* Category Badge */}
                  <Badge variant={todo.completed ? 'secondary' : todo.category}>
                    {todo.category}
                  </Badge>

                  {/* Due Date Badge */}
                  {dateInfo && (
                    <Badge variant={dateInfo.variant} className="gap-1 flex items-center">
                      <dateInfo.icon className="h-3 w-3 stroke-[2.2px]" />
                      {dateInfo.label}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              {todo.description && (
                <p className={cn(
                  "text-xs sm:text-sm text-muted-foreground leading-relaxed break-words",
                  todo.completed && "text-muted-foreground/50"
                )}>
                  {todo.description}
                </p>
              )}
            </div>

            {/* Action Buttons (Edit, Delete) */}
            <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 shrink-0">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsEditDialogOpen(true)}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                title="Edit task"
              >
                <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.2px]" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onDelete(todo.id)}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg hover:bg-destructive/15 text-muted-foreground hover:text-destructive active:scale-95"
                title="Delete task"
              >
                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.2px]" />
              </Button>
            </div>

          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Todo Popup Dialog */}
      <Dialog 
        isOpen={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)}
        title="Edit Task Details"
      >
        <TodoForm
          onSubmit={handleEditSubmit}
          initialTodo={todo}
          submitLabel="Save Changes"
          isEditMode={true}
        />
      </Dialog>
    </>
  );
});
