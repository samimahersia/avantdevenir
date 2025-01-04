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
import { toast } from "sonner";

const queryClient = new QueryClient();

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session check error:', error);
          toast.error("Erreur lors de la vérification de la session");
          return;
        }
        setSession(currentSession);
      } catch (error) {
        console.error('Unexpected error during session check:', error);
        toast.error("Une erreur inattendue est survenue");
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event);
      
      if (_event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
      
      if (_event === 'SIGNED_OUT') {
        // Clear any stored tokens
        localStorage.removeItem('supabase.auth.token');
        queryClient.clear();
      }

      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
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