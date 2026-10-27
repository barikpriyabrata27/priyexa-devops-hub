# AWS VPC Routing Simulator

An interactive, browser-only IPv4 lab for exploring VPC route tables and common paths between EC2, private RDS, and the internet. No AWS account, credentials, services, or installation are required.

Open `index.html` in a browser, or select **Labs → VPC Routing Simulator** from the Priyexa DevOps hub. The simulator uses example IP addresses and a simplified network. It does not validate a real AWS environment.

Use the source and destination controls, then step through or play the route. The lab conditions let you explore a missing NAT gateway, a public EC2 without a public IP, and blocked database access. Security groups, network ACLs, service availability, and other network dependencies are simplified.

References: [AWS VPC route tables](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html) and [NAT gateway scenarios](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-scenarios.html).
