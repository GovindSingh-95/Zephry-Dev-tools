
import React from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Regex, 
  FileJson, 
  FileText, 
  Code, 
  Menu
} from "lucide-react";

type Tool = "regex" | "json" | "markdown" | "snippets";

interface SidebarProps {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
}

const toolIcons = {
  regex: Regex,
  json: FileJson,
  markdown: FileText,
  snippets: Code
};

const toolLabels = {
  regex: "Regex Tester",
  json: "JSON Viewer",
  markdown: "Markdown",
  snippets: "Snippets"
};

const toolShortcuts = {
  regex: "1",
  json: "2",
  markdown: "3",
  snippets: "4"
};

const Sidebar: React.FC<SidebarProps> = ({ activeTool, setActiveTool }) => {
  const [collapsed, setCollapsed] = useLocalStorage("sidebar-collapsed", false);
  
  return (
    <div 
      className={cn(
        "flex flex-col h-full bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-16" : "w-56"
      )}
    >
      <div className="flex justify-end p-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex flex-col gap-2 p-2 flex-1">
        {(Object.keys(toolIcons) as Tool[]).map((tool) => {
          const Icon = toolIcons[tool];
          return (
            <Button
              key={tool}
              variant={activeTool === tool ? "secondary" : "ghost"}
              className={cn(
                "justify-start gap-3 hover:bg-sidebar-accent",
                activeTool === tool && "bg-sidebar-accent"
              )}
              onClick={() => setActiveTool(tool)}
            >
              <Icon className="h-5 w-5" />
              {!collapsed && (
                <span className="flex-1 text-left">{toolLabels[tool]}</span>
              )}
              {!collapsed && (
                <kbd className="kbd bg-sidebar-accent/50 text-sidebar-foreground">
                  {toolShortcuts[tool]}
                </kbd>
              )}
            </Button>
          );
        })}
      </div>
      
      <div className="p-2 text-xs text-center text-sidebar-foreground/50">
        {!collapsed && "Zephry © 2025"}
      </div>
    </div>
  );
};

export default Sidebar;
