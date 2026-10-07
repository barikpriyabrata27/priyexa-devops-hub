# NAT Gateway

> **A NAT gateway lets private instances open connections to the internet without accepting connections from the internet.**

```text
private instance                         no public IP
      │
      │  0.0.0.0/0 route
      ▼
NAT gateway in a public subnet          has an Elastic IP
      │
      ▼
internet gateway
      │
      ▼
software updates, external APIs, package registries
```

The return traffic for those outbound connections is allowed back. A stranger on the internet cannot open a new connection to the private instance through the NAT gateway.

## Place it correctly

The NAT gateway must live in a public subnet. Its subnet's route table points at the internet gateway. The private subnet's route table points at the NAT gateway. If you reverse those, nothing works and the error messages are dull.

One NAT gateway lives in one Availability Zone. If that zone fails, private instances in other zones lose internet egress when they all share that NAT. Production patterns put one NAT gateway in each zone and point each private subnet at the NAT in its own zone. That also avoids cross-zone data charges.

## Cost

A NAT gateway charges for every hour it exists and for every gigabyte it processes. A quiet dev account with three NAT gateways can cost more than the instances behind them. Dev can share one NAT. Production usually should not.

VPC endpoints for S3 and DynamoDB are free of NAT data charges for that traffic and do not need the internet at all. If your private nodes mostly pull from S3, an endpoint is the better path.

## NAT instance versus NAT gateway

A NAT instance is an EC2 machine you build yourself to do the same job. You patch it, you size it, and you notice when it falls over. A NAT gateway is the managed version. Use the gateway unless you have a constraint that forbids it.

## When private should mean no NAT

A data subnet often should not have a default route at all. Databases that "just need to phone home" become databases that can be persuaded to phone out with your data. Give them a route only for a specific need, such as a controlled path for backups to S3 through an endpoint.
