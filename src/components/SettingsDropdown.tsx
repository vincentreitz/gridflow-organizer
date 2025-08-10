import { Download, Settings, Upload } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGridStore } from "@/store/useGridStore";

export function SettingsDropdown() {
  const { grids, currentGridId } = useGridStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportData = () => {
    const data = {
      grids,
      currentGridId,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kanban-export-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        if (data.grids && Array.isArray(data.grids)) {
          // Clear current store data and set new data
          localStorage.setItem(
            "task-organizer-store",
            JSON.stringify({
              state: {
                grids: data.grids,
                currentGridId: data.currentGridId || null,
              },
              version: 1,
            }),
          );

          // Reload the page to reinitialize the store
          window.location.reload();
        } else {
          alert("Invalid file format. Please select a valid export file.");
        }
      } catch (error) {
        console.error("Import error:", error);
        alert("Error importing data. Please check the file format.");
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 shadow-card">
            <Settings className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom" sideOffset={4} className="w-48">
          <DropdownMenuItem onClick={exportData} className="gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={triggerFileInput} className="gap-2">
            <Upload className="h-4 w-4" />
            Import Data
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={importData}
        className="hidden"
      />
    </>
  );
}
