import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { 
  FileText, 
  Database, 
  Activity, 
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const kpiCards = [
    {
      title: "Active Cases",
      value: stats?.activeCases || 0,
      icon: FileText,
      trend: "+12%",
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Evidence Items",
      value: stats?.evidenceCount || 0,
      icon: Database,
      trend: "+8%",
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Active Analyses",
      value: stats?.activeAnalyses || 0,
      icon: Activity,
      trend: "+15%",
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Completed This Month",
      value: stats?.completedCases || 0,
      icon: CheckCircle2,
      trend: "+24%",
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ];

  const casesByStatus = [
    { name: "Open", value: 12, color: "hsl(var(--chart-1))" },
    { name: "In Progress", value: 28, color: "hsl(var(--chart-2))" },
    { name: "Under Review", value: 15, color: "hsl(var(--chart-3))" },
    { name: "Closed", value: 45, color: "hsl(var(--chart-4))" },
  ];

  const moduleUsage = [
    { module: "Image Forensics", count: 42 },
    { module: "Mobile Analysis", count: 38 },
    { module: "Network Traffic", count: 31 },
    { module: "Email Forensics", count: 28 },
    { module: "Social Media", count: 24 },
    { module: "Face Recognition", count: 19 },
  ];

  const weeklyActivity = [
    { day: "Mon", cases: 12, evidence: 24 },
    { day: "Tue", cases: 18, evidence: 32 },
    { day: "Wed", cases: 15, evidence: 28 },
    { day: "Thu", cases: 22, evidence: 38 },
    { day: "Fri", cases: 19, evidence: 35 },
    { day: "Sat", cases: 8, evidence: 15 },
    { day: "Sun", cases: 6, evidence: 12 },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-32 animate-pulse bg-card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Investigation Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time overview of forensic investigations and analysis
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => (
          <Card key={card.title} className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold" data-testid={`stat-${card.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    {card.value}
                  </p>
                  <span className="text-xs text-chart-4">{card.trend}</span>
                </div>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Activity */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Weekly Activity</h3>
            <TrendingUp className="h-5 w-5 text-chart-4" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="cases"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                name="Cases"
              />
              <Line
                type="monotone"
                dataKey="evidence"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                name="Evidence"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Cases by Status */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Cases by Status</h3>
            <Activity className="h-5 w-5 text-chart-3" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={casesByStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {casesByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {casesByStatus.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Module Usage */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Module Usage (This Week)</h3>
          <Users className="h-5 w-5 text-chart-1" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={moduleUsage}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="module"
              stroke="hsl(var(--muted-foreground))"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <Clock className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-3">
          {[
            {
              action: "New evidence uploaded",
              case: "CASE-2025-0042",
              user: "Sarah Chen",
              time: "2 minutes ago",
              icon: Database,
            },
            {
              action: "Analysis completed",
              case: "CASE-2025-0041",
              user: "Michael Brown",
              time: "15 minutes ago",
              icon: CheckCircle2,
            },
            {
              action: "Case status updated",
              case: "CASE-2025-0039",
              user: "Jessica Park",
              time: "1 hour ago",
              icon: FileText,
            },
            {
              action: "High priority alert",
              case: "CASE-2025-0038",
              user: "System",
              time: "2 hours ago",
              icon: AlertTriangle,
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-4 rounded-lg border border-border p-3 hover-elevate"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <activity.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.case} • {activity.user}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
