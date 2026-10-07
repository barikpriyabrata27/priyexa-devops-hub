# Traces

> **A trace is one request, broken into spans, one span per hop. It answers where the time went.**

```text
ingress span
   └── api span          40 ms
         ├── auth span   5 ms
         └── db span     380 ms     this is the story
```

Metrics said latency rose. The trace says it rose inside the database call, not in your JSON parser. Logs then show the slow query. Without the trace you scale the API and the wait stays.

## What has to be true

Every service uses the same context format, usually the W3C `traceparent` header. Incoming requests extract it. Outgoing calls inject it, including the database client when the driver supports it. If one service generates a new id and drops the header, the trace breaks in half and you debug two mysteries.

Sampling keeps the bill sane. Keep a high rate in dev. In production, sample a fraction, and always keep the errors. A trace store of every span from a busy API is a second production system.

Ten microservices means you should be able to send one request in the front door and see ten spans on one trace. If you see ten separate traces, propagation is broken.

See [OpenTelemetry](opentelemetry.md) for the instrumentation and the collector, and [Grafana](grafana.md) for looking at the result next to the metrics.
