// Reference: Replit Auth integration blueprint
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Cases from "@/pages/cases";
import ImageForensics from "@/pages/evidence";
import AIDeepfake from "@/pages/modules/ai-deepfake";
import SocialMedia from "@/pages/modules/social-media";
import NetworkTraffic from "@/pages/modules/network-traffic";
import FaceRecognition from "@/pages/modules/face-recognition";
import MobileForensics from "@/pages/modules/mobile-forensics";
import VideoAnalysis from "@/pages/modules/video-analysis";
import AudioForensics from "@/pages/modules/audio-forensics";
import Steganography from "@/pages/modules/steganography";
import ModulePlaceholder from "@/pages/modules/module-placeholder";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

// Module placeholder configs
const moduleConfigs: Record<string, any> = {
  "video-analysis": {
    title: "Video/CCTV Analysis",
    description: "Frame-by-frame video analysis and enhancement",
    features: ["CCTV/DVR playback", "Frame extraction", "Video enhancement", "Metadata analysis"]
  },
  "audio-forensics": {
    title: "Audio Forensics",
    description: "Audio analysis, noise reduction, and speaker verification",
    features: ["Noise reduction", "Speaker verification", "Audio enhancement", "Waveform analysis"]
  },
  "steganography": {
    title: "Steganography Detection",
    description: "Hidden data scanner and detection",
    features: ["Hidden data detection", "LSB analysis", "File carving", "Data extraction"]
  },
  "email-forensics": {
    title: "Email Forensics",
    description: "Email header analysis and sender verification",
    features: ["Header analysis", "Sender verification", "Email threading", "Attachment analysis"]
  },
  "cdr-analysis": {
    title: "CDR/IPDR Analysis",
    description: "Communication logs analyzer",
    features: ["Call detail records", "IP detail records", "Pattern analysis", "Timeline visualization"]
  },
  "dark-web": {
    title: "Dark Web Investigation",
    description: "Dark web monitoring and investigation",
    features: ["Dark web crawling", "Threat monitoring", "Content analysis", "Link mapping"]
  },
  "browser-forensics": {
    title: "Web Browser Forensics",
    description: "Browser history and artifact analysis",
    features: ["History recovery", "Cache analysis", "Cookie examination", "Download tracking"]
  },
  "disk-forensics": {
    title: "Disk Forensics",
    description: "Deleted file recovery and disk imaging",
    features: ["File recovery", "Disk imaging", "Partition analysis", "File system examination"]
  },
  "drone-forensics": {
    title: "Drone Forensics",
    description: "Flight log, GPS, and media extraction",
    features: ["Flight log analysis", "GPS tracking", "Media extraction", "Metadata recovery"]
  },
  "vehicle-forensics": {
    title: "Vehicle Digital Forensics",
    description: "ECU, GPS, and infotainment system analysis",
    features: ["ECU data extraction", "GPS history", "Infotainment analysis", "Event logging"]
  },
  "gps-analysis": {
    title: "GPS Tracking & Location Analysis",
    description: "Location metadata analyzer",
    features: ["GPS coordinate parsing", "Route reconstruction", "Location clustering", "Timeline mapping"]
  },
  "banking-fraud": {
    title: "Banking Fraud Investigation",
    description: "UPI/IMPS/Card fraud detection",
    features: ["Transaction analysis", "Fraud pattern detection", "Account linking", "Risk scoring"]
  },
  "aml-ctf": {
    title: "AML/CTF Investigation",
    description: "Anti-money laundering and counter-terrorism financing",
    features: ["Transaction graph mapping", "Pattern analysis", "Risk assessment", "Compliance reporting"]
  },
  "blockchain": {
    title: "Blockchain Transaction Tracing",
    description: "Cryptocurrency transaction analysis",
    features: ["Wallet tracking", "Transaction flow", "Address clustering", "Exchange analysis"]
  },
  "financial-audit": {
    title: "Financial & Corporate Audit",
    description: "Corporate forensic audit module",
    features: ["Financial statement analysis", "Fraud detection", "Compliance checking", "Report generation"]
  },
  "osint": {
    title: "OSINT Intelligence Gathering",
    description: "Open source intelligence toolkit",
    features: ["Public data collection", "Social media monitoring", "Domain analysis", "Email verification"]
  },
  "document-forgery": {
    title: "Document Forgery Detection",
    description: "PDF/image authenticity verification",
    features: ["Document tampering detection", "Signature verification", "Font analysis", "Metadata examination"]
  },
  "e-discovery": {
    title: "E-Discovery & Legal Evidence",
    description: "Legal evidence management",
    features: ["Document collection", "Legal hold", "Review workflow", "Production management"]
  },
  "csam": {
    title: "CSAM/Child Abuse Investigation",
    description: "Case workflow controls",
    features: ["Evidence flagging", "Secure storage", "Automated detection", "Case tracking"]
  },
  "cloud-evidence": {
    title: "Cloud Evidence Acquisition",
    description: "AWS, GDrive, iCloud evidence collection",
    features: ["Cloud data extraction", "API integration", "Automated collection", "Chain-of-custody"]
  },
  "big-data": {
    title: "Big Data / PCAP Traffic Analyzer",
    description: "Large-scale data processing",
    features: ["PCAP processing", "Big data analytics", "Pattern detection", "Performance optimization"]
  },
  "field-acquisition": {
    title: "Cyber Forensics Van Integration",
    description: "Field acquisition module",
    features: ["Mobile data collection", "Field device imaging", "Remote analysis", "Offline capability"]
  },
  "malware-analysis": {
    title: "Malware Analysis",
    description: "Malware detection and analysis",
    features: ["Static analysis", "Behavior monitoring", "Signature detection", "Threat intelligence"]
  },
  "sandbox": {
    title: "Sandbox Environment",
    description: "Safe malware execution environment",
    features: ["Isolated execution", "Behavior analysis", "Network monitoring", "Report generation"]
  },
  "password-recovery": {
    title: "Password & Encryption Recovery",
    description: "Password recovery toolkit",
    features: ["Hash cracking", "Password recovery", "Encryption analysis", "Brute force tools"]
  },
  "security-audit": {
    title: "Information System Security Audit",
    description: "Security audit panel",
    features: ["Vulnerability scanning", "Compliance checking", "Penetration testing", "Risk assessment"]
  }
};

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Login} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/cases" component={Cases} />
      <Route path="/evidence" component={ImageForensics} />
      
      {/* Implemented Modules */}
      <Route path="/modules/image-forensics" component={ImageForensics} />
      <Route path="/modules/ai-deepfake" component={AIDeepfake} />
      <Route path="/modules/video-analysis" component={VideoAnalysis} />
      <Route path="/modules/audio-forensics" component={AudioForensics} />
      <Route path="/modules/steganography" component={Steganography} />
      <Route path="/modules/social-media" component={SocialMedia} />
      <Route path="/modules/network-traffic" component={NetworkTraffic} />
      <Route path="/modules/face-recognition" component={FaceRecognition} />
      <Route path="/modules/mobile-forensics" component={MobileForensics} />
      
      {/* Dynamic placeholder for other modules */}
      <Route path="/modules/:module">
        {(params) => {
          const config = moduleConfigs[params.module];
          if (config) {
            return <ModulePlaceholder {...config} />;
          }
          return <Dashboard />;
        }}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  // Custom sidebar width for forensics application
  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  if (isLoading || !isAuthenticated) {
    return <Router />;
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-border px-4">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await fetch("/api/logout", { method: "POST" });
                  window.location.href = "/";
                }}
                data-testid="button-logout"
              >
                <LogOut className="mr-1 h-4 w-4" />
                Logout
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <Router />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <TooltipProvider>
      <AppContent />
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
