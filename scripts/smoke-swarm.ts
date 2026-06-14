#!/usr/bin/env tsx
/**
 * Stub smoke test — validates graph wiring, parallel fan-out/fan-in, Zod contracts.
 * Run: MOCK_LLM=true pnpm smoke
 */
import { AGENT_NAMES } from "../types/agents";
import { FIXTURE_INPUT } from "../lib/fixtures/demo-input";
import { runSwarmGraph } from "../lib/agents/graph";
import type { AgentLogEvent, AgentStatusEvent, SwarmStreamEvent } from "../lib/agents/events";

async function main() {
  process.env.MOCK_LLM = process.env.MOCK_LLM ?? "true";
  process.env.MOCK_TOOLS = "true";

  const runId = `smoke-${Date.now()}`;
  const events: AgentStatusEvent[] = [];
  const logs: AgentLogEvent[] = [];
  const start = Date.now();

  console.log(`\n🔥 Smoke test starting (run_id: ${runId})`);
  console.log(`   MOCK_LLM=${process.env.MOCK_LLM}\n`);

  const finalState = await runSwarmGraph(runId, FIXTURE_INPUT, (event: SwarmStreamEvent) => {
    if (event.type === "status") {
      events.push(event.data);
      const icon =
        event.data.status === "done"
          ? "✅"
          : event.data.status === "running"
            ? "🔄"
            : event.data.status === "error"
              ? "❌"
              : "⏳";
      console.log(`   ${icon} ${event.data.agent} → ${event.data.status}`);
    } else {
      logs.push(event.data);
      if (event.data.level === "error" || event.data.level === "warn") {
        console.log(`   ⚠️  [${event.data.level}] ${event.data.agent}: ${event.data.message}`);
      }
    }
  });

  const elapsed = Date.now() - start;
  const doneAgents = AGENT_NAMES.filter(
    (a) => finalState.agent_statuses[a] === "done"
  );
  const failedAgents = AGENT_NAMES.filter(
    (a) => finalState.agent_statuses[a] === "error"
  );

  console.log(`\n📊 Results (${elapsed}ms):`);
  console.log(`   Agents done: ${doneAgents.length}/${AGENT_NAMES.length}`);
  console.log(`   Log lines: ${logs.length}`);
  console.log(`   Report ready: ${finalState.report ? "yes" : "no"}`);
  console.log(
    `   Prospects: ${finalState.report?.prospects.length ?? 0}, Signals: ${finalState.report?.market_signals.length ?? 0}`
  );

  let passed = true;

  if (elapsed > 10000) {
    console.error(`\n❌ FAIL: exceeded 10s limit (${elapsed}ms)`);
    passed = false;
  }

  if (doneAgents.length !== AGENT_NAMES.length) {
    console.error(
      `\n❌ FAIL: not all agents done. Missing: ${AGENT_NAMES.filter((a) => !doneAgents.includes(a)).join(", ")}`
    );
    passed = false;
  }

  if (failedAgents.length > 0) {
    console.error(`\n❌ FAIL: errors in: ${failedAgents.join(", ")}`);
    passed = false;
  }

  if (!finalState.report) {
    console.error("\n❌ FAIL: no report generated");
    passed = false;
  }

  if (logs.length < AGENT_NAMES.length) {
    console.error(`\n❌ FAIL: expected agent logs, got ${logs.length}`);
    passed = false;
  }

  if (passed) {
    console.log(`\n✅ Smoke test PASSED in ${elapsed}ms\n`);
    process.exit(0);
  } else {
    console.log("\n💥 Smoke test FAILED\n");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Smoke test crashed:", err);
  process.exit(1);
});
