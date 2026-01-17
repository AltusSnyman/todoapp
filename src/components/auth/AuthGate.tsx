import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Login } from "./Login";

interface AuthGateProps {
    children: ReactNode;
}

const AUTH_KEY = "todoapp_auth_token";
const AUTH_VAL = "authenticated";

export function AuthGate({ children }: AuthGateProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check local storage on mount
        const storedAuth = localStorage.getItem(AUTH_KEY);
        if (storedAuth === AUTH_VAL) {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const handleLogin = () => {
        localStorage.setItem(AUTH_KEY, AUTH_VAL);
        setIsAuthenticated(true);
    };

    if (isLoading) {
        return null; // Or a loading spinner
    }

    if (!isAuthenticated) {
        return <Login onLogin={handleLogin} />;
    }

    return <>{children}</>;
}
