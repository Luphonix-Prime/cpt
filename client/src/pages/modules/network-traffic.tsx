import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Network, Upload, FileText } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function NetworkTraffic() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const simulateAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResults({
        totalPackets: 45672,
        protocols: [
          { name: "HTTP", value: 15234, color: "hsl(var(--chart-1))" },
          { name: "HTTPS", value: 12456, color: "hsl(var(--chart-2))" },
          { name: "DNS", value: 8901, color: "hsl(var(--chart-3))" },
          { name: "TCP", value: 5678, color: "hsl(var(--chart-4))" },
          { name: "UDP", value: 3403, color: "hsl(var(--chart-5))" },
        ],
        topConnections: [
          { ip: "192.168.1.100", packets: 8234, type: "Internal" },
          { ip: "8.8.8.8", packets: 6543, type: "DNS Server" },
          { ip: "172.217.14.206", packets: 5432, type: "Google" },
          { ip: "151.101.1.140", packets: 4321, type: "CDN" },
        ],
        suspiciousActivity: [
          { type: "Port Scan Detected", severity: "High", count: 12 },
          { type: "Unusual Traffic Pattern", severity: "Medium", count: 5 },
          { type: "Unknown Protocol", severity: "Low", count: 3 },
        ],
      });
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold">Network Traffic Analyzer</h1>
        <p className="text-muted-foreground">
          PCAP file analysis, protocol breakdown, and traffic visualization
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Upload PCAP File</h3>
            <p className="text-sm text-muted-foreground">
              Upload network capture files for analysis
            </p>
          </div>
          <Button
            onClick={simulateAnalysis}
            disabled={analyzing}
            data-testid="button-analyze-pcap"
          >
            {analyzing ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Analyzing...
              </>
            ) : (
              <>
                <Upload className="mr-1 h-4 w-4" />
                {results ? "Re-analyze" : "Analyze Sample"}
              </>
            )}
          </Button>
        </div>
      </Card>

      {results && (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Packets</p>
                  <p className="text-3xl font-bold">{results.totalPackets.toLocaleString()}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/10">
                  <Network className="h-6 w-6 text-chart-1" />
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Protocols</p>
                  <p className="text-3xl font-bold">{results.protocols.length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                  <FileText className="h-6 w-6 text-chart-2" />
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Alerts</p>
                  <p className="text-3xl font-bold text-destructive">
                    {results.suspiciousActivity.reduce((acc: number, item: any) => acc + item.count, 0)}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                  <Network className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Protocol Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={results.protocols}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label
                  >
                    {results.protocols.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {results.protocols.map((protocol: any) => (
                  <div key={protocol.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: protocol.color }} />
                    <span className="text-sm">{protocol.name}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Top Connections</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={results.topConnections}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="ip" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Bar dataKey="packets" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Suspicious Activity</h3>
            <div className="space-y-3">
              {results.suspiciousActivity.map((activity: any, index: number) => (
                <div key={index} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <Badge variant={activity.severity === "High" ? "destructive" : "secondary"}>
                      {activity.severity}
                    </Badge>
                    <span className="text-sm font-medium">{activity.type}</span>
                  </div>
                  <Badge variant="outline">{activity.count} occurrences</Badge>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
