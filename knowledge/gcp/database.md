# Databases on GCP

> **Use a managed database unless you have a reason you can explain. Cloud SQL and Spanner cover most relational needs. You still own the schema and the queries.**

```text
application
    │  private IP, IAM or a rotated password
    ▼
Cloud SQL instance
    ├── automated backups
    ├── a maintenance window
    └── high availability across zones, if you turned it on
```

## Cloud SQL

PostgreSQL, MySQL, and SQL Server. A private IP on the VPC beats a public IP with an allow-list. Automated backups plus point-in-time recovery protect you from bad SQL. High availability protects you from a zone failure. They are different switches. Enable both in production. Test a restore into another instance. Restoring over the live instance is not the drill.

Connections from GKE or Cloud Run should go through the Cloud SQL connector or a private IP path, with the runtime service account granted `roles/cloudsql.client`. Stuffing the database password into an environment variable in the console is the habit to retire. Secret Manager holds it. Rotation is a planned change, not a hope.

Read replicas help read-heavy loads. They lag. A user who writes and then reads from the replica may not see the write. Send that read to the primary.

## Spanner

Spanner is the horizontally scaled relational database when you need strong consistency across regions and you can live with its schema rules. It costs more and solves a problem Cloud SQL does not claim to solve. Do not pick it because it sounds impressive in a diagram.

## Memorystore and Firestore

Memorystore is managed Redis or Memcached, a cache, not a system of record. Firestore is a document database that scales without you planning disks. Choose it when the access pattern is documents by key, not when you need arbitrary SQL joins.

## The questions that matter in review

- Is there a private path only?
- What is the recovery point, in minutes, and when did we last prove a restore?
- Who can export the data, and is that export logged?
- What happens to in-flight requests during failover?

If those answers are "we think so," the database is not done.
