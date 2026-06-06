export type TodoCategory = 'work' | 'personal' | 'shopping' | 'learning' | 'wellness' | 'other';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  category: TodoCategory;
  createdAt: string;
}

export type TodoFilter = 'all' | 'pending' | 'completed';
export type TodoSortBy = 'dueDate' | 'createdAt' | 'alphabetical' | 'priority';
