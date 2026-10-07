# Managed Instance Groups

> **A managed instance group keeps a template's worth of VMs alive, replaces the unhealthy ones, and rolls out a new template without you SSH-ing through the fleet.**

```text
instance template          the recipe: image, type, disk, service account, startup
        │
        ▼
managed instance group     desired size, zones, health check, update policy
        │
        ├── VM in zone a
        ├── VM in zone b
        └── VM in zone c
        │
        ▼
backend of a load balancer
```

Regional groups spread VMs across zones. Zonal groups do not. Production web tiers should be regional.

## Healing and scaling

A health check that hits the real application port is the difference between "the VM is up" and "the app answers." The group recreates a VM that fails the check. Autoscaling adds and removes VMs from signals such as CPU or a load-balancer metric. Scale-in that is too aggressive flaps. Set a cooldown so a new VM can finish booting before the next decision.

## Rolling updates

You create a new instance template (a new image, usually) and start a rolling update: surge a few extra VMs, wait until they are healthy, delete old ones. `maxSurge` and `maxUnavailable` are the same idea as a Kubernetes rolling update. A bad image should stop the rollout because new VMs fail the health check. If your health check always passes, the bad image will replace the fleet happily.

## Templates are immutable in spirit

You can technically mutate pieces of this world in the console. Do not. A new template version is a reviewed change. The group should use the template you think it uses. Drift here means the next rollout resurrects an old startup script.

Use groups for anything stateless. A single database VM is not a candidate. That belongs on Cloud SQL, or on a deliberately pet-like instance with backups, not in an autoscaler that will replace it.
