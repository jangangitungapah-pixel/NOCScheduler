# Domain Modules

NOCScheduler is a modular monolith. Business domains live under `src/modules` and must keep ownership explicit.

Planned domain boundaries from the PRDs/workplan:

- `auth`
- `employees`
- `schedule`
- `exceptions`
- `payroll`
- `reports`
- `notifications`
- `audit`
- `settings`

Directories are introduced with their implementation phase rather than committed as empty folders. Domain business rules must not be implemented only inside React components.
