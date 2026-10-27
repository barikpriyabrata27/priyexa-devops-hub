# bitwise-devops-hub

Root/index repository for a set of small, focused example repositories used to
learn and demonstrate different CI approaches and deployment targets. Each
linked repository is self-contained (its own README, pipeline, and manifests)
so it can be studied or reused independently.

All linked repos below are private under the `barikpriyabrata27` GitHub
account.

## CI understanding examples

Small repos that each illustrate a different source-control/CI shape.

| # | Type | Repo |
| - | ---- | ---- |
| 1 | C# small repo | [bitwise-devops-csharp](https://github.com/barikpriyabrata27/bitwise-devops-csharp) |
| 2 | Python small repo | [bitwise-devops-python](https://github.com/barikpriyabrata27/bitwise-devops-python) |
| 3 | Java small repo | [bitwise-devops-java](https://github.com/barikpriyabrata27/bitwise-devops-java) |
| 4 | Version-control-only repo (no build/CI) | [bitwise-devops-vcs](https://github.com/barikpriyabrata27/bitwise-devops-vcs) |
| 5 | Monorepo example | [bitwise-devops-monorepo](https://github.com/barikpriyabrata27/bitwise-devops-monorepo) |

## Deployment examples

Small repos that each illustrate deploying an app to a different target.

| # | Target | Repo |
| - | ------ | ---- |
| 1 | NAS deployment (Windows) | [bitwise-devops-nasw](https://github.com/barikpriyabrata27/bitwise-devops-nasw) |
| 2 | NAS deployment (Linux) | [bitwise-devops-nasl](https://github.com/barikpriyabrata27/bitwise-devops-nasl) |
| 3 | PCF (Pivotal/Tanzu Application Service) deployment | [bitwise-devops-pcf](https://github.com/barikpriyabrata27/bitwise-devops-pcf) |
| 4 | Kubernetes deployment | [bitwise-devops-kubernates](https://github.com/barikpriyabrata27/bitwise-devops-kubernates) |
| 5 | AWS deployment | [bitwise-devops-aws](https://github.com/barikpriyabrata27/bitwise-devops-aws) |
| 6 | GCP deployment | [bitwise-devops-gcp](https://github.com/barikpriyabrata27/bitwise-devops-gcp) |
| 7 | Cloud Run deployment | [bitwise-devops-cloudrun](https://github.com/barikpriyabrata27/bitwise-devops-cloudrun) |

## Shared infrastructure

| Purpose | Repo |
| ------- | ---- |
| Terraform modules used across the deployment examples | [bitwise-devops-terraform](https://github.com/barikpriyabrata27/bitwise-devops-terraform) |

## Knowledge

[`knowledge/`](knowledge/README.md) breaks the pipeline into topic docs that
link back to the repos above: [CI/CD](knowledge/ci-cd/README.md),
[Jenkins](knowledge/jenkins/README.md),
[Terraform](knowledge/terraform/README.md), [AWS](knowledge/aws/README.md),
[GCP](knowledge/gcp/README.md), [Ansible](knowledge/ansible/README.md),
[Docker](knowledge/docker/README.md), [Kubernetes](knowledge/kubernetes/README.md),
[DevSecOps](knowledge/devsecops/README.md),
[Authentication & Authorization](knowledge/auth/README.md),
[Observability](knowledge/observability/README.md),
[Linux](knowledge/linux/README.md),
[Networking](knowledge/networking/README.md), and
[Python](knowledge/python/README.md).

## Interview quiz

[`quiz/`](quiz/) contains a standalone, interactive interview practice quiz
(practice and timed modes, rotating attempts), moved here from
`bitwise-devops-kubernates` so it can be shared across all the linked
example repos. Categories include Kubernetes, CI/CD, Docker, Terraform,
AWS, GCP, Ansible, Jenkins, observability, Linux, Networking, Python, DevSecOps, and authentication.

- `quiz/interview.html`, `interview.css`, `interview.js` – the quiz app.
- `quiz/interview-questions.json` – the question bank.
- `quiz/expand-interview-bank.py` – generator script used to extend the bank.

### Opening the quiz

The quiz loads its question bank from JSON at runtime, so it must be served
over HTTP rather than opened directly as a file.

- **GitHub Pages**: The Actions workflow publishes the repository root,
  including the quiz under `/quiz`. The root `index.html` redirects to the
  quiz, and it can also be opened directly at
  `https://barikpriyabrata27.github.io/priyexa-devops-hub/quiz/interview.html`.
  A `.nojekyll` file at the repo root skips Jekyll processing so the static
  HTML/CSS/JS/JSON files are served as-is.
- **Local testing**:
  ```bash
  python -m http.server 8000 --directory .
  ```
  then open `http://localhost:8000/quiz/interview.html`. The repository root must be served so QFI can load its interview-question guide from `knowledge/`.

### Using the quiz modes

Each round contains 20 questions. Practice and Interview use the multiple-choice
bank in [`quiz/interview-questions.json`](quiz/interview-questions.json). QFI
uses the open-ended questions and reference answers in
[`knowledge/scenario_based_questions.md`](knowledge/scenario_based_questions.md).

#### Practice

Practice mode is intended for learning one question at a time.

1. Select **Practice**.
2. Optionally choose a focus area, difficulty, or question type. These filters
   also apply to Interview mode.
3. Select **Start session**.
4. Choose an answer. The quiz immediately shows whether it is correct and
   displays the explanation.
5. Select **Next question** to continue. After question 20, review your score
   and answers.

The answer choices are shuffled for each round. The quiz tracks seen questions
in this browser and gives you a fresh set when possible. When the available
questions have been used, the question cycle starts again. Select **Reset
question cycle** on the results screen to start the cycle over sooner.

#### Interview

Interview mode simulates a timed multiple-choice interview round.

1. Select **Interview**.
2. Optionally choose a focus area, difficulty, or question type.
3. Select **Start session**. The 25-minute timer begins.
4. Select an answer, then use **Lock answer** to commit to it. Unlike Practice
   mode, the quiz does not immediately reveal the correct answer.
5. Continue through the questions. At the end, review your score and answers.
   If time runs out, the session ends automatically.

#### QFI

QFI is an open-ended practice mode: write an answer in your own words rather
than selecting from multiple choices. It is intended to help practise explaining
technical topics as you would in an interview.

1. Select **QFI**, then select **Start session**.
2. Read the question and write a short, readable answer in the text box.
3. Select **Score answer**. The quiz shows a technical-term match percentage,
   the matched and missing terms, and an expandable reference answer.
4. Select **Next question** to continue. At the end, review your answers and
   the round's average match score.

**QFI scoring is a keyword heuristic, not semantic grading.** It checks for
technical terms drawn from the reference answer (or, for some questions, the
question itself); it does not determine whether an answer is fully correct or
well reasoned. Write in complete sentences rather than submitting a list of
keywords.

### How to modify the question banks

There are two source files, not three separate banks: Practice and Interview
share one multiple-choice bank, while QFI uses a separate open-answer bank.
Edit the relevant source file, save it, then reload the quiz served over HTTP
to verify the question and filters.

#### Multiple-choice questions for Practice and Interview

Edit [`quiz/interview-questions.json`](quiz/interview-questions.json) to add,
change, or remove questions used by both Practice and Interview. Each question
should follow this format:

```json
{
  "id": 1061,
  "category": "Docker",
  "difficulty": "Beginner",
  "type": "concept",
  "question": "What does a container image provide?",
  "options": [
    "A packaged filesystem and application configuration",
    "A running virtual machine",
    "A Git branch",
    "A network firewall"
  ],
  "answer": 0,
  "explanation": "An image is the package used to create a container."
}
```

Give each question a unique `id`. The `answer` is a zero-based index into
`options`: `0` means the first option, `1` the second, and so on. Use a category
to place the question in the corresponding focus-area filter; categories are
populated automatically from this file. Use one of the existing difficulty
values (`Beginner`, `Intermediate`, or `Advanced`) because those are the
difficulty filter choices. Set `type` to `concept` or `scenario`; if omitted,
the question is treated as a concept question. The explanation is shown
immediately in Practice mode and during answer review in Interview mode.

For a new question, add an object to the JSON array and assign an ID not already
used. To change a question, edit its object and keep its ID. To remove one,
delete its entire object, including the appropriate comma between neighboring
objects. Keep the JSON valid: quote strings with double quotes and do not leave
a trailing comma after the last object or property.

The round size is set to 20 in [`quiz/interview.js`](quiz/interview.js). If you
change it, check the session selection, progress display, and results logic as
well.

**Note:** [`quiz/expand-interview-bank.py`](quiz/expand-interview-bank.py)
regenerates questions with IDs above 100. Running it can replace manual edits
to those questions, so keep a backup or update the generator when changing
generated questions.

#### QFI questions

Edit [`knowledge/scenario_based_questions.md`](knowledge/scenario_based_questions.md)
to add, change, or remove QFI questions. Add each question using a numbered
level-two heading and provide its reference answer under `**Answer:**`:

```markdown
## 501. What is a deployment pipeline?

**Answer:** A deployment pipeline automates the steps that build, test, and
deliver a change. It should provide repeatable checks and a controlled way to
promote the same artifact between environments.
```

Use a unique heading number for each question. The answer is shown to the
learner after scoring and also provides technical terms used by QFI's
keyword-matching heuristic, so make it a useful reference answer with the
important terms stated explicitly. QFI does not currently have the category,
difficulty, or question-type filters used by the multiple-choice bank.

The QFI loader currently expects exactly 500 questions. If you add or remove
any, update the expected count in [`quiz/interview.js`](quiz/interview.js) to
match the number of question headings, or the QFI bank will fail to load.
Renumber headings if needed so every question number is unique.

## Status

The Kubernetes deployment example (`bitwise-devops-kubernates`) already
contains a working Flask app + Docker + kind CI/CD pipeline, migrated from
this repository's previous history. The rest of the linked repos are freshly
created placeholders (`README.md` only) and still need their example
content, pipelines, and manifests filled in.

## AWS scenario practice

The Scenarios mode now includes 20 AWS interview decisions, each with immediate feedback, a model answer and AWS documentation links (reviewed 27 October 2026). The selector also retains the three VPC flow/command demonstrations. AWS decision answers are practice-only and are not saved or keyword-graded. Questions without a matching interactive lab explicitly say so; they do not link to unrelated demonstrations.

Content: `quiz/aws-scenarios.js`. Interface: `quiz/aws-scenario-practice.js`. Run focused checks with `node --test tests/*.test.cjs`. The existing quiz and QFI banks remain unchanged.
