import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, User, Shield } from "lucide-react";
import { mockUsers } from "@/services/mockData";
import { motion } from "framer-motion";

interface LoginProps {
  onLogin: (user: { id: string; name: string; role: "citizen" | "staff" }) => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (role: "citizen" | "staff") => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const mockUser = mockUsers.find(user => user.role === role);
    if (mockUser) {
      onLogin({ id: mockUser.id, name: mockUser.name, role: mockUser.role });
    }
    setIsLoading(false);
  };

  const quickLogin = (role: "citizen" | "staff") => {
    const mockUser = mockUsers.find(user => user.role === role);
    if (mockUser) {
      onLogin({ id: mockUser.id, name: mockUser.name, role: mockUser.role });
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        {/* Logo */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl overflow-hidden p-1">
              <img src="/samvad-logo.png" alt="Samvad" className="w-full h-full object-cover rounded-xl" />
            </div>
          </motion.div>
          <h2 className="text-3xl font-black tracking-tight text-foreground mb-2">Welcome Back</h2>
          <p className="text-muted-foreground">Sign in to your Samvad account</p>
        </div>

        <Tabs defaultValue="citizen" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 backdrop-blur-sm rounded-xl">
            <TabsTrigger value="citizen" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <User className="h-4 w-4" />
              Citizen
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Shield className="h-4 w-4" />
              Staff
            </TabsTrigger>
          </TabsList>

          <TabsContent value="citizen">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="glass-card border-none overflow-hidden rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Citizen Portal
                  </CardTitle>
                  <CardDescription>
                    Report issues and track your community's progress.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="citizen-email">Email Address</Label>
                    <Input
                      id="citizen-email"
                      type="email"
                      placeholder="name@example.com"
                      className="rounded-xl h-11 bg-background/50 border-border/50 focus:border-primary/50"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="citizen-password">Password</Label>
                    <Input
                      id="citizen-password"
                      type="password"
                      placeholder="••••••••"
                      className="rounded-xl h-11 bg-background/50 border-border/50 focus:border-primary/50"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full h-12 rounded-xl text-lg font-semibold shadow-civic bg-primary hover:bg-primary-hover transition-all"
                    onClick={() => handleLogin("citizen")}
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>

                  <div className="pt-6 border-t border-border/30">
                    <p className="text-xs font-semibold text-muted-foreground mb-3 text-center uppercase tracking-wider">Demo Access</p>
                    <Button
                      variant="outline"
                      className="w-full h-11 rounded-xl border-dashed border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-colors"
                      onClick={() => quickLogin("citizen")}
                    >
                      Login as <span className="font-bold ml-1 text-primary">Priya Sharma</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="staff">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="glass-card border-none overflow-hidden rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-secondary" />
                    Government Login
                  </CardTitle>
                  <CardDescription>
                    Manage civic reports and community responses.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="staff-email">Official Email</Label>
                    <Input
                      id="staff-email"
                      type="email"
                      placeholder="staff@gov.in"
                      className="rounded-xl h-11 bg-background/50 border-border/50 focus:border-secondary/50"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staff-password">Password</Label>
                    <Input
                      id="staff-password"
                      type="password"
                      placeholder="••••••••"
                      className="rounded-xl h-11 bg-background/50 border-border/50 focus:border-secondary/50"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full h-12 rounded-xl text-lg font-semibold shadow-lg hover:brightness-110 transition-all"
                    onClick={() => handleLogin("staff")}
                    disabled={isLoading}
                  >
                    {isLoading ? "Verifying..." : "Official Login"}
                  </Button>

                  <div className="pt-6 border-t border-border/30">
                    <p className="text-xs font-semibold text-muted-foreground mb-3 text-center uppercase tracking-wider">Demo Access</p>
                    <Button
                      variant="outline"
                      className="w-full h-11 rounded-xl border-dashed border-secondary/30 hover:bg-secondary/5 hover:border-secondary/50 transition-colors"
                      onClick={() => quickLogin("staff")}
                    >
                      Login as <span className="font-bold ml-1 text-secondary">Rajesh Kumar</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Footer info */}
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            New to Samvad?{" "}
            <button className="text-primary font-bold hover:underline transition-all">
              Create an account
            </button>
          </p>
          <div className="flex justify-center gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Help Center</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};