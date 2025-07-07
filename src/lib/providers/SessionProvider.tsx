"use client";
import { useState, useEffect, useContext, createContext } from "react";
import { authClient, type Session } from "@/lib/auth-client";

interface SessionContextType {
  session: Session | null;
  setSession: (session: Session | null) => void;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function getSession() {
      setIsLoading(true);
      const { data } = await authClient.getSession();
      setSession(data);
      setIsLoading(false);
    }
    getSession();
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
