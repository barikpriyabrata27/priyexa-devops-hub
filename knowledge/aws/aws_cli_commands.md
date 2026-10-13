# AWS Read-Only Inventory CLI Commands

Use these commands to collect architecture evidence from an AWS account without making changes.

Replace:

- `<profile>` with your AWS CLI profile, for example `freelance`
- `<region>` with the AWS region, for example `us-east-1`
- `<resource-id>` / `<name>` / `<arn>` placeholders with real values from earlier commands

Recommended starting variables in PowerShell:

```powershell
$PROFILE="freelance"
$REGION="us-east-1"
$OUT="D:\RAD365\Doc\aws-inventory"
New-Item -ItemType Directory -Force -Path $OUT
```

## 1. Account and Caller Identity

```powershell
aws sts get-caller-identity --profile $PROFILE --output json | Out-File "$OUT\account-identity.json" -Encoding utf8

aws iam list-account-aliases --profile $PROFILE --output json | Out-File "$OUT\account-aliases.json" -Encoding utf8
```

## 2. Regions

```powershell
aws ec2 describe-regions --profile $PROFILE --output json | Out-File "$OUT\regions.json" -Encoding utf8
```

## 3. VPC and Networking

```powershell
aws ec2 describe-vpcs --region $REGION --profile $PROFILE --output json | Out-File "$OUT\vpcs.json" -Encoding utf8

aws ec2 describe-subnets --region $REGION --profile $PROFILE --output json | Out-File "$OUT\subnets.json" -Encoding utf8

aws ec2 describe-route-tables --region $REGION --profile $PROFILE --output json | Out-File "$OUT\route-tables.json" -Encoding utf8

aws ec2 describe-internet-gateways --region $REGION --profile $PROFILE --output json | Out-File "$OUT\internet-gateways.json" -Encoding utf8

aws ec2 describe-nat-gateways --region $REGION --profile $PROFILE --output json | Out-File "$OUT\nat-gateways.json" -Encoding utf8

aws ec2 describe-egress-only-internet-gateways --region $REGION --profile $PROFILE --output json | Out-File "$OUT\egress-only-internet-gateways.json" -Encoding utf8

aws ec2 describe-network-acls --region $REGION --profile $PROFILE --output json | Out-File "$OUT\network-acls.json" -Encoding utf8

aws ec2 describe-security-groups --region $REGION --profile $PROFILE --output json | Out-File "$OUT\security-groups.json" -Encoding utf8

aws ec2 describe-network-interfaces --region $REGION --profile $PROFILE --output json | Out-File "$OUT\network-interfaces.json" -Encoding utf8

aws ec2 describe-addresses --region $REGION --profile $PROFILE --output json | Out-File "$OUT\elastic-ips.json" -Encoding utf8

aws ec2 describe-key-pairs --region $REGION --profile $PROFILE --output json | Out-File "$OUT\key-pairs.json" -Encoding utf8

aws ec2 describe-prefix-lists --region $REGION --profile $PROFILE --output json | Out-File "$OUT\prefix-lists.json" -Encoding utf8

aws ec2 describe-managed-prefix-lists --region $REGION --profile $PROFILE --output json | Out-File "$OUT\managed-prefix-lists.json" -Encoding utf8
```

## 4. VPC Endpoints and Private Connectivity

```powershell
aws ec2 describe-vpc-endpoints --region $REGION --profile $PROFILE --output json | Out-File "$OUT\vpc-endpoints.json" -Encoding utf8

aws ec2 describe-vpc-endpoint-services --region $REGION --profile $PROFILE --output json | Out-File "$OUT\vpc-endpoint-services.json" -Encoding utf8

aws ec2 describe-transit-gateways --region $REGION --profile $PROFILE --output json | Out-File "$OUT\transit-gateways.json" -Encoding utf8

aws ec2 describe-transit-gateway-attachments --region $REGION --profile $PROFILE --output json | Out-File "$OUT\transit-gateway-attachments.json" -Encoding utf8

aws ec2 describe-vpc-peering-connections --region $REGION --profile $PROFILE --output json | Out-File "$OUT\vpc-peering-connections.json" -Encoding utf8
```

