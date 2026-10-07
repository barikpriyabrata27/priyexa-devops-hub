# Amazon EC2

> **EC2 is a virtual machine you rent by the second. You choose the operating system image, the size, the network, and the disk. Patching the OS is still your job.**

```text
AMI (the image)
  + instance type (CPU, memory, network)
  + subnet and security group
  + IAM instance profile
  + EBS volumes
  = an instance, running in one Availability Zone
```

## The image

An AMI is a snapshot of a root disk plus metadata that says how to boot it. Amazon Linux, Ubuntu, and Windows are common starting points. A custom AMI with the agent, the hardening, and the timezone already done boots faster and drifts less than a long user-data script. Bake the image in a pipeline. Do not SSH to a golden machine and save it by hand with no record of what you installed.

## User data runs at boot

```bash
#!/bin/bash
dnf update -y
dnf install -y nginx
systemctl enable --now nginx
```

User data is not a configuration management system. It runs on first boot (and again only if you tell it to). It is visible to anyone who can describe the instance. Do not put passwords in it. Pull secrets at boot from a secret store, using the instance role.

## Disks

The root volume is usually EBS, a network disk that outlives the instance if you say so. Instance store is fast local disk that disappears when the instance stops. Databases on instance store without a replica are a bet. Encrypt EBS volumes. gp3 is the boring default. io2 is for a measured I/O problem, not a feeling.

## Reach it without SSH on the internet

SSM Session Manager uses the instance role and the SSM agent to give you a shell. No port 22, no bastion, and the session can be logged. If you do use SSH, the key pair is injected once. Losing the private key means replacing the key via another path, not downloading it again from AWS. AWS never stored your private key.

## Stop, start, terminate

Stop keeps the EBS volumes and usually moves the instance to new hardware on start. The public IP changes unless it is an Elastic IP. Terminate deletes the instance. Volumes go with it unless `DeleteOnTermination` is false. Termination protection exists so a cleanup script cannot eat the one box you meant to keep.

Sizing, purchasing, autoscaling, and what to do when the status check fails are in [aws-ec2.md](aws-ec2.md).
