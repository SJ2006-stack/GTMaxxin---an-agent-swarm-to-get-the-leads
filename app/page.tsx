"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, ArrowRight } from "lucide-react";
import { FIXTURE_INPUT } from "@/fixtures/demo-input";
import { MeshGradient } from "@/components/ui/mesh-gradient";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SwarmCycleMarquee } from "@/components/home/swarm-cycle-marquee";
import { SwarmSetupStepper } from "@/components/home/swarm-setup-stepper";
import { SwarmChatDemo } from "@/components/home/swarm-chat-demo";
import { SwarmGraphPreview } from "@/components/home/swarm-graph-preview";

type PresetInput = { company: string; product: string; url: string };

// Pre-baked showcase companies. These match the server-side demo datasets and
// replay instantly (no LLM), so the demo is fast and deterministic.
const DEMO_PRESETS: { id: string; label: string; tagline: string; input: PresetInput }[] = [
  {
    id: "microsoft",
    label: "Microsoft",
    tagline: "Azure + Copilot",
    input: {
      company: "Microsoft",
      product:
        "Microsoft Azure cloud platform and Microsoft Copilot AI assistant — cloud migration, a unified data estate (Microsoft Fabric), and org-wide generative AI productivity for the enterprise",
      url: "https://azure.microsoft.com",
    },
  },
  {
    id: "apple",
    label: "Apple",
    tagline: "Apple at Work",
    input: {
      company: "Apple",
      product:
        "Apple at Work — Mac, iPhone, and iPad for the enterprise with Apple Business Manager, employee-choice programs, zero-touch deployment, and built-in security",
      url: "https://www.apple.com/business/",
    },
  },
  {
    id: "spacex",
    label: "SpaceX",
    tagline: "Starlink + Starshield",
    input: {
      company: "SpaceX",
      product:
        "Starlink high-speed, low-latency satellite connectivity for enterprise, maritime, aviation, and government — plus Starshield secure comms and Falcon 9 launch services",
      url: "https://www.starlink.com",
    },
  },
];

