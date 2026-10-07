# Console and gcloud

> **The console is for seeing. `gcloud` is for repeating. Terraform is for keeping. All three are clients of the same APIs.**

If a change matters, it should end in a pull request, not in a click nobody can reconstruct. The console is still the fastest way to learn what a resource looks like and to read a graph during an incident.

## A setup that does not surprise you

```bash
gcloud auth login
gcloud auth application-default login
gcloud config set project priyexa-dev
gcloud config set compute/region asia-south1
gcloud config configurations list
```

`gcloud auth login` is you. Application Default Credentials are what Terraform and client libraries use. They can drift apart: the CLI targets project A while Terraform uses a key for project B. When a resource "vanishes," check both identities:

```bash
gcloud auth list
gcloud config get-value project
```

Named configurations (`gcloud config configurations create prod`) beat editing one global project back and forth. The prompt should show the configuration. Muscle memory will apply to the wrong project otherwise.

## Useful habits

```bash
gcloud compute instances list
gcloud compute instances describe web-1 --zone asia-south1-a
gcloud logging read "severity>=ERROR" --limit 20
```

`--format=json` and `--filter` turn a listing into something a script can use. `--quiet` skips prompts in CI. A human in CI should not be pressing `y`.

## Keys

A service account JSON key downloaded "for Terraform on my laptop" will outlive the laptop's threat model. Prefer:

```text
you            → gcloud auth application-default login
CI             → workload identity federation, no key file
GCE or GKE     → the attached service account
```

If a key must exist, store it in a secret manager, scope it to one job, and rotate it. Delete keys that nobody can name an owner for.

## The console's sharp edges

Editing a firewall rule or an IAM binding in the console creates drift the next Terraform plan will try to undo. That is fine when the plan is reviewed. It is chaos when half the team clicks and the other half applies. Decide which projects are click-allowed sandboxes and which are code-only.
