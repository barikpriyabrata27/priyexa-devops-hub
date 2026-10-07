# Amazon RDS

> **RDS is a managed relational database. AWS runs the engine, the failover, and the backups you configured. You still design the schema, the SQL, and the access path.**

```text
application in private subnets
        │
        │  security group: 5432 from the app only
        ▼
RDS instance or cluster, private subnets, no public IP
        │
        ├── automated backups and snapshots
        └── standby in another AZ, if Multi-AZ is on
```

Engines include PostgreSQL, MySQL, MariaDB, Oracle, SQL Server, and Amazon Aurora. Pick the engine your application already speaks. Aurora is the AWS-built compatible edition, with storage that spans zones. Standard RDS Multi-AZ is a primary plus a standby that you do not read from, unless you add a read replica on purpose.

## What "managed" covers

Patching the database software in a window you set. Replacing a failed instance. Taking automated backups and keeping them for the retention you chose. You do not SSH to the database server and `apt upgrade` it. You also do not get the OS.

## What it does not cover

Slow queries. A missing index. An application that opens a connection per request and exhausts the limit. A security group that lets the internet in because `Publicly accessible` was yes and `0.0.0.0/0` was convenient. RDS will faithfully host a badly exposed database.

## Backups versus Multi-AZ

Multi-AZ keeps you up when a node or a zone fails. It is not a backup. A bad `DELETE` replicates to the standby immediately. Backups and point-in-time recovery are how you return to a moment before the bad statement. Test a restore. An untested snapshot is a hope.

Set a backup window and a maintenance window that are not your peak. Turn on deletion protection for production. Set `skip_final_snapshot` to false in Terraform so destroy cannot be silent.

## Connections

The endpoint is a DNS name. In Multi-AZ the name points at the current primary. Applications must reconnect after failover. Use the subnet group in the data subnets, a parameter group for settings you can defend, and encryption at rest with KMS. Force TLS for clients if the engine supports it. Passwords belong in Secrets Manager, rotated, not in the application image.

## When RDS is the wrong tool

Huge read fan-out may want replicas or a cache. Key-value lookups at extreme rate may want DynamoDB. A database you must run with a very custom extension may still be an EC2 instance you operate yourself — and then you own the backups too.
