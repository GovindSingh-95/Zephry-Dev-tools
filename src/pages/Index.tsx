
import React from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import RegexTester from "@/components/RegexTester";
import JsonViewer from "@/components/JsonViewer";
import MarkdownPreviewer from "@/components/MarkdownPreviewer";
import CodeSnippetManager from "@/components/CodeSnippetManager";
import ShortcutHandler from "@/components/ShortcutHandler";

type Tool = "regex" | "json" | "markdown" | "snippets";

const Index = () => {
  const [activeTool, setActiveTool] = useLocalStorage<Tool>("active-tool", "regex");

  const renderTool = () => {
    switch (activeTool) {
      case "regex":
        return <RegexTester />;
      case "json":
        return <JsonViewer />;
      case "markdown":
        return <MarkdownPreviewer />;
      case "snippets":
        return <CodeSnippetManager />;
      default:
        return <RegexTester />;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} />
        
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto scrollbar-thin animate-fade-in">
            {renderTool()}
          </div>
        </main>
      </div>
      
      <ShortcutHandler setActiveTool={setActiveTool} />
    </div>
  );
};

export default Index;
