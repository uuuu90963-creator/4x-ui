-- 4X-UI Database Schema
-- PostgreSQL 16+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    totp_secret VARCHAR(255),
    totp_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Servers (Nodes) table
CREATE TABLE servers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    host VARCHAR(255) NOT NULL,
    port INT DEFAULT 22,
    ssh_key_path TEXT,
    ssh_password_encrypted TEXT,
    status VARCHAR(50) DEFAULT 'offline',
    last_health_check TIMESTAMP,
    cpu_usage DECIMAL(5,2) DEFAULT 0,
    memory_usage DECIMAL(5,2) DEFAULT 0,
    bandwidth_in BIGINT DEFAULT 0,
    bandwidth_out BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Inbounds table
CREATE TABLE inbounds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
    protocol VARCHAR(50) NOT NULL,
    port INT NOT NULL,
    remark VARCHAR(255),
    settings JSONB NOT NULL DEFAULT '{}',
    stream_settings JSONB DEFAULT '{}',
    enable BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inbound_id UUID REFERENCES inbounds(id) ON DELETE CASCADE,
    email VARCHAR(255),
    uuid VARCHAR(255) UNIQUE NOT NULL,
    enable BOOLEAN DEFAULT true,
    flow VARCHAR(50),
    alter_id INT DEFAULT 0,
    expiry_time TIMESTAMP,
    total_limit BIGINT, -- in bytes, NULL = unlimited
    reset INT DEFAULT 0, -- traffic reset interval in days, 0 = no reset
    upload BIGINT DEFAULT 0,
    download BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Traffic logs table
CREATE TABLE traffic_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    upload BIGINT DEFAULT 0,
    download BIGINT DEFAULT 0,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Subscription plans table
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    duration_days INT DEFAULT 30,
    bandwidth_limit BIGINT, -- in bytes, NULL = unlimited
    description TEXT,
    features TEXT[],
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id),
    status VARCHAR(50) DEFAULT 'active',
    start_date TIMESTAMP DEFAULT NOW(),
    expiry_date TIMESTAMP,
    auto_renew BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Alert logs table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    server_id UUID REFERENCES servers(id) ON DELETE SET NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sessions table (for JWT refresh tokens)
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255) NOT NULL,
    user_agent TEXT,
    ip_address VARCHAR(45),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Settings table
CREATE TABLE settings (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_servers_status ON servers(status);
CREATE INDEX idx_inbounds_server_id ON inbounds(server_id);
CREATE INDEX idx_clients_inbound_id ON clients(inbound_id);
CREATE INDEX idx_clients_expiry_time ON clients(expiry_time);
CREATE INDEX idx_traffic_logs_client_id ON traffic_logs(client_id);
CREATE INDEX idx_traffic_logs_timestamp ON traffic_logs(timestamp);
CREATE INDEX idx_alerts_server_id ON alerts(server_id);
CREATE INDEX idx_alerts_read ON alerts(read);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
('panel', '{"name": "4X-UI", "url": "", "theme": "dark", "language": "en", "timezone": "Asia/Shanghai"}'),
('smtp', '{"enabled": false, "host": "", "port": 587, "username": "", "password": ""}'),
('telegram', '{"enabled": false, "bot_token": "", "chat_id": ""}'),
('security', '{"2fa_required": false, "max_login_attempts": 5, "lockout_duration": 900}');

-- Insert sample subscription plans
INSERT INTO subscription_plans (name, price, duration_days, bandwidth_limit, description, features)
VALUES
('Free', 0, 30, 1073741824, 'Free tier - 1GB/month', ARRAY['1GB bandwidth', 'Basic support', 'Single device']),
('Basic', 9.99, 30, 53687091200, 'Basic plan - 50GB/month', ARRAY['50GB bandwidth', 'Priority support', '5 devices', 'No ads']),
('Pro', 29.99, 30, 214748364800, 'Pro plan - 200GB/month', ARRAY['200GB bandwidth', '24/7 support', 'Unlimited devices', 'No ads', 'Priority speed']),
('Ultimate', 99.99, 30, NULL, 'Unlimited - unlimited bandwidth', ARRAY['Unlimited bandwidth', '24/7 support', 'Unlimited devices', 'No ads', 'Max speed', 'Free trials']);

-- Create admin user (password: admin123)
INSERT INTO users (username, email, password_hash, role)
VALUES ('admin', 'admin@4x-ui.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.Q.W7F7E9vLQn3vKhHe', 'admin');