## 5. VPN and Hybrid Connectivity

```powershell
aws ec2 describe-vpn-gateways --region $REGION --profile $PROFILE --output json | Out-File "$OUT\vpn-gateways.json" -Encoding utf8

aws ec2 describe-vpn-connections --region $REGION --profile $PROFILE --output json | Out-File "$OUT\vpn-connections.json" -Encoding utf8

aws ec2 describe-customer-gateways --region $REGION --profile $PROFILE --output json | Out-File "$OUT\customer-gateways.json" -Encoding utf8

aws directconnect describe-connections --region $REGION --profile $PROFILE --output json | Out-File "$OUT\directconnect-connections.json" -Encoding utf8

aws directconnect describe-virtual-interfaces --region $REGION --profile $PROFILE --output json | Out-File "$OUT\directconnect-virtual-interfaces.json" -Encoding utf8
```

## 6. EC2 Compute

```powershell
aws ec2 describe-instances --region $REGION --profile $PROFILE --output json | Out-File "$OUT\ec2-instances.json" -Encoding utf8

aws ec2 describe-instances `
  --region $REGION `
  --profile $PROFILE `
  --query "Reservations[].Instances[].{Name:Tags[?Key=='Name']|[0].Value,ID:InstanceId,Type:InstanceType,State:State.Name,VpcId:VpcId,SubnetId:SubnetId,PrivateIP:PrivateIpAddress,PublicIP:PublicIpAddress,SecurityGroups:SecurityGroups[].GroupId}" `
  --output table | Out-File "$OUT\ec2-inventory-table.txt" -Encoding utf8

aws ec2 describe-volumes --region $REGION --profile $PROFILE --output json | Out-File "$OUT\ebs-volumes.json" -Encoding utf8

aws ec2 describe-snapshots --region $REGION --profile $PROFILE --owner-ids self --output json | Out-File "$OUT\ebs-snapshots-owned.json" -Encoding utf8

aws ec2 describe-images --region $REGION --profile $PROFILE --owners self --output json | Out-File "$OUT\amis-owned.json" -Encoding utf8

aws ec2 describe-launch-templates --region $REGION --profile $PROFILE --output json | Out-File "$OUT\launch-templates.json" -Encoding utf8

aws autoscaling describe-auto-scaling-groups --region $REGION --profile $PROFILE --output json | Out-File "$OUT\autoscaling-groups.json" -Encoding utf8

aws autoscaling describe-launch-configurations --region $REGION --profile $PROFILE --output json | Out-File "$OUT\launch-configurations.json" -Encoding utf8
```

## 7. Load Balancers

```powershell
aws elbv2 describe-load-balancers --region $REGION --profile $PROFILE --output json | Out-File "$OUT\elbv2-load-balancers.json" -Encoding utf8

aws elbv2 describe-target-groups --region $REGION --profile $PROFILE --output json | Out-File "$OUT\elbv2-target-groups.json" -Encoding utf8

aws elbv2 describe-rules --region $REGION --profile $PROFILE --listener-arn <listener-arn> --output json | Out-File "$OUT\elbv2-listener-rules.json" -Encoding utf8

aws elbv2 describe-listeners --region $REGION --profile $PROFILE --load-balancer-arn <load-balancer-arn> --output json | Out-File "$OUT\elbv2-listeners.json" -Encoding utf8

aws elb describe-load-balancers --region $REGION --profile $PROFILE --output json | Out-File "$OUT\classic-load-balancers.json" -Encoding utf8
```

## 8. ECS and ECR

