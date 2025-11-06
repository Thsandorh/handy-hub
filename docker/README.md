# Docker Development Environment

## Services

- **PostgreSQL 15 with PostGIS**: Port 5432
- **Redis 7**: Port 6379
- **Redis Commander**: Port 8081 (GUI for Redis)

## Usage

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Stop and remove volumes (⚠️ deletes all data)
docker-compose down -v
```

## Connection Strings

**PostgreSQL:**
```
postgresql://postgres:postgres@localhost:5432/mesterpont
```

**Redis:**
```
redis://localhost:6379
```

## Access Redis Commander

http://localhost:8081
