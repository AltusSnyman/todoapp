import { GlassCard } from "../ui/GlassCard";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

export function Dashboard() {
    const stats = useQuery(api.tasks.getStats);

    const projectColors = {
        "System Pros Ai": "var(--color-neon-blue)",
        "Skool": "var(--color-neon-purple)",
        "Social Media": "var(--color-neon-pink)",
        "Personal": "var(--color-neon-orange)",
    };

    const chartData = stats ? Object.entries(stats.byProject).map(([name, count]) => ({
        name,
        count,
    })) : [];

    return (
        <div className="flex flex-col h-full gap-6">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[--color-neon-blue] to-[--color-neon-purple]">
                    Dashboard
                </h1>
                <p className="text-gray-400">Welcome back, Altus. Here is your overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6">
                <StatCard
                    title="Pending Tasks"
                    value={stats?.pending || 0}
                    icon={<Clock className="text-[--color-neon-blue]" />}
                    subtext="Tasks to do"
                />
                <StatCard
                    title="Needs Attention"
                    value={stats?.highPriority || 0}
                    icon={<AlertCircle className="text-[--color-neon-pink]" />}
                    subtext="High Priority"
                />
                <StatCard
                    title="Completed"
                    value={stats?.completed || 0}
                    icon={<CheckCircle2 className="text-[--color-neon-orange]" />}
                    subtext="Total finished"
                />
            </div>

            {/* Main Chart Area */}
            <GlassCard className="flex-1 p-6 flex flex-col min-h-[300px]">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[--color-neon-purple]" />
                    Task Distribution
                </h3>
                <div className="w-full h-full min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis
                                dataKey="name"
                                stroke="#94a3b8"
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#0f172a',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    color: '#fff'
                                }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={projectColors[entry.name as keyof typeof projectColors] || "#fff"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>
        </div>
    );
}

function StatCard({ title, value, icon, subtext }: any) {
    return (
        <GlassCard className="p-6 flex flex-col justify-between" hoverEffect>
            <div className="flex justify-between items-start">
                <span className="text-gray-400 text-sm font-medium">{title}</span>
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    {icon}
                </div>
            </div>
            <div className="mt-4">
                <span className="text-4xl font-bold text-white tracking-tight">{value}</span>
                <p className="text-xs text-gray-500 mt-1">{subtext}</p>
            </div>
        </GlassCard>
    )
}
