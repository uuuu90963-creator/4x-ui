# 4X-UI

> Next-generation Xray proxy management panel — architecture upgraded from 3x-ui

## 🚀 Overview

4X-UI is a modern, high-performance web panel for managing Xray-core servers with a microservices architecture.

**Key Improvements over 3x-UI:**

| Feature | 3x-UI | 4X-UI |
|---------|-------|-------|
| Architecture | Monolithic | Microservices (Go) |
| Frontend | Vanilla JS | React 18 + TypeScript + Vite |
| Database | SQLite | PostgreSQL + Redis |
| Real-time | Polling | WebSocket |
| API | REST (sync) | gRPC + REST |
| Deployment | Single server | Kubernetes-ready |
| Security | Basic JWT | Zero-trust + 2FA |

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                   React 18 + TypeScript                      │
│                 Tailwind CSS + Zustand                       │
└──────────────────────────┬───────────────────────────────────┘
                           │ gRPC / REST
┌──────────────────────────┴───────────────────────────────────┐
│                      API Gateway                             │
│                    (Nginx / Caddy)                          │
└──────────────────────────┬───────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────┴────┐        ┌────┴────┐        ┌────┴────┐
   │  User   │        │  Node   │        │  Stats  │
   │ Service │        │ Service │        │ Service │
   └────┬────┘        └────┬────┘        └────┬────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
       ┌──────┴──────┐          ┌──────┴──────┐
       │ PostgreSQL  │          │    Redis     │
       └─────────────┘          └──────────────┘
```

## 📦 Services

- **User Service**: Authentication, user management, subscriptions
- **Node Service**: Server/node management, health checks, deployment
- **Stats Service**: Traffic monitoring, billing, analytics
- **Notify Service**: Telegram notifications, email alerts

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- Zustand (state management)
- React Query (server state)
- WebSocket (real-time)

### Backend
- Go 1.22+
- gRPC + Protobuf
- Echo (REST framework)
- PostgreSQL 16
- Redis 7

### Infrastructure
- Docker + Docker Compose
- Kubernetes (Helm charts)
- Prometheus + Grafana
- GitHub Actions CI/CD

## 🚀 Quick Start

### Development

```bash
# Clone the repository
git clone https://github.com/uuuu90963-creator/4x-ui.git
cd 4x-ui

# Start infrastructure
docker-compose up -d postgres redis

# Start backend services
cd backend && go run ./...

# Start frontend
cd frontend && npm install && npm run dev
```

### Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📁 Project Structure

```
4x-ui/
├── frontend/           # React 18 + TypeScript frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── services/    # API clients
│   │   ├── stores/      # Zustand stores
│   │   └── types/       # TypeScript types
│   └── package.json
├── backend/           # Go microservices
│   ├── cmd/           # Main applications
│   ├── internal/      # Internal packages
│   ├── api/           # gRPC/REST definitions
│   └── pkg/           # Shared libraries
├── infra/             # Infrastructure as code
│   ├── docker/       # Docker configurations
│   └── k8s/          # Kubernetes manifests
├── docs/             # Documentation
└── README.md
```

## 🌟 Features

- [ ] Multi-protocol support (Vmess, VLESS, Trojan, Shadowsocks, WireGuard, etc.)
- [ ] Multi-user management with traffic/IP limits
- [ ] Real-time server monitoring
- [ ] Telegram bot notifications
- [ ] Subscription system
- [ ] Multi-node management
- [ ] Role-based access control (RBAC)
- [ ] 2FA authentication
- [ ] Comprehensive audit logging
- [ ] API rate limiting
- [ ] WebSocket real-time updates
- [ ] Kubernetes deployment support

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines first.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- [GitHub Repository](https://github.com/uuuu90963-creator/4x-ui)
- [3x-UI Original Project](https://github.com/MHSanaei/3x-ui)

---

**Status**: 🚧 In Development — Architecture Design Phase