# Groups

> **A group is a set of users who share a job. You grant the role to the group, not to each person.**

```text
group: payments-oncall
    ├── priya
    └── arun
         │
         ▼
role: prod-reader     on the payments project
role: prod-deploy     only through the pipeline, not on the group by default
```

When someone joins the team, you add them to the group and they gain the access the job needs. When they leave the team, you remove them from the group and the access goes with them. Granting Priya the role directly, then also via a group, then also via a second "temporary" binding, is how leavers keep access.

## Source of truth

The directory (the identity provider) should own group membership. Cloud accounts and Kubernetes should consume those groups through SSO and OIDC. A local group on one server that nobody updates is a second directory. You will forget it.

## Groups are not roles

A group says who. A role says what. `payments-oncall` is a group. `cluster-admin` is a role. Naming a group `admins` and also using it as a permission bundle collapses the distinction and makes every tool's binding slightly different. Keep the group name about the team. Map it to roles in each system on purpose.

## Nesting

Groups of groups are useful (`payments-oncall` inside `engineering`) and dangerous when nobody can answer who is inside. Prefer one or two levels. Review membership. An access review that says "see the spreadsheet" is theater. The review should remove people who are no longer in the job, and the directory should be the thing that changes.

## Break-glass is not a group you live in

A group with five standing owners of production is not break-glass. Break-glass is an empty-or-nearly-empty path, alarmed, for the day SSO is down. If it is used weekly, it is a backdoor, and the groups are wrong.
