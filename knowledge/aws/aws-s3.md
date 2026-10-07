# Amazon S3

> **S3 stores objects in buckets. An object is a blob plus a key, not a file on a disk you can mount as a normal filesystem.**

```text
bucket: priyexa-app-logs
  └── key: 2026/10/07/app.json.gz     the object
```

Buckets are global in name and regional in location. `priyexa-app-logs` can exist once in the world. The data sits in the region you chose. There are no directories. The slash in the key is a convention that the console draws as folders.

## Durability and classes

S3 is designed for very high durability of objects across Availability Zones in the region. That does not stop you from deleting them. Versioning keeps older copies when someone overwrites or deletes. A lifecycle rule can expire old versions and move cold data to a cheaper class.

| Class | Use |
| --- | --- |
| Standard | data you read often |
| Intelligent-Tiering | when you do not want to think about access patterns |
| Standard-IA and Glacier classes | data you rarely read, cheaper to keep, slower or costlier to fetch |

The bill surprise is usually request volume, retrieval from Glacier, or data transfer out, not the storage line you estimated.

## Access

Block Public Access should be on at the account and the bucket. Objects are private unless a policy says otherwise. Prefer a bucket policy that allows a specific role, or presigned URLs that expire, over a public bucket "because the website needs it." Static websites can sit behind CloudFront with the bucket locked to the distribution.

```json
{
  "Effect": "Deny",
  "Principal": "*",
  "Action": "s3:*",
  "Resource": [
    "arn:aws:s3:::priyexa-app-logs",
    "arn:aws:s3:::priyexa-app-logs/*"
  ],
  "Condition": { "Bool": { "aws:SecureTransport": "false" } }
}
```

That deny blocks non-TLS access. Encryption at rest is on by default now. Use a customer-managed KMS key when you need to control who can decrypt, and remember that the role needs both S3 and KMS permissions or reads fail in a confusing way.

## Safety rails for important buckets

- Versioning on
- A lifecycle you have read
- Block public access
- Server access logs or CloudTrail data events if the data is sensitive
- Replication only when you have a region-failure story, not by reflex

S3 is the usual Terraform state backend, the usual artifact bucket, and the usual log archive. Those three buckets should not be the same bucket, and none of them should be public.
