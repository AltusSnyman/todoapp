import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "../../lib/utils"

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode
    className?: string
    hoverEffect?: boolean
}

export function GlassCard({ children, className, hoverEffect = false, ...props }: GlassCardProps) {
    return (
        <motion.div
            className={cn(
                "relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-xl",
                hoverEffect && "hover:bg-slate-800/50 hover:border-white/10 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 cursor-pointer",
                className
            )}
            {...props}
        >
            {children}
            {/* Subtle glossy overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
    )
}
