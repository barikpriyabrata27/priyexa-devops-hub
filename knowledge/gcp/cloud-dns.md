# Cloud DNS

> **Cloud DNS is Google's authoritative DNS. It answers names you own with records you write. It is not the resolver your laptop uses unless you point at it.**

```text
priyexa.example
  ├── A      app          34.x.x.x          or better, an alias to a load balancer
  ├── CNAME  www          app.priyexa.example
  └── TXT    _acme        the proof a certificate issuer asked for
```

A **public zone** answers on the internet. A **private zone** answers only from the VPC networks you attach. Use a private zone for `db.internal` and similar names so the database hostname is never a public question.

## Records you will actually edit

| Type | Points at |
| --- | --- |
| A / AAAA | an address |
| CNAME | another name, not allowed at the zone apex |
| TXT | verification, SPF |
| NS | the delegation itself |

At the apex (`priyexa.example`) you cannot use a CNAME. Load balancers give you an anycast address or an A record to publish. Some setups use an ALIAS-style record through the load balancer integration so the address can change without you editing DNS by hand.

## TTL

A TTL of 300 seconds means caches may serve the old answer for five minutes. Lower the TTL before a migration, wait out the old TTL, then change the record. Changing a record that had a one-day TTL and expecting instant cutover is how you run two versions for a day while convinced DNS is "broken."

## What usually goes wrong

- The domain registrar still points NS records at the old DNS host, so Cloud DNS is a zone nobody asks.
- A private zone and a public zone share a name and you edited the one the VM does not see.
- A certificate renewal fails because the TXT record was added in the wrong project.

DNS changes are small and high-impact. Review them like firewall changes. `dig` against the zone's name server tells you what you published. `dig` against your laptop's resolver tells you what cache you are stuck with. Those are different facts.
