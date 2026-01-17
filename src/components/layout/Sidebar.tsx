import { LayoutDashboard, FolderDot, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { GlassCard } from "../ui/GlassCard";

interface SidebarProps {
    activeView: string;
    setActiveView: (view: string) => void;
    stats?: any; // We'll add types properly later
    isOpen?: boolean;
    onClose?: () => void;
}

const projects = [
    { id: "System Pros Ai", color: "text-[--color-neon-blue]" },
    { id: "Skool", color: "text-[--color-neon-purple]" },
    { id: "Social Media", color: "text-[--color-neon-pink]" },
    { id: "Personal", color: "text-[--color-neon-orange]" },
];

export function Sidebar({ activeView, setActiveView, stats, isOpen, onClose }: SidebarProps) {
    return (
        <div className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-slate-950/95 backdrop-blur-xl border-r border-white/5 transition-transform duration-300 md:translate-x-0 md:static md:bg-transparent md:border-r-0 md:w-64 p-4 flex flex-col gap-6 select-none",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            {/* Mobile Close Button */}
            <button onClick={onClose} className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-white">
                <X size={20} />
            </button>
            {/* User Profile / Header */}
            <GlassCard className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    AS
                </div>
                <div className="flex flex-col overflow-hidden">
                    <span className="font-bold text-sm text-white truncate">Altus Snyman</span>
                    <span className="text-xs text-gray-400 truncate">altus@gmail.com</span>
                </div>
            </GlassCard>

            {/* Navigation */}
            <GlassCard className="flex-1 p-2 flex flex-col gap-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                    Menu
                </div>

                <NavItem
                    icon={<LayoutDashboard size={18} />}
                    label="Dashboard"
                    active={activeView === "dashboard"}
                    onClick={() => setActiveView("dashboard")}
                />

                <div className="my-2 h-[1px] bg-white/5 mx-3" />

                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                    Projects
                </div>

                {projects.map((proj) => (
                    <NavItem
                        key={proj.id}
                        icon={<FolderDot size={18} className={proj.color} />}
                        label={proj.id}
                        active={activeView === proj.id}
                        onClick={() => setActiveView(proj.id)}
                        count={stats?.byProject?.[proj.id]}
                    />
                ))}
            </GlassCard>

            {/* Mini Stats Footer */}
            <GlassCard className="p-4 bg-slate-900/60">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span>Overall Progress</span>
                    <span>{stats?.completionRate || 0}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[--color-neon-blue] to-[--color-neon-purple]"
                        style={{ width: `${stats?.completionRate || 0}%` }}
                    />
                </div>
            </GlassCard>
        </div>
    );
}

function NavItem({ icon, label, active, onClick, count }: any) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group relative overflow-hidden",
                active
                    ? "bg-white/10 text-white shadow-lg border border-white/5"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
        >
            {active && (
                <div className="absolute left-0 w-0.5 h-6 bg-gradient-to-b from-[--color-neon-blue] to-[--color-neon-purple] rounded-r-full" />
            )}
            <div className="relative z-10 transition-transform duration-200 group-hover:scale-110">
                {icon}
            </div>
            <span className="font-medium relative z-10">{label}</span>
            {count !== undefined && count > 0 && (
                <span className="ml-auto text-xs bg-slate-800 text-gray-300 px-1.5 py-0.5 rounded-md min-w-[20px] text-center border border-white/5">
                    {count}
                </span>
            )}
        </div>
    )
}
