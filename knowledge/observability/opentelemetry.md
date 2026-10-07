# OpenTelemetry

> **OpenTelemetry is the instrumentation standard. It is not a database. You still pick where metrics, logs, and traces are stored.**

```text
SDK in the service
        │  OTLP
        ▼
Collector on the node
        │
        ├── metrics → Prometheus
        ├── traces  → Tempo or Jaeger
        └── logs    → the log store, if you send them this way
```

The SDK creates spans and metrics in process. The collector receives, batches, and exports. Put the collector close to the pod, usually a DaemonSet, so every service is not opening a connection to one central box. The collector is the place to add the cluster name and to drop health-check spans.

## Why a standard matters

Before this, each vendor had a private agent and a private API. Switching from Jaeger to Tempo meant re-instrumenting. With OpenTelemetry the application depends on the SDK, and the exporter is configuration. You can change the backend without a new library in every service.

## A first service

Instrument the HTTP server and the HTTP client. Propagate context. Export to a local collector. Confirm one request produces a span with a child. Then do the next service. Doing all ten at once, with no proof the header survives, produces ten traces that do not join.

Do not send spans to Prometheus. Prometheus stores numbers. Tempo or Jaeger stores traces. Grafana can show both. That split is the design, not a missing feature.
