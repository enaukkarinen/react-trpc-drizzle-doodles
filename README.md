

## Structural overview

- packages/db
    - owns schema
    - depends on drizzle-orm
- apps/server
    - owns DB connections
    - depends on postgres, drizzle-orm
- packages/api
    - owns procedures
