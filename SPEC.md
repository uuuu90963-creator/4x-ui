# 4X-UI Specification

> Architecture specification for 4X-UI — next-generation Xray proxy management panel

---

## 1. Overview

**Project Name:** 4X-UI  
**Type:** Next-generation server management panel for Xray-core  
**Core Functionality:** Multi-protocol proxy server management with microservices architecture  
**Target Users:** System administrators managing Xray proxy infrastructure

**Base Project:** [MHSanaei/3x-ui](https://github.com/MHSanaei/3x-ui) — upgraded architecture

---

## 2. Architecture

### 2.1 High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENTS                                 │
│                   (Web Browser)                              │
└─────────────────────────────┬──────────────────────────────┘
                              │ HTTPS / WSS
┌─────────────────────────────┴──────────────────────────────┐
│                    FRONTEND (React 18)                       │
│              React + TypeScript + Vite                       │
│              Tailwind CSS + Zustand + React Query            │
└─────────────────────────────┬──────────────────────────────┘
                              │ gRPC (8080) / REST (8081)
┌─────────────────────────────┴──────────────────────────────┐
│                    API GATEWAY (Nginx)                       │
│               Layer 4 Load Balancer                         │
└─────────────────────────────┬──────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────┴────┐          ┌────┴────┐          ┌────┴────┐
   │  User   │          │  Node   │          │  Stats  │
   │ Service │          │ Service │          │ Service │
   │  :5001  │          │  :5002  │          │  :5003  │
   └────┬────┘          └────┬────┘          └────┬────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
       ┌──────┴──────┐                 ┌──────┴──────┐
       │ PostgreSQL  │                 │    Redis    │
       │   :5432    │                 │   :6379    │
       └────────────┘                 └────────────┘
```

### 2.2 Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | React | 18.x |
| Frontend | TypeScript | 5.x |
| Frontend | Vite | 5.x |
| Frontend | Tailwind CSS | 3.x |
| Frontend | Zustand | 4.x |
| Frontend | React Query | 5.x |
| Frontend | WebSocket | ws |
| Backend | Go | 1.22+ |
| Backend | gRPC | 1.62+ |
| Backend | Echo (REST) | 4.x |
| Database | PostgreSQL | 16.x |
| Cache | Redis | 7.x |
| Gateway | Nginx/Caddy | latest |
| Container | Docker | 24.x |
| Orchestration | Kubernetes | 1.29+ |

---

## 3. Frontend Specification

### 3.1 Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Authentication page |
| Dashboard | `/` | Main dashboard with stats |
| Servers | `/servers` | Node/server management |
| Users | `/users` | User management |
| Inbounds | `/inbounds` | Protocol inbound configuration |
| Subscriptions | `/subscriptions` | Subscription plans |
| Settings | `/settings` | Panel settings |
| Admin | `/admin` | Admin-only area |

### 3.2 Dashboard Components

- **Server Status Cards**: Real-time CPU, RAM, Bandwidth
- **Traffic Chart**: Live traffic visualization (WebSocket)
- **User Statistics**: Active users, total bandwidth used
- **Recent Activity**: Last 10 actions log
- **Quick Actions**: Add user, restart service, etc.

### 3.3 State Management

```typescript
// Zustand store structure
interface AppStore {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Server state
  servers: Server[];
  selectedServer: string | null;
  
  // UI state
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  
  // WebSocket
  wsConnected: boolean;
  realTimeStats: ServerStats[];
}
```

### 3.4 API Communication

- REST API for CRUD operations
- gRPC for high-frequency data (stats, logs)
- WebSocket for real-time updates

---

## 4. Backend Specification

### 4.1 Services

#### User Service (Port 5001)
- User CRUD operations
- Authentication (JWT)
- Subscription management
- 2FA handling

#### Node Service (Port 5002)
- Server/node CRUD
- Health check monitoring
- Xray configuration deployment
- SSH key management

#### Stats Service (Port 5003)
- Traffic data collection
- Bandwidth accounting
- Usage analytics
- Billing integration

#### Notify Service (Port 5004)
- Telegram bot integration
- Email notifications
- Alert rules engine

### 4.2 Database Schema (PostgreSQL)

```sql
-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Servers (Nodes)
CREATE TABLE servers (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    host VARCHAR(255) NOT NULL,
    port INT DEFAULT 22,
    ssh_key_path TEXT,
    status VARCHAR(50) DEFAULT 'offline',
    last_health_check TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Inbounds
CREATE TABLE inbounds (
    id UUID PRIMARY KEY,
    server_id UUID REFERENCES servers(id),
    protocol VARCHAR(50) NOT NULL,
    port INT NOT NULL,
    settings JSONB NOT NULL,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Clients
CREATE TABLE clients (
    id UUID PRIMARY KEY,
    inbound_id UUID REFERENCES inbounds(id),
    email VARCHAR(255),
    flow VARCHAR(50),
    enable BOOLEAN DEFAULT true,
    expiry_time TIMESTAMP,
    total_limit INT,
    reset INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Traffic Logs
CREATE TABLE traffic_logs (
    id UUID PRIMARY KEY,
    client_id UUID REFERENCES clients(id),
    upload BIGINT DEFAULT 0,
    download BIGINT DEFAULT 0,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Subscription Plans
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    bandwidth_limit BIGINT, -- in bytes, NULL = unlimited
    duration_days INT DEFAULT 30,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 4.3 API Endpoints

#### Authentication
```
POST   /api/v1/auth/login
POST   /api/v1/auth/register
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
POST   /api/v1/auth/2fa/enable
POST   /api/v1/auth/2fa/verify
```

#### Users
```
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/:id
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id
```

#### Servers
```
GET    /api/v1/servers
POST   /api/v1/servers
GET    /api/v1/servers/:id
PUT    /api/v1/servers/:id
DELETE /api/v1/servers/:id
POST   /api/v1/servers/:id/health-check
POST   /api/v1/servers/:id/deploy
```

#### Inbounds
```
GET    /api/v1/inbounds
POST   /api/v1/inbounds
GET    /api/v1/inbounds/:id
PUT    /api/v1/inbounds/:id
DELETE /api/v1/inbounds/:id
POST   /api/v1/inbounds/:id/clients
GET    /api/v1/inbounds/:id/clients
```

#### Clients
```
GET    /api/v1/clients
PUT    /api/v1/clients/:id
DELETE /api/v1/clients/:id
POST   /api/v1/clients/:id/enable
POST   /api/v1/clients/:id/disable
POST   /api/v1/clients/:id/reset
```

#### Stats
```
GET    /api/v1/stats/overview
GET    /api/v1/stats/traffic
GET    /api/v1/stats/servers
WS     /ws/stats (real-time)
```

---

## 5. Security Specification

### 5.1 Authentication
- JWT access tokens (15min expiry)
- Refresh tokens (7 days, stored in Redis)
- Password hashing: Argon2id
- 2FA: TOTP (Google Authenticator)

### 5.2 Authorization
- RBAC: Admin, Moderator, User roles
- API rate limiting: 100 req/min per user
- IP whitelist for admin endpoints

### 5.3 Network Security
- TLS 1.3 for all communications
- mTLS between microservices
- Firewall rules for server access

---

## 6. Real-time Specification

### 6.1 WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `stats:update` | Server → Client | Real-time server stats |
| `user:joined` | Server → Client | New user connected |
| `alert:triggered` | Server → Client | System alert |
| `traffic:threshold` | Server → Client | Usage threshold reached |

### 6.2 Health Checks
- Server ping: Every 30 seconds
- Service health: Every 60 seconds
- Automatic failover on failure

---

## 7. Deployment Specification

### 7.1 Docker Compose (Development)

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: 4xui
      POSTGRES_USER: 4xui
      POSTGRES_PASSWORD: 4xui_secret
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  api-gateway:
    build: ./gateway
    ports:
      - "8080:8080"
      - "8081:8081"

  user-service:
    build: ./services/user
    ports:
      - "5001:5001"

  node-service:
    build: ./services/node
    ports:
      - "5002:5002"

  stats-service:
    build: ./services/stats
    ports:
      - "5003:5003"
```

### 7.2 Kubernetes

- Helm charts for production deployment
- HPA (Horizontal Pod Autoscaler) for services
- PDB (Pod Disruption Budget) for zero-downtime updates

---

## 8. Development Phases

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Project Setup, Repo Init | 🚧 In Progress |
| Phase 2 | Database Schema | 📋 Todo |
| Phase 3 | Backend Services (Go) | 📋 Todo |
| Phase 4 | Frontend (React) | 📋 Todo |
| Phase 5 | WebSocket Real-time | 📋 Todo |
| Phase 6 | Docker & K8s | 📋 Todo |
| Phase 7 | Testing & Documentation | 📋 Todo |
| Phase 8 | GitHub Release | 📋 Todo |

---

## 9. Milestones

- [ ] Repository created ✓
- [ ] Project structure defined
- [ ] Database schema migrated
- [ ] Backend services running
- [ ] Frontend deployed
- [ ] WebSocket working
- [ ] Production deployment ready
- [ ] Open source release

---

**Last Updated:** 2026-05-31  
**Version:** 0.1.0-alpha