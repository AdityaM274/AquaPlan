# AquaPlan

A local-first community water-allocation planning prototype for STEM2Connect 2026, primary track Sustainability. Created 28 October 2026.

## Run
Use Node.js 22+ for tests: `node test.mjs`. Serve this directory with `python -m http.server 4180 --bind 127.0.0.1` and open http://127.0.0.1:4180/. No packages or API keys.

## Workflow
Load or edit scenario JSON, calculate, inspect every delivery and shortfall, review assumptions, then export the full decision record. Changes invalidate the previous review. Input is processed in browser memory; no analytics, cloud service or persistent personal-data collection.

## Method
Integer min-cost flow, with a priced unmet-demand edge per destination. The penalty is larger than any possible total route cost, so integer priority-weighted shortfall is minimized first, transport cost second. Priorities are user-provided weights per unmet unit, not lexicographic priority classes or a fairness guarantee. No travel-time or hydraulic model, water quality check, tanker scheduling, uncertainty model or dispatch integration.

Limits: 12 supplies, 20 demands, 120 unique routes, 10,000 units per location, route costs 0–10,000, priority 1–5. Nonnegative integer inputs only. These bounds keep the scalar objective inside JavaScript safe integers. One consistent water quantity unit must be used across the network. Costs are relative per-unit costs, not promised currency expenditure. No real deployment validation.

## Verification
160 independent exhaustive-oracle small networks; sample, zero supply/demand and invalid input cases. The sample delivers110/135units; weighted unmet25 vs85 from cheapest-route-first; cost170 vs145. These are synthetic test results, not real community savings. The downloaded JSON export was inspected, including all6routes and input/baseline. See ../VERIFICATION.md for browser coverage.

## AI disclosure and authorship
OpenAI Codex selected the implementation approach and generated the source, tests, UI and documentation in this chat, under Aditya Mittal’s direction. Do not describe the code as independently human-written. Runtime contains deterministic optimization, no model, no hidden LLM or paid API. AI coding assistance is permitted by the event. No prior competition application source was reused; standard algorithm knowledge and third-party runtime tools were used.

## Next development
Validate input units, priorities and actual constraints with consenting community planners; then investigate uncertainty scenarios, importable network editing and accessible first-use guidance. No user interviews, field pilot or impact measurements have been performed.
