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
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Clear any stale tokens
        const currentSession = await supabase.auth.getSession();
        if (!currentSession.data.session) {
          localStorage.removeItem('supabase.auth.token');
          queryClient.clear();
        }

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          console.log('Auth state changed:', event);
          
          if (event === 'SIGNED_OUT') {
            // Clear storage and cache
            localStorage.removeItem('supabase.auth.token');
            sessionStorage.clear();
            queryClient.clear();
            setSession(null);
          } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            setSession(currentSession);
          }
        });

        // Initial session check
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        setSession(initialSession);

      } catch (error) {
        console.error('Auth initialization error:', error);
        toast.error("Erreur d'authentification. Veuillez vous reconnecter.");
        
        // Clean up on error
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();
        queryClient.clear();
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Cleanup subscription on unmount
    return () => {
      supabase.auth.onAuthStateChange(() => {}).data.subscription.unsubscribe();
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