# Cloud Functions

> **Cloud Functions runs a function in response to an event. The unit of deployment is the function, not a server and not a whole service.**

```text
trigger                         function
HTTP request                ┐
message on a topic          ├──►  your code, one entry point
object finalized in a bucket┘
new file in Cloud Storage
```

2nd gen functions run on Cloud Run's machinery. You get longer timeouts, concurrency, and a clearer revision model. Prefer 2nd gen for anything new. 1st gen is the older system you will still see in existing projects.

## What belongs here

A small reaction: validate a file that landed in a bucket, fan a message out, handle a webhook. The function should be idempotent. Events are delivered at least once. If "send the receipt" runs twice, the customer must not be charged twice. Use an idempotency key, a transaction, or a state row.

## What does not

A request that can run past the timeout. A large in-memory model. A workload that needs a sidecar. Those are Cloud Run or GKE. Stretching a function with a 540-second timeout and a prayer is how on-call inherits a mystery.

## Identity and exposure

The function runs as a service account. Give that account the role for the one bucket or the one table, not Editor on the project. HTTP functions are public only when you grant `allUsers` the invoker role. Private functions require the caller to present identity. Event triggers need permission to invoke the function. Missing that permission looks like "the file uploaded and nothing happened," and the logs are in the function's project if you look.

## Cost and failure

A bug that re-emits the event it consumes will scale until the quota or the invoice stops it. Cap instances. Send failures to a dead-letter topic after a bounded number of retries. Alert on error logs. Functions are quiet when healthy and extremely loud when a loop finds them.
