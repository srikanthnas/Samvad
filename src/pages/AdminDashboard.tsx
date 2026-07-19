import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  Users,
  Search,
  MapPin,
  TrendingUp,
  Eye,
  LayoutDashboard,
  Camera,
  X,
  Loader2,
  Upload,
  Shield
} from "lucide-react";
import { Report } from "@/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface AdminDashboardProps {
  reports: Report[];
  onUpdateReport: (reportId: string, updates: Partial<Report>) => void;
}

export const AdminDashboard = ({ reports, onUpdateReport }: AdminDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [staffComment, setStaffComment] = useState("");
  const [resolutionFile, setResolutionFile] = useState<File | null>(null);
  const [resolutionPreview, setResolutionPreview] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let filtered = [...reports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (searchTerm.trim()) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(report => report.status === statusFilter);
    }
    if (priorityFilter !== "all") {
      filtered = filtered.filter(report => report.priority === parseInt(priorityFilter));
    }
    setFilteredReports(filtered);
  }, [searchTerm, statusFilter, priorityFilter, reports]);

  const uploadImage = async (file: File): Promise<string | undefined> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    
    if (!cloudName || !uploadPreset) {
      console.warn("Cloudinary credentials missing.");
      return undefined;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Cloudinary upload failed");
      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      console.error("Image upload error:", error);
      return undefined;
    }
  };

  const handleUpdateReport = async () => {
    if (!selectedReport || !newStatus) return;
    setIsUpdating(true);
    
    let resolutionPhotoUrl = selectedReport.resolutionPhotoUrl;
    
    if (resolutionFile) {
      const uploadedUrl = await uploadImage(resolutionFile);
      if (uploadedUrl) {
        resolutionPhotoUrl = uploadedUrl;
      }
    }

    onUpdateReport(selectedReport.id, {
      status: newStatus as Report["status"],
      staffComment: staffComment.trim(),
      resolutionPhotoUrl,
      updatedAt: new Date(),
      assignedStaffId: "staff1"
    });
    
    setIsUpdating(false);
    setSelectedReport(null);
    setResolutionFile(null);
    setResolutionPreview("");
  };

  const getStatusIcon = (status: Report["status"]) => {
    switch (status) {
      case "Resolved": return <CheckCircle className="h-4 w-4" />;
      case "In Progress": return <Clock className="h-4 w-4" />;
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    }).format(new Date(date));
  };

  const stats = [
    { label: "Total Reports", value: reports.length, icon: LayoutDashboard, color: "primary" },
    { label: "High Priority", value: reports.filter(r => r.priority >= 4).length, icon: AlertTriangle, color: "destructive" },
    { label: "Assigned", value: reports.filter(r => r.status === "Assigned").length, icon: Users, color: "primary" },
    { label: "Resolved", value: reports.filter(r => r.status === "Resolved").length, icon: CheckCircle, color: "success" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto p-4 lg:p-10 space-y-10"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-secondary" />
            </div>
            <Badge variant="outline" className="text-secondary border-secondary/30 font-bold tracking-widest uppercase py-1 px-3">Government Administration</Badge>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">Command Center</h1>
          <p className="text-muted-foreground text-lg">Central hub for managing civic resolutions</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-primary/5 rounded-2xl p-4 flex items-center gap-4 border border-primary/10">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Efficiency</p>
              <p className="text-xl font-black text-primary">82.4%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass-card border-none hover-lift group overflow-hidden">
              <CardContent className="p-8">
                <div className={`w-14 h-14 bg-${stat.color === 'primary' ? 'primary' : stat.color}/10 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                  <stat.icon className={`h-8 w-8 text-${stat.color === 'destructive' ? 'destructive' : 'primary'}`} />
                </div>
                <h3 className="text-4xl font-black text-foreground mb-1 tracking-tight">{stat.value}</h3>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Control Bar */}
      <Card className="glass-card border-none rounded-3xl overflow-hidden p-2">
        <CardContent className="p-4 flex flex-col lg:flex-row gap-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search reports by ID or Title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 h-16 bg-background/30 border-none rounded-2xl text-lg focus-visible:ring-primary/20"
            />
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] h-14 rounded-2xl bg-background/50 border-none glass ring-0 focus:ring-primary/20">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="glass-card border-none rounded-2xl shadow-2xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Assigned">Assigned</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px] h-14 rounded-2xl bg-background/50 border-none glass ring-0 focus:ring-primary/20">
                <SelectValue placeholder="Filter Priority" />
              </SelectTrigger>
              <SelectContent className="glass-card border-none rounded-2xl shadow-2xl">
                <SelectItem value="all">Any Priority</SelectItem>
                <SelectItem value="5">Critical (P5)</SelectItem>
                <SelectItem value="4">High (P4)</SelectItem>
                <SelectItem value="3">Normal (P3)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table - Table View */}
      <Card className="glass-card border-none rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/30 border-b border-border/30">
                <th className="text-left p-6 font-bold uppercase tracking-widest text-xs text-muted-foreground">Reference</th>
                <th className="text-left p-6 font-bold uppercase tracking-widest text-xs text-muted-foreground">Incident Details</th>
                <th className="text-left p-6 font-bold uppercase tracking-widest text-xs text-muted-foreground">Severity</th>
                <th className="text-left p-6 font-bold uppercase tracking-widest text-xs text-muted-foreground">Current Status</th>
                <th className="text-left p-6 font-bold uppercase tracking-widest text-xs text-muted-foreground">Timeline</th>
                <th className="text-right p-6 font-bold uppercase tracking-widest text-xs text-muted-foreground">Control</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredReports.map((report, idx) => (
                  <motion.tr
                    key={report.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={cn(
                      "border-b border-border/20 hover:bg-primary/5 transition-colors cursor-pointer group relative",
                      report.status === "Submitted" && "border-status-submitted",
                      report.status === "Assigned" && "border-status-assigned",
                      report.status === "In Progress" && "border-status-inprogress",
                      report.status === "Resolved" && "border-status-resolved"
                    )}
                  >
                    <td className="p-6 pl-8">
                      <Badge variant="secondary" className="font-mono text-[10px] font-black px-3 py-1 bg-muted/50 border-none group-hover:bg-primary/10 transition-colors uppercase tracking-widest">
                        {report.id}
                      </Badge>
                    </td>
                    <td className="p-6">
                      <div className="max-w-md">
                        <p className="font-black text-foreground text-lg mb-1 leading-tight">{report.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1 font-medium">{report.description}</p>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className={cn(
                        "font-black text-[10px] px-3 py-1.5 rounded-full inline-block uppercase tracking-[0.2em] shadow-sm",
                        report.priority >= 4 ? "bg-destructive/10 text-destructive" :
                          report.priority >= 3 ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                      )}>
                        Priority {report.priority}
                      </div>
                    </td>
                    <td className="p-6">
                      <Badge variant="outline" className={cn("rounded-full px-4 py-2 flex items-center gap-2 border-none shadow-sm", getStatusColor(report.status))}>
                        {getStatusIcon(report.status)}
                        <span className="font-black text-[10px] uppercase tracking-wider">{report.status}</span>
                      </Badge>
                    </td>
                    <td className="p-6 text-sm text-muted-foreground/80 font-bold">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDate(report.createdAt)}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="civic"
                            size="sm"
                            className="rounded-full px-6 shadow-lg hover:scale-105 transition-transform"
                            onClick={() => {
                              setSelectedReport(report);
                              setNewStatus(report.status);
                              setStaffComment(report.staffComment || "");
                              setResolutionPreview(report.resolutionPhotoUrl || "");
                            }}
                          >
                            Manage
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl glass-card border-none rounded-[3rem] p-0 overflow-hidden shadow-2xl">
                          {selectedReport && (
                            <div className="flex flex-col h-full max-h-[90vh]">
                              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-10 pt-14 border-b border-white/10 relative">
                                <div className="absolute top-8 left-10 flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-primary" />
                                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">Official Case File</span>
                                </div>
                                <div className="flex justify-between items-start gap-6 pt-2">
                                  <div className="space-y-2">
                                    <h2 className="text-3xl font-black tracking-tight">{selectedReport.title}</h2>
                                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                                      <MapPin className="h-4 w-4" /> {selectedReport.location.address}
                                    </p>
                                  </div>
                                  <Badge className={cn("text-sm px-6 py-2 rounded-2xl border-none shadow-xl", getStatusColor(selectedReport.status))}>
                                    {selectedReport.status}
                                  </Badge>
                                </div>
                              </div>

                              <div className="p-10 overflow-y-auto space-y-10">
                                <section className="space-y-4">
                                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Investigation Segment</h3>
                                  <div className="grid lg:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                      <p className="text-lg leading-relaxed text-foreground/80">{selectedReport.description}</p>
                                      <div className="flex gap-4">
                                        <Badge variant="secondary" className="rounded-xl px-4 py-1.5 font-bold">{selectedReport.category}</Badge>
                                        <Badge variant="secondary" className="rounded-xl px-4 py-1.5 font-bold">Ref: {selectedReport.id}</Badge>
                                      </div>
                                    </div>
                                    {selectedReport.photoUrl && (
                                      <div className="relative group rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                                        <img src={selectedReport.photoUrl} alt="Incident" className="w-full h-48 object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                          <Button variant="outline" className="glass border-white/20 text-white rounded-full">Expand View</Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </section>

                                <section className="space-y-6 pt-10 border-t border-border/20">
                                  <h3 className="text-xs font-black uppercase tracking-widest text-primary">Resolution Action</h3>
                                  <div className="grid lg:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                      <Label className="font-bold">Execution Status</Label>
                                      <Select value={newStatus} onValueChange={setNewStatus}>
                                        <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none glass ring-0">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="glass-card border-none rounded-2xl shadow-2xl">
                                          <SelectItem value="Submitted">Submitted</SelectItem>
                                          <SelectItem value="Assigned">Assigned</SelectItem>
                                          <SelectItem value="In Progress">In Progress</SelectItem>
                                          <SelectItem value="Resolved">Resolved</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-3 lg:col-span-2 pt-4 border-t border-white/10">
                                      <Label className="font-bold flex items-center gap-2">
                                        <Camera className="h-4 w-4" /> Resolution Proof (Visual Confirmation)
                                      </Label>
                                      <div className="grid lg:grid-cols-2 gap-6 items-center">
                                        <div 
                                          className="relative border-2 border-dashed border-primary/20 rounded-2xl p-6 text-center hover:bg-primary/5 cursor-pointer transition-all"
                                          onClick={() => document.getElementById('res-upload')?.click()}
                                        >
                                          {resolutionPreview ? (
                                            <div className="relative">
                                              <img src={resolutionPreview} className="h-32 w-full object-cover rounded-xl" alt="Preview" />
                                              <Button 
                                                variant="destructive" 
                                                size="icon" 
                                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setResolutionPreview("");
                                                  setResolutionFile(null);
                                                }}
                                              >
                                                <X className="h-3 w-3" />
                                              </Button>
                                            </div>
                                          ) : (
                                            <div className="space-y-1">
                                              <Upload className="h-6 w-6 text-primary mx-auto mb-2" />
                                              <p className="text-xs font-bold">Click to Upload Proof</p>
                                            </div>
                                          )}
                                          <input 
                                            id="res-upload" 
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden" 
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                setResolutionFile(file);
                                                const reader = new FileReader();
                                                reader.onload = (e) => setResolutionPreview(e.target?.result as string);
                                                reader.readAsDataURL(file);
                                              }
                                            }}
                                          />
                                        </div>
                                        <div className="text-xs text-muted-foreground bg-primary/5 p-4 rounded-xl border border-primary/10">
                                          <p className="font-bold text-primary mb-1">PRO TIP:</p>
                                          Resolution photos significantly increase citizen trust. Ensure the fixed asset is clearly visible.
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <Button
                                    variant="civic"
                                    className="w-full h-16 rounded-[1.5rem] text-lg font-black shadow-civic hover-lift"
                                    onClick={handleUpdateReport}
                                    disabled={isUpdating || (newStatus === selectedReport.status && staffComment === (selectedReport.staffComment || "") && !resolutionFile)}
                                  >
                                    {isUpdating ? <Loader2 className="h-6 w-6 animate-spin mr-2" /> : null}
                                    {isUpdating ? "Committing Response..." : "Commit Response"}
                                  </Button>
                                </section>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
};