import { motion } from "framer-motion";
import { Shield, Zap, Lock, Users } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";

const features = [
  { icon: Zap, title: "Lightning Fast", desc: "Transactions complete in seconds" },
  { icon: Shield, title: "Secure", desc: "Your funds are always safe" },
  { icon: Lock, title: "Non-Custodial", desc: "You control your keys" },
  { icon: Users, title: "Community Driven", desc: "Built by the community" },
];

const WhyPegasus = () => {
  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-4xl font-bold text-center mb-12 gradient-text">
            Why Pegasus?
          </motion.h1>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-6">
                <f.icon className="text-primary mb-4" size={32} />
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WhyPegasus;
