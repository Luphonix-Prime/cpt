import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, Upload, FileImage, CheckCircle2 } from "lucide-react";

export default function FaceRecognition() {
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const simulateAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResults({
        facesDetected: 3,
        matches: [
          {
            name: "John Smith",
            confidence: 94,
            caseReference: "CASE-2024-0087",
            lastSeen: "2024-12-15",
          },
          {
            name: "Unknown Person #1",
            confidence: 0,
            caseReference: null,
            lastSeen: null,
          },
          {
            name: "Unknown Person #2",
            confidence: 0,
            caseReference: null,
            lastSeen: null,
          },
        ],
        quality: {
          resolution: "High",
          lighting: "Good",
          angle: "Frontal",
        },
      });
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold">Face Recognition & Comparison</h1>
        <p className="text-muted-foreground">
          Advanced facial recognition, matching, and database comparison
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
            <Fingerprint className="h-5 w-5 text-primary" />
            Upload Image for Recognition
          </h3>
          
          <label className="flex min-h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border hover-elevate active-elevate-2">
            <FileImage className="mb-3 h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click to upload image containing faces
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG up to 10MB
            </p>
          </label>

          <div className="mt-4 flex gap-2">
            <Button
              onClick={simulateAnalysis}
              disabled={analyzing}
              className="flex-1"
              data-testid="button-analyze-faces"
            >
              {analyzing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Upload className="mr-1 h-4 w-4" />
                  Analyze Faces
                </>
              )}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Recognition Results</h3>
          
          {!results ? (
            <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed border-border">
              <Fingerprint className="mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Upload image to begin facial recognition
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Faces Detected</span>
                  <Badge>{results.facesDetected}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div>
                    <p>Resolution</p>
                    <p className="font-medium text-foreground">{results.quality.resolution}</p>
                  </div>
                  <div>
                    <p>Lighting</p>
                    <p className="font-medium text-foreground">{results.quality.lighting}</p>
                  </div>
                  <div>
                    <p>Angle</p>
                    <p className="font-medium text-foreground">{results.quality.angle}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {results && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Database Matches</h3>
          <div className="space-y-3">
            {results.matches.map((match: any, index: number) => (
              <div
                key={index}
                className="rounded-lg border border-border p-4 hover-elevate"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{match.name}</h4>
                      {match.confidence > 0 && (
                        <Badge className="bg-chart-4/10 text-chart-4">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Match Found
                        </Badge>
                      )}
                    </div>
                    {match.caseReference && (
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Case: {match.caseReference}</p>
                        <p>Last Seen: {match.lastSeen}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {match.confidence}%
                    </div>
                    <div className="text-xs text-muted-foreground">Confidence</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full ${
                        match.confidence > 80
                          ? "bg-chart-4"
                          : match.confidence > 0
                          ? "bg-chart-3"
                          : "bg-muted-foreground"
                      }`}
                      style={{ width: `${match.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
