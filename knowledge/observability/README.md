# Observability

Observability is how you tell what the system is doing without logging into a box and guessing. Three signals carry almost all of it.

```text
metrics     numbers over time        "error rate doubled at 14:02"
logs        what a process said      "payment declined, code=51"
traces      one request across hops  "420 ms was the database span"
```

A dashboard that only shows CPU is not observability. CPU can be idle while users wait on a lock. The useful set is a symptom (latency, errors), a way to see which hop, and the line the process wrote.

## The pages

- [Metrics and Prometheus](metrics.md)
- [Logs](logs.md)
- [Traces](traces.md)
- [OpenTelemetry](opentelemetry.md)
- [Grafana](grafana.md)
- [Alerting](alerting.md)

## How they meet

Put one id on the request and pass it through. The access log prints it. The trace uses it. The metric is the count of requests that failed in that minute. From an alert you open the dashboard, from the dashboard you open the trace, from the trace you open the log line. If those three do not share an id, you have three tools and no investigation.

Kubernetes and cloud metrics do not replace application metrics. The cluster can be green while the checkout endpoint returns 500.

Related reading: [CI/CD troubleshooting](../ci-cd/ci-cd-troubleshooting.md) for a failed pipeline, and [Kubernetes troubleshooting](../kubernetes/kubernetes-troubleshooting.md) for a pod that never becomes Ready.
