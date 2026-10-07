# SSH Keys

> **An SSH key pair lets you prove you hold a private key without sending the private key. The server stores the public key. You store the private key as if it were a password.**

```text
your laptop                         server
private key                         authorized_keys (public keys)
    │                                      │
    └── proof you hold the private key ────┘
```

`ssh-keygen -t ed25519` is the current default you should use. RSA keys should be large if you still have them. The private key stays on the machine that needs it, encrypted with a passphrase, or on a hardware token. Copying `id_ed25519` into Slack "so you can log in too" means it is no longer your key.

## Authorized keys do not scale

A file of public keys on every server drifts. Someone leaves and their key remains. A bastion shared by the team becomes a museum of ex-employees. Prefer one of:

- **SSH certificates** signed by a CA you control, with a short lifetime and a principal name. The servers trust the CA. You stop distributing keys. The certificate expires this afternoon.
- **OS Login or SSM Session Manager** so access follows IAM and there is no port 22 on the internet.
- **A configuration-managed `authorized_keys`** from the directory, if you are not ready for certificates. Still better than hand edits.

## CI and deploy keys

A deploy key on a repository is a key that can read or write that repo. One repo, one key, write access only if the job pushes. A machine-wide key that can push to every repository is a stolen laptop away from your source. Protect the private key in CI secrets. Passphrases and agents are awkward in CI, so the compensation is a narrow key and a short-lived runner.

## Agents and forwarding

`ssh-agent` holds the key so you do not type the passphrase every time. Agent forwarding lets a remote host use your local agent. It also lets a compromised remote host use your local agent. Forward only to machines you trust as much as your own, which is a short list.

## Rotate

Replace a key when a laptop is lost, when a person leaves, or when the key might have been copied. Adding the new public key and deleting the old one is the whole rotation. If you cannot find every server that has the old public key, that is the argument for certificates or a central login path.
