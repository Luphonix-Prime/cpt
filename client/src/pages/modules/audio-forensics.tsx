
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Upload, Play, Pause, Volume2, Download } from "lucide-react";

export default function AudioForensics() {
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 2000);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Mic className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Audio Forensics</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Audio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Mic className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop audio files or click to browse
              </p>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Select Audio File
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Supported Formats:</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">MP3</Badge>
                <Badge variant="secondary">WAV</Badge>
                <Badge variant="secondary">M4A</Badge>
                <Badge variant="secondary">FLAC</Badge>
                <Badge variant="secondary">AAC</Badge>
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
              <Volume2 className="h-4 w-4 text-primary" />
              <span className="text-sm">Noise reduction</span>
            </div>
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-primary" />
              <span className="text-sm">Speaker verification</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-primary" />
              <span className="text-sm">Audio enhancement</span>
            </div>
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4 text-primary" />
              <span className="text-sm">Waveform analysis</span>
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
          <CardTitle>Audio Waveform</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Mic className="h-16 w-16 mx-auto mb-4" />
              <p>Upload an audio file to view waveform</p>
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
              <Volume2 className="h-4 w-4 mr-2" />
              Enhance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