export default function HomePage() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [product, setProduct] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function loadDemoInput() {
    setCompany(FIXTURE_INPUT.company);
    setProduct(FIXTURE_INPUT.product);
    setUrl(FIXTURE_INPUT.url ?? "");
    setError(null);
  }

  function scrollToLaunchForm() {
    document.getElementById("launch-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function startRun(payload: PresetInput) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/report/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: payload.company,
          product: payload.product,
          url: payload.url || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to start run");
      }

      const { run_id } = await res.json();
      router.push(`/report/${run_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  function launchPreset(preset: PresetInput) {
    setCompany(preset.company);
    setProduct(preset.product);
    setUrl(preset.url);
    void startRun(preset);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await startRun({ company, product, url });
  }

  return (
    <div className="min-h-screen bg-[#FCD116] flex flex-col">
      {/* Hero */}
      <section className="relative border-b-4 border-black overflow-hidden">
        <MeshGradient variant="hero" />
        <div className="relative z-10 p-6 md:p-12 lg:p-16">
          <ScrollReveal>
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="space-y-6">
                <p className="text-xs font-black uppercase tracking-widest text-neutral-700">
                  GTMaxxin · 11 Agents
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-none tracking-tighter text-[#0A0A0A]">
                  GTM
                  <br />
                  <span className="inline-block rotate-180 origin-center">Maxxin</span>
                </h1>
                <p className="text-sm md:text-base font-bold text-neutral-800 max-w-md leading-relaxed">
                  Describe your company and product — eleven AI agents map markets, hunt
                  signals, qualify prospects, and draft outreach in minutes.
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-black">
                  <span className="bg-black text-[#FCD116] px-3 py-1.5 border-2 border-black flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    GTMAXXIN READY
                  </span>
                  <a
                    href="#architecture-section"
                    className="bg-white text-black px-3 py-1.5 border-2 border-black brutalist-shadow hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform"
                  >
                    VIEW GRAPH
                  </a>
                </div>
              </div>

              {/* Launch form */}
              <ScrollReveal delay={100}>
                <div
                  id="launch-form"
                  className="border-4 border-black bg-white/90 backdrop-blur-sm p-6 md:p-8 brutalist-shadow-lg"
                >
                  <div className="mb-4 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h2 className="text-lg font-black uppercase tracking-tight text-[#0A0A0A]">
                        Launch GTMaxxin
                      </h2>
                      <button
                        type="button"
                        onClick={loadDemoInput}
                        className="border-2 border-black bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[#0A0A0A] transition-colors hover:bg-black hover:text-[#FCD116]"
                      >
                        Load demo
                      </button>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-wide text-neutral-500">
                      Instant demo — pick a company
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {DEMO_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => launchPreset(preset.input)}
                          disabled={loading}
                          className="flex flex-col items-start border-2 border-black bg-[#FCD116] px-2.5 py-1.5 text-left transition-colors hover:bg-black hover:text-[#FCD116] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <span className="text-xs font-black uppercase tracking-tight">
                            {preset.label}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wide opacity-70">
                            {preset.tagline}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="company"
                        className="block text-xs font-black uppercase tracking-wider text-[#0A0A0A]"
                      >
                        Company
                      </label>
                      <textarea
                        id="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        required
                        rows={2}
                        placeholder="B2B SaaS sales intelligence startup…"
                        className="w-full border-4 border-black bg-white px-3 py-2 text-sm font-medium text-[#0A0A0A] placeholder:text-neutral-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="product"
                        className="block text-xs font-black uppercase tracking-wider text-[#0A0A0A]"
                      >
                        Product
                      </label>
                      <textarea
                        id="product"
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        required
                        rows={3}
                        placeholder="AI prospecting and GTM automation tool…"
                        className="w-full border-4 border-black bg-white px-3 py-2 text-sm font-medium text-[#0A0A0A] placeholder:text-neutral-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="url"
                        className="block text-xs font-black uppercase tracking-wider text-[#0A0A0A]"
                      >
                        Website{" "}
                        <span className="font-bold normal-case text-neutral-600">(optional)</span>
                      </label>
                      <input
                        id="url"
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full border-4 border-black bg-white px-3 py-2 text-sm font-medium text-[#0A0A0A] placeholder:text-neutral-400 focus:outline-none"
                      />
                    </div>

                    {error && (
                      <p className="border-2 border-red-700 bg-red-100 px-3 py-2 text-xs font-bold text-red-800">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 border-4 border-black bg-[#0A0A0A] py-3 text-sm font-black uppercase tracking-wide text-[#FCD116] brutalist-shadow brutalist-btn-hover-yellow disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#FCD116] border-t-transparent" />
                          Starting GTMaxxin…
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 fill-current" />
                          Launch GTMaxxin
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </ScrollReveal>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SwarmCycleMarquee />

      <SwarmSetupStepper onLaunchClick={scrollToLaunchForm} />

      <SwarmChatDemo />

      <SwarmGraphPreview />

      {/* Bottom CTA */}
      <section className="grid md:grid-cols-2 border-b-4 border-black">
        <ScrollReveal className="p-8 md:p-12 bg-[#0A0A0A] text-[#FCD116] border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col justify-between space-y-8">
          <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter leading-none text-white">
            Daring,
            <br />
            Avant-Garde,
            <br />
            Automated.
          </h3>
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-neutral-300 font-medium">
              GTMaxxin coordinates distinct AI roles over LangGraph state — compiling
              structured target maps at developer speed.
            </p>
            <button
              type="button"
              onClick={scrollToLaunchForm}
              className="bg-[#FCD116] text-black font-black uppercase text-sm border-2 border-black px-6 py-3 brutalist-shadow brutalist-btn-hover flex items-center gap-2"
            >
              Start GTMaxxin engine
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120} className="p-8 md:p-12 bg-white text-[#0A0A0A] flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <span className="text-xs font-black text-neutral-500 uppercase tracking-widest block">
              GTMaxxin performance telemetry
            </span>
            <p className="text-xl font-black uppercase leading-tight">
              Shared graph state prevents model drift and ensures high-fit prospect matches.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t-2 border-black pt-6">
            <div>
              <p className="text-4xl font-black">11</p>
              <p className="text-xs text-neutral-500 font-bold uppercase mt-1">
                Autonomous agent roles
              </p>
            </div>
            <div>
              <p className="text-4xl font-black">5</p>
              <p className="text-xs text-neutral-500 font-bold uppercase mt-1">
                Pipeline stages
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <footer className="bg-[#0A0A0A] text-neutral-500 border-t-4 border-black p-8 text-center text-xs font-bold">
        <p className="text-white font-black text-sm uppercase">GTMaxxin</p>
        <p className="text-[10px] text-neutral-600 mt-1">
          © {new Date().getFullYear()} · Next.js, LangGraph & Tailwind
        </p>
      </footer>
    </div>
  );
}
