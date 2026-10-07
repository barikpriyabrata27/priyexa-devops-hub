# Ansible Vault

> **Vault encrypts a variable file so you can keep a secret in the repository without keeping it in plaintext.**

```bash
ansible-vault encrypt group_vars/prod/vault.yml
ansible-vault edit group_vars/prod/vault.yml
```

```yaml
db_password: !vault |
  $ANSIBLE_VAULT;1.1;AES256
  32663336...
```

The playbook still says `{{ db_password }}`. At runtime Ansible decrypts with a password, a password file, or a script.

```bash
ansible-playbook site.yml --ask-vault-pass
ansible-playbook site.yml --vault-password-file ~/.vault_pass
```

## What vault is

It is encryption at rest for files in git. It is not a dynamic secret. Everyone who can run production playbooks can decrypt the production vault. That group should be small. The vault password is a secret of its own. It does not belong in the repo next to the encrypted file. CI fetches it from a real secret manager.

## Separate the files

```text
group_vars/prod/
  vars.yml          plaintext, reviewable
  vault.yml         encrypted, only secrets
```

Mixing one secret into a 200-line vars file means every password rotation hides the rest of the diff. Reviewers cannot read the encrypted blob. Keep the blob tiny.

## Rotation

1. Change the password in the upstream system (the database, the API).
2. `ansible-vault edit` the file.
3. Run the playbook so hosts receive the new value.
4. Retire the old password.

Re-keying the vault (`ansible-vault rekey`) changes the encryption password. It does not change the secret inside. Do both when someone who knew the vault password leaves.

## View and diff

`ansible-vault view` prints a file. A diff of an encrypted file is noise. Configure a vault-aware diff in review if you rotate secrets often, and still prefer small files so the change is "the database password," not a mystery.

## When vault is the wrong box

A secret that should be different per deploy, short-lived, and audited on every read belongs in HashiCorp Vault, cloud secret manager, or the CI secret store. Ansible Vault is the right box for a handful of values the playbook must know and that change rarely. It is a poor box for customer data and a poor box for "all of production."
