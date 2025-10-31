import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Image as ImageIcon, 
  Hash, 
  MapPin, 
  Calendar, 
  Camera,
  CheckCircle2,
  AlertTriangle,
  FileImage
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ImageForensics() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      setResults(null);
    }
  };

  const simulateAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResults({
        sha256: "a3c4f5e2b1d8c9f7e6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3",
        fileSize: "2.4 MB",
        dimensions: "3024 x 4032",
        format: "JPEG",
        tamperingScore: 12,
        tampered: false,
        metadata: {
          camera: "Apple iPhone 14 Pro",
          dateTaken: "2025-01-15 14:23:45",
          gpsLocation: "37.7749°N, 122.4194°W",
          software: "iOS 17.2.1",
          fNumber: "f/1.78",
          iso: "ISO 64",
          exposureTime: "1/120s",
        },
      });
      setAnalyzing(false);
      toast({
        title: "Analysis Complete",
        description: "Image forensic analysis completed successfully",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Image Forensics</h1>
        <p className="text-muted-foreground">
          EXIF metadata extraction, tampering detection, and hash verification
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Upload Image for Analysis</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              {preview ? (
                <div className="relative w-full">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-96 w-full rounded-lg object-contain border border-border"
                  />
                </div>
              ) : (
                <label className="flex min-h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border hover-elevate active-elevate-2">
                  <FileImage className="mb-3 h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, JPEG up to 10MB
                  </p>
                  <Input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    data-testid="input-image-upload"
                  />
                </label>
              )}
            </div>

            {selectedFile && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected File:</p>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm font-mono">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              {selectedFile && !results && (
                <Button
                  onClick={simulateAnalysis}
                  disabled={analyzing}
                  className="flex-1"
                  data-testid="button-analyze"
                >
                  {analyzing ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-1 h-4 w-4" />
                      Analyze Image
                    </>
                  )}
                </Button>
              )}
              {selectedFile && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                    setResults(null);
                  }}
                  data-testid="button-clear"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Results Section */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Analysis Results</h3>
          
          {!results ? (
            <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed border-border">
              <ImageIcon className="mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Upload and analyze an image to see results
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Tampering Status */}
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Tampering Detection</span>
                  {results.tampered ? (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Tampered
                    </Badge>
                  ) : (
                    <Badge className="gap-1 bg-chart-4/10 text-chart-4">
                      <CheckCircle2 className="h-3 w-3" />
                      Authentic
                    </Badge>
                  )}
                </div>
                <div className="mt-2">
                  <div className="text-xs text-muted-foreground">
                    Confidence Score: {100 - results.tamperingScore}%
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-chart-4"
                      style={{ width: `${100 - results.tamperingScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Hash Verification */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">SHA-256 Hash</span>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="break-all font-mono text-xs" data-testid="text-sha256">
                    {results.sha256}
                  </p>
                </div>
              </div>

              {/* File Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">File Size</p>
                  <p className="font-medium">{results.fileSize}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Dimensions</p>
                  <p className="font-medium">{results.dimensions}</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* EXIF Metadata */}
      {results && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">EXIF Metadata</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Camera className="h-4 w-4" />
                <span className="text-sm">Camera</span>
              </div>
              <p className="font-medium">{results.metadata.camera}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Date Taken</span>
              </div>
              <p className="font-medium">{results.metadata.dateTaken}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">GPS Location</span>
              </div>
              <p className="font-medium">{results.metadata.gpsLocation}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Software</p>
              <p className="font-medium">{results.metadata.software}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">F-Number</p>
              <p className="font-medium">{results.metadata.fNumber}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">ISO</p>
              <p className="font-medium">{results.metadata.iso}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Exposure Time</p>
              <p className="font-medium">{results.metadata.exposureTime}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