```powershell
aws ecs list-clusters --region $REGION --profile $PROFILE --output json | Out-File "$OUT\ecs-clusters.json" -Encoding utf8

aws ecs list-services --region $REGION --profile $PROFILE --cluster <cluster-arn> --output json | Out-File "$OUT\ecs-services.json" -Encoding utf8

aws ecs describe-services --region $REGION --profile $PROFILE --cluster <cluster-arn> --services <service-name-or-arn> --output json | Out-File "$OUT\ecs-service-details.json" -Encoding utf8

aws ecs list-tasks --region $REGION --profile $PROFILE --cluster <cluster-arn> --output json | Out-File "$OUT\ecs-tasks.json" -Encoding utf8

aws ecs describe-tasks --region $REGION --profile $PROFILE --cluster <cluster-arn> --tasks <task-arn> --output json | Out-File "$OUT\ecs-task-details.json" -Encoding utf8

aws ecs list-task-definitions --region $REGION --profile $PROFILE --output json | Out-File "$OUT\ecs-task-definitions.json" -Encoding utf8

aws ecs describe-task-definition --region $REGION --profile $PROFILE --task-definition <task-definition-arn> --output json | Out-File "$OUT\ecs-task-definition-detail.json" -Encoding utf8

aws ecr describe-repositories --region $REGION --profile $PROFILE --output json | Out-File "$OUT\ecr-repositories.json" -Encoding utf8

aws ecr describe-images --region $REGION --profile $PROFILE --repository-name <repository-name> --output json | Out-File "$OUT\ecr-images.json" -Encoding utf8
```

## 9. Lambda

```powershell
aws lambda list-functions --region $REGION --profile $PROFILE --output json | Out-File "$OUT\lambda-functions.json" -Encoding utf8

aws lambda get-function-configuration --region $REGION --profile $PROFILE --function-name <function-name> --output json | Out-File "$OUT\lambda-function-configuration.json" -Encoding utf8

aws lambda list-event-source-mappings --region $REGION --profile $PROFILE --output json | Out-File "$OUT\lambda-event-source-mappings.json" -Encoding utf8

aws lambda list-layers --region $REGION --profile $PROFILE --output json | Out-File "$OUT\lambda-layers.json" -Encoding utf8
```

## 10. API Gateway

```powershell
aws apigateway get-rest-apis --region $REGION --profile $PROFILE --output json | Out-File "$OUT\apigateway-rest-apis.json" -Encoding utf8

aws apigatewayv2 get-apis --region $REGION --profile $PROFILE --output json | Out-File "$OUT\apigatewayv2-apis.json" -Encoding utf8

aws apigatewayv2 get-domain-names --region $REGION --profile $PROFILE --output json | Out-File "$OUT\apigatewayv2-domain-names.json" -Encoding utf8
```

## 11. S3

S3 bucket listing is global, but many bucket settings are retrieved per bucket.

```powershell
aws s3api list-buckets --profile $PROFILE --output json | Out-File "$OUT\s3-buckets.json" -Encoding utf8

aws s3api get-bucket-location --profile $PROFILE --bucket <bucket-name> --output json | Out-File "$OUT\s3-bucket-location.json" -Encoding utf8

aws s3api get-public-access-block --profile $PROFILE --bucket <bucket-name> --output json | Out-File "$OUT\s3-public-access-block.json" -Encoding utf8

aws s3api get-bucket-policy-status --profile $PROFILE --bucket <bucket-name> --output json | Out-File "$OUT\s3-policy-status.json" -Encoding utf8

aws s3api get-bucket-encryption --profile $PROFILE --bucket <bucket-name> --output json | Out-File "$OUT\s3-encryption.json" -Encoding utf8

aws s3api get-bucket-versioning --profile $PROFILE --bucket <bucket-name> --output json | Out-File "$OUT\s3-versioning.json" -Encoding utf8

aws s3api get-bucket-lifecycle-configuration --profile $PROFILE --bucket <bucket-name> --output json | Out-File "$OUT\s3-lifecycle.json" -Encoding utf8

aws s3api get-bucket-notification-configuration --profile $PROFILE --bucket <bucket-name> --output json | Out-File "$OUT\s3-notifications.json" -Encoding utf8
```

