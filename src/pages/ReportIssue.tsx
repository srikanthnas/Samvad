import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  MapPin,
  Loader2,
  CheckCircle,
  Mic,
  Upload,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X
} from "lucide-react";
import { mockAIService, mockLocationService } from "@/services/mockData";
import { Report } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface ReportIssueProps {
  userId: string;
  onReportSubmitted: (report: Report) => void;
}

export const ReportIssue = ({ userId, onReportSubmitted }: ReportIssueProps) => {
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{ category: string; priority: number; suggestedTitle?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log("File selected:", file.name, file.size, file.type);
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const locationData = await mockLocationService.getCurrentLocation();
      setLocation(locationData);
    } catch (error) {
      console.error("Failed to get location:", error);
    }
    setIsGettingLocation(false);
  };

  const analyzeWithAI = async () => {
    if (!description.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await mockAIService.categorizeReport(description, photoPreview);
      setAiResult(result);
    } catch (error) {
      console.error("AI analysis failed:", error);
    }
    setIsAnalyzing(false);
  };

  const startVoiceRecording = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setDescription(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    }
  };

  const uploadImage = async (file: File | string): Promise<string | undefined> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    
    console.log("Cloudinary Config:", { cloudName, uploadPreset: uploadPreset ? "PRESENT" : "MISSING" });

    if (!cloudName || !uploadPreset) {
      console.warn("Cloudinary credentials missing. Falling back to local storage.");
      return typeof file === 'string' ? file : photoPreview;
    }

    try {
      console.log("Starting Cloudinary upload...");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Cloudinary upload failed");
      }
      
      const data = await res.json();
      console.log("Cloudinary upload successful! URL:", data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error("Image upload error:", error);
      return typeof file === 'string' ? file : photoPreview;
    }
  };

  const submitReport = async () => {
    if (!description.trim() || !location) return;
    setIsSubmitting(true);

    console.log("Submitting report. Current photo state:", { 
      hasPreview: !!photoPreview, 
      hasFile: !!selectedFile 
    });

    let finalPhotoUrl = photoPreview || undefined;
    
    // If we have a photo, upload it to the cloud first
    if (selectedFile || photoPreview) {
      finalPhotoUrl = await uploadImage(selectedFile || photoPreview);
    }

    const newReport: Report = {
      id: `RPT${String(Date.now()).slice(-3)}`,
      title: aiResult?.suggestedTitle || "New civic issue report",
      description: description.trim(),
      category: (aiResult?.category as Report["category"]) || "Other",
      priority: (aiResult?.priority as Report["priority"]) || 2,
      status: "Submitted",
      photoUrl: finalPhotoUrl,
      location,
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onReportSubmitted(newReport);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 lg:p-12 min-h-screen relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '3s' }}></div>

      <div className="mb-12 text-center space-y-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-primary uppercase tracking-wider">AI Powered Reporting</span>
        </motion.div>
        <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-foreground">Report an Issue</h1>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">Make your community better, one report at a time.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between max-w-sm mx-auto mb-10 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 -z-10"></div>
        <motion.div
          className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 -z-10 transition-all duration-500"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        ></motion.div>
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= s ? 'bg-primary text-white shadow-civic' : 'bg-muted text-muted-foreground'
              }`}
          >
            {s}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="glass-card border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 lg:p-12">

              {/* Step 1: Photos & Description */}
              {step === 1 && (
                <div className="space-y-8">
                  <div className="text-center space-y-2 mb-4">
                    <h2 className="text-2xl font-bold">Describe the Issue</h2>
                    <p className="text-muted-foreground">What's going on in your neighborhood?</p>
                  </div>

                  <div className="grid gap-8">
                    <div className="space-y-4">
                      <Label className="text-lg font-bold">Visual Proof (Optional)</Label>
                      <div className="group relative border-2 border-dashed border-primary/20 rounded-[2rem] p-10 text-center transition-all hover:bg-primary/5 hover:border-primary/40 cursor-pointer overflow-hidden">
                        {photoPreview ? (
                          <div className="relative">
                            <img src={photoPreview} className="w-full h-64 object-cover rounded-2xl" alt="Preview" />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-4 right-4 rounded-full shadow-lg"
                              onClick={(e) => { e.stopPropagation(); setPhotoPreview(""); }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div onClick={() => fileInputRef.current?.click()} className="space-y-4">
                            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                              <Camera className="h-10 w-10 text-primary" />
                            </div>
                            <div>
                              <p className="text-xl font-bold">Capture Photo</p>
                              <p className="text-muted-foreground">Tap to use camera or upload file</p>
                            </div>
                          </div>
                        )}
                        <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} className="hidden" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-lg font-bold">Detailed Description</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`rounded-full gap-2 transition-all ${isListening ? 'bg-red-500/10 text-red-500 border-red-500/50' : ''}`}
                          onClick={startVoiceRecording}
                        >
                          {isListening ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}
                          {isListening ? 'Listening...' : 'Use Voice'}
                        </Button>
                      </div>
                      <Textarea
                        placeholder="Tell us more... (e.g., Large pothole in the middle of Main Street)"
                        className="rounded-2xl min-h-[150px] p-6 text-lg bg-background/50 border-none glass focus-visible:ring-primary/20 transition-all shadow-inner"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-8 border-t border-border/30">
                    <Button
                      size="lg"
                      className="rounded-full px-10 h-14 text-lg font-bold shadow-civic hover-lift"
                      disabled={!description.trim()}
                      onClick={() => setStep(2)}
                    >
                      Next Step
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: AI Analysis & Category */}
              {step === 2 && (
                <div className="space-y-8">
                  <div className="text-center space-y-2 mb-4">
                    <h2 className="text-2xl font-bold">Verifying Report</h2>
                    <p className="text-muted-foreground">Our AI is analyzing the details for accuracy.</p>
                  </div>

                  <div className="grid gap-6">
                    <Button
                      variant="outline"
                      className="h-24 rounded-3xl border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all flex flex-col items-center justify-center gap-2 group"
                      onClick={analyzeWithAI}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? <Loader2 className="h-8 w-8 animate-spin text-primary" /> : <Sparkles className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />}
                      <span className="font-bold text-lg">{isAnalyzing ? "Processing Details..." : "Run Smart Analysis"}</span>
                    </Button>

                    <AnimatePresence>
                      {aiResult && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          className="space-y-6"
                        >
                          <div className="p-8 bg-primary/5 rounded-[2rem] border border-primary/10 space-y-6">
                            <div className="flex flex-wrap items-center gap-4">
                              <Badge className="bg-primary text-white px-4 py-2 rounded-xl text-lg">{aiResult.category}</Badge>
                              <Badge variant="outline" className="border-primary/30 text-primary px-4 py-2 rounded-xl text-lg">Priority {aiResult.priority}/5</Badge>
                            </div>
                            {aiResult.suggestedTitle && (
                              <div className="space-y-2">
                                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">AI Suggested Title</p>
                                <p className="text-2xl font-bold text-foreground">{aiResult.suggestedTitle}</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex justify-between pt-8 border-t border-border/30">
                    <Button variant="ghost" size="lg" className="rounded-full px-8" onClick={() => setStep(1)}>
                      <ChevronLeft className="mr-2 h-5 w-5" />
                      Back
                    </Button>
                    <Button
                      size="lg"
                      className="rounded-full px-10 h-14 text-lg font-bold shadow-civic hover-lift"
                      onClick={() => setStep(3)}
                    >
                      Confirm Details
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Location & Submit */}
              {step === 3 && (
                <div className="space-y-8">
                  <div className="text-center space-y-2 mb-4">
                    <h2 className="text-2xl font-bold">Confirm Location</h2>
                    <p className="text-muted-foreground">Where should we send the relief team?</p>
                  </div>

                  <div className="space-y-6">
                    <div
                      className={`relative border-2 rounded-[2rem] p-10 text-center transition-all cursor-pointer overflow-hidden ${location ? 'border-success bg-success/5' : 'border-dashed border-primary/20 hover:bg-primary/5'
                        }`}
                      onClick={getCurrentLocation}
                    >
                      {isGettingLocation ? (
                        <div className="space-y-4">
                          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                          <p className="text-xl font-bold">Acquiring GPS...</p>
                        </div>
                      ) : location ? (
                        <div className="space-y-4">
                          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="h-10 w-10 text-success" />
                          </div>
                          <div>
                            <p className="text-xl font-bold">Location Confirmed</p>
                            <p className="text-muted-foreground line-clamp-2 max-w-sm mx-auto">{location.address}</p>
                          </div>
                          <Button variant="outline" size="sm" className="rounded-full" onClick={(e) => { e.stopPropagation(); setLocation(null); }}>
                            Update Location
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto">
                            <MapPin className="h-10 w-10 text-primary" />
                          </div>
                          <div>
                            <p className="text-xl font-bold">Get Current Location</p>
                            <p className="text-muted-foreground">Tap to automatically tag your location</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 pt-8 border-t border-border/30">
                    <div className="flex justify-between">
                      <Button variant="ghost" size="lg" className="rounded-full px-8" onClick={() => setStep(2)}>
                        <ChevronLeft className="mr-2 h-5 w-5" />
                        Back
                      </Button>
                    </div>
                    <Button
                      variant="civic"
                      size="lg"
                      className="rounded-full h-16 text-xl font-black shadow-xl hover-lift w-full"
                      disabled={!location || isSubmitting}
                      onClick={submitReport}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-6 w-6 animate-spin mr-3" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-3 h-6 w-6" />
                          Finalize Report
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};