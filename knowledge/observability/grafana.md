# Grafana

> **Grafana is the screen. It queries Prometheus, the log store, and the trace store. It does not collect anything itself.**

One Grafana, several datasources. A service dashboard has four panels that match the investigation:

```text
request rate
error ratio
latency p95
and a link: trace id in a log line opens the trace
```

Derived fields are how a log line becomes a click. The log contains `trace_id`. Grafana's datasource knows that field and opens Tempo. Without that, people copy ids between tabs and miss digits.

## Dashboards people will open

One per service, not one giant board for the company. A row for the RED numbers, a row for saturation (CPU throttling, pool usage, queue depth), and a row of links to the logs. The cluster dashboard is separate: nodes, pods pending, restarts. An executive board of fifty panels is where alerts go to be ignored.

## Alerts can live here or in Alertmanager

Prometheus alert rules and Alertmanager are the usual paging path. Grafana alerting is fine when the query is already a Grafana query across more than one source. Do not define the same page in both and then wonder why two notifications arrive. Pick one route for paging.

Folder permissions should follow the team. A dashboard someone cannot edit will rot. A dashboard everyone can edit on a Friday will lose its axes. Review dashboard changes the way you review a monitor, because a broken panel looks like a healthy service.
