# Serverless on AWS

> **Serverless means you do not run the server. You still own the code, the permissions, the timeouts, and the bill when a bug loops a million times.**

```text
event                  function                 permission
API request        ┐
S3 object created  ├──►  Lambda function  ──►  what the function's role may call
queue message      ┘         │
                              └── logs in CloudWatch, errors if you watch them
```

Lambda runs a function for a short time in an environment AWS starts for you. You bring a zip or a container image. You set memory, and CPU scales with that memory setting. You set a timeout. When nothing is calling, you pay nothing for compute.

## What it is good at

Irregular work: resize an image when it lands in a bucket, react to a webhook, run a small API, drain a queue. It is a poor fit for a long-lived connection, a big in-memory cache, or a job that runs for hours. The maximum timeout is 15 minutes. If the work might take longer, use a container on ECS or a batch job, not a bigger hope.

## The cold start

The first call after idle pays to start the runtime. For many internal jobs nobody notices. For a user-facing API, provisioned concurrency or a runtime that starts fast (often a smaller language runtime, or a careful JVM) is the lever. Do not "fix" cold starts by pinging the function every minute unless you have measured that the ping is cheaper than the alternative.

## Permissions and the event

The function's role is what it can do after it starts. The resource policy on the function is who may invoke it. Both must be right. A function triggered by S3 needs permission for S3 to invoke it, and the role needs permission to read the bucket if the function reads the object. Logging needs permission to create CloudWatch log streams, or you debug in the dark.

## The bill you did not mean

A function that writes a file to S3 that triggers the same function is a loop. Set a reserved concurrency limit on anything that can fan out, so a bug spends a capped amount. Alarms on error count and on throttles belong in the first deploy, not after the invoice.

API Gateway or a Lambda function URL puts HTTP in front of a function. SQS in front of a function gives you retries and a dead-letter queue. The queue is the kinder design when the work must not disappear because the function failed once.

Serverless is not "no operations." It is different operations: concurrency, idempotency, traces, and least privilege on a role that is easy to make far too strong because the console button says "create a new role with basic permissions" and then everyone adds `*` the first time AccessDenied appears.
