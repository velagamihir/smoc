-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create users table with password hashing
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('manager', 'client', 'admin', 'super_admin')),
  manager_id UUID,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  password_reset_token UUID,
  password_reset_expires_at TIMESTAMP,
  password_reset_otp VARCHAR(6),
  password_reset_otp_expires_at TIMESTAMP,
  FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Insert demo users (passwords are hashed using pgcrypto)
-- password for mohan: Manager@2026
INSERT INTO users (username, email, full_name, password_hash, role)
VALUES (
  'mohan',
  'mohan@smoc.com',
  'Mohan Joshi',
  crypt('Manager@2026', gen_salt('bf')),
  'manager'
)
ON CONFLICT (email) DO NOTHING;

-- password for pushpakshi: Client@2026
INSERT INTO users (username, email, full_name, password_hash, role)
VALUES (
  'pushpakshi',
  'pushpakshi@smoc.com',
  'Pushpakshi',
  crypt('Client@2026', gen_salt('bf')),
  'client'
)
ON CONFLICT (email) DO NOTHING;

-- Optional: Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
