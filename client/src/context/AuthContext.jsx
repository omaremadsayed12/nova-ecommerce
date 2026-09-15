import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/auth.service";
import { ToastContext } from "./ToastContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [loginOpen, setLoginOpen] = useState(false);
    const {showError} = useContext(ToastContext);

    const isAuthenticated = Boolean(user);

    useEffect(() => {
        const restoreSession = async () => {
            const accessToken = localStorage.getItem("access_token");

            if (!accessToken) {
                setAuthLoading(false);
                return;
            }

            try {
                const response = await getCurrentUser();

                setUser(response.data);
            } catch (error) {
                console.error(error);
                showError(error.message);
                setUser(null);
            } finally {
                setAuthLoading(false);
            }
        };

        restoreSession();
    }, [showError]);



    const requireAuth = (action) => {
        if (!isAuthenticated) {
            setLoginOpen(true);
            return false;
        }

        if (action) {
            action();
        }

        return true;
    };

    const openLogin = () => setLoginOpen(true);
    const closeLogin = () => setLoginOpen(false);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isAuthenticated,
                authLoading,
                loginOpen,
                openLogin,
                closeLogin,
                requireAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}