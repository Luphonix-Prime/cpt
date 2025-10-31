import {
  Shield,
  FileText,
  Image,
  Smartphone,
  Network,
  Mail,
  Search,
  UserCircle,
  FileWarning,
  Database,
  Lock,
  Globe,
  Plane,
  Car,
  MapPin,
  Mic,
  Video,
  HardDrive,
  Cloud,
  Bitcoin,
  AlertTriangle,
  Brain,
  ScanEye,
  Fingerprint,
  Radio,
  Bug,
  Users,
  TrendingUp,
  Truck,
  FileCheck,
  Folder,
  BarChart3,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const moduleCategories = [
  {
    category: "AI & Media Analysis",
    modules: [
      { title: "AI/Deepfake Detection", url: "/modules/ai-deepfake", icon: Brain },
      { title: "Image Forensics", url: "/modules/image-forensics", icon: Image },
      { title: "Video/CCTV Analysis", url: "/modules/video-analysis", icon: Video },
      { title: "Audio Forensics", url: "/modules/audio-forensics", icon: Mic },
      { title: "Steganography Detection", url: "/modules/steganography", icon: ScanEye },
    ],
  },
  {
    category: "Network & Communications",
    modules: [
      { title: "Network Traffic Analysis", url: "/modules/network-traffic", icon: Network },
      { title: "Email Forensics", url: "/modules/email-forensics", icon: Mail },
      { title: "CDR/IPDR Analysis", url: "/modules/cdr-analysis", icon: Radio },
      { title: "Dark Web Investigation", url: "/modules/dark-web", icon: Globe },
      { title: "Browser Forensics", url: "/modules/browser-forensics", icon: Search },
    ],
  },
  {
    category: "Device & Hardware",
    modules: [
      { title: "Mobile Forensics", url: "/modules/mobile-forensics", icon: Smartphone },
      { title: "Disk Forensics", url: "/modules/disk-forensics", icon: HardDrive },
      { title: "Drone Forensics", url: "/modules/drone-forensics", icon: Plane },
      { title: "Vehicle Forensics", url: "/modules/vehicle-forensics", icon: Car },
      { title: "GPS Analysis", url: "/modules/gps-analysis", icon: MapPin },
    ],
  },
  {
    category: "Financial & Fraud",
    modules: [
      { title: "Banking Fraud Investigation", url: "/modules/banking-fraud", icon: TrendingUp },
      { title: "AML/CTF Investigation", url: "/modules/aml-ctf", icon: BarChart3 },
      { title: "Blockchain Tracing", url: "/modules/blockchain", icon: Bitcoin },
      { title: "Financial Audit", url: "/modules/financial-audit", icon: FileCheck },
    ],
  },
  {
    category: "Social & OSINT",
    modules: [
      { title: "Social Media Forensics", url: "/modules/social-media", icon: Users },
      { title: "OSINT Intelligence", url: "/modules/osint", icon: Search },
      { title: "Face Recognition", url: "/modules/face-recognition", icon: Fingerprint },
      { title: "Document Forgery Detection", url: "/modules/document-forgery", icon: FileWarning },
    ],
  },
  {
    category: "Security & Malware",
    modules: [
      { title: "Malware Analysis", url: "/modules/malware-analysis", icon: Bug },
      { title: "Sandbox Environment", url: "/modules/sandbox", icon: Shield },
      { title: "Password Recovery", url: "/modules/password-recovery", icon: Lock },
      { title: "Security Audit", url: "/modules/security-audit", icon: AlertTriangle },
    ],
  },
  {
    category: "Case Management",
    modules: [
      { title: "Case Management", url: "/cases", icon: Folder },
      { title: "Evidence Management", url: "/evidence", icon: Database },
      { title: "E-Discovery", url: "/modules/e-discovery", icon: FileText },
      { title: "CSAM Controls", url: "/modules/csam", icon: AlertTriangle },
    ],
  },
  {
    category: "Data & Cloud",
    modules: [
      { title: "Cloud Evidence", url: "/modules/cloud-evidence", icon: Cloud },
      { title: "Big Data Analysis", url: "/modules/big-data", icon: Database },
      { title: "Field Acquisition", url: "/modules/field-acquisition", icon: Truck },
    ],
  },
];

export function AppSidebar() {
  const { user } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">CPT</h2>
            <p className="text-xs text-muted-foreground">Forensics Platform</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {moduleCategories.map((category) => (
          <Collapsible key={category.category} defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full items-center justify-between hover-elevate active-elevate-2 rounded-md px-2">
                  <span className="text-xs font-medium">{category.category}</span>
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {category.modules.map((module) => (
                      <SidebarMenuItem key={module.title}>
                        <SidebarMenuButton asChild data-testid={`sidebar-${module.url}`}>
                          <a href={module.url}>
                            <module.icon className="h-4 w-4" />
                            <span className="text-sm">{module.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {user && (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.profileImageUrl || undefined} />
              <AvatarFallback>
                {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" data-testid="text-user-name">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.email}
              </p>
              <Badge variant="secondary" className="text-xs capitalize">
                {user.role}
              </Badge>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
