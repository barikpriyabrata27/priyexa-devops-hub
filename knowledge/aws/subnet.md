# Subnet

> **A subnet is a range of IP addresses inside one Availability Zone. The zone is the failure boundary. The route table is what makes the subnet public or private.**

```text
ap-south-1a                         ap-south-1b
┌─────────────────────────┐        ┌─────────────────────────┐
│ public  10.20.0.0/24    │        │ public  10.20.1.0/24    │
│ private 10.20.10.0/24   │        │ private 10.20.11.0/24   │
└─────────────────────────┘        └─────────────────────────┘
```

Put a load balancer node and an application node in each zone. If zone A disappears, zone B still serves traffic. A subnet cannot span zones. That is the point.

## Sizing

A `/24` has 256 addresses. AWS reserves five in every subnet (network, gateway, DNS, and two future uses), so a `/24` yields about 251 usable addresses. Load balancers and NAT gateways consume addresses. A subnet that is "only a few instances" today becomes tight when an autoscaling group doubles during an incident. `/24` per tier per zone is a boring default that rarely embarrasses you. A `/28` will.

## Public and private are routes

| | Public subnet | Private subnet |
| --- | --- | --- |
| Route to internet | internet gateway | NAT, or nothing |
| Instances need public IPs | yes, to be reachable | no |
| Typical residents | load balancer, bastion, NAT | app servers, workers |
| Database | no | data subnet with no internet route |

Auto-assign public IP is a subnet setting. Leaving it on for a private subnet is how an instance you thought was internal gets a public address the moment a route exists.

## One subnet, one main job

Mixing databases and web servers in one subnet forces one route table and one NACL on both. Split them. The data subnet's route table has local routes only, plus maybe a path to an on-premises network. It does not have `0.0.0.0/0`.

## IP addresses run out

Symptoms: autoscaling fails, tasks stay pending, "insufficient free addresses." Fixes: a larger CIDR associated to the VPC (you can add secondary CIDRs), new subnets, or less waste. You cannot resize a subnet in place. You create a new one and move workloads.
