# Contributing to ElixirV4

ElixirV4 is the current platform for the [**Elixir Tech Community**](https://elixircommunity.in), serving thousands of students, developers, and tech professionals.

This is a real production codebase, not a playground for dumping generated code into a branch and hoping CI develops consciousness.

We welcome contributions from Elixir community members and external contributors. What matters is not how large your contribution is, but whether it is **understood, tested, maintainable, and appropriate for this repository**.

---

## Table of Contents

* [Before You Contribute](#before-you-contribute)
* [What You Can Contribute](#what-you-can-contribute)
* [Issues](#issues)
* [Development Setup](#development-setup)
* [Understanding ElixirV4](#understanding-elixirv4)
* [Branching](#branching)
* [Engineering Principles](#engineering-principles)
* [Keeping Changes Focused](#keeping-changes-focused)
* [Large Changes and Stacked PRs](#large-changes-and-stacked-prs)
* [AI-Assisted Development](#ai-assisted-development)
* [Code Quality](#code-quality)
* [Testing](#testing)
* [Comments and TODOs](#comments-and-todos)
* [Pull Requests](#pull-requests)
* [Self-Review](#self-review)
* [Code Review](#code-review)
* [Commit Messages](#commit-messages)
* [Frontend Guidelines](#frontend-guidelines)
* [Backend Guidelines](#backend-guidelines)
* [API and Data Changes](#api-and-data-changes)
* [Dependencies](#dependencies)
* [Security](#security)
* [Documentation](#documentation)
* [Broken Windows](#broken-windows)
* [Contributor Checklist](#contributor-checklist)

---

## Before You Contribute

Before writing code:

1. Search existing issues and PRs.
2. Read the relevant documentation.
3. Understand the affected part of the application.
4. Check whether someone is already working on the problem.
5. For non-trivial changes, open an issue before implementation.
6. Keep the eventual PR limited to the issue it addresses.

If you cannot explain **what the existing code does, what your change modifies, and why the change is necessary**, you are not ready to submit the PR.

The repository should remain the source of truth for code and contribution rules.

### Need Help?

If you are stuck, unsure about the architecture, cannot reproduce a problem, or simply need clarification before making a change, join the [**Elixir Tech Community Discord**](https://dsc.gg/elixirtechcommunity).

You can use the community to:

* Ask questions about ElixirV4
* Discuss an issue before implementing it
* Get help understanding an unfamiliar part of the codebase
* Discuss contribution ideas
* Report problems that are difficult to communicate through GitHub
* Coordinate with other contributors and maintainers

For security-sensitive issues, **do not post confidential information or vulnerability details publicly in Discord**. Follow the [Security Issues](#security-issues) process instead.

When in doubt, ask before making a large change. A five-minute conversation is considerably cheaper than reviewing a 2,000-line PR that should have been three PRs and an issue.


---

# What You Can Contribute

Contributions can include:

* Bug fixes
* Security fixes
* Performance improvements
* Accessibility improvements
* UI/UX improvements
* Backend improvements
* API improvements
* Test coverage
* Documentation
* Developer tooling
* Refactoring
* Dependency maintenance
* New ElixirV4 features

A contribution does not need to add a feature.

Removing unnecessary complexity is often more valuable than adding another feature nobody requested.

---

# Issues

## Before Opening an Issue

Search first.

Your issue may already exist under another name, or the behavior may already be documented.

A good issue answers:

* What is the problem?
* Where does it occur?
* How can it be reproduced?
* What is the expected behavior?
* What actually happens?
* Why does it matter?
* Is there a proposed solution?

Avoid issues such as:

> "Something is broken."

That gives maintainers approximately the same information as staring at the repository and sighing.

---

## Bug Reports

Include:

* Clear title
* Environment
* Relevant page/API/feature
* Reproduction steps
* Expected behavior
* Actual behavior
* Logs or error messages
* Screenshots/video when useful
* Relevant issue or PR references

Do not expose:

* API keys
* Tokens
* Passwords
* User credentials
* Private data
* Production secrets

---

## Feature Requests

Explain the **problem before the solution**.

Include:

1. Problem
2. Who is affected
3. Current workaround, if any
4. Proposed behavior
5. Alternatives considered
6. Scope and potential impact

Do not open a massive feature issue containing unrelated improvements.

If the work contains several independently understandable pieces, split it into sub-issues.

---

## Large Issues

Large work should be decomposed.

For example:

```text
#123 Add event analytics

├── #124 Define analytics data model
├── #125 Add backend analytics endpoints
├── #126 Add frontend analytics hooks
├── #127 Add dashboard visualizations
└── #128 Add tests and documentation
```

Each sub-issue should produce a meaningful, reviewable increment.

If the pieces are tightly coupled and cannot reasonably be merged independently, use stacked PRs.

---

## Security Issues

Do not publicly disclose exploitable vulnerabilities, credentials, authentication bypasses, or sensitive production information in a normal issue.

Contact the maintainers privately and provide:

* Vulnerability description
* Affected component
* Reproduction steps
* Impact
* Suggested mitigation, if known

---

# Development Setup

## Prerequisites

* Node.js 18+
* npm
* Git
* A GitHub account

Clone the repository:

```bash
git clone https://github.com/vaibhavxtripathi/ElixirV4.git
cd ElixirV4
```

Install dependencies:

```bash
npm install
```

Create the required local environment configuration.

Do not commit `.env.local` or any secret-containing environment file.

Start development:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:3000
```

---

## Available Commands

| Command              | Purpose                                    |
| -------------------- | ------------------------------------------ |
| `npm run dev`        | Start Next.js development server           |
| `npm run dev:fast`   | Development server with experimental HTTPS |
| `npm run build`      | Production build                           |
| `npm run start`      | Start production build                     |
| `npm run lint`       | Run ESLint                                 |
| `npm run type-check` | Run TypeScript checks                      |

Run at minimum before requesting review:

```bash
npm run lint
npm run type-check
npm run build
```

If your change requires additional backend or integration checks, run those too.

---

# Understanding ElixirV4

ElixirV4 currently consists of:

```text
ElixirV4/
├── src/
│   ├── app/             # Next.js App Router
│   ├── components/      # Shared UI
│   └── lib/             # Utilities, hooks, API helpers
├── backend/              # Separate Node.js backend
├── public/               # Static assets
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

The platform currently covers:

* Events
* Blogs
* Mentorship
* Member profiles
* Role-based dashboards
* Admin functionality
* Authentication
* Community-facing content

Before modifying an area, understand its existing flow.

For example:

```text
UI
 ↓
Client state / form
 ↓
API helper
 ↓
Backend route
 ↓
Middleware
 ↓
Controller
 ↓
Database
```

Do not introduce a new architectural pattern simply because it is fashionable.

If the existing architecture is genuinely insufficient, document the problem and propose the architectural change separately.

---

# Branching

Do not develop directly on `main`.

Use descriptive branches:

```text
feature/event-registration
fix/event-registration-validation
refactor/auth-middleware
docs/contributing-guide
test/event-controller
chore/update-dependencies
```

Recommended format:

```text
<type>/<short-description>
```

Keep branch scope aligned with the issue being solved.

---

# Engineering Principles

ElixirV4 follows a few principles that matter more than any particular framework preference.

## 1. Understand Before Changing

Read the surrounding code before modifying it.

Do not rewrite unfamiliar code because an AI assistant suggested a cleaner-looking architecture.

## 2. Prefer Small Changes

Small changes are:

* Easier to review
* Easier to test
* Easier to revert
* Easier to debug
* Less likely to hide regressions

## 3. Preserve Existing Behavior

Unless the issue explicitly changes behavior, existing behavior should remain unchanged.

## 4. Make Intent Obvious

Code should be understandable without requiring the author to explain every line personally.

## 5. Remove Complexity

Do not add abstractions merely to demonstrate that abstractions exist.

## 6. Leave the Code Better

A contribution should not introduce:

* Dead code
* Unnecessary duplication
* Unused dependencies
* Misleading comments
* Arbitrary abstractions
* Temporary hacks presented as permanent solutions

---

# Keeping Changes Focused

## One Core Issue Per PR

A PR should solve **one core problem**.

This is bad:

```text
Fix login bug
+ redesign navbar
+ refactor API client
+ update dependencies
+ rename components
+ rewrite dashboard
+ add unrelated tests
```

Even if every individual change is reasonable, the PR is not.

Prefer:

```text
PR #1 → Fix login token refresh

PR #2 → Refactor API client

PR #3 → Redesign navbar
```

This makes review, testing, rollback, and debugging substantially easier.

### The Rule

> If a reviewer cannot summarize the PR in one sentence, the PR is probably too large.

---

# Large Changes and Stacked PRs

Large work should be split into independently reviewable PRs whenever possible.

If the PRs depend on one another, use **GitHub stacked PRs**.

Example:

```text
main
 │
 ├── PR #101: database changes
 │      ↓
 ├── PR #102: backend API
 │      ↓
 └── PR #103: frontend integration
```

Each PR must still be:

* Reviewable
* Tested
* Coherent
* Non-breaking

Most importantly:

> **Every PR in the stack must leave production in a working state.**

A maintainer should be able to merge:

```text
#101
#102
#103
```

one at a time without production becoming broken between merges.

Do not create a stack where PR #102 only works because PR #103 exists.

If two changes genuinely cannot be separated without breaking the application, explain that dependency in the PR description.

---

# AI-Assisted Development

AI tools are allowed and encouraged.

They are tools, not authors.

Our standard is:

> **AI-driven, not AI-dependent.**

Use AI for:

* Exploring unfamiliar code
* Generating test cases
* Finding edge cases
* Documentation
* Refactoring suggestions
* Debugging hypotheses
* Research
* Boilerplate

Do not use AI as a substitute for understanding the code.

Before submitting AI-assisted code, you must be able to explain:

* What it does
* Why it works
* Why it belongs here
* What assumptions it makes
* What edge cases exist
* How it was tested

Never blindly accept generated code.

### AI Slop Is Not a Contribution

Do not submit code that contains:

* Generic abstractions with no purpose
* Excessive defensive checks
* Repetitive generated patterns
* Unused helpers
* Needless comments
* Obvious boilerplate
* Copied architecture that does not fit ElixirV4
* Tests that merely satisfy coverage
* Large rewrites unrelated to the issue

Generated code must be reviewed like code written by a stranger.

Because, functionally, that is what it is.

---

# Code Quality

Prefer:

```text
simple > clever
explicit > magical
local > unnecessarily abstract
tested > assumed
consistent > novel
```

Follow the existing TypeScript, React, Next.js, Tailwind, and backend conventions unless there is a documented reason to change them.

Before adding an abstraction, ask:

1. Is it actually reused?
2. Does it reduce complexity?
3. Does it make the code easier to understand?
4. Does it belong at this architectural layer?

If the answer is no, do not add it.

---

# Testing

Code changes that can reasonably be tested must include tests.

For code requiring tests, the expected target is:

> **90%+ test coverage**

Coverage is a floor, not permission to write meaningless tests.

Good tests verify behavior.

Bad tests merely execute lines.

Test:

* Happy paths
* Failure paths
* Validation
* Permissions
* Edge cases
* Regression cases
* Important state transitions

A bug fix should normally include a regression test demonstrating the original failure.

---

## Test Naming

Prefer behavior-oriented names.

Examples:

```text
should reject registration when the email is already registered
should return an event when the event ID exists
should deny event deletion for non-admin users
```

For complex behavior, structure the test around:

```text
Given
When
Then
```

The test name should explain **what behavior is guaranteed**, not how the implementation happens to work.

---

# Comments and TODOs

Comments should explain **why**, not narrate obvious code.

Bad:

```ts
// Increment counter
counter++;
```

Good:

```ts
// Keep the previous value because the API uses it when generating the audit record.
counter++;
```

Avoid comments that become false as soon as the code changes.

TODOs should be actionable.

Prefer:

```ts
// TODO(#241): Replace this fallback once the new events API is available.
```

Avoid:

```ts
// TODO: fix this later
```

If something matters enough to remember, it usually matters enough to track.

---

# Pull Requests

## Draft First

Until your PR is genuinely ready for maintainer review, **keep it as a Draft PR**.

Do not mark a PR ready simply because the code compiles.

A PR becomes ready when:

* The implementation is complete
* Tests are complete
* Documentation is updated where necessary
* Self-review is complete
* CI passes
* The PR description is complete
* No known unfinished work remains

Use Draft PRs as the workspace for collaboration, not as a declaration of readiness.

---

## PR Title

Keep titles short and specific.

Examples:

```text
fix: prevent duplicate event registrations
feat: add mentor availability filters
refactor: simplify authentication middleware
docs: document local development setup
test: cover event registration failures
```

---

## PR Description

Every non-trivial PR should explain:

### What

What changed?

### Why

What issue does it solve?

### How

What approach was taken?

### Testing

What was tested?

Include:

```text
- npm run lint
- npm run type-check
- npm run build
- relevant test suite
```

### Risks

Mention:

* API changes
* Database changes
* Authentication/authorization changes
* Migration requirements
* Deployment considerations
* Potential regressions

### Related Issue

Link the relevant issue:

```text
Closes #123
```

or:

```text
Related to #123
```

---

# Loom / Change Walkthrough

For code changes, include a **Loom walkthrough** in the PR description when the change benefits from visual or contextual explanation.

The walkthrough should briefly cover:

1. What changed
2. Why it changed
3. Important implementation details
4. How the feature/fix behaves
5. Anything reviewers should pay particular attention to

Documentation-only and genuinely minor changes do not require a Loom.

Screenshots, recordings, or before/after examples should be included when they make UI changes easier to review.

---

# Self-Review

Before requesting maintainers to review your PR, review it yourself.

Check:

### Scope

* [ ] Does this PR solve one core issue?
* [ ] Did I accidentally include unrelated changes?
* [ ] Can any change be moved into another PR?

### Code

* [ ] Did I understand every changed section?
* [ ] Did I remove unnecessary generated code?
* [ ] Are names clear?
* [ ] Are abstractions justified?
* [ ] Did I introduce duplication?
* [ ] Did I leave dead code behind?

### Tests

* [ ] Are relevant behaviors tested?
* [ ] Are failure paths tested?
* [ ] Are regressions covered?
* [ ] Is coverage ≥90% where tests are required?

### Repository

* [ ] `npm run lint` passes
* [ ] `npm run type-check` passes
* [ ] `npm run build` passes
* [ ] No secrets were committed
* [ ] No unnecessary dependencies were added

### PR

* [ ] Description is complete
* [ ] Related issue is linked
* [ ] Loom is included when applicable
* [ ] Screenshots/recordings are included when useful
* [ ] PR is still Draft if work is incomplete

Do not make maintainers perform your self-review for you.

---

# Code Review

Review the code, not the person.

Good review comments explain:

* What is wrong
* Why it matters
* What behavior is expected
* A possible direction for fixing it

Avoid:

```text
This is bad.
```

Prefer:

```text
This bypasses the existing authorization middleware, so a non-admin
could reach this path. Can this use the existing role check instead?
```

Reviewers should distinguish between:

* Blocking correctness issues
* Maintainability concerns
* Suggestions
* Personal preferences

Not every disagreement needs to become a constitutional crisis.

---

# Handling Review Feedback

When a reviewer identifies an issue:

1. Understand the concern.
2. Make the change.
3. Re-run relevant checks.
4. Resolve the thread when addressed.
5. Explain why if you intentionally disagree.

Do not silently ignore review comments.

If feedback reveals a broader problem, discuss whether it belongs in:

* The current PR
* A follow-up issue
* A separate PR

Keep the current PR focused.

---

# Commit Messages

Use concise, meaningful commits.

Preferred format:

```text
feat: add event registration validation
fix: prevent duplicate mentor bookings
refactor: extract event query helper
test: cover unauthorized event deletion
docs: document backend authentication
chore: update dependencies
```

Do not use commits such as:

```text
changes
final
final2
fix
asdf
AI generated stuff
```

Keep commits logically grouped.

Avoid mixing formatting-only changes with functional changes unless necessary.

---

# Frontend Guidelines

ElixirV4 uses:

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS
* Radix UI
* TanStack Query
* React Hook Form
* Zod
* Framer Motion / Motion

When modifying the frontend:

* Follow existing component patterns.
* Reuse existing UI primitives.
* Keep components focused.
* Avoid duplicating shared components.
* Validate user input.
* Handle loading, empty, success, and error states.
* Consider mobile layouts.
* Preserve accessibility.
* Avoid unnecessary client components.
* Do not introduce a state-management library without architectural justification.

Do not create another button, modal, form wrapper, API helper, or utility if an appropriate existing implementation already exists.

---

# Backend Guidelines

The backend lives under:

```text
/backend
```

It is a separate Node.js/TypeScript application.

When changing backend behavior:

* Understand the route → middleware → controller → database flow.
* Preserve authentication and authorization boundaries.
* Validate external input.
* Return consistent responses.
* Handle expected failures explicitly.
* Do not expose internal errors or sensitive information.
* Keep business logic out of places where it does not belong.
* Add regression tests for bug fixes.
* Document API behavior when externally observable behavior changes.

Do not bypass existing middleware simply because doing so is convenient.

---

# API and Data Changes

API changes can affect both the frontend and other consumers.

Before changing an API:

1. Find its consumers.
2. Understand the current contract.
3. Determine whether the change is backward compatible.
4. Update validation.
5. Update tests.
6. Update documentation.

Prefer additive, backward-compatible changes when possible.

If a breaking change is unavoidable, isolate it and document:

* What changed
* Why
* Affected consumers
* Migration steps
* Rollback considerations

---

# Database Changes

Database changes require additional care.

For schema or migration work:

* Explain the migration in the PR.
* Consider existing production data.
* Avoid destructive changes unless explicitly required.
* Consider backward compatibility.
* Test migrations against realistic data.
* Keep application and schema changes deployable independently where possible.

Never assume the database is empty just because your local database is.

Production has a memory. It remembers everything humans have done to it.

---

# Authentication and Authorization

Authentication and authorization changes are security-sensitive.

When modifying auth:

* Understand the complete authentication flow.
* Validate tokens and sessions correctly.
* Preserve role boundaries.
* Test unauthorized and forbidden cases.
* Never log credentials, tokens, or sensitive user data.
* Never commit secrets.
* Do not weaken existing security controls to make development easier.

Role-based behavior must be enforced server-side, not only through frontend UI.

---

# Dependencies

Do not add dependencies casually.

Before adding one:

1. Check whether the repository already provides the functionality.
2. Check whether the dependency is maintained.
3. Check its size and transitive dependencies.
4. Check its license.
5. Explain why it is necessary.

Do not upgrade unrelated dependencies inside a feature PR.

Dependency upgrades should normally be isolated into their own PR.

---

# Security

Never commit:

* `.env` files containing secrets
* API keys
* OAuth credentials
* Database passwords
* Private tokens
* User credentials
* Production configuration containing secrets

If a secret is accidentally committed, removing the file is not sufficient. Treat the credential as compromised and rotate it.

Do not include sensitive production data in issues, PRs, screenshots, logs, or Loom recordings.

---

# Documentation

Documentation is part of the product.

Update documentation when a change affects:

* Developer setup
* Architecture
* API behavior
* Configuration
* Database behavior
* Authentication
* Contribution workflow
* User-facing functionality

Detailed architecture and implementation documentation belongs in:

```text
/docs
```

and is surfaced through:

```text
https://developer.elixircommunity.in
```

Do not turn `CONTRIBUTING.md` into the architecture manual. It exists to explain **how to contribute to ElixirV4**.

---

# Broken Windows

Small problems become permanent problems when everyone assumes somebody else will fix them.

Examples:

* Dead code
* Broken links
* Stale documentation
* Misleading comments
* Unused imports
* Obvious duplication
* Incorrect naming
* Unhandled errors
* Temporary hacks becoming permanent

If your contribution touches an area with an obvious small defect, fixing it is encouraged **when it remains within the PR's scope**.

Do not use the Broken Windows principle as an excuse to turn a bug fix into a 4,000-line cleanup PR.

---

# What We Do Not Want

Please do not submit:

* Massive unrelated PRs
* Blind AI-generated code
* Copy-pasted architecture
* Unnecessary dependencies
* Unjustified rewrites
* Tests written only to inflate coverage
* Dead code
* Unexplained breaking changes
* Secrets or credentials
* Formatting churn unrelated to the issue
* "While I'm here" refactors
* Giant PRs containing several independent features

A contribution being large does not make it valuable.

A contribution being small does not make it trivial.

**Clarity wins.**

---

# Contributor Checklist

Before opening a PR:

```text
[ ] I searched existing issues and PRs.
[ ] My change addresses one core issue.
[ ] I understand the code I changed.
[ ] I did not include unrelated changes.
[ ] I used an appropriate branch name.
[ ] I added/updated tests where required.
[ ] Coverage is ≥90% for code requiring tests.
[ ] I ran lint.
[ ] I ran TypeScript checks.
[ ] I ran the production build.
[ ] I checked for regressions.
[ ] I checked authentication/authorization implications.
[ ] I checked for secrets.
[ ] I updated relevant documentation.
[ ] I self-reviewed the entire diff.
[ ] My PR description explains what, why, how, and testing.
[ ] I linked the relevant issue.
[ ] I added a Loom walkthrough when applicable.
[ ] The PR is Draft if it is not ready for review.
```

---

# The Standard

The goal of contributing to ElixirV4 is not to maximize lines changed.

It is to make the platform **more reliable, understandable, maintainable, and useful to the Elixir community**.

Before opening a PR, ask yourself:

> **Would I be comfortable being responsible for maintaining this code six months from now?**

If the answer is no, keep working.

If the answer is yes, make the PR easy for somebody else to understand.

That is the standard.
