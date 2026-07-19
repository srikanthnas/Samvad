import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Clock, 
  Shield, 
  ChevronLeft, 
  AlertTriangle,
  CheckCircle,
  Users
} from "lucide-react";
import { Report } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CivicMap } from "@/components/CivicMap";

const API_URL = import.meta.env.VITE_API_URL || "https://samvad-backend-1fpd.onrender.com";

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [report, setReport] = useState<Report | null>(location.state?.report || null);
  const [loading, setLoading] = useState(!location.state?.report);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("ReportDetail mounted with ID:", id);
    if (location.state?.report) {
      console.log("Using report from state");
      setLoading(false);
      return;
    }

    const fetchReport = async () => {
      try {
        console.log("Fetching report from API:", `${API_URL}/api/reports/${id}`);
        const response = await fetch(`${API_URL}/api/reports/${id}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Report fetched successfully:", data);
          setReport({
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt)
          });
        } else if (response.status === 404) {
          console.error("Report not found (404)");
          setError("Report not found");
        } else {
          setError("Failed to fetch report");
        }
      } catch (error) {
        console.error("Failed to fetch report error:", error);
        setError("Network error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id, location.state]);

  const getStatusIcon = (status: Report["status"]) => {
    switch (status) {
      case "Resolved": return <CheckCircle className="h-6 w-6" />;
      case "In Progress": return <Clock className="h-6 w-6" />;
      default: return <AlertTriangle className="h-6 w-6" />;
    }
  };

  const getStatusColor = (status: Report["status"]) => {
    switch (status) {
      case "Resolved": return "bg-success text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]";
      case "In Progress": return "bg-warning text-white shadow-[0_0_20px_rgba(245,158,11,0.3)]";
      case "Assigned": return "bg-primary text-white shadow-[0_0_20px_rgba(var(--primary),0.3)]";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!report || error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-black">{error || "Report Not Found"}</h2>
        <Button onClick={() => navigate("/")}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header onNavigate={(page) => navigate("/")} currentPage="detail" />
      
      <main className="max-w-5xl mx-auto px-4 pt-12 space-y-10">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="rounded-full hover:bg-primary/5 font-bold"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Activity
        </Button>

        <div className="grid lg:grid-cols-[1fr_350px] gap-12">
          <div className="space-y-10">
            {/* Header Info */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <Badge className={cn("px-6 py-2 rounded-2xl border-none shadow-xl text-sm font-black uppercase tracking-widest", getStatusColor(report.status))}>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(report.status)}
                    {report.status}
                  </div>
                </Badge>
                <span className="text-xs font-black text-muted-foreground/40 tracking-[0.3em]">REF: {report.id}</span>
              </div>
              
              <h1 className="text-5xl font-black tracking-tighter text-foreground leading-tight">
                {report.title}
              </h1>

              <div className="flex flex-wrap gap-6 items-center border-y border-border/30 py-6">
                <div className="flex items-center gap-3 font-bold text-muted-foreground">
                  <MapPin className="h-5 w-5 text-primary" />
                  {report.location.address}
                </div>
                <div className="flex items-center gap-3 font-bold text-muted-foreground">
                  <Clock className="h-5 w-5 text-secondary" />
                  {report.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Description */}
            <section className="space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary">Incident Narrative</h2>
              <p className="text-xl leading-relaxed text-foreground/80 font-medium italic border-l-4 border-primary/20 pl-8 py-2">
                "{report.description}"
              </p>
            </section>

            {/* Visual Evidence */}
            {report.photoUrl && (
              <section className="space-y-6">
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary">Visual Evidence</h2>
                <div className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/20 relative group">
                  <img src={report.photoUrl} alt="Evidence" className="w-full h-[500px] object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </section>
            )}

            {/* Resolution History */}
            {report.staffComment && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary/5 rounded-[3rem] p-10 border-l-[12px] border-primary shadow-inner relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-bl-full -mr-24 -mt-24" />
                <div className="flex items-center gap-4 mb-8 relative">
                  <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center shadow-2xl">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-primary uppercase tracking-[0.4em]">Official Resolution</h3>
                    <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">Authorized Government Directive</p>
                  </div>
                </div>
                <p className="text-2xl text-foreground/90 leading-relaxed italic font-bold relative pl-6 border-l-4 border-primary/20 mb-8">
                  "{report.staffComment}"
                </p>
                {report.resolutionPhotoUrl && (
                  <div className="mt-8 rounded-[2rem] overflow-hidden border-4 border-white/40 shadow-2xl group relative">
                    <img src={report.resolutionPhotoUrl} alt="Resolution" className="w-full h-64 object-cover" />
                    <div className="absolute inset-0 bg-primary/10 pointer-events-none group-hover:bg-transparent transition-all" />
                    <div className="absolute bottom-4 left-6 z-10">
                       <Badge className="bg-success text-white px-4 py-2 rounded-xl text-xs font-black shadow-xl">RESOLUTION PROOF</Badge>
                    </div>
                  </div>
                )}
                <div className="mt-8 pt-8 border-t border-primary/10 flex justify-between items-center relative">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-primary/70">Assigned: {report.assignedStaffId || "Civic AI Core"}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                    Last Verified: {report.updatedAt.toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar Info */}
          <aside className="space-y-8">
            <div className="glass-card rounded-[2.5rem] p-8 border border-white/20 space-y-6 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Case Status Analytics</h3>
              
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Priority</span>
                  <Badge variant="secondary" className="rounded-full px-4 font-black text-xs uppercase tracking-widest bg-destructive/10 text-destructive border-none">
                    LEVEL {report.priority}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Category</span>
                  <span className="text-sm font-bold text-foreground">{report.category}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-border/20">
                <div className="h-48 rounded-[1.5rem] overflow-hidden border border-border/50 shadow-inner group relative">
                  <CivicMap 
                    lat={report.location.lat} 
                    lng={report.location.lng} 
                    address={report.location.address}
                    interactive={false}
                  />
                  <div className="absolute inset-0 bg-primary/5 pointer-events-none group-hover:bg-transparent transition-all" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mt-3 text-center">Precise Incident Geolocation</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ReportDetail;
