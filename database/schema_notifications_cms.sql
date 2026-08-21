-- ==========================================================================
-- GRI Real-Time Communication & CMS Extension — schema_notifications_cms.sql
-- Version     : 1.0.0
-- Description : Complete schema extension for real-time multi-channel notifications,
--               targeting engine, approval workflow, recipient tracking, channel logs,
--               user channel preferences, dynamic CMS content, and audit log.
-- ==========================================================================

SET search_path = core, infra, academic, public;

-- --------------------------------------------------------------------------
-- 1. EXTEND core.users FOR COMMUNICATION CHANNELS & AUDIENCE TARGETING
-- --------------------------------------------------------------------------
ALTER TABLE core.users
  ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(20),
  ADD COLUMN IF NOT EXISTS university_id    VARCHAR(50),
  ADD COLUMN IF NOT EXISTS department_id   UUID REFERENCES core.departments(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS programme       TEXT,
  ADD COLUMN IF NOT EXISTS batch_year      SMALLINT,
  ADD COLUMN IF NOT EXISTS current_year    SMALLINT DEFAULT 1;

CREATE INDEX IF NOT EXISTS idx_users_whatsapp   ON core.users(whatsapp_number) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_dept_prog ON core.users(department_id, programme, batch_year) WHERE deleted_at IS NULL;

-- --------------------------------------------------------------------------
-- 2. TABLE: infra.notification_preferences (Channel & Topic Toggles per User)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS infra.notification_preferences (
    id                UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id           UUID        UNIQUE NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    push_enabled      BOOLEAN     NOT NULL DEFAULT TRUE,
    email_enabled     BOOLEAN     NOT NULL DEFAULT TRUE,
    whatsapp_enabled  BOOLEAN     NOT NULL DEFAULT TRUE,
    sms_enabled       BOOLEAN     NOT NULL DEFAULT TRUE,
    in_app_enabled    BOOLEAN     NOT NULL DEFAULT TRUE,
    academic_enabled  BOOLEAN     NOT NULL DEFAULT TRUE,
    event_enabled     BOOLEAN     NOT NULL DEFAULT TRUE,
    placement_enabled BOOLEAN     NOT NULL DEFAULT TRUE,
    emergency_enabled BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- 3. TABLE: infra.official_notifications (Main Notification Record & Workflow)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS infra.official_notifications (
    id                UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    title             TEXT        NOT NULL,
    message           TEXT        NOT NULL,
    category          VARCHAR(50) NOT NULL DEFAULT 'general'
                                  CHECK (category IN ('general','academic','exam','admission','placement','scholarship','research','events','emergency','department','hostel','library','transport','fee','attendance')),
    priority          VARCHAR(20) NOT NULL DEFAULT 'NORMAL'
                                  CHECK (priority IN ('LOW','NORMAL','HIGH','URGENT')),
    status            VARCHAR(30) NOT NULL DEFAULT 'DRAFT'
                                  CHECK (status IN ('DRAFT','SUBMITTED','PENDING_APPROVAL','APPROVED','SCHEDULED','SENDING','SENT','REJECTED','CANCELLED','FAILED','EXPIRED')),
    attachment_url    TEXT,
    deep_link         TEXT,
    target_type       VARCHAR(50) NOT NULL DEFAULT 'all'
                                  CHECK (target_type IN ('all','role','department','programme','year','batch','user','group','hostel','placement','research')),
    target_filter     JSONB       NOT NULL DEFAULT '{}',
    channels          JSONB       NOT NULL DEFAULT '["in_app","push"]', -- ["in_app","push","email","whatsapp","sms"]
    estimated_recipients INTEGER  NOT NULL DEFAULT 0,
    actual_recipients   INTEGER  NOT NULL DEFAULT 0,
    rejection_reason  TEXT,
    created_by        UUID        NOT NULL REFERENCES core.users(id),
    submitted_by      UUID        REFERENCES core.users(id),
    approved_by       UUID        REFERENCES core.users(id),
    submitted_at      TIMESTAMPTZ,
    approved_at       TIMESTAMPTZ,
    scheduled_at      TIMESTAMPTZ,
    published_at      TIMESTAMPTZ,
    expires_at        TIMESTAMPTZ,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_status   ON infra.official_notifications(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_category ON infra.official_notifications(category);
CREATE INDEX IF NOT EXISTS idx_notifications_created  ON infra.official_notifications(created_by);

-- --------------------------------------------------------------------------
-- 4. TABLE: infra.notification_recipients (Per-User Delivery & Read Receipt Tracking)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS infra.notification_recipients (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    notification_id UUID        NOT NULL REFERENCES infra.official_notifications(id) ON DELETE CASCADE,
    user_id         UUID        NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    delivery_status VARCHAR(20) NOT NULL DEFAULT 'queued'
                                CHECK (delivery_status IN ('queued','sent','delivered','failed')),
    read_status     VARCHAR(20) NOT NULL DEFAULT 'unread'
                                CHECK (read_status IN ('unread','read')),
    read_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (notification_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_recipients_user_read ON infra.notification_recipients(user_id, read_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recipients_notif     ON infra.notification_recipients(notification_id, delivery_status);

-- --------------------------------------------------------------------------
-- 5. TABLE: infra.notification_channels (Per-Channel Delivery Log)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS infra.notification_channels (
    id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    notification_id     UUID        NOT NULL REFERENCES infra.official_notifications(id) ON DELETE CASCADE,
    channel             VARCHAR(20) NOT NULL CHECK (channel IN ('push','email','whatsapp','sms','in_app')),
    status              VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sending','sent','delivered','failed')),
    provider_message_id VARCHAR(255),
    sent_count          INTEGER     NOT NULL DEFAULT 0,
    delivered_count     INTEGER     NOT NULL DEFAULT 0,
    failed_count        INTEGER     NOT NULL DEFAULT 0,
    error_message       TEXT,
    sent_at             TIMESTAMPTZ,
    delivered_at        TIMESTAMPTZ,
    failed_at           TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (notification_id, channel)
);

-- --------------------------------------------------------------------------
-- 6. TABLE: infra.cms_content (Dynamic University Content Management System)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS infra.cms_content (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           TEXT        NOT NULL,
    summary         TEXT,
    content_body    TEXT        NOT NULL,
    category        VARCHAR(50) NOT NULL DEFAULT 'announcement'
                                CHECK (category IN ('announcement','news','event','circular','notice','download','banner','placement','research')),
    image_url       TEXT,
    attachment_url  TEXT,
    external_url    TEXT,
    is_published    BOOLEAN     NOT NULL DEFAULT TRUE,
    is_featured     BOOLEAN     NOT NULL DEFAULT FALSE,
    target_role     VARCHAR(50) DEFAULT 'all',
    department_id   UUID        REFERENCES core.departments(id),
    event_date      TIMESTAMPTZ,
    created_by      UUID        NOT NULL REFERENCES core.users(id),
    published_at    TIMESTAMPTZ DEFAULT NOW(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_category ON infra.cms_content(category, is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cms_featured ON infra.cms_content(is_featured) WHERE is_featured IS TRUE;

-- ==========================================================================
-- END OF EXTENSION
-- ==========================================================================
