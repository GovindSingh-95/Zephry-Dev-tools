
import { useEffect } from "react";

type Tool = "regex" | "json" | "markdown" | "snippets";

interface ShortcutHandlerProps {
  setActiveTool: (tool: Tool) => void;
}

const ShortcutHandler: React.FC<ShortcutHandlerProps> = ({ setActiveTool }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keys when user is typing in input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Prevent default for our shortcuts
      if (["1", "2", "3", "4"].includes(e.key)) {
        e.preventDefault();
      }

      // Tool switching shortcuts
      if (e.key === "1") setActiveTool("regex");
      if (e.key === "2") setActiveTool("json");
      if (e.key === "3") setActiveTool("markdown");
      if (e.key === "4") setActiveTool("snippets");
    };

    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setActiveTool]);

  // This component doesn't render anything
  return null;
};

export default ShortcutHandler;
