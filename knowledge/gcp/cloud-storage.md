# Cloud Storage

> **Cloud Storage is objects in buckets: a name, bytes, and metadata. It is not a POSIX disk.**

```text
bucket  gs://priyexa-prod-assets
  └── object  images/logo.png
```

Bucket names are global. The location is not. A region bucket stays in one region. A dual-region or multi-region bucket spreads further and costs more. Put the bucket in the same place as the readers. Egress between continents is the line item people notice later.

## Classes

Standard for hot data. Nearline, Coldline, and Archive for data you touch less often. Retrieval then costs money and, for the colder classes, can have a minimum storage duration. Lifecycle rules move or delete objects so you do not pay Standard prices for last year's logs.

## Access

Uniform bucket-level access turns off the old per-object ACL maze and uses IAM only. Turn it on. `allUsers` with `roles/storage.objectViewer` makes the bucket public. That is correct for a truly public website asset and wrong for everything else. Prefer a backend bucket behind a load balancer, or a signed URL that expires.

Public access prevention is an organization policy you can set so a project cannot make a bucket public even if someone tries.

## Versions and deletes

Object versioning keeps the previous generation when you overwrite. Soft delete keeps a recently deleted object for a retention window. Neither replaces a backup of data you cannot recreate if the whole bucket is removed by someone with permission. Separate the log archive bucket from the application bucket. Lock retention on audit logs so even an admin cannot quietly wipe them during the window.

## Consistency

Uploading an object and immediately reading it is safe. The older "eventual consistency" caveats for Cloud Storage are gone for the operations you care about. What still hurts is caching: a CDN or a browser holding an old object while you overwrite the same name. Give static assets versioned names and treat overwrites as a cache problem.
