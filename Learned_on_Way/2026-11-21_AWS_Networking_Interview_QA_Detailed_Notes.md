# AWS Networking and DevOps Interview Practice — 21 November 2026

*Detailed reconstructed notes from today's discussion; not a verbatim transcript.*

## VPC and subnet fundamentals

**Q1. What is the difference between default and custom VPC creation?**  
A default VPC generally has default subnets, an Internet Gateway, a main route table, a default security group and a network ACL. It does not automatically include a NAT Gateway. A custom VPC created with “VPC only” has foundational components but no automatically created subnets or gateways; “VPC and more” can create them.

**Q2. What makes a subnet public?**  
An effective subnet route table with a default route to an Internet Gateway, such as `0.0.0.0/0 -> igw-...`. A public subnet name alone is not enough. Instances need public addressing and security rules for direct inbound internet access.

**Q3. Can instances in different subnets of one VPC communicate?**  
Yes, via the VPC CIDR's built-in `local` route. They do not need NAT or an IGW to communicate privately. SGs, NACLs and host firewalls must allow the traffic.

**Q4. What is a CIDR?**  
Classless Inter-Domain Routing defines an IP range, e.g. `10.0.0.0/16` for a VPC and `10.0.1.0/24` for a subnet. Subnet ranges must be contained in the VPC range and cannot overlap within that VPC.

**Q5. What does an Internet Gateway do?**  
It provides a route for internet connectivity when the subnet routes to it and instances have appropriate public addressing and permissions.

**Q6. What does a NAT Gateway do?**  
A public NAT Gateway allows private-subnet IPv4 resources to initiate outbound internet connections. A private subnet routes `0.0.0.0/0` to NAT; the NAT resides in a public subnet with a route to the IGW. It does not permit unsolicited inbound connections.

## Multi-VPC routing

**Q7. Can the VPC local route connect separate VPCs?**  
No. Use VPC Peering, Transit Gateway or other explicit connectivity, with nonoverlapping IP ranges as appropriate.

**Q8. What is VPC Peering?**  
A direct private connection between two VPCs. Both VPC route tables need reciprocal routes, and security rules must allow traffic.

**Q9. Is VPC Peering transitive?**  
No. A–B and B–C peering do not automatically allow A–C traffic.

**Q10. How many connections for a full mesh of ten VPCs?**  
`10 × 9 / 2 = 45` peerings.

**Q11. Why use Transit Gateway?**  
A hub-and-spoke option for multiple VPCs. Each VPC needs a TGW attachment and relevant subnet routes; TGW route tables need association/propagation or static routes. Review cost implications.

## Security and connectivity

**Q12. Route table versus security group?**  
A route table decides the packet's next hop; a stateful security group allows specified traffic to and from an ENI. Both must be correct.

**Q13. What is a NACL?**  
A stateless subnet-level allow/deny filter. Return traffic needs to be explicitly permitted as applicable.

**Q14. Can an EC2 OS firewall block traffic that AWS permits?**  
Yes. Windows Defender Firewall or Linux Netfilter rules can block traffic despite an AWS SG allow rule.

**Q15. What is iptables?**  
A Linux tool for configuring kernel Netfilter rules. Inspect with `sudo iptables -L -n -v`. Newer distributions may primarily use nftables, with firewalld or ufw as management tools.

**Q16. SG allows RDP TCP 3389, Windows Firewall blocks it: will RDP work?**  
No. The host firewall must also allow it, and RDP must be enabled and listening.

**Q17. SSH TCP 22 is allowed in SG but connection fails. What to check?**  
Check routing and IP reachability, NACL, Linux firewall, `sshd` status/listening port, username, SSH key, and logs. A timeout, connection refusal and authentication failure indicate different problems.

**Q18. Ping fails but SSH works: what does it suggest?**  
ICMP Echo may be blocked while TCP 22 is allowed. Ping does not use a TCP or UDP port.

## VPN, IIS, DNS and load balancing

**Q19. What is SSTP?**  
Secure Socket Tunneling Protocol carries PPP through TLS, typically over TCP 443.

**Q20. How can an internal IIS site on AWS have a private hostname?**  
Use private DNS such as a Route 53 private hosted zone, private IP routing via VPN and suitable DNS resolver forwarding for VPN clients. Configure HTTPS certificates and IIS bindings; enforce access with network and firewall rules.

**Q21. Public DNS versus private DNS?**  
Public DNS records are generally resolvable through public DNS infrastructure. Private hosted zone records are resolved inside associated VPCs and connected networks with correctly configured DNS resolution.

**Q22. ALB versus NLB?**  
ALB is Layer 7 and supports HTTP/HTTPS host/path routing. NLB is Layer 4 and handles TCP, UDP and TLS connections. A public ALB can front private instances.

## Protocols and troubleshooting

**Q23. What is TCP?**  
Transmission Control Protocol: connection-oriented, reliable, ordered byte-stream transport using acknowledgments and retransmissions.

**Q24. What is UDP?**  
User Datagram Protocol: connectionless datagram transport with no built-in delivery or ordering guarantees. Useful when low latency or application-controlled delivery is important.

**Q25. Give UDP application examples.**  
DNS queries, voice communication, gaming and QUIC/HTTP/3. Video streaming may use QUIC over UDP or HTTP over TCP depending on service and conditions; Netflix is not exclusively UDP.

**Q26. What is ICMP?**  
Internet Control Message Protocol, used for diagnostics and network error signaling, including ping. It does not have TCP/UDP port numbers.

**Q27. What is SMTP?**  
Simple Mail Transfer Protocol, used to send email, commonly TCP 25 for server-to-server transfer and TCP 587 for message submission.

**Q28. What is SSH?**  
Secure Shell, commonly TCP 22, for encrypted remote administration of Linux servers.

**Q29. What is RDP?**  
Remote Desktop Protocol, commonly TCP 3389 (and sometimes UDP 3389), for remote graphical sessions to Windows systems.

**Q30. What are the key networking protocols for DevOps interviews?**  
TCP, UDP, IP, ICMP, DNS, HTTP/HTTPS, TLS, SSH, RDP, SMTP and DHCP. Learn purpose, layer, port or transport where relevant, and typical failures.

**Q31. What is the troubleshooting order?**  
Verify source/destination IP and DNS, route tables, gateways/VPN, SG, NACL, OS firewall, application listening port, and authentication. Use error symptoms to narrow the cause.

## Useful commands

```powershell
Get-DnsClientServerAddress -AddressFamily IPv4
Get-NetFirewallRule
```

```bash
sudo iptables -L -n -v
sudo nft list ruleset
sudo ss -lntp
sudo systemctl status sshd
```

## Key interview takeaways

- Same-VPC subnet traffic uses local routing, not NAT.
- VPC Peering is nontransitive; Transit Gateway can simplify multi-VPC networks.
- Routes control reachability; SGs, NACLs and OS firewalls control permission.
- ICMP ping failing does not mean TCP SSH is failing.
- TCP is reliable and ordered; UDP offers lightweight datagrams without built-in delivery guarantees.
- Private DNS requires correct resolver configuration for remote VPN clients.
