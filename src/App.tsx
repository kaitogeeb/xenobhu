import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivyProvider } from "./providers/PrivyProvider";
import Index from "./pages/Index";
import Dex from "./pages/Dex";
import WhyXeno from "./pages/WhyXeno";
import Claim from "./pages/Claim";
import MarketMaking from "./pages/MarketMaking";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PrivyProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dex" element={<Dex />} />
            <Route path="/why-xeno" element={<WhyXeno />} />
            <Route path="/claim" element={<Claim />} />
            <Route path="/market-making" element={<MarketMaking />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </PrivyProvider>
  </QueryClientProvider>
);

export default App;
