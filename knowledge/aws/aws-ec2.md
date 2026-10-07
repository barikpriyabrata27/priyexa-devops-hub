# EC2 in Production

> **One instance is a demo. Production is a group of instances, behind a load balancer, in more than one Availability Zone, replaced instead of patched in place.**

[ec2.md](ec2.md) is the machine. This page is the fleet.

## Sizes and money

An instance type is a shape: `t3.micro`, `m7i.large`, `c7g.xlarge`. The family letter is a hint (`c` compute, `m` balanced, `r` memory, `g` Graviton ARM). Do not memorize the price list. Measure CPU, memory, and network, then change the type. A vertical resize requires a stop for most types.

| Option | You pay | You accept |
| --- | --- | --- |
| On-Demand | the rack rate | nothing, it stays until you stop it |
| Savings Plan or Reserved | less, for a commitment | paying even when idle |
| Spot | much less | AWS can take it back with a short warning |

Spot is a gift for workers that can die. It is a trap for the only database. Mix Spot and On-Demand in an autoscaling group when the work is stateless.

## Autoscaling

An Auto Scaling group keeps a desired count of instances from a launch template, across the subnets you list. A launch template is the AMI, type, security group, and user data, versioned. The group replaces unhealthy instances. A load balancer stops sending traffic to an instance that fails its health check.

Scale on something the user feels: CPU is easy, queue depth or request count is often truer. Scale out before you are on fire. Scale in slowly so you do not flap.

## Health

```text
system status check     the host hardware or AWS network — stop/start moves you
instance status check   your OS failed to boot or kernel-panicked — look at the console log
load balancer check     your app did not answer — the process, the port, the security group
```

Those three fail differently and the fixes differ. Restarting the app does nothing for a failed system status check.

## Patch by replacing

Launch a new instance from a new AMI, wait until it is healthy, drain the old one, terminate it. That is the same idea as a Kubernetes rollout, with more minutes. Patching over SSH and hoping the other two instances match is how "it only fails in prod" begins.

## A small checklist

- Instances in private subnets, more than one zone
- IMDSv2 required, so a stolen application cannot casually read the role credentials from the metadata service
- Instance role instead of access keys on disk
- Detailed monitoring and a log agent
- Termination protection on anything you cannot recreate from an AMI in minutes