## 12. EFS and FSx

```powershell
aws efs describe-file-systems --region $REGION --profile $PROFILE --output json | Out-File "$OUT\efs-file-systems.json" -Encoding utf8

aws efs describe-mount-targets --region $REGION --profile $PROFILE --file-system-id <file-system-id> --output json | Out-File "$OUT\efs-mount-targets.json" -Encoding utf8

aws fsx describe-file-systems --region $REGION --profile $PROFILE --output json | Out-File "$OUT\fsx-file-systems.json" -Encoding utf8
```

## 13. Databases

```powershell
aws rds describe-db-instances --region $REGION --profile $PROFILE --output json | Out-File "$OUT\rds-db-instances.json" -Encoding utf8

aws rds describe-db-clusters --region $REGION --profile $PROFILE --output json | Out-File "$OUT\rds-db-clusters.json" -Encoding utf8

aws rds describe-db-subnet-groups --region $REGION --profile $PROFILE --output json | Out-File "$OUT\rds-db-subnet-groups.json" -Encoding utf8

aws rds describe-db-parameter-groups --region $REGION --profile $PROFILE --output json | Out-File "$OUT\rds-db-parameter-groups.json" -Encoding utf8

aws dynamodb list-tables --region $REGION --profile $PROFILE --output json | Out-File "$OUT\dynamodb-tables.json" -Encoding utf8

aws dynamodb describe-table --region $REGION --profile $PROFILE --table-name <table-name> --output json | Out-File "$OUT\dynamodb-table-detail.json" -Encoding utf8

aws elasticache describe-cache-clusters --region $REGION --profile $PROFILE --show-cache-node-info --output json | Out-File "$OUT\elasticache-cache-clusters.json" -Encoding utf8

aws elasticache describe-replication-groups --region $REGION --profile $PROFILE --output json | Out-File "$OUT\elasticache-replication-groups.json" -Encoding utf8
```

## 14. CloudFront

CloudFront is global.

```powershell
aws cloudfront list-distributions --profile $PROFILE --output json | Out-File "$OUT\cloudfront-distributions.json" -Encoding utf8

aws cloudfront get-distribution-config --profile $PROFILE --id <distribution-id> --output json | Out-File "$OUT\cloudfront-distribution-config.json" -Encoding utf8

aws cloudfront list-origin-access-controls --profile $PROFILE --output json | Out-File "$OUT\cloudfront-origin-access-controls.json" -Encoding utf8
```

## 15. Route 53 and DNS

Route 53 hosted zones are global.

```powershell
aws route53 list-hosted-zones --profile $PROFILE --output json | Out-File "$OUT\route53-hosted-zones.json" -Encoding utf8

aws route53 list-resource-record-sets --profile $PROFILE --hosted-zone-id <hosted-zone-id> --output json | Out-File "$OUT\route53-records.json" -Encoding utf8

aws route53domains list-domains --region us-east-1 --profile $PROFILE --output json | Out-File "$OUT\route53-domains.json" -Encoding utf8
```

## 16. Certificates and WAF

```powershell
aws acm list-certificates --region $REGION --profile $PROFILE --output json | Out-File "$OUT\acm-certificates-regional.json" -Encoding utf8

aws acm list-certificates --region us-east-1 --profile $PROFILE --output json | Out-File "$OUT\acm-certificates-us-east-1.json" -Encoding utf8

aws wafv2 list-web-acls --region $REGION --scope REGIONAL --profile $PROFILE --output json | Out-File "$OUT\waf-regional-web-acls.json" -Encoding utf8

aws wafv2 list-web-acls --region us-east-1 --scope CLOUDFRONT --profile $PROFILE --output json | Out-File "$OUT\waf-cloudfront-web-acls.json" -Encoding utf8
```

