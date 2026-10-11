---
name: pnpm override reification
description: Reconcile patched pnpm lockfile overrides with installed workspace packages.
---

After changing root pnpm workspace overrides, run `pnpm install` before validating the runtime. A clean lockfile audit can coexist temporarily with stale installed package links until pnpm reifies the updated graph.

**Why:** During the dependency remediation, the lockfile and audit showed patched versions while `pnpm why` and the running preview still used the previous installed graph until a forced reinstall.

**How to apply:** After adding or changing overrides in `pnpm-workspace.yaml`, install from the lockfile, then check the resolved dependency graph, audit, build, and restart affected workflows.
