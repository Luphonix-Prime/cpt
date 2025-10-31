import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Search, ExternalLink, Calendar, MapPin, Link as LinkIcon } from "lucide-react";

export default function SocialMedia() {
  const [profileUrl, setProfileUrl] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any>(null);

  const simulateSearch = () => {
    setSearching(true);
    setTimeout(() => {
      setResults({
        platform: "Twitter/X",
        username: "@example_user",
        displayName: "Example User",
        verified: false,
        followers: 1247,
        following: 892,
        posts: 3456,
        joined: "March 2020",
        location: "San Francisco, CA",
        bio: "Digital forensics investigator | Technology enthusiast | Photography lover",
        recentPosts: [
          { date: "2025-01-20", content: "Just finished analyzing...", engagement: 45 },
          { date: "2025-01-19", content: "Interesting case today...", engagement: 89 },
          { date: "2025-01-18", content: "New tools for investigation...", engagement: 123 },
        ],
        connections: [
          { name: "Related User 1", type: "Frequent interaction" },
          { name: "Related User 2", type: "Mentioned often" },
          { name: "Related User 3", type: "Shared content" },
        ],
      });
      setSearching(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Social Media Forensics</h1>
        <p className="text-muted-foreground">
          Profile data extraction, timeline visualization, and relationship mapping
        </p>
      </div>

      {/* Search Section */}
      <Card className="p-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Enter social media profile URL..."
              className="pl-9"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              data-testid="input-profile-url"
            />
          </div>
          <Button
            onClick={simulateSearch}
            disabled={!profileUrl || searching}
            data-testid="button-analyze-profile"
          >
            {searching ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-1 h-4 w-4" />
                Analyze Profile
              </>
            )}
          </Button>
        </div>
      </Card>

      {results && (
        <>
          {/* Profile Overview */}
          <Card className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-semibold">{results.displayName}</h3>
                <p className="text-muted-foreground">{results.username}</p>
              </div>
              {results.verified && (
                <Badge className="bg-chart-1/10 text-chart-1">Verified</Badge>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border p-4 text-center">
                <p className="text-2xl font-bold">{results.followers.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div className="rounded-lg border border-border p-4 text-center">
                <p className="text-2xl font-bold">{results.following.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
              <div className="rounded-lg border border-border p-4 text-center">
                <p className="text-2xl font-bold">{results.posts.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Posts</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {results.joined}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{results.location}</span>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-muted p-3">
              <p className="text-sm">{results.bio}</p>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
              <div className="space-y-3">
                {results.recentPosts.map((post: any, index: number) => (
                  <div
                    key={index}
                    className="rounded-lg border border-border p-3 hover-elevate"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                      <Badge variant="secondary" className="text-xs">
                        {post.engagement} interactions
                      </Badge>
                    </div>
                    <p className="text-sm">{post.content}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Connections */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Key Connections</h3>
              <div className="space-y-3">
                {results.connections.map((connection: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border p-3 hover-elevate"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{connection.name}</p>
                        <p className="text-xs text-muted-foreground">{connection.type}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}

      {!results && (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <Users className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No Profile Data</h3>
          <p className="text-sm text-muted-foreground">
            Enter a social media profile URL to begin analysis
          </p>
        </Card>
      )}
    </div>
  );
}
