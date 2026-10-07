# SSO

> **Single sign-on means a person proves who they are once, to the identity provider, and other systems trust that proof instead of keeping their own passwords.**

```text
Priya
  │  password + hardware key
  ▼
identity provider          the directory
  │
  ├── AWS console
  ├── Google Cloud console
  ├── GitHub
  └── the internal admin tool
```

One disable in the directory closes those doors. Local passwords in each tool stay valid after you think you offboarded someone. That gap is the incident.

## What you standardize

- The identity provider is the only place humans set a password for work.
- Second factor is required, and phishing-resistant where you can (security keys).
- Groups in the directory map to roles in each system. You do not also click people into cloud groups by hand.
- Session length matches the risk. A payroll console does not need a week-long session.

## SSO is not "one account for the company bot"

Service accounts do not use the interactive SSO screen. They use workload identity or a key. Do not enroll a robot in the human directory with a password taped to the pipeline. You will not put a hardware key on it, and you will exempt it from MFA, and that exemption will spread.

## Failure

When the identity provider is down, SSO is down. A break-glass admin that does not depend on that provider, sealed and alarmed, is part of the design. If break-glass is used because SSO login is "annoying," the design has already failed in the other direction.

The protocol underneath modern SSO for web and for CI is usually [OIDC](oidc.md) or SAML. You can operate SSO without memorizing the XML. You cannot operate it without knowing which system is the source of the groups.
