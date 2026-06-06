import { useState, useEffect, useRef } from 'react';
import { Plus, Calendar, Tag, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { Todo, TodoCategory } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

interface TodoFormProps {
  onSubmit: (title: string, category: TodoCategory, description?: string, dueDate?: string) => void;
  initialTodo?: Todo;
  submitLabel?: string;
  isEditMode?: boolean;
}

const CATEGORIES: { value: TodoCategory; label: string; color: string }[] = [
  { value: 'work', label: 'Work', color: 'bg-blue-500' },
  { value: 'personal', label: 'Personal', color: 'bg-green-500' },
  { value: 'shopping', label: 'Shopping', color: 'bg-amber-500' },
  { value: 'learning', label: 'Learning', color: 'bg-purple-500' },
  { value: 'wellness', label: 'Wellness', color: 'bg-emerald-500' },
  { value: 'other', label: 'Other', color: 'bg-slate-400' },
];

export function TodoForm({ onSubmit, initialTodo, submitLabel = "Add Task", isEditMode = false }: TodoFormProps) {
  const [title, setTitle] = useState(initialTodo?.title || '');
  const [description, setDescription] = useState(initialTodo?.description || '');
  const [category, setCategory] = useState<TodoCategory>(initialTodo?.category || 'other');
  const [dueDate, setDueDate] = useState(initialTodo?.dueDate || '');
  const [isExpanded, setIsExpanded] = useState(isEditMode);
  
  const formRef = useRef<HTMLFormElement>(null);

  // Sync state if initialTodo changes (important for edit mode in Dialog)
  useEffect(() => {
    if (initialTodo) {
      setTitle(initialTodo.title);
      setDescription(initialTodo.description || '');
      setCategory(initialTodo.category);
      setDueDate(initialTodo.dueDate || '');
    }
  }, [initialTodo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit(title, category, description, dueDate);
    
    // Reset if adding new todo
    if (!isEditMode) {
      setTitle('');
      setDescription('');
      setCategory('other');
      setDueDate('');
      setIsExpanded(false);
    }
  };

  // Close details panel when clicking outside the form (only for creation mode)
  useEffect(() => {
    if (isEditMode) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node) && !title.trim()) {
        setIsExpanded(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditMode, title]);

  return (
    <form 
      ref={formRef}
      onSubmit={handleSubmit} 
      className={cn(
        "space-y-3 transition-all duration-300", 
        !isEditMode && "p-4 sm:p-5 rounded-2xl border border-border bg-card/25 dark:bg-card/20 backdrop-blur-md shadow-lg"
      )}
    >
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder={isEditMode ? "Task title..." : "Add a new task..."}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => !isEditMode && setIsExpanded(true)}
          required
          className="flex-1 font-medium bg-background/40 dark:bg-background/20"
        />
        
        {/* Quick Add Button shown only when collapsed */}
        {!isExpanded && !isEditMode && (
          <Button 
            type="submit" 
            size="icon" 
            disabled={!title.trim()}
            className="rounded-xl h-10 w-10 bg-primary shrink-0 text-white"
          >
            <Plus className="h-5 w-5 stroke-[2.5px]" />
          </Button>
        )}
      </div>

      {/* Expandable fields: Description, Category, Due Date */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0 }}
            className="overflow-hidden space-y-4 pt-1"
          >
            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Description (Optional)
              </label>
              <textarea
                placeholder="What details should we note for this task?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="flex w-full rounded-md border border-input bg-background/30 dark:bg-background/20 backdrop-blur-sm px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary/50 transition-all duration-200 resize-none"
              />
            </div>

            {/* Category selector & Due date grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" /> Category
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => {
                    const isSelected = category === cat.value;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        className={cn(
                          "relative flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95",
                          isSelected
                            ? "bg-primary/10 text-primary border-primary"
                            : "bg-background/30 border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                        )}
                      >
                        <span className={cn("h-2 w-2 rounded-full", cat.color)} />
                        {cat.label}
                        {isSelected && <Check className="h-3 w-3 stroke-[3px] ml-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Due Date (Optional)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background/30 dark:bg-background/20 backdrop-blur-sm px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all dark:[color-scheme:dark]"
                  />
                </div>
              </div>

            </div>

            {/* Expandable Footer Action Button */}
            <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
              {!isEditMode && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setIsExpanded(false);
                    setTitle('');
                    setDescription('');
                    setCategory('other');
                    setDueDate('');
                  }}
                  className="rounded-xl text-xs hover:bg-secondary/80 text-muted-foreground"
                >
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                size="sm"
                disabled={!title.trim()}
                className="rounded-xl text-xs bg-primary text-white hover:bg-primary/95 shadow-sm px-4"
              >
                {submitLabel}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
