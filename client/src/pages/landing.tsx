import { Button } from "@/components/ui/button";
import { Shield, Lock, FileCheck, Users, Database, TrendingUp } from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Shield,
      title: "36 Forensic Modules",
      description: "Comprehensive suite of specialized investigation tools",
    },
    {
      icon: Lock,
      title: "Chain-of-Custody",
      description: "Complete evidence tracking with SHA-256 verification",
    },
    {
      icon: FileCheck,
      title: "Audit Compliance",
      description: "Full audit trail for legal proceedings",
    },
    {
      icon: Users,
      title: "Role-Based Access",
      description: "Secure access control for your entire team",
    },
    {
      icon: Database,
      title: "Case Management",
      description: "Organize and track investigations efficiently",
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "AI-powered insights and visualizations",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        
        <div className="relative">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="flex flex-col items-center text-center">
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
                <Shield className="h-12 w-12 text-primary-foreground" />
              </div>
              
              <h1 className="mb-4 text-4xl font-semibold md:text-5xl lg:text-6xl">
                CPT Digital Forensics Platform
              </h1>
              
              <p className="mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
                Comprehensive investigation platform for law enforcement, cyber cells, and security agencies.
                Advanced forensic analysis with complete chain-of-custody tracking.
              </p>
              
              <Button
                size="lg"
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-login"
                className="h-12 px-8 text-base"
              >
                Sign In to Platform
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold">Platform Features</h2>
          <p className="text-muted-foreground">
            Professional-grade tools for digital investigation and forensic analysis
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-border bg-card p-6 hover-elevate"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Module Categories */}
      <div className="border-t border-border bg-card/50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-semibold">Investigation Modules</h2>
            <p className="text-muted-foreground">
              Specialized tools for every aspect of digital forensics
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              "AI & Media Analysis",
              "Network & Communications",
              "Device & Hardware",
              "Financial & Fraud",
              "Social & OSINT",
              "Security & Malware",
              "Case Management",
              "Data & Cloud",
            ].map((category) => (
              <div
                key={category}
                className="rounded-lg border border-border bg-background p-4 text-center"
              >
                <p className="font-medium">{category}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 CPT Digital Forensics Platform. All rights reserved.</p>
          <p className="mt-2">Secure • Compliant • Professional</p>
        </div>
      </div>
    </div>
  );
}
