import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export function Dialog({ isOpen, onClose, children, title }: DialogProps) {
  // Listen for Escape key to close the modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent scroll when dialog is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Glass Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.12 }}
            className="relative z-10 w-full max-w-lg rounded-xl border border-border bg-card/95 dark:bg-card/90 backdrop-blur-md p-6 shadow-2xl focus:outline-none overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/50">
              {title && <h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>}
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200 focus:outline-none"
              >
                <X className="h-4 w-4 stroke-[2.5px]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-foreground">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
