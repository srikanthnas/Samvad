import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  MapPin,
  Calendar,
  Shield,
  Activity
} from "lucide-react";
import { Report } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CivicMap } from "@/components/CivicMap";

const API_URL = import.meta.env.VITE_API_URL || "https://samvad-backend-1fpd.onrender.com";

const TrackLive = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [report, setReport] = useState<Report | null>(location.state?.report || null);
  const [loading, setLoading] = useState(!location.state?.report);

  useEffect(() => {
    if (location.state?.report) return;

    const fetchReport = async () => {
      try {
        const response = await fetch(`${API_URL}/api/reports/${id}`);
        if (response.ok) {
          const data = await response.json();
          setReport({
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt)
          });
        }
      } catch (error) {
        console.error("Fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id, location.state]);

  const stages = [
    { name: "Submitted", desc: "Report received and filed in city database", icon: Activity },
    { name: "Assigned", desc: "Official department assigned to evaluate case", icon: Shield },
    { name: "In Progress", desc: "Teams dispatched for on-site resolution", icon: Clock },
    { name: "Resolved", desc: "Issue corrected and verified by city audit", icon: CheckCircle }
  ];

  const currentStatusIdx = report ? stages.findIndex(s => s.name === report.status) : 0;

  if (loading) return <div className="min-h-screen flex items-center justify-center animate-pulse text-primary font-black">SCANNING CIVIC GRID...</div>;
  if (!report) return <div className="min-h-screen flex flex-col items-center justify-center space-y-4"><h2 className="text-2xl font-black">TRACKING DATA NOT FOUND</h2><Button onClick={() => navigate("/")}>Go Back</Button></div>;

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Header onNavigate={() => navigate("/")} currentPage="track" />
      
      <main className="max-w-4xl mx-auto px-4 pt-12 space-y-12 pb-24">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="rounded-full hover:bg-primary/5 font-bold"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Exit Live Tracking
        </Button>

        {/* Live Tracking Header */}
        <div className="bg-zinc-900 dark:bg-white p-10 rounded-[3rem] text-white dark:text-zinc-900 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-bl-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
              <span className="text-xs font-black uppercase tracking-[0.4em] opacity-70">Live Status Feed</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter">{report.title}</h1>
            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex items-center gap-2 text-sm font-bold opacity-80">
                <MapPin className="h-4 w-4" />
                {report.location.address.split(',')[0]}
              </div>
              <div className="flex items-center gap-2 text-sm font-bold opacity-80">
                <Calendar className="h-4 w-4" />
                Updated {report.updatedAt.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* Status Progression - Vertical Timeline */}
        <div className="relative space-y-12 before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-[6px] before:bg-muted before:rounded-full">
          {/* Animated Progress Line */}
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: `${(currentStatusIdx / (stages.length - 1)) * 100}%` }}
            className="absolute left-[27px] top-4 w-[6px] bg-gradient-to-b from-primary via-secondary to-success rounded-full z-10 shadow-[0_0_15px_rgba(var(--primary),0.4)]"
            transition={{ duration: 1.5, ease: "circOut" }}
          />

          {stages.map((stage, idx) => {
            const isCompleted = idx <= currentStatusIdx;
            const isCurrent = idx === currentStatusIdx;
            const StageIcon = stage.icon;

            return (
              <motion.div 
                key={stage.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2 }}
                className={cn(
                  "relative pl-20 transition-all duration-500",
                  !isCompleted && "opacity-30 grayscale"
                )}
              >
                {/* Stage Marker */}
                <div className={cn(
                  "absolute left-0 top-0 w-14 h-14 rounded-2xl border-4 border-background z-20 flex items-center justify-center transition-all duration-500",
                  isCurrent ? "bg-primary text-white scale-110 shadow-2xl rotate-12" : 
                  isCompleted ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"
                )}>
                  <StageIcon className={cn("h-6 w-6", isCurrent && "animate-pulse")} />
                </div>

                {/* Stage Info */}
                <div className={cn(
                  "p-8 rounded-[2rem] border transition-all duration-500",
                  isCurrent ? "bg-white dark:bg-zinc-900 border-primary shadow-xl scale-[1.02]" : 
                  "bg-background/50 border-border/40"
                )}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-black uppercase tracking-tight">{stage.name}</h3>
                    {isCurrent && (
                      <Badge className="bg-primary text-white text-[9px] font-black tracking-widest px-3 py-1 animate-bounce">
                        CURRENT STAGE
                      </Badge>
                    )}
                    {isCompleted && !isCurrent && (
                      <CheckCircle className="h-5 w-5 text-success" />
                    )}
                  </div>
                  <p className="text-muted-foreground font-medium">{stage.desc}</p>
                  
                  {isCurrent && (
                    <div className="mt-6 pt-6 border-t border-primary/10 flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center overflow-hidden">
                            <Shield className="h-4 w-4 text-primary/40" />
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                        Operational Teams Engaged
                      </span>
                    </div>
                  )}

                  {stage.name === 'Resolved' && report.status === 'Resolved' && report.resolutionPhotoUrl && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-8 rounded-3xl overflow-hidden border-4 border-success/20 shadow-xl"
                    >
                      <img src={report.resolutionPhotoUrl} alt="Resolution" className="w-full h-48 object-cover" />
                      <div className="bg-success/10 p-4 border-t border-success/20 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-success">Verified Resolution Proof</span>
                        <CheckCircle className="h-4 w-4 text-success" />
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Live Analytics Box */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/20">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-6">Dispatch Details</h4>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-bold text-muted-foreground/60">Verification Hash</span>
                <span className="text-sm font-mono font-bold">#SV-{report.id.slice(0,8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-bold text-muted-foreground/60">Sector Priority</span>
                <span className="text-sm font-black text-destructive">CRITICAL P{report.priority}</span>
              </div>
            </div>
          </div>
          <div className="glass-card p-8 rounded-[2.5rem] border border-white/20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-success">Secure Connection</p>
              <p className="text-[10px] font-bold text-muted-foreground">End-to-end encrypted civic data feed</p>
            </div>
          </div>
        </div>

        {/* Live Operational Map */}
        <div className="space-y-6 pt-12 border-t border-border/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary">Operational Map</h2>
              <p className="text-sm font-bold text-muted-foreground mt-1">Live tracking of resolution coordinates</p>
            </div>
            <Badge variant="outline" className="rounded-full border-primary/20 text-primary animate-pulse">
              LIVE SIGNAL
            </Badge>
          </div>
          <div className="h-[400px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/20 relative group">
            <CivicMap 
              lat={report.location.lat} 
              lng={report.location.lng} 
              address={report.location.address}
              zoom={16}
            />
            <div className="absolute top-6 left-6 z-[1000] glass-card p-4 rounded-2xl border border-white/20 shadow-xl pointer-events-none">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-1">Asset Location</p>
              <p className="text-xs font-bold">{report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrackLive;
