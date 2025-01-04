import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { AuthLoader } from "./components/auth/AuthLoader";
import { ThemeProvider } from "next-themes";
import "./App.css";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import { supabase } from "./integrations/supabase/client";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier la session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <AuthLoader />;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<AuthLoader />}>
            <Routes>
              <Route
                path="/auth"
                element={
                  session ? <Navigate to="/dashboard" replace /> : <Auth />
                }
              />
              <Route
                path="/dashboard"
                element={
                  session ? (
                    <Index />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              <Route
                path="/"
                element={
                  <Navigate to={session ? "/dashboard" : "/auth"} replace />
                }
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;