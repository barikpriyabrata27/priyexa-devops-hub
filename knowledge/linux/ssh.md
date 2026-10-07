# Users and SSH

> **One person, one account. A shared `deploy` password cannot answer who restarted the service.**

Service accounts are for software. They do not have a login shell if they do not need one, and they are not a person's daily sudo. Humans log in as themselves. Privilege is `sudo` for one command, logged, not a root SSH session everyone knows.

## SSH

`Permission denied` is the key or the user. `Connection refused` is nothing listening, or a firewall. `Timed out` is a route or a security group. The server log, `journalctl -u ssh`, tells you whether the packet arrived. The client message alone cannot tell those apart when you have not looked.

Prefer the platform path when it exists: SSM Session Manager on AWS, OS Login on GCP, or short-lived SSH certificates. A file of `authorized_keys` on every server drifts, and people who left stay in it. If you still use keys, the private key stays on the machine that needs it, with a passphrase. Copying `id_ed25519` into chat means it is no longer that person's key.

Agent forwarding lets a remote host use your local keys. A compromised jump host then uses them too. Forward only to a machine you trust as much as your own.

## sudo

Grant a group the specific commands it needs. A `NOPASSWD: ALL` for the engineering group is root. Logs of sudo are how you reconstruct a change. If the only login is `root`, those logs say root, which is not an audit.

See [SSH keys](../auth/ssh-keys.md) for the credential, and [permissions](permissions.md) for the file modes sshd insists on.