## 17. IAM

IAM is global.

```powershell
aws iam list-users --profile $PROFILE --output json | Out-File "$OUT\iam-users.json" -Encoding utf8

aws iam list-groups --profile $PROFILE --output json | Out-File "$OUT\iam-groups.json" -Encoding utf8

aws iam list-roles --profile $PROFILE --output json | Out-File "$OUT\iam-roles.json" -Encoding utf8

aws iam list-policies --profile $PROFILE --scope Local --output json | Out-File "$OUT\iam-local-policies.json" -Encoding utf8

aws iam get-account-password-policy --profile $PROFILE --output json | Out-File "$OUT\iam-password-policy.json" -Encoding utf8

aws iam get-account-summary --profile $PROFILE --output json | Out-File "$OUT\iam-account-summary.json" -Encoding utf8
```

## 18. Secrets and KMS

```powershell
aws kms list-keys --region $REGION --profile $PROFILE --output json | Out-File "$OUT\kms-keys.json" -Encoding utf8

aws kms list-aliases --region $REGION --profile $PROFILE --output json | Out-File "$OUT\kms-aliases.json" -Encoding utf8

aws secretsmanager list-secrets --region $REGION --profile $PROFILE --output json | Out-File "$OUT\secretsmanager-secrets.json" -Encoding utf8

aws ssm describe-parameters --region $REGION --profile $PROFILE --output json | Out-File "$OUT\ssm-parameters.json" -Encoding utf8
```

## 19. CloudFormation and CDK Evidence

```powershell
aws cloudformation describe-stacks --region $REGION --profile $PROFILE --output json | Out-File "$OUT\cloudformation-stacks.json" -Encoding utf8

aws cloudformation list-stacks --region $REGION --profile $PROFILE --output json | Out-File "$OUT\cloudformation-stack-list.json" -Encoding utf8

aws cloudformation list-stack-resources --region $REGION --profile $PROFILE --stack-name <stack-name> --output json | Out-File "$OUT\cloudformation-stack-resources.json" -Encoding utf8

aws cloudformation get-template --region $REGION --profile $PROFILE --stack-name <stack-name> --output json | Out-File "$OUT\cloudformation-template.json" -Encoding utf8
```

## 20. CloudWatch, Logs, and Alarms

```powershell
aws cloudwatch describe-alarms --region $REGION --profile $PROFILE --output json | Out-File "$OUT\cloudwatch-alarms.json" -Encoding utf8

aws logs describe-log-groups --region $REGION --profile $PROFILE --output json | Out-File "$OUT\cloudwatch-log-groups.json" -Encoding utf8

aws events list-rules --region $REGION --profile $PROFILE --output json | Out-File "$OUT\eventbridge-rules.json" -Encoding utf8

aws scheduler list-schedules --region $REGION --profile $PROFILE --output json | Out-File "$OUT\eventbridge-scheduler-schedules.json" -Encoding utf8
```

## 21. Audit, Compliance, and Threat Detection

```powershell
aws cloudtrail describe-trails --region $REGION --profile $PROFILE --output json | Out-File "$OUT\cloudtrail-trails.json" -Encoding utf8

aws cloudtrail get-trail-status --region $REGION --profile $PROFILE --name <trail-name-or-arn> --output json | Out-File "$OUT\cloudtrail-trail-status.json" -Encoding utf8

aws configservice describe-configuration-recorders --region $REGION --profile $PROFILE --output json | Out-File "$OUT\config-recorders.json" -Encoding utf8

aws configservice describe-delivery-channels --region $REGION --profile $PROFILE --output json | Out-File "$OUT\config-delivery-channels.json" -Encoding utf8

aws guardduty list-detectors --region $REGION --profile $PROFILE --output json | Out-File "$OUT\guardduty-detectors.json" -Encoding utf8

aws securityhub describe-hub --region $REGION --profile $PROFILE --output json | Out-File "$OUT\securityhub-hub.json" -Encoding utf8
```

