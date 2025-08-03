import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

const App = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="gridflow-theme">
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
