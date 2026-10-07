# Alerting

> **An alert should be something a person can act on. A chart that moved is not an alert.**

Page on symptoms users feel, or on the thing that is about to become one: error ratio, latency, queue age, disk that will be full tonight, a certificate that expires this week. Chat-notify on warnings. Do not page on CPU at 70 percent.

```text
symptom alert     users are failing now          page
burn alert        the error budget is vanishing  page or ticket
diagnostic        CPU, restarts, one node        dashboard or ticket
```

## SLO burn, when you are ready

An SLO is the promise, such as 99.9 percent of requests under the latency line. The error budget is what you are allowed to miss. A fast-burn alert fires when that budget would be gone in hours. A slow-burn alert becomes a ticket when the month is at risk. This replaces a pile of threshold alerts that all mean "something is a bit worse."

## A flood is one cause

When hundreds of alerts fire together, sort by what started first. The database, DNS, a bad deploy, or a zone. Silence the downstream copies once the upstream is named, so the channel can be read. After the incident, delete every alert that fired and changed nobody's next action.

## Each alert needs a sentence

What it means, which dashboard, what to check first, and who owns it. An alert with no owner is a mailing list. A runbook that says "investigate" is not a runbook. Include the query. The person on call should not have to reconstruct it at 2 a.m.

Test the route. An alert that has never been delivered is a wish. Send a test page when you add the receiver, and again when you change the on-call calendar.
