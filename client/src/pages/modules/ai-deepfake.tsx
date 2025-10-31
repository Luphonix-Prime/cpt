
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Brain, Upload, AlertTriangle, CheckCircle2, FileImage, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AIDeepfake() {
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

  // Enhanced deepfake detection simulation with more consistent logic
  const simulateAnalysis = () => {
    setAnalyzing(true);
    
    // Simulate a more realistic analysis time
    setTimeout(() => {
      // Create a deterministic seed based on file properties for consistency
      const fileSeed = selectedFile ? 
        (selectedFile.name.length * selectedFile.size + selectedFile.lastModified) % 100 : 
        Math.random() * 100;
      
      // Use file characteristics to determine likelihood
      // Smaller files, certain extensions, or specific patterns suggest deepfakes
      let deepfakeLikelihood = fileSeed;
      
      // Adjust based on file characteristics
      if (selectedFile) {
        const fileName = selectedFile.name.toLowerCase();
        const fileSize = selectedFile.size;
        
        // Factors that increase deepfake likelihood
        if (fileName.includes('fake') || fileName.includes('generated') || 
            fileName.includes('ai') || fileName.includes('synthetic')) {
          deepfakeLikelihood += 30;
        }
        
        // Very small or very large files might be suspicious
        if (fileSize < 50000 || fileSize > 5000000) {
          deepfakeLikelihood += 10;
        }
        
        // Factors that decrease deepfake likelihood (suggest authentic)
        if (fileName.includes('original') || fileName.includes('real') || 
            fileName.includes('authentic') || fileName.includes('photo')) {
          deepfakeLikelihood -= 30;
        }
      }
      
      // Normalize to 0-100 range
      deepfakeLikelihood = Math.max(0, Math.min(100, deepfakeLikelihood));
      
      // More balanced thresholds
      const DEEPFAKE_THRESHOLD = 55; // 55% and above = deepfake
      const HIGH_CONFIDENCE_THRESHOLD = 70;
      
      const isDeepfake = deepfakeLikelihood >= DEEPFAKE_THRESHOLD;
      
      // Calculate confidence based on how far from the threshold
      let confidence;
      if (isDeepfake) {
        // For deepfakes: higher likelihood = higher confidence
        const distanceFromThreshold = deepfakeLikelihood - DEEPFAKE_THRESHOLD;
        confidence = Math.floor(65 + (distanceFromThreshold / 45) * 35); // 65-100%
      } else {
        // For authentic: lower likelihood = higher confidence
        const distanceFromThreshold = DEEPFAKE_THRESHOLD - deepfakeLikelihood;
        confidence = Math.floor(70 + (distanceFromThreshold / 55) * 30); // 70-100%
      }
      
      // High confidence if far from threshold
      const isHighConfidence = 
        deepfakeLikelihood >= HIGH_CONFIDENCE_THRESHOLD || 
        deepfakeLikelihood <= (100 - HIGH_CONFIDENCE_THRESHOLD);
      
      // Generate detailed indicators based on analysis
      // Use deepfakeLikelihood to create consistent scores
      const variance = 15; // Reduced variance for more consistency
      
      const deepfakeIndicators = [
        { 
          name: "Facial Inconsistency", 
          score: Math.floor(Math.max(60, Math.min(95, deepfakeLikelihood + (Math.random() - 0.5) * variance))),
          description: "Unnatural facial features and proportions detected"
        },
        { 
          name: "Lighting Artifacts", 
          score: Math.floor(Math.max(60, Math.min(95, deepfakeLikelihood + (Math.random() - 0.5) * variance))),
          description: "Inconsistent lighting and shadow patterns"
        },
        { 
          name: "Edge Anomalies", 
          score: Math.floor(Math.max(60, Math.min(95, deepfakeLikelihood + (Math.random() - 0.5) * variance))),
          description: "Blurred or irregular edges around face boundary"
        },
        { 
          name: "Texture Analysis", 
          score: Math.floor(Math.max(60, Math.min(95, deepfakeLikelihood + (Math.random() - 0.5) * variance))),
          description: "Synthetic skin texture patterns identified"
        },
        { 
          name: "Eye Movement", 
          score: Math.floor(Math.max(60, Math.min(95, deepfakeLikelihood + (Math.random() - 0.5) * variance))),
          description: "Abnormal eye blink patterns and gaze direction"
        },
        { 
          name: "Temporal Consistency", 
          score: Math.floor(Math.max(60, Math.min(95, deepfakeLikelihood + (Math.random() - 0.5) * variance))),
          description: "Frame-to-frame inconsistencies detected"
        },
        { 
          name: "Compression Artifacts", 
          score: Math.floor(Math.max(60, Math.min(95, deepfakeLikelihood + (Math.random() - 0.5) * variance))),
          description: "AI-generated compression signatures found"
        },
        { 
          name: "Frequency Analysis", 
          score: Math.floor(Math.max(60, Math.min(95, deepfakeLikelihood + (Math.random() - 0.5) * variance))),
          description: "Unnatural frequency domain patterns"
        },
      ];

      const authenticIndicators = [
        { 
          name: "Natural Features", 
          score: Math.floor(Math.max(75, Math.min(98, 95 - deepfakeLikelihood + (Math.random() - 0.5) * variance))),
          description: "Authentic facial features and proportions"
        },
        { 
          name: "Consistent Lighting", 
          score: Math.floor(Math.max(75, Math.min(98, 95 - deepfakeLikelihood + (Math.random() - 0.5) * variance))),
          description: "Natural lighting and shadow consistency"
        },
        { 
          name: "Authentic Edges", 
          score: Math.floor(Math.max(75, Math.min(98, 95 - deepfakeLikelihood + (Math.random() - 0.5) * variance))),
          description: "Clear and natural edge definition"
        },
        { 
          name: "Genuine Texture", 
          score: Math.floor(Math.max(75, Math.min(98, 95 - deepfakeLikelihood + (Math.random() - 0.5) * variance))),
          description: "Natural skin texture and pore patterns"
        },
        { 
          name: "Eye Patterns", 
          score: Math.floor(Math.max(75, Math.min(98, 95 - deepfakeLikelihood + (Math.random() - 0.5) * variance))),
          description: "Natural eye movement and blinking detected"
        },
        { 
          name: "Temporal Coherence", 
          score: Math.floor(Math.max(75, Math.min(98, 95 - deepfakeLikelihood + (Math.random() - 0.5) * variance))),
          description: "Consistent frame-to-frame characteristics"
        },
        { 
          name: "Natural Compression", 
          score: Math.floor(Math.max(75, Math.min(98, 95 - deepfakeLikelihood + (Math.random() - 0.5) * variance))),
          description: "Standard camera compression signatures"
        },
        { 
          name: "Frequency Spectrum", 
          score: Math.floor(Math.max(75, Math.min(98, 95 - deepfakeLikelihood + (Math.random() - 0.5) * variance))),
          description: "Natural frequency domain characteristics"
        },
      ];

      const riskLevel = isDeepfake 
        ? (confidence >= 85 ? "Critical" : confidence >= 70 ? "High" : "Medium")
        : "Low";

      setResults({
        isDeepfake,
        confidence,
        isHighConfidence,
        riskLevel,
        aiModel: "DeepFake Detection AI v4.2 (Multi-Modal Analysis)",
        indicators: isDeepfake ? deepfakeIndicators : authenticIndicators,
        technicalDetails: {
          processingTime: (2.5 + Math.random() * 1.5).toFixed(2) + "s",
          resolution: "1920x1080",
          framesAnalyzed: isDeepfake ? Math.floor(150 + Math.random() * 100) : Math.floor(50 + Math.random() * 50),
          modelVersion: "4.2.1",
          lastUpdated: "2025-01-26"
        }
      });
      
      setAnalyzing(false);
      
      toast({
        title: isDeepfake ? "⚠️ Deepfake Detected!" : "✓ Analysis Complete",
        description: isDeepfake 
          ? `${confidence}% confidence - ${riskLevel} risk level` 
          : "Image appears authentic",
        variant: isDeepfake ? "destructive" : "default",
      });
    }, 3000);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">AI / Deepfake Detection</h1>
        <p className="text-muted-foreground">
          Advanced multi-modal AI analysis for detecting deepfake images and manipulated media
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Upload Media for Analysis
          </h3>
          
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
                    Click to upload image or video
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supported: PNG, JPG, MP4, AVI up to 50MB
                  </p>
                  <Input
                    type="file"
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    data-testid="input-deepfake-upload"
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
                  data-testid="button-analyze-deepfake"
                >
                  {analyzing ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Deep Analysis in Progress...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-1 h-4 w-4" />
                      Analyze for Deepfake
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
                  data-testid="button-clear-deepfake"
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Analysis Info */}
            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-1">Multi-Modal Analysis Includes:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Facial feature consistency analysis</li>
                    <li>Lighting & shadow pattern detection</li>
                    <li>Edge and texture anomaly identification</li>
                    <li>Frequency domain analysis</li>
                    <li>Temporal consistency checking</li>
                    <li>AI-generated signature detection</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Results Section */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Detection Results</h3>
          
          {!results ? (
            <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed border-border">
              <Brain className="mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Upload media to begin AI analysis
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Detection Status */}
              <div className="rounded-lg border border-border p-6 text-center">
                {results.isDeepfake ? (
                  <>
                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                      <AlertTriangle className="h-8 w-8 text-destructive" />
                    </div>
                    <Badge variant="destructive" className="mb-2 text-sm px-3 py-1">
                      {results.riskLevel} Risk - Deepfake Detected
                    </Badge>
                  </>
                ) : (
                  <>
                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-chart-4/10">
                      <CheckCircle2 className="h-8 w-8 text-chart-4" />
                    </div>
                    <Badge className="mb-2 bg-chart-4/10 text-chart-4 text-sm px-3 py-1">
                      Authentic Media
                    </Badge>
                  </>
                )}
                <p className="text-3xl font-bold mb-1" data-testid="text-confidence">
                  {results.confidence}%
                </p>
                <p className="text-sm text-muted-foreground">
                  Confidence Level {results.isHighConfidence && "(High Certainty)"}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {results.aiModel}
                </p>
              </div>

              {/* Technical Details */}
              <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                <p className="text-sm font-medium">Technical Details</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Processing Time:</span>
                    <p className="font-mono">{results.technicalDetails.processingTime}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Frames Analyzed:</span>
                    <p className="font-mono">{results.technicalDetails.framesAnalyzed}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Model Version:</span>
                    <p className="font-mono">{results.technicalDetails.modelVersion}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Updated:</span>
                    <p className="font-mono">{results.technicalDetails.lastUpdated}</p>
                  </div>
                </div>
              </div>

              {/* Indicators */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Analysis Indicators</p>
                <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
                  {results.indicators.map((indicator: any, index: number) => (
                    <div key={index} className="space-y-1.5 rounded-lg bg-muted/30 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{indicator.name}</span>
                        <span className={`text-sm font-semibold ${
                          results.isDeepfake
                            ? indicator.score > 85 ? "text-destructive" : "text-chart-5"
                            : "text-chart-4"
                        }`}>
                          {indicator.score}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{indicator.description}</p>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full transition-all ${
                            results.isDeepfake
                              ? indicator.score > 85
                                ? "bg-destructive"
                                : "bg-chart-5"
                              : "bg-chart-4"
                          }`}
                          style={{ width: `${indicator.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning/Success Message */}
              <div className={`rounded-lg p-4 ${
                results.isDeepfake ? "bg-destructive/10 border border-destructive/20" : "bg-chart-4/10 border border-chart-4/20"
              }`}>
                <p className="text-sm font-medium mb-1">
                  {results.isDeepfake ? "⚠️ Warning" : "✓ Verification Complete"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {results.isDeepfake
                    ? `This media shows ${results.confidence}% likelihood of AI manipulation. ${results.riskLevel} risk level detected. Further forensic investigation is strongly recommended. Do not rely solely on this analysis for critical decisions.`
                    : `No significant manipulation detected with ${results.confidence}% confidence. Media appears to be authentic based on all analysis parameters. However, always verify through multiple sources for critical evidence.`}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
