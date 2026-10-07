# Logs

> **A log is an event the process wrote. If it is not structured, searching it is a guessing game.**

```text
app writes JSON to stdout
        │
        ▼
Fluent Bit DaemonSet on the node
        │  adds namespace, pod, node
        ▼
OpenSearch or Elasticsearch
        │
        ▼
Kibana or Grafana
```

Write JSON to stdout. Do not write a second copy to a file in the container. The node already has the stdout stream, and a file fills the disk. A collector DaemonSet is the usual Kubernetes choice. A sidecar is for a process that cannot log to stdout. A Deployment of one central collector is for aggregation, not for reading every node's files.

## Fields worth agreeing on

`timestamp`, `level`, `service`, `environment`, `message`, and `trace_id`. The logging platform owns retention and index patterns. The application owns those fields. A new service is done when a known line is searchable within a minute, in the right environment, and a developer can read their service without reading everyone else's.

## EFK and ELK

Both store in Elasticsearch (or OpenSearch) and search in Kibana. **F is Fluent Bit. L is Logstash.** Fluent Bit is the light collector on every node. Logstash is the heavy processor you add when the transformation is actually complicated. Do not run Logstash as a DaemonSet because a diagram said ELK.

## Indexes

The collector chooses the index name, often `logs-service-env-date`. An index template fixes the mapping and the lifecycle: hot, then delete. A field that changes type between documents will make the index reject writes. High-cardinality fields stay out. Kibana index patterns are only the window over those indexes.

Never log secrets, tokens, or full card numbers. A structured log makes that mistake easier to search, which is worse, not better.
