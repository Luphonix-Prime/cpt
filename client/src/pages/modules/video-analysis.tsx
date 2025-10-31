
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Upload, Play, Pause, SkipForward, Download } from "lucide-react";

export default function VideoAnalysis() {
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 2000);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Video className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Video/CCTV Analysis</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Video
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop video files or click to browse
              </p>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Select Video File
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Supported Formats:</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">MP4</Badge>
                <Badge variant="secondary">AVI</Badge>
                <Badge variant="secondary">MOV</Badge>
                <Badge variant="secondary">MKV</Badge>
                <Badge variant="secondary">CCTV DVR</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4 text-primary" />
              <span className="text-sm">Frame-by-frame playback</span>
            </div>
            <div className="flex items-center gap-2">
              <SkipForward className="h-4 w-4 text-primary" />
              <span className="text-sm">Frame extraction</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-primary" />
              <span className="text-sm">Video enhancement</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-primary" />
              <span className="text-sm">Metadata analysis</span>
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? "Analyzing..." : "Start Analysis"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Video Player</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Video className="h-16 w-16 mx-auto mb-4" />
              <p>Upload a video to begin analysis</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm">
              <Play className="h-4 w-4 mr-2" />
              Play
            </Button>
            <Button variant="outline" size="sm">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
            <Button variant="outline" size="sm">
              <SkipForward className="h-4 w-4 mr-2" />
              Next Frame
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
