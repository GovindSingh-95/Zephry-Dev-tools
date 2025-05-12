
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Copy, Upload, Save, Eye, EyeOff } from "lucide-react";

// Default markdown sample
const defaultMarkdown = `# Markdown Previewer

## Features
- Real-time preview
- GitHub-flavored markdown
- Export to HTML

### Code Example
\`\`\`javascript
function helloWorld() {
  console.log("Hello, world!");
}
\`\`\`

> This is a blockquote

- [x] Task 1
- [ ] Task 2

`;

const MarkdownPreviewer: React.FC = () => {
  const [markdownInput, setMarkdownInput] = useLocalStorage(
    "markdown-input",
    defaultMarkdown
  );
  const [htmlOutput, setHtmlOutput] = useState("");
  const [previewVisible, setPreviewVisible] = useLocalStorage(
    "markdown-preview-visible",
    true
  );

  // Function to convert markdown to HTML
  const convertMarkdownToHtml = async (markdown: string) => {
    try {
      // Using the marked library to convert markdown to HTML
      const module = await import("marked");
      const marked = module.default || module;
      
      marked.setOptions({
        gfm: true,
        breaks: true,
        sanitize: false,
        highlight: function (code: string, lang: string) {
          return code;
        }
      });
      
      const html = marked.parse(markdown);
      setHtmlOutput(html as string);
    } catch (error) {
      console.error("Error converting markdown to HTML:", error);
    }
  };

  // Convert markdown to HTML whenever the input changes
  useEffect(() => {
    convertMarkdownToHtml(markdownInput);
  }, [markdownInput]);

  const copyToClipboard = (type: "markdown" | "html") => {
    if (type === "markdown") {
      navigator.clipboard.writeText(markdownInput);
      toast.success("Markdown copied to clipboard");
    } else {
      navigator.clipboard.writeText(htmlOutput);
      toast.success("HTML copied to clipboard");
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setMarkdownInput(content);
      };
      reader.readAsText(file);
      e.target.value = ""; // Reset file input
    }
  };

  const handleSave = (type: "markdown" | "html") => {
    // Create a blob and download link
    const content = type === "markdown" ? markdownInput : htmlOutput;
    const mimeType = type === "markdown" ? "text/markdown" : "text/html";
    const extension = type === "markdown" ? "md" : "html";
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `document.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`${type.toUpperCase()} saved to file`);
  };

  const togglePreview = () => {
    setPreviewVisible(!previewVisible);
  };

  return (
    <div className="tool-container p-4 h-full">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Markdown Previewer</h2>
        <p className="text-muted-foreground">
          Write markdown and see the rendered HTML in real-time
        </p>
      </div>

      <div className={`grid gap-4 h-[calc(100%-6rem)] ${previewVisible ? "md:grid-cols-2" : ""}`}>
        <Card className="p-4 flex flex-col">
          <div className="flex justify-between mb-2">
            <h3 className="text-sm font-medium">Markdown Input</h3>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard("markdown")}
                title="Copy markdown"
              >
                <Copy className="h-4 w-4 mr-1" /> Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave("markdown")}
                title="Save markdown"
              >
                <Save className="h-4 w-4 mr-1" /> Save
              </Button>
              <input
                type="file"
                accept=".md,.markdown,.txt"
                onChange={handleUpload}
                className="hidden"
                id="md-upload"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("md-upload")?.click()}
                title="Upload markdown file"
              >
                <Upload className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={togglePreview}
                title={previewVisible ? "Hide preview" : "Show preview"}
              >
                {previewVisible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Textarea
            value={markdownInput}
            onChange={(e) => setMarkdownInput(e.target.value)}
            className="flex-1 font-mono text-sm scrollbar-thin code-editor resize-none"
            placeholder="Enter markdown here"
            spellCheck={false}
          />
        </Card>

        {previewVisible && (
          <Card className="p-4 flex flex-col">
            <div className="flex justify-between mb-2">
              <h3 className="text-sm font-medium">HTML Preview</h3>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard("html")}
                  title="Copy HTML"
                >
                  <Copy className="h-4 w-4 mr-1" /> Copy HTML
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSave("html")}
                  title="Save HTML"
                >
                  <Save className="h-4 w-4 mr-1" /> Save HTML
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-accent/30 rounded-md p-4 scrollbar-thin">
              <div
                className="prose dark:prose-invert max-w-none prose-img:rounded prose-pre:bg-muted prose-pre:p-2"
                dangerouslySetInnerHTML={{ __html: htmlOutput }}
              ></div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MarkdownPreviewer;
