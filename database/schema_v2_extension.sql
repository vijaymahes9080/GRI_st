-- ==========================================================================
-- GRI (Gandhigram Rural Institute) — Stage 2 Schema Extension (v2.0)
-- Description : Server-Driven Remote Config, Feature Flags, Dynamic Navigation,
--               Unified Content Entities, and Web Data Ingestion Engine Tables
-- ==========================================================================

CREATE SCHEMA IF NOT EXISTS content;
CREATE SCHEMA IF NOT EXISTS sync;

SET search_path = core, content, sync, academic, exam, campus, finance, placement, research, ai, infra, public;

-- --------------------------------------------------------------------------
-- TABLE: core.app_config (Server-Driven Remote App Configuration)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.app_config (
    id                  UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_version         VARCHAR(20)  NOT NULL DEFAULT '1.0.0',
    minimum_version     VARCHAR(20)  NOT NULL DEFAULT '1.0.0',
    recommended_version VARCHAR(20)  NOT NULL DEFAULT '1.0.0',
    maintenance_mode    BOOLEAN      NOT NULL DEFAULT FALSE,
    maintenance_message TEXT         DEFAULT 'GRI Services are undergoing scheduled maintenance. Please check back shortly.',
    theme_tokens        JSONB        NOT NULL DEFAULT '{
        "primaryColor": "#518214",
        "secondaryColor": "#911C03",
        "accentColor": "#F16236",
        "surfaceColor": "#FFFFFF",
        "darkSurfaceColor": "#121212"
    }'::jsonb,
    is_active           BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- TABLE: core.feature_flags (Dynamic Server-Controlled Feature Rollouts)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.feature_flags (
    id                 UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    key                VARCHAR(60) UNIQUE NOT NULL, -- e.g. 'admissions', 'examinations', 'results'
    title              VARCHAR(100) NOT NULL,
    description        TEXT,
    enabled            BOOLEAN     NOT NULL DEFAULT TRUE,
    rollout_percentage INT         NOT NULL DEFAULT 100 CHECK (rollout_percentage BETWEEN 0 AND 100),
    allowed_roles      TEXT[]      DEFAULT '{}', -- Empty array means available to all roles
    min_app_version    VARCHAR(20) DEFAULT '1.0.0',
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- TABLE: core.navigation_nodes (Dynamic Server-Driven Mobile Menu)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS core.navigation_nodes (
    id                 UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id            VARCHAR(60)  UNIQUE NOT NULL, -- e.g. 'home', 'academics', 'admissions'
    title              VARCHAR(100) NOT NULL,
    icon               VARCHAR(50)  NOT NULL, -- Lucide icon key
    route              VARCHAR(120) NOT NULL, -- App screen route path
    feature_flag_key   VARCHAR(60)  REFERENCES core.feature_flags(key) ON DELETE SET NULL,
    sort_order         INT          NOT NULL DEFAULT 0,
    enabled            BOOLEAN      NOT NULL DEFAULT TRUE,
    parent_id          UUID         REFERENCES core.navigation_nodes(id) ON DELETE CASCADE,
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- TABLE: content.entities (Unified Institutional Content Model)
-- Covers: Announcement, News, Event, Department, Programme, Faculty,
-- Admission, Exam, Result, Document, Notification, Contact, Campus, Facility
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS content.entities (
    id           UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type  VARCHAR(50)  NOT NULL, -- 'announcement'|'news'|'event'|'department'|'programme'|'faculty'|'admission'|'exam'|'result'|'document'|'facility'
    title        VARCHAR(500) NOT NULL,
    description  TEXT,
    content_html TEXT,
    category     VARCHAR(100) DEFAULT 'General',
    status       VARCHAR(30)  NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'syncing')),
    source_url   TEXT,
    source_id    VARCHAR(255),
    image_url    TEXT,
    attachments  JSONB        DEFAULT '[]'::jsonb, -- Array of { title, url, sizeBytes, mimeType }
    metadata     JSONB        DEFAULT '{}'::jsonb, -- Flexible metadata payload
    checksum     VARCHAR(64),                      -- SHA256 of normalized raw content
    language     VARCHAR(10)  NOT DEFAULT 'en',
    published_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    deleted_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_content_entities_type_status ON content.entities (entity_type, status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_entities_checksum ON content.entities (checksum);

-- --------------------------------------------------------------------------
-- TABLE: sync.selector_configs (Configurable HTML Parser Selectors)
-- Allows updating scraping targets WITHOUT changing application code
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sync.selector_configs (
    id                 UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_name        VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'gri_homepage_ticker', 'gri_faculty_table'
    target_url         TEXT         NOT NULL,
    item_selector      TEXT         NOT NULL, -- CSS / Cheerio selector for item container
    title_selector     TEXT         NOT NULL,
    link_selector      TEXT,
    date_selector      TEXT,
    content_selector   TEXT,
    is_active          BOOLEAN      NOT NULL DEFAULT TRUE,
    last_tested_at     TIMESTAMPTZ,
    last_status        VARCHAR(30)  DEFAULT 'pending',
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- TABLE: sync.sync_jobs (Ingestion Pipeline Execution Audit)
-- --------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sync.sync_jobs (
    id                 UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_name           VARCHAR(100) NOT NULL,
    source_url         TEXT         NOT NULL,
    status             VARCHAR(30)  NOT NULL CHECK (status IN ('running', 'success', 'failed', 'partial')),
    items_fetched      INT          NOT NULL DEFAULT 0,
    items_created      INT          NOT NULL DEFAULT 0,
    items_updated      INT          NOT NULL DEFAULT 0,
    items_failed       INT          NOT NULL DEFAULT 0,
    error_log          TEXT,
    execution_time_ms  INT,
    started_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    completed_at       TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_sync_jobs_status_started ON sync.sync_jobs (status, started_at DESC);

-- --------------------------------------------------------------------------
-- DEFAULT SEED DATA
-- --------------------------------------------------------------------------
INSERT INTO core.app_config (app_version, minimum_version, maintenance_mode)
VALUES ('1.0.0', '1.0.0', FALSE)
ON CONFLICT DO NOTHING;

INSERT INTO core.feature_flags (key, title, description, enabled, rollout_percentage)
VALUES 
    ('admissions', 'Admissions Portal', 'Dynamic GRI Admissions & Prospectus', TRUE, 100),
    ('examinations', 'Exam Cell', 'Exam Timetables & Schedules', TRUE, 100),
    ('results', 'Semester Results', 'Student Result Portal', TRUE, 100),
    ('departments', 'Departments Directory', 'Academic Schools & Departments', TRUE, 100),
    ('faculty', 'Faculty Directory', 'Faculty Profiles & Contact Details', TRUE, 100),
    ('news', 'Notices & Announcements', 'University Circulars & Tickers', TRUE, 100),
    ('events', 'Campus Events', 'Conferences, Seminars & Workshops', TRUE, 100),
    ('downloads', 'Resource Downloads', 'Forms, Manuals & Documents', TRUE, 100),
    ('student_services', 'Student Services', 'Hostel, Transport & Grievance', TRUE, 100)
ON CONFLICT (key) DO NOTHING;

INSERT INTO core.navigation_nodes (node_id, title, icon, route, feature_flag_key, sort_order)
VALUES 
    ('home', 'Home', 'home', '/(tabs)', NULL, 1),
    ('academics', 'Academics', 'book-open', '/(tabs)/academics', 'departments', 2),
    ('admissions', 'Admissions', 'graduation-cap', '/(tabs)/admissions', 'admissions', 3),
    ('examinations', 'Examinations', 'file-text', '/(tabs)/examinations', 'examinations', 4),
    ('news', 'Notices', 'bell', '/(tabs)/news', 'news', 5)
ON CONFLICT (node_id) DO NOTHING;
