import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  MapPin,
  Plus,
  Shield,
  Users
} from "lucide-react";
import { Report } from "@/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface CitizenDashboardProps {
  reports: Report[];
  userId: string;
  onNavigate: (page: string) => void;
}

export const CitizenDashboard = ({ reports, userId, onNavigate }: CitizenDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const navigate = useNavigate();

  const userReports = reports.filter(report => report.userId === userId);

  useEffect(() => {
    let filtered = userReports;
    if (searchTerm.trim()) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(report => report.status === statusFilter);
    }
    setFilteredReports(filtered);
  }, [searchTerm, statusFilter, userReports]);

  const getStatusIcon = (status: Report["status"]) => {
    switch (status) {
      case "Resolved": return <CheckCircle className="h-4 w-4" />;
      case "In Progress": return <Clock className="h-4 w-4" />;
      case "Assigned": return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Report["status"]) => {
    switch (status) {
      case "Resolved": return "bg-success/20 text-success border-success/30";
      case "In Progress": return "bg-warning/20 text-warning border-warning/30";
      case "Assigned": return "bg-primary/20 text-primary border-primary/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return "text-destructive bg-destructive/10 px-2 py-0.5 rounded-full";
    if (priority >= 3) return "text-warning bg-warning/10 px-2 py-0.5 rounded-full";
    return "text-success bg-success/10 px-2 py-0.5 rounded-full";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-4 lg:p-8 space-y-10"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-foreground">My Community Reports</h1>
          <p className="text-muted-foreground text-lg">Real-time tracking of your civic contributions</p>
        </div>
        <Button
          variant="civic"
          size="lg"
          className="rounded-full px-8 shadow-civic hover-lift"
          onClick={() => onNavigate("report")}
        >
          <Plus className="h-5 w-5 mr-2" />
          Report New Issue
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Reports", value: userReports.length, icon: AlertTriangle, color: "primary" },
          { label: "In Progress", value: userReports.filter(r => r.status === "In Progress").length, icon: Clock, color: "warning" },
          { label: "Resolved", value: userReports.filter(r => r.status === "Resolved").length, icon: CheckCircle, color: "success" },
          { label: "Pending", value: userReports.filter(r => r.status === "Submitted").length, icon: AlertTriangle, color: "muted" }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass-card border-none hover-lift overflow-hidden group">
              <CardContent className="p-6 relative">
                <div className={`absolute top-0 right-0 w-16 h-16 bg-${stat.color === 'muted' ? 'muted' : stat.color}/10 rounded-bl-full flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color === 'muted' ? 'muted-foreground' : stat.color}`} />
                </div>
                <p className="text-3xl font-black text-foreground mb-1">{stat.value}</p>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters & Search */}
      <Card className="glass-card border-none rounded-3xl p-2">
        <CardContent className="p-4 flex flex-col md:flex-row gap-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search issues, categories, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 bg-background/30 border-none rounded-2xl text-lg focus-visible:ring-primary/20"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {["all", "Submitted", "Assigned", "In Progress", "Resolved"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "civic" : "ghost"}
                size="sm"
                className={`rounded-full px-6 h-10 transition-all ${statusFilter === status ? "shadow-lg scale-105" : "hover:bg-primary/5"}`}
                onClick={() => setStatusFilter(status)}
              >
                {status === "all" ? "All Status" : status}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline Feed */}
      <div className="relative space-y-16 before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-[4px] before:bg-gradient-to-b before:from-primary before:via-secondary/40 before:to-transparent before:rounded-full pt-10">
        <AnimatePresence mode="popLayout">
          {filteredReports.length === 0 ? (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <p className="text-xl font-bold text-muted-foreground/50">No activity found</p>
            </motion.div>
          ) : (
            filteredReports.map((report, idx) => (
              <motion.div
                key={report.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="relative pl-16 group"
              >
                {/* Timeline Dot - Enhanced Visual Strength */}
                <div className={cn(
                  "absolute left-[-1px] top-0 w-10 h-10 rounded-full border-4 border-background z-10 flex items-center justify-center transition-all duration-500 group-hover:scale-125 shadow-[0_0_20px_rgba(0,0,0,0.1)] group-hover:shadow-[0_0_25px_rgba(0,0,0,0.2)]",
                  report.status === "Resolved" ? "bg-success text-white" : 
                  report.status === "In Progress" ? "bg-warning text-white" : 
                  report.status === "Assigned" ? "bg-primary text-white" : "bg-zinc-400 text-white"
                )}>
                  <div className="scale-110">
                    {getStatusIcon(report.status)}
                  </div>
                </div>

                <div className="space-y-6 transition-all duration-500 group-hover:translate-x-2">
                  {/* Date Header - High Contrast */}
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground/80 bg-muted/50 px-3 py-1 rounded-md">
                      {formatDate(new Date(report.createdAt))}
                    </span>
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-border/40 to-transparent"></div>
                    <Badge className={cn(
                      "rounded-full px-4 py-1 border-none shadow-sm font-black text-[10px] uppercase tracking-widest",
                      getStatusColor(report.status)
                    )}>
                      {report.status}
                    </Badge>
                  </div>

                  {/* Feed Item Body - Added Card Depth */}
                  <div className="grid md:grid-cols-[1fr_280px] gap-10 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/20 shadow-sm group-hover:shadow-2xl group-hover:bg-white/60 dark:group-hover:bg-zinc-900/60 transition-all duration-500 overflow-hidden">
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-3xl font-black tracking-tight text-foreground leading-[1.1] group-hover:text-primary transition-colors">
                            {report.title}
                          </h3>
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm",
                            report.priority >= 4 ? "bg-destructive text-white" : "bg-primary/10 text-primary"
                          )}>
                            {report.priority >= 4 ? "CRITICAL SEVERITY" : `PRIORITY LEVEL ${report.priority}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-800 border-none text-[9px] font-black uppercase tracking-widest px-3 py-1">
                            {report.category}
                          </Badge>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 tracking-wider">
                            <Users className="h-3 w-3" />
                            ASSIGNED: {report.assignedStaffId || "Civic AI Core"}
                          </div>
                        </div>
                      </div>

                      <p className="text-lg text-foreground/70 font-medium leading-relaxed max-w-2xl line-clamp-2 italic">
                        "{report.description}"
                      </p>

                      {/* Status Progression Bar */}
                      <div className="space-y-4 py-2">
                        <div className="flex justify-between items-center px-2">
                          {["Submitted", "Assigned", "In Progress", "Resolved"].map((step, i) => {
                            const statuses = ["Submitted", "Assigned", "In Progress", "Resolved"];
                            const currentIdx = statuses.indexOf(report.status);
                            const stepIdx = i;
                            const isActive = stepIdx <= currentIdx;
                            const isCurrent = stepIdx === currentIdx;

                            return (
                              <div key={step} className="flex flex-col items-center gap-2 relative">
                                <div className={cn(
                                  "w-3 h-3 rounded-full transition-all duration-700",
                                  isCurrent ? "scale-150 ring-4 ring-primary/20 bg-primary" : 
                                  isActive ? "bg-primary/60" : "bg-muted-foreground/20"
                                )} />
                                <span className={cn(
                                  "text-[8px] font-black uppercase tracking-widest",
                                  isCurrent ? "text-primary" : isActive ? "text-foreground/60" : "text-muted-foreground/30"
                                )}>
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden relative">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(["Submitted", "Assigned", "In Progress", "Resolved"].indexOf(report.status) / 3) * 100}%` }}
                            className="absolute h-full bg-gradient-to-r from-primary via-secondary to-success shadow-[0_0_10px_rgba(var(--primary),0.5)]" 
                          />
                        </div>
                      </div>

                      {/* Metadata Row */}
                      <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-3 px-4 py-2 bg-background/50 rounded-2xl text-[11px] font-bold text-foreground/80 shadow-inner border border-white/10 group/loc">
                          <MapPin className="h-4 w-4 text-primary" />
                          {report.location.address.split(',')[0]}
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 bg-background/50 rounded-2xl text-[11px] font-bold text-foreground/80 shadow-inner border border-white/10">
                          <Clock className="h-4 w-4 text-secondary" />
                          {formatDate(new Date(report.createdAt))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4 pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => navigate(`/report/${report.id}`, { state: { report } })}
                          className="flex-1 rounded-2xl h-12 border-primary/20 text-primary font-black text-xs uppercase tracking-widest hover:bg-primary/5"
                        >
                          View Full Case
                        </Button>
                        <Button 
                          onClick={() => navigate(`/track/${report.id}`, { state: { report } })}
                          className="flex-1 rounded-2xl h-12 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform"
                        >
                          Track Live
                        </Button>
                      </div>

                      {report.staffComment && (
                        <div className="bg-primary/5 rounded-[2rem] p-8 border-l-[6px] border-primary shadow-inner relative overflow-hidden group/comment">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-12 -mt-12 transition-transform duration-700 group-hover/comment:scale-125"></div>
                          <div className="flex items-center gap-3 mb-4 relative">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shadow-lg">
                              <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em] block">Case Update</span>
                              <span className="text-[9px] font-bold text-primary/60 uppercase tracking-widest">Verified Official Directive</span>
                            </div>
                          </div>
                          <p className="text-base text-foreground/90 leading-relaxed italic font-bold relative pl-4 border-l-2 border-primary/20">
                            "{report.staffComment}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Media / Visual Side - Enhanced Visual Strength */}
                    <div className="space-y-6">
                      {report.photoUrl ? (
                        <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border-2 border-white/30 shadow-2xl group/media relative bg-muted/20">
                          <img 
                            src={report.photoUrl} 
                            className="w-full h-full object-cover transition-all duration-700 group-hover/media:scale-110 group-hover/media:rotate-1"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity"></div>
                        </div>
                      ) : (
                        <div className="aspect-[4/5] rounded-[2rem] border-2 border-dashed border-border/50 flex flex-col items-center justify-center bg-muted/5 group/media transition-colors hover:bg-muted/10">
                          <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4 group-hover/media:scale-110 transition-transform">
                            <AlertTriangle className="h-8 w-8 text-muted-foreground/30" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 text-center px-6 leading-relaxed">
                            No Visual Data Available
                          </span>
                        </div>
                      )}
                      
                      {/* Stylized Location Info Card */}
                      <div className="bg-zinc-800/5 dark:bg-white/5 rounded-[1.5rem] p-5 border border-white/10 group/map cursor-pointer hover:bg-primary/5 transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 shadow-xl flex items-center justify-center group-hover/map:rotate-12 transition-transform">
                            <MapPin className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Location</p>
                            <p className="text-xs font-bold text-foreground truncate max-w-[120px]">View Analytics</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};