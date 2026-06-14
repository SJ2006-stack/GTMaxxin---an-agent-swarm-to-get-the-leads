"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FIXTURE_INPUT } from "@/lib/fixtures/demo-input";

export function GTMInputForm() {
  const router = useRouter();
  const [company, setCompany] = useState(FIXTURE_INPUT.company);
  const [product, setProduct] = useState(FIXTURE_INPUT.product);
  const [url, setUrl] = useState(FIXTURE_INPUT.url ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/report/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, product, url: url || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to start run");
      }

      const { run_id } = await res.json();
      router.push(`/report/${run_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="company">Company Description</Label>
        <Input
          id="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Describe your company..."
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="product">Product Description</Label>
        <Input
          id="product"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Describe your product..."
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="url">Website URL (optional)</Label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" size="lg" disabled={loading} className="w-full">
        {loading ? "Starting Swarm..." : "Generate GTM Report"}
      </Button>
    </form>
  );
}
