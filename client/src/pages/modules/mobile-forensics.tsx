import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  MessageSquare, 
  Phone, 
  Image, 
  MapPin, 
  Calendar,
  Database as DatabaseIcon
} from "lucide-react";

export default function MobileForensics() {
  const deviceInfo = {
    device: "Apple iPhone 14 Pro",
    os: "iOS 17.2.1",
    imei: "356728114726824",
    serialNumber: "F2LXH7XKPN83",
    carrier: "AT&T",
    lastBackup: "2025-01-18 23:15:42",
  };

  const appData = [
    { app: "WhatsApp", messages: 4523, media: 1247, databases: 3 },
    { app: "Instagram", messages: 892, media: 3421, databases: 2 },
    { app: "Telegram", messages: 2341, media: 876, databases: 4 },
    { app: "Signal", messages: 156, media: 45, databases: 2 },
  ];

  const recentActivities = [
    { type: "Call", contact: "+1 (555) 123-4567", time: "2025-01-20 14:23", duration: "4:32" },
    { type: "SMS", contact: "+1 (555) 987-6543", time: "2025-01-20 13:45", duration: null },
    { type: "Location", contact: "Golden Gate Park, SF", time: "2025-01-20 12:00", duration: null },
    { type: "Photo", contact: "Camera", time: "2025-01-20 11:30", duration: null },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold">Mobile Forensics & App Storage</h1>
        <p className="text-muted-foreground">
          Comprehensive mobile device analysis, app data extraction, and SQLite database viewer
        </p>
      </div>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Device Information</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Device Model</p>
            <p className="font-medium">{deviceInfo.device}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Operating System</p>
            <p className="font-medium">{deviceInfo.os}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">IMEI</p>
            <p className="font-medium font-mono text-sm">{deviceInfo.imei}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Serial Number</p>
            <p className="font-medium font-mono text-sm">{deviceInfo.serialNumber}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Carrier</p>
            <p className="font-medium">{deviceInfo.carrier}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Last Backup</p>
            <p className="font-medium">{deviceInfo.lastBackup}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Application Data</h3>
        <div className="space-y-3">
          {appData.map((app) => (
            <div
              key={app.app}
              className="rounded-lg border border-border p-4 hover-elevate cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold">{app.app}</h4>
                </div>
                <Badge variant="secondary">{app.databases} databases</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Messages</p>
                  <p className="font-medium">{app.messages.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Media Files</p>
                  <p className="font-medium">{app.media.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Database Size</p>
                  <p className="font-medium">{(Math.random() * 100 + 20).toFixed(1)} MB</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Recent Activities</h3>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-4 rounded-lg border border-border p-3 hover-elevate"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-1/10">
                {activity.type === "Call" && <Phone className="h-4 w-4 text-chart-1" />}
                {activity.type === "SMS" && <MessageSquare className="h-4 w-4 text-chart-2" />}
                {activity.type === "Location" && <MapPin className="h-4 w-4 text-chart-3" />}
                {activity.type === "Photo" && <Image className="h-4 w-4 text-chart-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">{activity.type}</Badge>
                  {activity.duration && (
                    <span className="text-xs text-muted-foreground">Duration: {activity.duration}</span>
                  )}
                </div>
                <p className="text-sm font-medium">{activity.contact}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
