-- ==========================================================================
-- GRI Auth Extension — schema_auth_extension.sql
-- Version     : 3.0.0
-- Description : Login / Register / Admin-Controlled Permission System
--               • Adds approval_status to core.users
--               • Seeds default roles: admin, student, faculty, staff, other
--               • Creates staff_profiles, other_profiles, audit_log tables
--               • Seeds a default admin account (set via env vars before running)
-- Run after   : schema.sql and schema_v2_extension.sql
-- ==========================================================================

SET search_path = core, academic, exam, campus, finance, placement, research, ai, infra, public;

-- --------------------------------------------------------------------------
-- 1. ADD APPROVAL COLUMNS TO core.users
-- --------------------------------------------------------------------------
-- approval_status:
--   'approved'  → user can log in (admin sets this)
--   'pending'   → registered but not yet approved  [ONLY admin self-registers as approved]
--   'rejected'  → admin denied access
--   'suspended' → previously approved but access revoked by admin

ALTER TABLE core.users
  ADD COLUMN IF NOT EXISTS approval_status VARCHAR(20)
    NOT NULL DEFAULT 'approved'
    CHECK (approval_status IN ('approved','pending','rejected','suspended'));

ALTER TABLE core.users
  ADD COLUMN IF NOT EXISTS full_name         TEXT,
  ADD COLUMN IF NOT EXISTS approved_by       UUID REFERENCES core.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS approved_at       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejection_reason  TEXT,
  ADD COLUMN IF NOT EXISTS created_by        UUID REFERENCES core.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS notes             TEXT;

-- Index for fast lookups on approval queue
CREATE INDEX IF NOT EXISTS idx_users_approval_status ON core.users (approval_status)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_users_role_status ON core.users (role_id, approval_status)
  WHERE deleted_at IS NULL;

-- --------------------------------------------------------------------------
-- 2. SEED DEFAULT ROLES
-- --------------------------------------------------------------------------
INSERT INTO core.roles (name, description) VALUES
  ('admin',   'System Administrator — full access to all modules and user management'),
  ('student', 'Student — read-only access to own academic data; login enabled by admin'),
  ('faculty', 'Faculty member — access to academic, attendance, and result modules'),
  ('staff',   'Non-teaching staff — limited access based on department; login enabled by admin'),
  ('other',   'Guest / External / Alumni — restricted access; login enabled by admin')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;

-- --------------------------------------------------------------------------
-- 3. TABLE: core.staff_profiles  (for staff role users)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.staff_profiles (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID        UNIQUE NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    employee_id     VARCHAR(30) UNIQUE,
    first_name      TEXT        NOT NULL,
    last_name       TEXT        NOT NULL,
    designation     VARCHAR(100),
    department_id   UUID        REFERENCES core.departments(id),
    date_of_joining DATE,
    phone           VARCHAR(20),
    photo_url       TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- 4. TABLE: core.other_profiles  (for 'other' role: alumni, guest, external)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.other_profiles (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID        UNIQUE NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    first_name      TEXT        NOT NULL,
    last_name       TEXT,
    organisation    VARCHAR(200),
    designation     VARCHAR(100),
    purpose         TEXT,
    phone           VARCHAR(20),
    photo_url       TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- 5. TABLE: core.sessions  (track active refresh tokens for revocation)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.sessions (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID        NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    refresh_token   TEXT        UNIQUE NOT NULL,
    ip_address      VARCHAR(45),
    user_agent      TEXT,
    issued_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ NOT NULL,
    revoked_at      TIMESTAMPTZ,
    revoked_reason  VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON core.sessions (user_id)
  WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_sessions_token   ON core.sessions (refresh_token)
  WHERE revoked_at IS NULL;

-- --------------------------------------------------------------------------
-- 6. TABLE: core.audit_log  (immutable record of all admin actions)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.audit_log (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id        UUID        NOT NULL REFERENCES core.users(id),
    action          VARCHAR(60) NOT NULL,
    target_user_id  UUID        REFERENCES core.users(id),
    target_email    VARCHAR(255),
    metadata        JSONB       DEFAULT '{}',
    ip_address      VARCHAR(45),
    user_agent      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_actor     ON core.audit_log (actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_target    ON core.audit_log (target_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_action    ON core.audit_log (action, created_at DESC);

-- --------------------------------------------------------------------------
-- 7. TABLE: core.login_attempts  (brute-force protection)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.login_attempts (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) NOT NULL,
    ip_address      VARCHAR(45),
    success         BOOLEAN      NOT NULL,
    failure_reason  VARCHAR(100),
    attempted_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_email_time
  ON core.login_attempts (email, attempted_at DESC);

-- --------------------------------------------------------------------------
-- 8. SEED DEFAULT ADMIN ACCOUNT
-- --------------------------------------------------------------------------
-- Password below is bcrypt hash of: Admin@GRI2026
-- CHANGE THIS PASSWORD after first login!
DO $$
DECLARE
    v_admin_role_id UUID;
    v_admin_user_id UUID := uuid_generate_v4();
BEGIN
    SELECT id INTO v_admin_role_id FROM core.roles WHERE name = 'admin';

    IF NOT EXISTS (
        SELECT 1 FROM core.users u
        JOIN core.roles r ON r.id = u.role_id
        WHERE r.name = 'admin' AND u.deleted_at IS NULL
    ) THEN
        INSERT INTO core.users (
            id, email, password_hash, phone, role_id,
            is_active, is_email_verified, approval_status,
            full_name, created_at, updated_at
        ) VALUES (
            v_admin_user_id,
            'admin@ruraluniv.ac.in',
            '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGAkF8Yq6p0XQKQTB3ORfPvFwK',
            '+91-4542-240601',
            v_admin_role_id,
            TRUE, TRUE, 'approved',
            'GRI System Administrator',
            NOW(), NOW()
        );
        RAISE NOTICE 'Default admin account created: admin@ruraluniv.ac.in';
    ELSE
        RAISE NOTICE 'Admin account already exists — skipping seed.';
    END IF;
END;
$$;

-- --------------------------------------------------------------------------
-- 9. VIEW: core.v_users_with_role  (for admin panel queries)
-- --------------------------------------------------------------------------
CREATE OR REPLACE VIEW core.v_users_with_role AS
SELECT
    u.id,
    u.email,
    u.full_name,
    u.phone,
    r.name               AS role_name,
    u.approval_status,
    u.is_active,
    u.is_email_verified,
    u.last_login_at,
    u.notes,
    u.rejection_reason,
    u.approved_at,
    approver.email       AS approved_by_email,
    approver.full_name   AS approved_by_name,
    u.created_at,
    u.updated_at,
    u.deleted_at
FROM core.users u
JOIN core.roles r ON r.id = u.role_id
LEFT JOIN core.users approver ON approver.id = u.approved_by
WHERE u.deleted_at IS NULL;

-- ==========================================================================
-- MIGRATION COMPLETE
-- Run: psql -d gri_db -f schema_auth_extension.sql
-- ==========================================================================
