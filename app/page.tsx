
"use client";

import { useState } from "react";
import { PRESETS } from "@/lib/presets";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Copy, Download, Loader2, Sparkles, FileDigit } from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";

export default function Home() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESETS[0].id);
  const [quantity, setQuantity] = useState<number>(5); // Default to 5 as per request (1, 5, 10 options)
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const selectedPreset = PRESETS.find((p) => p.id === selectedPresetId);

  const handleGenerate = async () => {
    setLoading(true);
    setData(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presetId: selectedPresetId, quantity }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Generation failed");
      }

      setData(json);
      toast.success("Data generated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success("Copied to clipboard");
  };

  const handleExport = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mock-data-${selectedPresetId}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Download started");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-foreground">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <FileDigit className="h-6 w-6 text-primary" />

          <div>
            <h1 className="text-xl font-bold tracking-tight">Synthetic Data Generator</h1>
            <p className="text-xs text-muted-foreground">generate → copy → go</p>
          </div>
        </div>
        <ModeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Controls Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Setup your data generation parameters.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Preset Selector */}
              <div className="space-y-2">
                <Label htmlFor="preset">Data Preset</Label>
                <Select value={selectedPresetId} onValueChange={setSelectedPresetId}>
                  <SelectTrigger id="preset">
                    <SelectValue placeholder="Select a preset" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESETS.map((preset) => (
                      <SelectItem key={preset.id} value={preset.id}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedPreset && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedPreset.description}
                  </p>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="space-y-3">
                <Label>Quantity</Label>
                <RadioGroup
                  value={quantity.toString()}
                  onValueChange={(val) => setQuantity(parseInt(val))}
                  className="flex space-x-4"
                >
                  {[1, 5, 10].map((q) => (
                    <div key={q} className="flex items-center space-x-2">
                      <RadioGroupItem value={q.toString()} id={`q-${q}`} />
                      <Label htmlFor={`q-${q}`}>{q}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Generate Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Data
                  </>
                )}
              </Button>

            </CardContent>
          </Card>

          {/* Schema Preview */}
          {selectedPreset && (
            <Card className="bg-muted/50 border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Schema Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs text-muted-foreground font-mono overflow-auto max-h-[300px]">
                  {JSON.stringify(selectedPreset.schema, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Output Column */}
        <div className="lg:col-span-2 flex flex-col h-full min-h-[500px]">
          <Card className="flex-1 flex flex-col overflow-hidden h-full">
            <div className="flex items-center justify-between p-4 border-b bg-muted/50">
              <h2 className="font-semibold text-sm">Generated Output</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} disabled={!data}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport} disabled={!data}>
                  <Download className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
              </div>
            </div>

            <div className="flex-1 p-0 overflow-auto bg-muted/30 text-foreground font-mono text-sm relative">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-muted-foreground font-medium">Thinking...</span>
                  </div>
                </div>
              ) : null}

              {data ? (
                <pre className="p-4">{JSON.stringify(data, null, 2)}</pre>
              ) : (
                !loading && (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                    <Sparkles className="h-12 w-12 mb-4 opacity-20" />
                    <p>Select a preset and click Generate to start.</p>
                  </div>
                )
              )}
            </div>
          </Card>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Synthetic Data Generator. Open Source MVP.</p>
        <div className="mt-2 space-x-4">
          <span className="hover:underline cursor-pointer">GitHub</span>
          <span className="hover:underline cursor-pointer">Support</span>
        </div>
      </footer>
    </div>
  );
}
