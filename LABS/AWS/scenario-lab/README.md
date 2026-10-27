# AWS Scenario Labs

Twenty browser-only educational simulations, matching the twenty AWS questions in Scenarios. Each models a small set of access or readiness conditions, highlights affected architecture/workflow stages, provides Back/Next/Play controls, and shows a read-only simulation log. Playback pauses at a failed check. Use the working example, then introduce faults to compare outcomes.

Open `index.html?scenario=aws-01` through `?scenario=aws-20`. Unknown IDs visibly fall back to the first lab. The question link returns to the corresponding question. No AWS SDK, credentials, network calls to AWS, resource creation, user command execution or real data migration are involved.

The models are defined in `quiz/aws-labs.js`; question explanations and primary AWS references come from `quiz/aws-scenarios.js`. Example commands appear only where useful and are never executed. Simulated observations are not represented as raw CLI output. Conceptual labs show event/readiness observations instead of invented commands.

These are deliberately limited models: passing selected checks does not validate real security, migration consistency, availability, DNS propagation, WAF effectiveness or DDoS resilience. Each lab states its assumptions. The existing packet-routing simulator remains a separate, more detailed VPC example.

From the repository root: `node --test tests/*.test.cjs`.
