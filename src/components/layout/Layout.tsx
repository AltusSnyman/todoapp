import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Menu } from "lucide-react";
import { CreateTaskModal } from "../ui/CreateTaskModal";

interface LayoutProps {
    children: React.ReactNode;
    activeView: string;
    setActiveView: (view: string) => void;
}

export function Layout({ children, activeView, setActiveView }: LayoutProps) {
    const stats = useQuery(api.tasks.getStats);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen w-full text-white bg-[--color-background] overflow-hidden">
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <Sidebar
                activeView={activeView}
                setActiveView={(view) => {
                    setActiveView(view);
                    setIsMobileMenuOpen(false);
                }}
                stats={stats}
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />

            <main className="flex-1 h-full p-4 md:pl-0 overflow-hidden relative flex flex-col">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between mb-4">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-gray-400 hover:text-white">
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-[--color-neon-blue] to-[--color-neon-purple]">
                        TodoApp
                    </span>
                    <div className="w-8" /> {/* Spacer */}
                </div>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeView}
                        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                        transition={{ duration: 0.3 }}
                        className="h-full w-full"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>

                {/* Floating Action Button */}
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsModalOpen(true)}
                    className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-tr from-[--color-neon-blue] to-[--color-neon-purple] rounded-full flex items-center justify-center shadow-lg hover:shadow-[0_0_20px_rgba(0,243,255,0.6)] z-40 transition-shadow"
                >
                    <Plus className="text-white" size={24} strokeWidth={3} />
                </motion.button>

                <CreateTaskModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    defaultProject={activeView !== "dashboard" ? activeView : undefined}
                />
            </main>
        </div>
    );
}
