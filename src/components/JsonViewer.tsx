
import React, { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Copy, Upload, Save, RefreshCw } from "lucide-react";

const JsonViewer: React.FC = () => {
  const [jsonInput, setJsonInput] = useLocalStorage(
    "json-input",
    JSON.stringify({ example: "Paste or enter your JSON here" }, null, 2)
  );
  const [formattedJson, setFormattedJson] = useState(jsonInput);
  const [error, setError] = useState<string | null>(null);

  // Format the JSON with specified spacing
  const formatJson = (spacing: number = 2) => {
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, spacing);
      setFormattedJson(formatted);
      setError(null);
      return formatted;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Invalid JSON");
      }
      return jsonInput;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
    try {
      // Validate but don't format on every keystroke
      JSON.parse(e.target.value);
      setError(null);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Invalid JSON");
      }
    }
  };

  const handleFormat = () => {
    const formatted = formatJson();
    setJsonInput(formatted);
    toast.success("JSON formatted successfully");
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      setJsonInput(minified);
      setFormattedJson(minified);
      setError(null);
      toast.success("JSON minified successfully");
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Invalid JSON");
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedJson);
    toast.success("JSON copied to clipboard");
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setJsonInput(content);
        formatJson();
      };
      reader.readAsText(file);
      e.target.value = ""; // Reset file input
    }
  };

  const handleSave = () => {
    try {
      // Check if JSON is valid first
      JSON.parse(jsonInput);
      
      // Create a blob and download link
      const blob = new Blob([formattedJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "formatted.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("JSON saved to file");
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Invalid JSON");
      }
    }
  };

  return (
    <div className="tool-container p-4 h-full">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">JSON Viewer</h2>
        <p className="text-muted-foreground">
          Format, validate, and explore JSON data
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 h-[calc(100%-6rem)]">
        <Card className="p-4 flex flex-col">
          <div className="flex justify-between mb-2">
            <h3 className="text-sm font-medium">Input</h3>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFormat}
                title="Format JSON"
              >
                <RefreshCw className="h-4 w-4 mr-1" /> Format
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleMinify}
                title="Minify JSON"
              >
                Minify
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={handleUpload}
                className="hidden"
                id="json-upload"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("json-upload")?.click()}
                title="Upload JSON file"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Textarea
            value={jsonInput}
            onChange={handleInputChange}
            className="flex-1 font-mono text-sm scrollbar-thin code-editor resize-none"
            placeholder="Enter or paste JSON here"
            spellCheck={false}
          />

          {error && (
            <div className="mt-2 text-xs text-destructive bg-destructive/10 p-2 rounded">
              {error}
            </div>
          )}
        </Card>

        <Card className="p-4 flex flex-col">
          <div className="flex justify-between mb-2">
            <h3 className="text-sm font-medium">Formatted Output</h3>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4 mr-1" /> Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                title="Save to file"
              >
                <Save className="h-4 w-4 mr-1" /> Save
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-accent/30 rounded-md p-2 scrollbar-thin">
            <pre className="font-mono text-sm whitespace-pre-wrap">
              {formattedJson}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default JsonViewer;
