-- Create Admin User for Elegance EMS
-- Run this in PostgreSQL

INSERT INTO users (id, name, email, password, role, employee_id, department, designation, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Mr.Nobody',
  'admin@elegance.com',
  '$2a$12$GnSo6iH8.NJCzi6eoL4tBuSjR8ReAcOwPhtLQEWzw1K9zdNfgDJ1O',
  'root',
  'EMP001',
  'Administration',
  'System Administrator',
  NOW(),
  NOW()
);