## 22. Cost and Tagging

```powershell
aws resourcegroupstaggingapi get-resources --region $REGION --profile $PROFILE --output json | Out-File "$OUT\tagged-resources.json" -Encoding utf8

aws ce get-cost-and-usage `
  --profile $PROFILE `
  --time-period Start=2026-10-01,End=2026-10-13 `
  --granularity MONTHLY `
  --metrics UnblendedCost `
  --group-by Type=DIMENSION,Key=SERVICE `
  --output json | Out-File "$OUT\cost-by-service.json" -Encoding utf8
```

## 23. Useful One-File Architecture Bundle

After collecting the JSON files, create a zip file:

```powershell
Compress-Archive -Path "$OUT\*" -DestinationPath "D:\RAD365\Doc\aws-inventory.zip" -Force
```

## 24. Quick Human-Readable Tables

### EC2 Table

```powershell
aws ec2 describe-instances `
  --region $REGION `
  --profile $PROFILE `
  --query "Reservations[].Instances[].{Name:Tags[?Key=='Name']|[0].Value,ID:InstanceId,Type:InstanceType,State:State.Name,PrivateIP:PrivateIpAddress,PublicIP:PublicIpAddress}" `
  --output table
```

### VPC Table

```powershell
aws ec2 describe-vpcs `
  --region $REGION `
  --profile $PROFILE `
  --query "Vpcs[].{VpcId:VpcId,Cidr:CidrBlock,Default:IsDefault,State:State,Name:Tags[?Key=='Name']|[0].Value}" `
  --output table
```

### Subnet Table

```powershell
aws ec2 describe-subnets `
  --region $REGION `
  --profile $PROFILE `
  --query "Subnets[].{Name:Tags[?Key=='Name']|[0].Value,SubnetId:SubnetId,VpcId:VpcId,AZ:AvailabilityZone,Cidr:CidrBlock,PublicIpOnLaunch:MapPublicIpOnLaunch,AvailableIPs:AvailableIpAddressCount}" `
  --output table
```

### Security Group Table

```powershell
aws ec2 describe-security-groups `
  --region $REGION `
  --profile $PROFILE `
  --query "SecurityGroups[].{GroupName:GroupName,GroupId:GroupId,VpcId:VpcId,Description:Description}" `
  --output table
```

### RDS Table

```powershell
aws rds describe-db-instances `
  --region $REGION `
  --profile $PROFILE `
  --query "DBInstances[].{DB:DBInstanceIdentifier,Engine:Engine,Class:DBInstanceClass,Status:DBInstanceStatus,Public:PubliclyAccessible,MultiAZ:MultiAZ,Vpc:DBSubnetGroup.VpcId}" `
  --output table
```

### Lambda Table

```powershell
aws lambda list-functions `
  --region $REGION `
  --profile $PROFILE `
  --query "Functions[].{Name:FunctionName,Runtime:Runtime,Role:Role,LastModified:LastModified,VpcSubnets:VpcConfig.SubnetIds,VpcSecurityGroups:VpcConfig.SecurityGroupIds}" `
  --output table
```

### S3 Table

```powershell
aws s3api list-buckets `
  --profile $PROFILE `
  --query "Buckets[].{Name:Name,Created:CreationDate}" `
  --output table
```

## 25. Notes

- These commands are intended for inventory and documentation.
- Some commands may fail if a service is not enabled, if the account has no resources for that service, or if the IAM user/role lacks read permission.
- Some services are global, while others are regional. For a complete account inventory, repeat the regional commands for every enabled AWS region.
- Avoid running commands that contain words such as `create`, `delete`, `modify`, `put`, `update`, `authorize`, `revoke`, `attach`, `detach`, `start`, `stop`, or `terminate` unless the client explicitly approves an operational change.
