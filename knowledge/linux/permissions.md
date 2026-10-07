# Permissions

> **Every file has an owner, a group, and a mode. The service must be able to read its config and must not be able to read the world's secrets.**

`ls -l` shows the mode. `chmod 640` means the owner can read and write, the group can read, and everyone else cannot. Prefer the symbolic form, `u+x`, when you are changing one bit and do not want to wipe the others. `chown app:app` sets the owner to the account the process runs as.

```text
600   a secret file, owner only
640   a config the service account's group can read
755   a directory people may traverse, or a public executable
```

Do not `chmod 777` to make an error go away. That error was the process running as the wrong user. World-writable directories and executables are how the next account on the box changes your application.

## SUID, SGID, sticky

SUID on an executable runs it as the file owner. That is how `passwd` works and how a careless SUID binary becomes a privilege escalation. SGID on a directory makes new files inherit the directory's group, which is useful for a shared deploy directory. The sticky bit on a directory, the `t` in `/tmp`, means users can delete only their own files.

## SSH and keys

`sshd` ignores an `authorized_keys` file when the directory or the file is writable by others. A home directory of `777` looks like a permission bug and presents as "my key is ignored." Keys are `600`, `.ssh` is `700`. The same rule applies to a kubeconfig or a cloud credential file on an agent: if the mode is loose, the file is not a secret anymore.

Application code in git should not depend on a mode you set by hand once. The unit, the Ansible task, or the image build sets the owner and the mode every time.
