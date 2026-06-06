import { Suspense, lazy } from 'react';
import { useTodos } from './hooks/useTodos';
const Header = lazy(() => import('./components/Header').then(m => ({ default: m.Header })));
const TodoForm = lazy(() => import('./components/TodoForm').then(m => ({ default: m.TodoForm })));
const TodoList = lazy(() => import('./components/TodoList').then(m => ({ default: m.TodoList })));
import { Toaster } from 'sonner';

export default function App() {
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    totalCount,
    completedCount,
    pendingCount,
    completionRate
  } = useTodos();

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><span>Loading...</span></div>}>
      <div className="relative min-h-screen w-full py-10 px-4 sm:px-6 md:px-8 flex flex-col justify-start items-center overflow-x-hidden">
        {/* 1. PREMIUM BACKGROUND SYSTEM */}
        {/* Interactive geometric grid lines overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:20px_20px] sm:bg-[size:30px_30px] -z-20 pointer-events-none" />
        {/* Reduced background blobs for performance */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 blur-2xl -z-30 pointer-events-none" />
        {/* 2. MAIN APPLICATION CONTENT PORT */}
        <main className="w-full max-w-3xl space-y-8 relative z-10 animate-fade-in-up">
          <Header totalCount={totalCount} completedCount={completedCount} pendingCount={pendingCount} completionRate={completionRate} />
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Task Creation</h2>
            <TodoForm onSubmit={addTodo} />
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pl-1">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">My Task Board</h2>
              <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground bg-secondary/60 backdrop-blur-xs px-2 py-0.5 rounded-full border border-border/40">Active: {pendingCount}</span>
            </div>
            <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} onUpdate={updateTodo} />
          </div>
        </main>
        <Toaster position="bottom-right" closeButton richColors theme="system" toastOptions={{ style: { borderRadius: 'var(--radius)', borderColor: 'hsl(var(--border))', background: 'hsl(var(--card) / 0.95)', color: 'hsl(var(--foreground))', backdropFilter: 'blur(8px)' } }} />
      </div>
    </Suspense>
  );
}
