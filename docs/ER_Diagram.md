# ER Diagram for User Authentication and Item CRUD Microservice

```mermaid
erDiagram
    USER ||--o{ ITEM : owns
    USER {
      UUID id PK
      String email UQ
      String passwordHash
      DateTime createdAt
      DateTime updatedAt
    }
    ITEM {
      UUID id PK
      String name
      String description
      UUID ownerId FK
      DateTime createdAt
      DateTime updatedAt
      DateTime deletedAt
    }
    USER ||--o{ REFRESHTOKEN : has
    REFRESHTOKEN {
      UUID id PK
      String token UQ
      UUID userId FK
      DateTime expiresAt
      DateTime createdAt
      DateTime revokedAt
    }
```

## Notes
- UUID v7 used for primary keys for time-ordered indexing
- Soft deletes implemented on Item with deletedAt
- Refresh tokens stored with expiry and revocation timestamps
- Rate limiting handled externally in Redis, not in DB
