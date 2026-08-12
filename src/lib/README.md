# Shared Infrastructure

Cross-domain infrastructure belongs under `src/lib` only when it is genuinely shared.

Planned areas include database access, authentication adapters, validation, time, money, permissions, and observability. Business-domain policy should remain in its owning module rather than turning `lib/` into a dumping ground.
