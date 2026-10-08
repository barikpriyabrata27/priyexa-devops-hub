# Firewalls

> **A firewall decides which packets may pass. "The instance is in a private subnet" is not a decision. The rules are.**

```text
stateless     each packet judged alone          cloud NACLs, some router ACLs
stateful      return traffic for an allowed     security groups, iptables conntrack,
              connection is allowed             most host firewalls
```

A stateful rule "allow outbound TCP/443" also allows the replies. A stateless ruleset needs an explicit rule for the return traffic, including the ephemeral source ports. Forgetting the return rule looks exactly like a timeout.

## Order is product-specific

Some systems use the first matching rule (priority). Some security-group models are a set of allows, with an implicit deny, and no ordering between allows. Read the product you are in before arguing about "the rule above." In AWS, security groups are stateful allows, and network ACLs are stateless and numbered. In GCP, firewall rules have a priority and an implicit deny ingress. The idea is the same. The syntax is not. Details live in [AWS security groups](../aws/security-group.md) and [GCP networking](../gcp/networking.md).

## Default deny is the posture

Allow the ports you can name, from the sources you can name. `0.0.0.0/0` on port 22 is an invitation. `0.0.0.0/0` on port 443 is often the product. Say which one you mean.

Egress rules matter as much as ingress once a host is compromised or a workload is only supposed to reach one API. A default allow-all egress is convenient and is how data leaves. Restrict egress on tiers that hold data. Expect the first week to find legitimate calls you forgot, including DNS, NTP, and the package mirror.

## What a drop looks like

```text
allowed, nothing listening     connection refused
dropped                        timeout
rejected with RST or ICMP      refused, quickly
```

A drop is quieter and slower to diagnose than a reject. Security tools like drops because scanners learn less. Operators like rejects because `curl` fails in one second instead of thirty. Pick deliberately, and set client timeouts either way.

Host firewalls and cloud firewalls both apply. Opening the security group does nothing if `nftables` on the host still drops the port. Opening the host does nothing if the security group drops it. Check both before you declare the application broken.

A security group attached to the wrong network interface, or a rule aimed at the wrong tag, is a configuration bug with the same symptom as a network outage. The diff of the rule is the incident timeline.
