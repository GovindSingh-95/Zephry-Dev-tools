
import React, { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Copy } from "lucide-react";

interface RegexMatch {
  index: number;
  match: string;
  groups?: string[];
}

const RegexTester: React.FC = () => {
  const [regexInput, setRegexInput] = useLocalStorage("regex-pattern", "");
  const [flags, setFlags] = useLocalStorage("regex-flags", "g");
  const [testString, setTestString] = useLocalStorage(
    "regex-test-string",
    "Sample text to test your regular expression."
  );
  const [replaceValue, setReplaceValue] = useLocalStorage("regex-replace", "$&");
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [replacedText, setReplacedText] = useState("");
  const [activeTab, setActiveTab] = useLocalStorage<"match" | "replace">(
    "regex-active-tab",
    "match"
  );

  useEffect(() => {
    try {
      // Create regex from user input
      if (!regexInput) {
        setMatches([]);
        setReplacedText("");
        return;
      }

      const regex = new RegExp(regexInput, flags);
      const results: RegexMatch[] = [];
      let match;

      if (flags.includes("g")) {
        // Global match
        while ((match = regex.exec(testString)) !== null) {
          results.push({
            index: match.index,
            match: match[0],
            groups: match.slice(1),
          });
          
          // Avoid infinite loop for zero-length matches
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        // Single match
        match = regex.exec(testString);
        if (match) {
          results.push({
            index: match.index,
            match: match[0],
            groups: match.slice(1),
          });
        }
      }

      setMatches(results);

      // Handle replace
      try {
        setReplacedText(testString.replace(regex, replaceValue));
      } catch (e) {
        setReplacedText("Invalid replacement pattern");
      }
    } catch (e) {
      console.log("Invalid regex", e);
      // Invalid regex, clear results
      setMatches([]);
    }
  }, [regexInput, flags, testString, replaceValue]);

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  const highlightMatches = () => {
    if (!regexInput || matches.length === 0) {
      return testString;
    }

    let result = "";
    let lastIndex = 0;

    // Sort matches by index
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);

    sortedMatches.forEach((match) => {
      // Add text before match
      result += testString.substring(lastIndex, match.index);
      // Add highlighted match
      result += `<mark class="bg-primary/20 rounded px-0.5">${testString.substring(
        match.index,
        match.index + match.match.length
      )}</mark>`;
      lastIndex = match.index + match.match.length;
    });

    // Add remaining text
    result += testString.substring(lastIndex);
    return result;
  };

  return (
    <div className="tool-container p-4 h-full">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Regex Tester</h2>
        <p className="text-muted-foreground">
          Test and debug your regular expressions in real-time
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4 flex flex-col gap-4 h-fit">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Label htmlFor="regex-input">Regular Expression</Label>
                <Input
                  id="regex-input"
                  value={regexInput}
                  onChange={(e) => setRegexInput(e.target.value)}
                  placeholder="/pattern/"
                  className="font-mono"
                />
              </div>
              <div className="w-24">
                <Label htmlFor="flags">Flags</Label>
                <Input
                  id="flags"
                  value={flags}
                  onChange={(e) => setFlags(e.target.value)}
                  placeholder="g"
                  className="font-mono"
                />
              </div>
            </div>
            <small className="text-xs text-muted-foreground">
              Common flags: g (global), i (case-insensitive), m (multiline)
            </small>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="test-string">Test String</Label>
            <Textarea
              id="test-string"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter text to test against your regex"
              className="min-h-[120px] scrollbar-thin"
            />
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(testString, "Test string copied")}
              >
                <Copy className="h-4 w-4 mr-1" /> Copy
              </Button>
            </div>
          </div>

          {activeTab === "replace" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="replace-value">Replace With</Label>
              <Input
                id="replace-value"
                value={replaceValue}
                onChange={(e) => setReplaceValue(e.target.value)}
                placeholder="Replacement pattern"
                className="font-mono"
              />
              <small className="text-xs text-muted-foreground">
                Use $& (matched text), $` (before match), $' (after match), $1, $2, etc.
              </small>
            </div>
          )}
        </Card>

        <Card className="p-4 flex flex-col">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "match" | "replace")}>
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="match">Matches</TabsTrigger>
              <TabsTrigger value="replace">Replace</TabsTrigger>
            </TabsList>

            <TabsContent value="match" className="flex flex-col gap-4">
              <div className="bg-card border rounded-md p-3">
                <div className="text-sm mb-2 font-medium text-muted-foreground">
                  Preview with Highlighting
                </div>
                <div
                  className="whitespace-pre-wrap break-words font-mono text-sm"
                  dangerouslySetInnerHTML={{ __html: highlightMatches() }}
                ></div>
              </div>

              <div>
                <div className="text-sm mb-2 font-medium">
                  {matches.length} Match{matches.length !== 1 && "es"}
                </div>
                
                {matches.length > 0 ? (
                  <div className="max-h-[300px] overflow-y-auto scrollbar-thin space-y-2">
                    {matches.map((match, idx) => (
                      <div key={idx} className="bg-accent/40 rounded-md p-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Index: {match.index}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(match.match, "Match copied")}
                          >
                            <Copy className="h-3 w-3 mr-1" /> Copy
                          </Button>
                        </div>
                        <div className="font-mono text-sm break-all pt-1">
                          {match.match}
                        </div>
                        
                        {match.groups && match.groups.length > 0 && (
                          <div className="mt-2 pt-2 border-t">
                            <span className="text-xs text-muted-foreground mb-1 block">
                              Capturing Groups:
                            </span>
                            <div className="space-y-1">
                              {match.groups.map((group, groupIdx) => (
                                <div key={groupIdx} className="text-xs font-mono bg-accent/60 p-1 rounded">
                                  ${groupIdx + 1}: {group}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm">No matches found</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="replace" className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="text-sm mb-2 font-medium">Replaced Text</div>
                <div className="bg-card border rounded-md p-3">
                  <div className="whitespace-pre-wrap break-words font-mono text-sm">
                    {replacedText}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(replacedText, "Replaced text copied")}
                  >
                    <Copy className="h-4 w-4 mr-2" /> Copy Result
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default RegexTester;
