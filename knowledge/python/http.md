# HTTP APIs

> **Most DevOps Python calls an HTTP API: a health check, a webhook, a registry, or a cloud endpoint. The standard library is enough for the simple ones.**

```python
import urllib.request

def health_ok(url: str, timeout: float = 5) -> bool:
    request = urllib.request.Request(url, method="GET")
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return 200 <= response.status < 300
```

Always set a timeout. A missing timeout is a Jenkins stage that occupies an agent until a human notices. Treat connection errors and timeouts as failures of the check, not as surprises.

## Status codes

`200` to `299` is success for a health check. `503` from a load balancer means no healthy backend. Read the body only when it is small and useful. Do not log a body that might contain a token.

Sending a webhook is a POST with a JSON body and a timeout. Retry a network failure a small, fixed number of times. Do not retry a `400`. You sent the wrong payload and repeating it will not help. Do retry a `429` or a `503` with a short wait, and then stop.

## Authentication

Pass a token in a header from the environment. Never put it in the URL. Query strings end up in access logs. Prefer the platform's identity, a cloud role or a workload identity, over a long-lived key in a variable, when the API allows it. See [tokens](../auth/tokens.md).

`requests` is fine when you already depend on it and want a clearer API. It is not required to learn the idea. The idea is: timeout, status, no secrets in the log, a bounded retry.
