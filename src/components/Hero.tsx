import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Shield, Zap, ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-civic.jpg";

interface HeroProps {
  onNavigate: (page: string) => void;
}

export const Hero = ({ onNavigate }: HeroProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-left max-w-2xl">
            {/* Logo Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-1.5 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-semibold text-primary">Samvad Civic Connect</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]"
            >
              Empowering <br />
              <span className="text-gradient">Citizen Voices</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed"
            >
              Bridge the gap between you and your local government. Report issues,
              track resolutions in real-time, and build a smarter, safer community
              together.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Button
                size="lg"
                onClick={() => onNavigate("login")}
                className="h-14 px-8 text-lg rounded-full shadow-civic hover-lift group"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => onNavigate("login")}
                className="h-14 px-8 text-lg rounded-full backdrop-blur-sm hover-lift"
              >
                Watch Demo
                <Play className="ml-2 h-4 w-4 fill-current" />
              </Button>
            </motion.div>

            {/* Stats/Social Proof */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-8 pt-4 border-t border-border/50"
            >
              <div>
                <p className="text-2xl font-bold">10k+</p>
                <p className="text-sm text-muted-foreground">Active Citizens</p>
              </div>
              <div className="w-px h-10 bg-border/50"></div>
              <div>
                <p className="text-2xl font-bold">95%</p>
                <p className="text-sm text-muted-foreground">Resolution Rate</p>
              </div>
              <div className="w-px h-10 bg-border/50"></div>
              <div>
                <p className="text-2xl font-bold">24h</p>
                <p className="text-sm text-muted-foreground">Avg Response</p>
              </div>
            </motion.div>
          </div>

          {/* Right Side Visuals */}
          <motion.div
            variants={itemVariants}
            className="relative lg:block hidden"
          >
            <div className="relative z-10 glass-card rounded-3xl overflow-hidden p-2 aspect-square max-w-[500px] ml-auto">
              <img
                src={heroImage}
                alt="Civic Interaction"
                className="w-full h-full object-cover rounded-2xl"
              />
              {/* Floating Cards */}
              <motion.div
                className="absolute -left-12 top-1/4 glass-card p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-[200px]"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                  <Zap className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xs font-bold">Issue Resolved</p>
                  <p className="text-[10px] text-muted-foreground">2 mins ago</p>
                </div>
              </motion.div>

              <motion.div
                className="absolute -right-8 bottom-1/4 glass-card p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-[200px]"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold">AI Verified</p>
                  <p className="text-[10px] text-muted-foreground">Security Check OK</p>
                </div>
              </motion.div>
            </div>
            {/* Background Decorative Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-primary/10 rounded-full z-0"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-secondary/5 rounded-full z-0"></div>
          </motion.div>
        </motion.div>

        {/* Feature Grid Below */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-32"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="glass-card hover-lift p-8 rounded-3xl group">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Instant Reporting</h3>
            <p className="text-muted-foreground leading-relaxed">
              Snap a photo, describe the issue, and submit. Our AI handles the rest, ensuring it reaches the right department.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card hover-lift p-8 rounded-3xl group">
            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="h-7 w-7 text-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Transparent Tracking</h3>
            <p className="text-muted-foreground leading-relaxed">
              Stay in the loop with real-time status updates and direct communication with government officials.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card hover-lift p-8 rounded-3xl group sm:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="h-7 w-7 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">Community Impact</h3>
            <p className="text-muted-foreground leading-relaxed">
              Join thousands of citizens making their city better. Your voice matters in building a more livable environment.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};