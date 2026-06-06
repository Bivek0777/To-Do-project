import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Todo, TodoCategory } from '../types';
import { toast } from 'sonner';

const DEFAULT_TODOS: Todo[] = [
  {
    id: 'default-1',
    title: 'Welcome to your premium To-Do App! 🌟',
    description: 'This is a description. You can click the Edit icon on the right to modify it, or click the checkbox to complete it!',
    completed: false,
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
    category: 'learning',
    createdAt: new Date().toISOString()
  },
  {
    id: 'default-2',
    title: 'Explore different filters and search 🔍',
    description: 'Use the tabs below the header to filter by Complete or Pending, or use the search bar to find tasks instantly.',
    completed: false,
    category: 'work',
    createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  },
  {
    id: 'default-3',
    title: 'Toggle between Dark and Light mode 🌗',
    description: 'Click the sun/moon button in the top-right corner to experience a premium, fluidly transitioning UI theme.',
    completed: true,
    category: 'wellness',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];


  export function useTodos() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos-app-premium', DEFAULT_TODOS);

  const addTodo = useCallback((title: string, category: TodoCategory = 'other', description?: string, dueDate?: string) => {
    if (!title.trim()) {
      toast.error('Task title cannot be empty!');
      return;
    }
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description?.trim() || undefined,
      completed: false,
      category,
      dueDate: dueDate || undefined,
      createdAt: new Date().toISOString()
    };
    setTodos(prev => [newTodo, ...prev]);
    toast.success('Task created successfully! 🎉', { description: `"${title}" has been added to your list.` });
  }, [setTodos]);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(todo => {
        if (todo.id === id) {
          const nextCompleted = !todo.completed;
          if (nextCompleted) {
            toast.success('Task completed! Double tap on the checkbox to undo.', { description: `Completed: "${todo.title}"` });
          } else {
            toast.info('Task marked as pending.', { description: `Pending: "${todo.title}"` });
          }
          return { ...todo, completed: nextCompleted };
        }
        return todo;
      })
    );
  }, [setTodos]);

  const deleteTodo = useCallback((id: string) => {
    const todoToDelete = todos.find(t => t.id === id);
    setTodos(prev => prev.filter(todo => todo.id !== id));
    if (todoToDelete) {
      toast.success('Task deleted', {
        description: `"${todoToDelete.title}" has been removed.`,
        action: { label: 'Undo', onClick: () => {
          setTodos(prev => [todoToDelete, ...prev]);
          toast.success('Task restored!', { description: `"${todoToDelete.title}" is back.` });
        } }
      });
    }
  }, [todos, setTodos]);

  const updateTodo = useCallback((id: string, updatedFields: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    setTodos(prev =>
      prev.map(todo => {
        if (todo.id === id) {
          const updated = { ...todo, ...updatedFields };
          if (updated.title && !updated.title.trim()) {
            toast.error('Task title cannot be empty!');
            return todo;
          }
          toast.success('Task updated successfully!');
          return updated;
        }
        return todo;
      })
    );
  }, [setTodos]);

  // Derived statistics memoized
  const {
    totalCount,
    completedCount,
    pendingCount,
    completionRate
  } = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { totalCount: total, completedCount: completed, pendingCount: pending, completionRate: rate };
  }, [todos]);

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    totalCount,
    completedCount,
    pendingCount,
    completionRate
  };
}
