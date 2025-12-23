import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WalletProvider from "./providers/WalletProvider";
import Index from "./pages/Index";
import Dex from "./pages/Dex";
import WhyPegasus from "./pages/WhyPegasus";
import Claim from "./pages/Claim";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WalletProvider>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dex" element={<Dex />} />
              <Route path="/why-pegasus" element={<WhyPegasus />} />
              <Route path="/claim" element={<Claim />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </WalletProvider>
  </QueryClientProvider>
);

export default App;
