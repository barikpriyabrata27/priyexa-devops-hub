# Metrics and Prometheus

> **A metric is a number you can graph. Prometheus collects those numbers by scraping HTTP endpoints and stores them as time series.**

```text
application /metrics
node exporter
kube-state-metrics
        │
        ▼  scrape every 30s
   Prometheus
        │
        ├── Grafana dashboards
        └── Alertmanager
```

## The four kinds you will actually use

| Type | Moves | Example |
| --- | --- | --- |
| Counter | only up | requests served |
| Gauge | up and down | memory in use, queue depth |
| Histogram | a distribution | request latency buckets |
| Summary | similar, calculated on the client | less common in new work |

Rate of a counter is the chart you want. A raw counter that only climbs does not tell you that errors doubled. `rate(http_requests_total{status=~"5.."}[5m])` does.

## What to scrape in Kubernetes

- The application, on `/metrics`, with labels for service, namespace, and status code.
- node-exporter for the machine: CPU, disk, network.
- kube-state-metrics for objects: desired replicas versus ready, pod restarts.

A scrape interval of 30 seconds is the boring default. Fifteen seconds for a few critical targets. One minute hides a short incident.

## Labels are the bill

Every unique combination of labels is a series Prometheus keeps in memory. `status` and `service` are cheap. `user_id` or a raw URL is how a Prometheus server dies. If you need a per-user fact, that is a log or a trace, not a metric.

## RED and USE

For a service, watch **rate, errors, and duration**. For a resource, watch **utilization, saturation, and errors**. An alert on CPU at 70 percent is usually noise. An alert on error ratio or on p95 latency is the one a user would agree with.

CloudWatch and the GCP operations suite cover the cloud's own numbers: load balancer 5xx, database CPU, NAT bytes. Keep those. Do not force every pod metric through them if Prometheus is already the cluster store.
