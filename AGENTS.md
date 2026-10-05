# AGENTS.md

## Mission

ElixirV4 is the production website and platform for the Elixir Tech Community.

This is a real codebase, not a sandbox for generated code. Optimize for:

- correctness
- maintainability
- consistency with the existing codebase
- minimal and focused changes
- backwards compatibility
- security
- testability

Do not optimize for the number of files changed, amount of code produced, or architectural novelty.

---

## 1. Non-Negotiable Rules

Before modifying code:

1. Read the relevant implementation.
2. Search for existing components, utilities, patterns, routes, validators, and types.
3. Check all obvious consumers of the code being changed.
4. Understand the current behavior before changing it.
5. Make the smallest change that correctly solves the requested problem.

Never:

- invent repository facts
- invent APIs, scripts, environment variables, tests, or architecture
- replace existing patterns without a concrete reason
- rewrite unrelated code
- weaken authentication or authorization
- expose secrets
- silently change API contracts
- make destructive database changes without explicit justification
- add dependencies when existing functionality is sufficient
- claim something was tested when it was not

**Repository reality beats assumptions.**

When documentation disagrees with the implementation, inspect the implementation and configuration first.

### Source of truth

Prefer, in order:

1. Actual implementation
2. `package.json` / backend package configuration
3. Prisma schema and migrations
4. Existing tests and CI configuration
5. Developer documentation
6. README
7. Assumptions or generated suggestions

---

## 2. Repository Architecture

ElixirV4 contains two main applications.

### Frontend

The root application uses:

- Next.js 15
- React 19
- TypeScript 5
- App Router
- Tailwind CSS
- Radix UI / shadcn-style components
- TanStack Query
- TanStack Table
- React Hook Form
- Zod
- Axios
- Motion / Framer Motion
- Recharts
- dnd-kit

Important areas:

```text
src/app/
src/components/
src/lib/
public/
````

Inspect the current tree before assuming where functionality belongs.

Do not create a new abstraction when an existing component, utility, hook, query pattern, or primitive already solves the problem.

### Backend

The backend is under:

```text
backend/
```

It uses:

* Node.js
* TypeScript
* Express
* Prisma
* PostgreSQL
* Zod
* JWT
* bcrypt
* Google OAuth

Normal request flow:

```text
HTTP request
  ↓
Express app
  ↓
Route
  ↓
Middleware / validation
  ↓
Controller
  ↓
Prisma
  ↓
PostgreSQL
  ↓
