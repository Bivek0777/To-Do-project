import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ListFilter, ClipboardList, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TodoItem } from './TodoItem';
import { Input } from './ui/input';
import type { Todo, TodoCategory, TodoFilter, TodoSortBy } from '../types';
import { cn } from '@/utils/cn';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, fields: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
}

const FILTERS: { value: TodoFilter; label: string }[] = [
  { value: 'all', label: 'All Tasks' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

const SORT_OPTIONS: { value: TodoSortBy; label: string }[] = [
  { value: 'createdAt', label: 'Date Created (Newest)' },
  { value: 'dueDate', label: 'Due Date (Earliest)' },
  { value: 'alphabetical', label: 'Alphabetical (A-Z)' },
];

const CATEGORY_FILTERS: { value: TodoCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'learning', label: 'Learning' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'other', label: 'Other' },
];

export function TodoList({ todos, onToggle, onDelete, onUpdate }: TodoListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<TodoFilter>('all');
  const [activeCategory, setActiveCategory] = useState<TodoCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<TodoSortBy>('createdAt');

  // Filter and Search Logic
  const filteredAndSortedTodos = useMemo(() => {
    let result = [...todos];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        todo => 
          todo.title.toLowerCase().includes(query) || 
          todo.description?.toLowerCase().includes(query)
      );
    }

    // 2. Tab Filter (All, Pending, Completed)
    if (activeFilter === 'pending') {
      result = result.filter(todo => !todo.completed);
    } else if (activeFilter === 'completed') {
      result = result.filter(todo => todo.completed);
    }

    // 3. Category Filter
    if (activeCategory !== 'all') {
      result = result.filter(todo => todo.category === activeCategory);
    }

    // 4. Sorting Logic
    result.sort((a, b) => {
      if (sortBy === 'createdAt') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      
      if (sortBy === 'dueDate') {
        // Handle undefined due dates by putting them at the end
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }

      return 0;
    });

    return result;
  }, [todos, searchQuery, activeFilter, activeCategory, sortBy]);

  return (
    <div className="space-y-6 w-full">
      {/* Search, Filter, Sort Controls Panel */}
      <div className="space-y-4 bg-card/15 dark:bg-card/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-border/50">
        
        {/* Search Bar & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-muted-foreground stroke-[2px]" />
            <Input
              type="text"
              placeholder="Search tasks by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 bg-background/30 dark:bg-background/15 focus-visible:ring-primary border-border/60"
            />
          </div>

          {/* Sort Selector */}
          <div className="relative min-w-[200px] shrink-0">
            <SlidersHorizontal className="absolute left-3 top-3.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as TodoSortBy)}
              className="w-full h-10 rounded-md border border-border/60 bg-background/30 dark:bg-background/15 pl-9 pr-8 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all cursor-pointer font-medium text-foreground dark:[color-scheme:dark]"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-background text-foreground">
                  Sort: {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Filters and Category Selector */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-t border-border/40 pt-4">
          {/* Custom sliding Active-Tab Buttons */}
          <div className="flex bg-secondary/50 backdrop-blur-xs p-1 rounded-xl border border-border/40 w-full sm:w-auto">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={cn(
                    "relative flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all select-none focus:outline-none",
                    isActive ? "text-primary dark:text-white" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {/* Sliding Tab Highlight background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-background shadow-xs border border-border/60 rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* Category Filter Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto self-stretch sm:self-auto justify-end">
            <ListFilter className="h-4 w-4 text-muted-foreground shrink-0" />
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value as TodoCategory | 'all')}
              className="h-9 rounded-lg border border-border/60 bg-background/30 dark:bg-background/15 px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all cursor-pointer text-foreground dark:[color-scheme:dark]"
            >
              {CATEGORY_FILTERS.map(cat => (
                <option key={cat.value} value={cat.value} className="bg-background text-foreground">
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Task List Rendering */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedTodos.length > 0 ? (
            filteredAndSortedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            ))
          ) : (
            // Beautiful Empty States
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="py-12 px-4 rounded-2xl border border-dashed border-border/80 bg-card/10 backdrop-blur-xs flex flex-col items-center justify-center text-center space-y-4 shadow-sm"
            >
              {searchQuery.trim() ? (
                // Search result empty state
                <>
                  <div className="h-12 w-12 rounded-xl bg-secondary/80 flex items-center justify-center text-muted-foreground border border-border">
                    <Search className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h4 className="text-base font-bold text-foreground">No tasks found</h4>
                    <p className="text-xs text-muted-foreground">
                      We couldn't find anything matching "{searchQuery}". Try editing your keyword or filter.
                    </p>
                  </div>
                </>
              ) : activeFilter === 'completed' ? (
                // Completed empty state
                <>
                  <div className="h-12 w-12 rounded-xl bg-secondary/80 flex items-center justify-center text-muted-foreground border border-border">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h4 className="text-base font-bold text-foreground">No completed tasks yet</h4>
                    <p className="text-xs text-muted-foreground">
                      Click the checkbox on your active tasks to complete them. You can do it! 🌟
                    </p>
                  </div>
                </>
              ) : (
                // Completely empty or completed all tasks state
                <>
                  <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle className="h-6 w-6 stroke-[2.2px]" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h4 className="text-base font-bold text-foreground">All caught up! 🎉</h4>
                    <p className="text-xs text-muted-foreground">
                      {activeCategory !== 'all' 
                        ? `No pending tasks under the "${activeCategory}" category.` 
                        : "Your list is empty. Take a break, enjoy a coffee, or add some fresh tasks!"}
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
