import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/utils/cn"

export interface CheckboxProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  id?: string
  className?: string
  disabled?: boolean
}

export function Checkbox({ checked, onCheckedChange, id, className, disabled }: CheckboxProps) {
  return (
    <button
      type="button"
      id={id}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "peer h-5.5 w-5.5 shrink-0 rounded-md border border-input bg-background/20 backdrop-blur-sm shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center overflow-hidden hover:border-primary/50 hover:bg-primary/5 active:scale-95",
        checked && "bg-primary border-primary text-primary-foreground hover:bg-primary/90",
        className
      )}
    >
      {checked && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 600, damping: 25 }}
          className="flex items-center justify-center"
        >
          <Check className="h-3.5 w-3.5 stroke-[3.5px] text-white" />
        </motion.span>
      )}
    </button>
  )
}
