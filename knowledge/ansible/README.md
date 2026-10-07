# Ansible

Phase V is configuration management: make many machines match a description, safely, more than once.

Start with [fundamentals](ansible-fundamentals.md).

## The moving parts

- [Inventory](inventory.md)
- [Ad-hoc commands](ad-hoc-commands.md)
- [Modules](module.md)
- [Tasks](task.md)
- [Playbooks](playbook.md)
- [Roles](roles.md)

## Data

- [Variables](variable.md)
- [Facts](fact.md)
- [Templates](template.md)
- [Vault](vault.md)
- [Handlers](handlers.md)

## Running it for a team

- [AWX](awx.md)

Ansible starts where [Terraform](../terraform/README.md) stops: the machine exists, and now the software on it has to match. Secrets that outgrow an encrypted file belong with [Vault](../auth/vault.md) in the auth notes.
