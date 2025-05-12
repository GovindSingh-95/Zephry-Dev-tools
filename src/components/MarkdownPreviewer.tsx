
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { marked } from "marked";

const MarkdownPreviewer: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>("");
  const [html, setHtml] = useState<string>("");
  
  useEffect(() => {
    try {
      // Use the marked library to convert markdown to HTML
      const renderedHtml = marked(markdown);
      setHtml(renderedHtml);
    } catch (error) {
      console.error("Error parsing markdown:", error);
      setHtml("<p>Error rendering markdown</p>");
    }
  }, [markdown]);

  useEffect(() => {
    // Load from localStorage on component mount
    const savedMarkdown = localStorage.getItem("zephry-markdown");
    if (savedMarkdown) {
      setMarkdown(savedMarkdown);
    } else {
      // Default sample markdown
      setMarkdown(`# Welcome to Markdown Previewer
      
## This is a subheading

Here's some code: \`const greeting = "Hello World";\`

\`\`\`javascript
// This is a code block
function sayHello() {
  return "Hello, World!";
}
\`\`\`

- This is a list item
- Another list item

> This is a blockquote

[Visit OpenAI](https://www.openai.com)

![Alt text](placeholder.svg)

**Bold text** and *italic text*
`);
    }
  }, []);

  // Save to localStorage whenever markdown changes
  useEffect(() => {
    localStorage.setItem("zephry-markdown", markdown);
  }, [markdown]);

  return (
    <div className="container p-4 mx-auto">
      <h2 className="text-2xl font-bold mb-4">Markdown Previewer</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Editor</h3>
          <Textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="h-[70vh] font-mono"
            placeholder="Type markdown here..."
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Preview</h3>
          <Card className="p-4 overflow-auto h-[70vh]">
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MarkdownPreviewer;
