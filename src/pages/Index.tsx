import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Login } from "@/pages/Login";
import { ReportIssue } from "@/pages/ReportIssue";
import { CitizenDashboard } from "@/pages/CitizenDashboard";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { mockReports } from "@/services/mockData";
import { Report } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name: string;
  role: "citizen" | "staff";
}

const API_URL = import.meta.env.VITE_API_URL || "https://samvad-backend-1fpd.onrender.com";

const Index = () => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("samvad_user");
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (!parsed || !parsed.id) return null;
      return { ...parsed, createdAt: new Date(parsed.createdAt || Date.now()) };
    } catch (e) {
      console.warn("Failed to parse saved user:", e);
      return null;
    }
  });

  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<boolean>(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        console.log("Fetching from:", `${API_URL}/api/reports`);
        const response = await fetch(`${API_URL}/api/reports`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const formattedData = data.map((r: any) => ({
            ...r,
            createdAt: new Date(r.createdAt || Date.now()),
            updatedAt: new Date(r.updatedAt || Date.now())
          }));
          setReports(formattedData);
          setFetchError(false);
        } else {
          throw new Error("Invalid data format received from server");
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        setFetchError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const [currentPage, setCurrentPage] = useState<string>(() => {
    if (user) {
      return user.role === "citizen" ? "dashboard" : "admin";
    }
    return "home";
  });
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      localStorage.setItem("samvad_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("samvad_user");
    }
  }, [user]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    if (userData.role === "citizen") {
      setCurrentPage("dashboard");
    } else {
      setCurrentPage("admin");
    }
    toast({
      title: "Welcome back!",
      description: `Signed in as ${userData.name}`,
    });
  };

  const handleNavigate = (page: string) => {
    if ((page === "report" || page === "dashboard") && !user) {
      setCurrentPage("login");
    } else if (page === "admin" && user?.role !== "staff") {
      setCurrentPage("login");
    } else {
      setCurrentPage(page);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage("login");
  };

  const handleReportSubmitted = async (newReport: Report) => {
    try {
      console.log("Submitting report:", newReport);
      const response = await fetch(`${API_URL}/api/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReport),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error("Server Error:", result);
        throw new Error(result.details || result.error || "Failed to save report to database");
      }
      
      setReports(prev => [{ 
        ...result, 
        createdAt: new Date(result.createdAt), 
        updatedAt: new Date(result.updatedAt) 
      }, ...prev]);
      
      setCurrentPage("dashboard");
      toast({
        title: "Report Submitted Successfully!",
        description: `Your report has been saved to the Samvad Civic Grid.`,
      });
    } catch (error: any) {
      console.error("Submission failed:", error);
      toast({
        title: "Submission Error",
        description: error.message || "Your report could not be saved. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateReport = async (reportId: string, updates: Partial<Report>) => {
    try {
      await fetch(`${API_URL}/api/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      setReports(prev => prev.map(report =>
        report.id === reportId
          ? { ...report, ...updates, updatedAt: new Date() }
          : report
      ));
      toast({
        title: "Report Updated",
        description: `Report #${reportId} has been updated successfully.`,
      });
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <Login key="login" onLogin={handleLogin} />;

      case "report":
        return user ? (
          <ReportIssue
            key="report"
            userId={user.id}
            onReportSubmitted={handleReportSubmitted}
          />
        ) : null;

      case "dashboard":
        return user && user.role === "citizen" ? (
          <CitizenDashboard
            key="dashboard"
            reports={reports}
            userId={user.id}
            onNavigate={handleNavigate}
          />
        ) : null;

      case "admin":
        return user && user.role === "staff" ? (
          <AdminDashboard
            key="admin"
            reports={reports}
            onUpdateReport={handleUpdateReport}
          />
        ) : null;

      default:
        return <Hero key="hero" onNavigate={handleNavigate} />;
    }
  };

  if (fetchError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-6 p-4 text-center">
        <div className="w-20 h-20 bg-destructive/10 rounded-[2rem] flex items-center justify-center text-destructive">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black uppercase tracking-tight">Database Connection Failed</h2>
          <p className="text-muted-foreground font-medium max-w-md mx-auto">
            We're unable to sync with the Samvad Civic Grid. This might be due to a network issue or database maintenance.
          </p>
        </div>
        <Button 
          onClick={() => window.location.reload()}
          className="rounded-2xl px-8 h-12 bg-primary font-bold shadow-civic"
        >
          Re-establish Connection
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-6">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
          <img src="/samvad-logo.png" alt="Samvad" className="w-10 h-10 object-contain" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-1 w-48 bg-muted rounded-full overflow-hidden">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="h-full w-1/2 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]"
            />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Syncing Civic Data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Header
        userRole={user?.role || null}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        currentPage={currentPage}
      />
      <main className="pb-12 pt-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Toaster />
    </div>
  );
};

export default Index;
