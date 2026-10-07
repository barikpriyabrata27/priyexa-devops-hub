# Terraform Apply

> **Apply is the command that makes the cloud match the configuration. It is the only routine command that is allowed to change infrastructure.**

```bash
terraform apply tfplan
```

Applying a saved plan runs the plan you reviewed. Applying with no argument creates a new plan and asks for confirmation. Interactive confirmation does not belong in CI. In a pipeline, pass the saved plan file and run non-interactively.

```text
approved plan
     │
     ▼
state lock acquired
     │
     ▼
walk the graph
     │
     ├── create missing resources
     ├── update changed resources
     └── destroy resources removed from code
     │
     ▼
write new state
     │
     ▼
release lock
```

## Partial failure is normal

APIs fail. Quotas hit. A timeout is not a rollback. Terraform is not a database transaction. Resources created before the error stay created, and state records them. The fix is to correct the cause and apply again. The next plan should continue from the resources that already exist.

Do not delete state and start over. That is how you get a second copy of the network plus a first copy Terraform has forgotten.

## Ordering and parallelism

Independent resources are created together. Terraform's default parallelism is 10. Dependencies from attribute references are respected. If you need a hard "A fully exists before B starts" and no attribute creates that edge, `depends_on` adds one. Use it when the dependency is real but invisible, such as an IAM policy that must propagate before a pod starts. Do not sprinkle it everywhere. Extra edges make applies slower and errors harder to read.

## Apply permissions

The apply role creates and destroys. Keep it off laptops. A protected CI job on the main branch, with the plan already reviewed, is the production path. Local apply is for a sandbox account you can afford to break.

## After apply

- Read the outputs you meant to publish.
- Confirm the one resource you were worried about in the console or with a CLI read.
- Commit the configuration that was applied. The next plan should be empty. A plan that is not empty after a successful apply means drift or a value that is computed differently every time, such as a timestamp in a tag. Fix that, or every pipeline will look dirty.

## Apply is not a deploy of your application

Terraform applies infrastructure. Shipping a new container image is a deployment pipeline. You can store the image tag in a variable and let apply roll the service, and many teams do. Just do not confuse "the instances exist" with "the release is healthy." Health still belongs to probes, checks, and the deployment strategy in [`../ci-cd/deployment-strategies.md`](../ci-cd/deployment-strategies.md).