Response
```

The backend currently uses controllers directly for business logic. Do **not** introduce service/repository/domain layers merely because they are common patterns.

Follow the architecture that exists unless the task explicitly requires architectural change.

---

## 3. Read Before You Change

For any change, identify:

* where the behavior starts
* who calls it
* what it calls
* where state/data is stored
* where validation happens
* where authorization happens
* what frontend/backend consumers depend on it
* what tests cover it
* what could break if it changes

For API changes, search both backend definitions and frontend consumers.

For component changes, search usages before changing props or behavior.

For database changes, inspect:

* `backend/prisma/schema.prisma`
* relevant migrations
* controllers
* validators
* frontend consumers
* existing production assumptions

Do not modify a shared abstraction without checking its consumers.

---

## 4. Authentication and Authorization

Authentication and authorization are security boundaries.

Current roles:

```text
STUDENT
CLUB_HEAD
ADMIN
```

JWT authentication is handled through the existing authentication middleware and utilities.

The backend is the final authority for authorization.

Never rely on:

* hidden frontend buttons
* route visibility
* client-side role checks
* UI restrictions

to protect privileged operations.

When changing protected functionality, verify:

* unauthenticated behavior
* authenticated behavior
* role restrictions
* resource ownership where applicable
* unauthorized vs forbidden responses
* regression coverage

Do not weaken existing role or ownership checks to make a feature easier to implement.

Never log or expose:

* JWTs
* passwords
* OAuth secrets
* database credentials
* API keys
* private keys
* sensitive user data

---

## 5. API Changes

Before changing an endpoint, search for its consumers.

Consider:

* HTTP method
* route
* request body
* query parameters
* response shape
* status codes
* validation
* authentication
* authorization
* error behavior

Prefer additive and backwards-compatible changes.

If a breaking change is genuinely required:

1. identify affected consumers
2. update them deliberately
3. update validation
4. update tests
5. update documentation
6. make the breaking behavior explicit

Do not silently alter an existing contract.

---

## 6. Database Changes

Prisma schema changes can affect production data.

Before changing the schema:

* inspect existing models and relations
* inspect migrations
* understand existing data
* identify affected API consumers
* consider backwards compatibility
* verify migration behavior

Avoid destructive migrations unless they are explicitly required and understood.

Never casually delete or rename production-facing fields.

Schema changes are not complete until the application code, migration, and affected consumers agree.

---

## 7. Frontend Rules

Prefer existing patterns.

Use:

* TanStack Query for server state
* React state for local UI state
* React Hook Form for forms
* Zod for validation

Do not introduce another state-management library for convenience.

Do not add `"use client"` unless client-side behavior actually requires it.

Reuse existing:

* components
* Radix primitives
* Tailwind patterns
* utilities
* hooks
* query patterns
* form patterns

Avoid unnecessary global state, duplicated API abstractions, and new UI libraries.

Handle relevant UI states:

* loading
* empty
* success
* error
* disabled
* unauthorized

Preserve accessibility:

* semantic HTML
* labels
* keyboard interaction
* visible focus
* accessible controls
* do not communicate meaning through color alone

---

## 8. Validation and Errors

Validate input at the appropriate existing boundary.

Do not trust client-side validation for security-sensitive operations.

Errors should:

* use appropriate HTTP status codes
* provide useful safe messages
* avoid leaking implementation details
* preserve useful debugging information in server logs where appropriate

Never expose:

* stack traces
* SQL/Prisma internals
* credentials
* tokens
* sensitive configuration

Do not swallow errors with broad empty `catch` blocks.

Do not add defensive checks everywhere merely because an AI suggested them. Add checks where an actual failure mode exists.

---

## 9. AI-Assisted Development

Development should be **AI-driven, not AI-dependent**.

AI may be used for:

* exploration
* debugging hypotheses
* research
* boilerplate
* tests
* documentation
* refactoring suggestions
* edge-case discovery

Generated code is untrusted until the contributor understands it.

Reject AI-generated patterns such as:

* unnecessary abstractions
* speculative extensibility
* generic wrappers
* duplicated utilities
* giant helper functions
* excessive defensive programming
* meaningless comments
* unused types/functions
* tests written only to increase coverage
* copied architecture
* unrelated refactors
* dependency additions without need

Do not rewrite a subsystem because an AI tool produced a cleaner-looking version.

Preserve working code unless the requested change requires otherwise.

---

## 10. Scope Discipline

One PR should address one core problem.

If a task is too large:

* split it into sub-issues
* keep each change independently understandable
* use stacked PRs when changes are genuinely interdependent

Every PR in a stack must remain valid and non-breaking when merged independently.

Do not combine:

* feature work
* unrelated refactoring
* dependency upgrades
* formatting changes
* opportunistic cleanup

into one PR.

If a reviewer cannot summarize the purpose of the PR in one sentence, the scope probably needs work.

---

## 11. Dependencies

Before adding a dependency:

1. search the repository for existing functionality
2. determine whether the dependency is actually necessary
3. check maintenance and compatibility
4. consider bundle/runtime impact
5. consider transitive dependencies
6. consider licensing

Do not upgrade unrelated dependencies while solving another problem.

---

## 12. Testing

Test behavior, not implementation details.

Before writing tests, inspect the repository's actual testing setup. Do not assume Jest, Vitest, Playwright, Cypress, Supertest, or any other framework exists.

Tests should cover relevant:

* happy paths
* validation failures
* authorization failures
* edge cases
* regressions
* state transitions

Bug fixes should normally include a regression test.

Use behavior-oriented names, for example:

```text
should reject registration when the email is already registered
should deny event deletion for non-admin users
should return an event when the event ID exists
```

Where the project requires tests, target >90% coverage. Coverage is a quality floor, not a reason to write meaningless tests.

---

## 13. Comments and TODOs

Comments should explain **why**, not restate what the code already says.

Bad:

```ts
// Increment count
count++;
```

Good:

```ts
// Keep this counter synchronized with the external registration limit.
count++;
```

TODOs should be actionable and reference an issue where possible.

Do not add comments merely to make generated code look documented.

---

## 14. Verification

Use commands that actually exist in the repository.

### Root

```bash
npm run dev
npm run dev:fast
npm run lint
npm run type-check
npm run build
npm run start
```

### Backend

Run from `backend/`:

```bash
npm run dev
npm run build
npm run start
npm run db:migrate
npm run db:generate
npm run db:studio
```

Check `package.json` before using any command not listed here.

The repository's configuration is authoritative.

---

## 15. Environment and Secrets

Use:

```text
backend/env.example
```

as the reference for backend configuration.

Never commit:

* `.env` files containing secrets
* database credentials
* JWT secrets
* OAuth secrets
* API keys
* tokens
* private keys

Never place secrets in:

* source code
* logs
* screenshots
* Loom recordings
* PR descriptions
* issues

If a secret is accidentally exposed, treat it as compromised and rotate it.

---

## 16. Documentation

Update documentation when a change affects:

* developer setup
* architecture
* API behavior
* configuration
* authentication
* database behavior
* contribution workflow
* user-visible functionality

Detailed developer documentation belongs in the project's documentation system and `docs/` where appropriate.

Do not turn `AGENTS.md` into the entire architecture manual.

---

## 17. Git and Pull Requests

Use focused branches such as:

```text
feature/...
fix/...
refactor/...
docs/...
test/...
chore/...
```

Do not modify `main` directly.

Keep PRs focused and reviewable.

PRs should remain Draft until they are genuinely ready.

Before requesting review:

* implementation is complete
* tests/checks have been run
* lint/type-check/build are relevantly verified
* documentation is updated where necessary
* secrets are absent
* diff has been self-reviewed
* PR description explains what and why
* Loom walkthrough is included for substantive code changes
* UI changes include appropriate screenshots/recordings

Documentation and minor changes do not require a Loom.

---

## 18. Self-Review

Before considering work complete, inspect the final diff.

Ask:

* Did I change anything unrelated?
* Did I duplicate existing functionality?
* Did I invent an abstraction?
* Did I change an API contract?
* Did I weaken auth or validation?
* Did I introduce a dependency unnecessarily?
* Did I expose sensitive information?
* Did I update affected consumers?
* Did I test the important failure paths?
* Did I actually run the checks I claim to have run?
* Did I leave the code simpler or at least no worse?

Do not declare completion based on code generation alone.

---

## 19. Final Rule

When uncertain:

1. inspect the repository
2. search for existing patterns
3. trace consumers
4. make the smallest safe change
5. verify the result
6. report what was actually verified

**Do the work. Understand the work. Verify the work. Do not make the repository worse merely because an AI can produce code quickly.**
