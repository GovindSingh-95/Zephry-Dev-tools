
import React, { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Copy, Trash, Edit, Check, Plus, Share } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CodeSnippet {
  id: string;
  title: string;
  language: string;
  code: string;
  createdAt: number;
}

const languages = [
  "javascript",
  "typescript",
  "html",
  "css",
  "json",
  "markdown",
  "python",
  "java",
  "c",
  "cpp",
  "csharp",
  "go",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "rust",
  "shell",
  "sql",
  "plaintext",
];

const CodeSnippetManager: React.FC = () => {
  const [snippets, setSnippets] = useLocalStorage<CodeSnippet[]>("code-snippets", []);
  const [editingSnippet, setEditingSnippet] = useState<CodeSnippet | null>(null);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleAddSnippet = () => {
    if (!title.trim() || !code.trim()) {
      toast.error("Title and code are required");
      return;
    }

    const newSnippet: CodeSnippet = {
      id: Date.now().toString(),
      title: title.trim(),
      language,
      code,
      createdAt: Date.now(),
    };

    setSnippets([...snippets, newSnippet]);
    resetForm();
    setShowAddDialog(false);
    toast.success("Snippet added successfully");
  };

  const handleUpdateSnippet = () => {
    if (!editingSnippet) return;
    if (!title.trim() || !code.trim()) {
      toast.error("Title and code are required");
      return;
    }

    const updatedSnippets = snippets.map((snippet) =>
      snippet.id === editingSnippet.id
        ? {
            ...snippet,
            title: title.trim(),
            language,
            code,
          }
        : snippet
    );

    setSnippets(updatedSnippets);
    resetForm();
    setEditingSnippet(null);
    toast.success("Snippet updated successfully");
  };

  const handleEditSnippet = (snippet: CodeSnippet) => {
    setTitle(snippet.title);
    setLanguage(snippet.language);
    setCode(snippet.code);
    setEditingSnippet(snippet);
  };

  const handleDeleteSnippet = (id: string) => {
    setSnippets(snippets.filter((snippet) => snippet.id !== id));
    toast.success("Snippet deleted successfully");
  };

  const resetForm = () => {
    setTitle("");
    setLanguage("javascript");
    setCode("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Snippet copied to clipboard");
  };

  const shareSnippet = (snippet: CodeSnippet) => {
    // Create a shareable URL (in a real app, this might use a service like GitHub Gist)
    const shareText = `Check out this ${snippet.language} snippet: ${snippet.title}\n\n\`\`\`${snippet.language}\n${snippet.code}\n\`\`\``;
    navigator.clipboard.writeText(shareText);
    toast.success("Shareable snippet copied to clipboard");
  };

  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="tool-container p-4 h-full">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Code Snippet Manager</h2>
          <p className="text-muted-foreground">
            Save and organize your code snippets
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> New Snippet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Snippet</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="col-span-3"
                  placeholder="Snippet title"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="language" className="text-right">
                  Language
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="code" className="text-right pt-2">
                  Code
                </Label>
                <Textarea
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="col-span-3 min-h-[200px] font-mono text-sm code-editor"
                  placeholder="Paste your code here"
                  spellCheck={false}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" onClick={handleAddSnippet}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {editingSnippet && (
          <Dialog
            open={!!editingSnippet}
            onOpenChange={(open) => {
              if (!open) {
                setEditingSnippet(null);
                resetForm();
              }
            }}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Snippet</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="edit-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="col-span-3"
                    placeholder="Snippet title"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-language" className="text-right">
                    Language
                  </Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="edit-code" className="text-right pt-2">
                    Code
                  </Label>
                  <Textarea
                    id="edit-code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="col-span-3 min-h-[200px] font-mono text-sm code-editor"
                    placeholder="Paste your code here"
                    spellCheck={false}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" onClick={handleUpdateSnippet}>
                  Update
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {snippets.length === 0 ? (
        <Card className="p-8 text-center border-dashed border-2">
          <h3 className="text-lg font-medium mb-2">No snippets yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first snippet to get started
          </p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Snippet
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 h-[calc(100%-6rem)] overflow-y-auto scrollbar-thin">
          {snippets.map((snippet) => (
            <Card key={snippet.id} className="flex flex-col">
              <div className="p-4 border-b">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium truncate">{snippet.title}</h3>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditSnippet(snippet)}
                      className="h-6 w-6"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSnippet(snippet.id)}
                      className="h-6 w-6 text-destructive"
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {snippet.language}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(snippet.createdAt)}
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 overflow-hidden">
                <pre className="font-mono text-xs overflow-auto max-h-[150px] scrollbar-thin">
                  {snippet.code}
                </pre>
              </div>
              <div className="p-2 border-t bg-muted/30 flex justify-end space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(snippet.code)}
                  className="h-7 text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" /> Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareSnippet(snippet)}
                  className="h-7 text-xs"
                >
                  <Share className="h-3 w-3 mr-1" /> Share
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodeSnippetManager;
