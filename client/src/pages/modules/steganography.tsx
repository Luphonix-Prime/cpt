
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Upload, Search, FileWarning, Download } from "lucide-react";

export default function Steganography() {
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 2000);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Eye className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Steganography Detection</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload File
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <FileWarning className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop files or click to browse
              </p>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Select File
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Supported Files:</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Images</Badge>
                <Badge variant="secondary">Audio</Badge>
                <Badge variant="secondary">Video</Badge>
                <Badge variant="secondary">Documents</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detection Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              <span className="text-sm">Hidden data detection</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              <span className="text-sm">LSB analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <FileWarning className="h-4 w-4 text-primary" />
              <span className="text-sm">File carving</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-primary" />
              <span className="text-sm">Data extraction</span>
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? "Scanning..." : "Start Scan"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scan Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Eye className="h-16 w-16 mx-auto mb-4" />
                <p>Upload a file to scan for hidden data</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Files Scanned</p>
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Hidden Data Found</p>
              </div>
              <div>
                <p className="text-2xl font-bold">0%</p>
                <p className="text-sm text-muted-foreground">Confidence</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
