# Security Group

> **A security group is a virtual firewall on a network interface. You write allow rules. Anything you do not allow is denied. Return traffic for an allowed connection is allowed automatically.**

```text
internet ──► security group on the load balancer ── allow 443 from the world
                    │
                    ▼
             security group on the app ── allow app port only from the LB group
                    │
                    ▼
             security group on the database ── allow 5432 only from the app group
```

Referencing another security group, instead of a CIDR, means "whoever has that group," even as instances are replaced. CIDRs go stale. Group references follow the role.

## Stateful, and why that matters

If an app is allowed to connect out to PostgreSQL, the reply packets are allowed back without an inbound rule for the ephemeral ports. Network ACLs are not stateful. People who add a NACL and allow only port 5432 inbound then watch the database "randomly" fail, because the return half of the connection is blocked. Security groups do not have that trap.

## Rules are allow-only

You cannot write a deny inside a security group. If a source matches any allow, it is allowed. Combine that with "someone added `0.0.0.0/0` on port 22 for five minutes in 2022 and never removed it," and you get the audit finding. Review rules. Name groups by role: `payments-app`, `payments-db`.

## Defaults

The default security group in a VPC allows all traffic from itself. New instances you forget to reassign land in that group and can talk to each other. Do not use the default group for workloads. Set an explicit group on every instance, load balancer, and RDS cluster.

## A tight pattern

| Group | Inbound | Outbound |
| --- | --- | --- |
| load balancer | 443 from the internet | app port to the app group |
| app | app port from the load balancer group | 443 to anywhere it must call, 5432 to the db group |
| db | 5432 from the app group | none, or only what backups require |

Outbound "allow all" is the default and is convenient. Restricting outbound is worth it for instances that should only reach a package mirror and a secret store. It is noisy to get right. Do it on purpose for sensitive tiers, not as a drive-by on every group in one afternoon.

## Troubleshooting order

Security group, then network ACL, then route table, then "does the process listen?" A group that allows port 443 does not help an application that is listening on 8080. Flow logs show ACCEPT or REJECT. REJECT on the way in is the group or the NACL. No packet at all is a route or a wrong IP.
