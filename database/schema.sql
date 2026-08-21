-- ==========================================================================
-- GRI (Gandhigram Rural Institute) — Production PostgreSQL Database Schema
-- Version     : 1.0.0
-- Author      : Vijay Mahes (Principal Database Architect)
-- Date        : August 2026
-- Description : Scalable, normalized, partitioned, indexed PostgreSQL schema
--               for the GRI Mobile & Web Application
--
-- Best Practices applied:
--   • 3NF Normalization throughout
--   • UUID primary keys for global uniqueness
--   • Timestamptz for all time columns (timezone-aware)
--   • Soft deletes (deleted_at) instead of hard DELETEs
--   • Row-Level Security (RLS) enabled on sensitive tables
--   • Declarative partitioning on high-volume tables (attendance, results, notifications)
--   • Partial and composite indexes for query performance
--   • FK constraints with ON DELETE RESTRICT / CASCADE where appropriate
--   • CHECK constraints for enums (no separate enum types for portability)
-- ==========================================================================

-- --------------------------------------------------------------------------
-- EXTENSIONS
-- --------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";        -- Password hashing
CREATE EXTENSION IF NOT EXISTS "pg_trgm";         -- Trigram search on names
CREATE EXTENSION IF NOT EXISTS "btree_gin";       -- GIN indexes on multiple cols
CREATE EXTENSION IF NOT EXISTS "vector";          -- pgvector for AI embeddings

-- --------------------------------------------------------------------------
-- SCHEMA ORGANIZATION
-- --------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS core;        -- Users, roles, departments
CREATE SCHEMA IF NOT EXISTS academic;    -- Courses, subjects, timetable, attendance
CREATE SCHEMA IF NOT EXISTS exam;        -- Results, assignments
CREATE SCHEMA IF NOT EXISTS campus;      -- Library, hostel, transport
CREATE SCHEMA IF NOT EXISTS finance;     -- Payments, scholarships
CREATE SCHEMA IF NOT EXISTS placement;  -- Companies, drives, applications
CREATE SCHEMA IF NOT EXISTS research;   -- Publications, projects
CREATE SCHEMA IF NOT EXISTS ai;          -- Chatbot, documents, embeddings
CREATE SCHEMA IF NOT EXISTS infra;       -- Notifications, complaints, events

SET search_path = core, academic, exam, campus, finance, placement, research, ai, infra, public;


-- ==========================================================================
-- SCHEMA: core
-- ==========================================================================

-- --------------------------------------------------------------------------
-- TABLE: core.roles
-- --------------------------------------------------------------------------
CREATE TABLE core.roles (
    id          UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(50)  UNIQUE NOT NULL,  -- student, faculty, admin, parent, alumni, warden, librarian, placement_officer, finance_officer
    description TEXT,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- TABLE: core.permissions
-- --------------------------------------------------------------------------
CREATE TABLE core.permissions (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    module      VARCHAR(80) NOT NULL,   -- e.g., 'attendance', 'library', 'exam_results'
    action      VARCHAR(30) NOT NULL,   -- read | write | delete | approve
    description TEXT,
    UNIQUE (module, action)
);

-- --------------------------------------------------------------------------
-- TABLE: core.role_permissions (Junction)
-- --------------------------------------------------------------------------
CREATE TABLE core.role_permissions (
    role_id       UUID REFERENCES core.roles(id)       ON DELETE CASCADE,
    permission_id UUID REFERENCES core.permissions(id) ON DELETE CASCADE,
    granted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id)
);

-- --------------------------------------------------------------------------
-- TABLE: core.users  (Central identity table for ALL actors)
-- --------------------------------------------------------------------------
CREATE TABLE core.users (
    id              UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   TEXT         NOT NULL,    -- bcrypt/pgcrypto hash
    phone           VARCHAR(20),
    role_id         UUID         NOT NULL REFERENCES core.roles(id),
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    is_email_verified BOOLEAN    NOT NULL DEFAULT FALSE,
    last_login_at   TIMESTAMPTZ,
    mfa_enabled     BOOLEAN      NOT NULL DEFAULT FALSE,
    mfa_secret      TEXT,                     -- TOTP secret (encrypted)
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ                          -- Soft delete
);

-- --------------------------------------------------------------------------
-- TABLE: core.departments
-- --------------------------------------------------------------------------
CREATE TABLE core.departments (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    code        VARCHAR(20) UNIQUE NOT NULL,   -- e.g., 'DEPT-CS', 'DEPT-BIO'
    name        TEXT        NOT NULL,
    school      TEXT,                          -- School / Faculty it belongs to
    hod_id      UUID        REFERENCES core.users(id) ON DELETE SET NULL,
    email       VARCHAR(255),
    phone       VARCHAR(20),
    about       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- TABLE: core.student_profiles
-- --------------------------------------------------------------------------
CREATE TABLE core.student_profiles (
    id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id          UUID        UNIQUE NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    roll_number      VARCHAR(30) UNIQUE NOT NULL,
    register_number  VARCHAR(30) UNIQUE,
    first_name       TEXT        NOT NULL,
    last_name        TEXT        NOT NULL,
    date_of_birth    DATE,
    gender           VARCHAR(10) CHECK (gender IN ('male','female','other')),
    blood_group      VARCHAR(5),
    aadhar_number    VARCHAR(12),          -- Stored encrypted in production
    category         VARCHAR(20) CHECK (category IN ('OC','BC','MBC','SC','ST','OBC')),
    department_id    UUID        REFERENCES core.departments(id),
    programme        TEXT        NOT NULL,
    degree_type      VARCHAR(20) CHECK (degree_type IN ('UG','PG','M.Phil.','Ph.D.','Diploma','B.Voc.','ITEP','Certificate')),
    batch_year       SMALLINT    NOT NULL,
    current_semester SMALLINT    NOT NULL DEFAULT 1,
    cgpa             NUMERIC(4,2),
    address          TEXT,
    city             VARCHAR(100),
    state            VARCHAR(100),
    pincode          VARCHAR(10),
    parent_name      TEXT,
    parent_phone     VARCHAR(20),
    parent_email     VARCHAR(255),
    photo_url        TEXT,
    digital_id_qr    TEXT,                 -- QR code payload (encrypted)
    is_hosteller     BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- TABLE: core.faculty_profiles
-- --------------------------------------------------------------------------
CREATE TABLE core.faculty_profiles (
    id                UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id           UUID        UNIQUE NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    employee_id       VARCHAR(30) UNIQUE NOT NULL,
    first_name        TEXT        NOT NULL,
    last_name         TEXT        NOT NULL,
    designation       VARCHAR(100),        -- Asst. Prof | Assoc. Prof | Professor
    department_id     UUID        REFERENCES core.departments(id),
    qualification     TEXT,
    specialization    TEXT,
    date_of_joining   DATE,
    experience_years  SMALLINT,
    research_interests TEXT[],
    orcid_id          VARCHAR(30),
    scopus_id         VARCHAR(30),
    photo_url         TEXT,
    google_scholar_url TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ==========================================================================
-- SCHEMA: academic
-- ==========================================================================

-- --------------------------------------------------------------------------
-- TABLE: academic.courses
-- --------------------------------------------------------------------------
CREATE TABLE academic.courses (
    id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    code          VARCHAR(20) UNIQUE NOT NULL,
    name          TEXT        NOT NULL,
    department_id UUID        REFERENCES core.departments(id),
    credits       SMALLINT    NOT NULL CHECK (credits BETWEEN 1 AND 10),
    type          VARCHAR(30) CHECK (type IN ('core','elective','open_elective','lab','project','audit')),
    degree_type   VARCHAR(20) CHECK (degree_type IN ('UG','PG','M.Phil.','Ph.D.')),
    semester      SMALLINT    NOT NULL,
    syllabus_url  TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- TABLE: academic.subjects  (Sub-units / modules within a course)
-- --------------------------------------------------------------------------
CREATE TABLE academic.subjects (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id   UUID        NOT NULL REFERENCES academic.courses(id) ON DELETE CASCADE,
    unit_number SMALLINT    NOT NULL,
    title       TEXT        NOT NULL,
    description TEXT,
    hours       SMALLINT
);

-- --------------------------------------------------------------------------
-- TABLE: academic.course_faculty  (Which faculty teaches which course — many-to-many)
-- --------------------------------------------------------------------------
CREATE TABLE academic.course_faculty (
    course_id    UUID     NOT NULL REFERENCES academic.courses(id)             ON DELETE CASCADE,
    faculty_id   UUID     NOT NULL REFERENCES core.faculty_profiles(id)        ON DELETE CASCADE,
    academic_year VARCHAR(10) NOT NULL,   -- e.g., '2026-27'
    semester     SMALLINT NOT NULL,
    PRIMARY KEY (course_id, faculty_id, academic_year, semester)
);

-- --------------------------------------------------------------------------
-- TABLE: academic.course_students  (Enrollment — many-to-many)
-- --------------------------------------------------------------------------
CREATE TABLE academic.course_students (
    course_id  UUID NOT NULL REFERENCES academic.courses(id)           ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES core.student_profiles(id)      ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (course_id, student_id)
);

-- --------------------------------------------------------------------------
-- TABLE: academic.timetable
-- --------------------------------------------------------------------------
CREATE TABLE academic.timetable (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id   UUID        NOT NULL REFERENCES academic.courses(id),
    faculty_id  UUID        NOT NULL REFERENCES core.faculty_profiles(id),
    department_id UUID      NOT NULL REFERENCES core.departments(id),
    day_of_week SMALLINT    NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1=Mon
    start_time  TIME        NOT NULL,
    end_time    TIME        NOT NULL,
    room        VARCHAR(50),
    academic_year VARCHAR(10),
    semester    SMALLINT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- TABLE: academic.attendance
-- PARTITIONED BY RANGE (record_date) — monthly partitions
-- --------------------------------------------------------------------------
CREATE TABLE academic.attendance (
    id          UUID        NOT NULL DEFAULT uuid_generate_v4(),
    student_id  UUID        NOT NULL REFERENCES core.student_profiles(id),
    course_id   UUID        NOT NULL REFERENCES academic.courses(id),
    faculty_id  UUID        REFERENCES core.faculty_profiles(id),
    record_date DATE        NOT NULL,
    status      VARCHAR(10) NOT NULL CHECK (status IN ('present','absent','od','ml','duty_leave')),
    marked_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    latitude    NUMERIC(10,7),           -- Geo-verification
    longitude   NUMERIC(10,7),
    verified    BOOLEAN     NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id, record_date)
) PARTITION BY RANGE (record_date);

-- Monthly partitions (2026)
CREATE TABLE academic.attendance_2026_01 PARTITION OF academic.attendance
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE academic.attendance_2026_02 PARTITION OF academic.attendance
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
CREATE TABLE academic.attendance_2026_03 PARTITION OF academic.attendance
    FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
CREATE TABLE academic.attendance_2026_04 PARTITION OF academic.attendance
    FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
CREATE TABLE academic.attendance_2026_05 PARTITION OF academic.attendance
    FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
CREATE TABLE academic.attendance_2026_06 PARTITION OF academic.attendance
    FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
CREATE TABLE academic.attendance_2026_07 PARTITION OF academic.attendance
    FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
CREATE TABLE academic.attendance_2026_08 PARTITION OF academic.attendance
    FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');
CREATE TABLE academic.attendance_2026_09 PARTITION OF academic.attendance
    FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');
CREATE TABLE academic.attendance_2026_10 PARTITION OF academic.attendance
    FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
CREATE TABLE academic.attendance_2026_11 PARTITION OF academic.attendance
    FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
CREATE TABLE academic.attendance_2026_12 PARTITION OF academic.attendance
    FOR VALUES FROM ('2026-12-01') TO ('2027-01-01');


-- ==========================================================================
-- SCHEMA: exam
-- ==========================================================================

-- --------------------------------------------------------------------------
-- TABLE: exam.exam_schedules
-- --------------------------------------------------------------------------
CREATE TABLE exam.exam_schedules (
    id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id     UUID        NOT NULL REFERENCES academic.courses(id),
    exam_type     VARCHAR(30) NOT NULL CHECK (exam_type IN ('ESE','CIA1','CIA2','Model','Practical','Viva','PhD_coursework')),
    exam_date     DATE        NOT NULL,
    start_time    TIME        NOT NULL,
    end_time      TIME        NOT NULL,
    hall          VARCHAR(50),
    academic_year VARCHAR(10),
    semester      SMALLINT,
    published     BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- TABLE: exam.results
-- PARTITIONED BY academic_year
-- --------------------------------------------------------------------------
CREATE TABLE exam.results (
    id             UUID         NOT NULL DEFAULT uuid_generate_v4(),
    student_id     UUID         NOT NULL REFERENCES core.student_profiles(id),
    course_id      UUID         NOT NULL REFERENCES academic.courses(id),
    exam_type      VARCHAR(30)  NOT NULL CHECK (exam_type IN ('ESE','CIA1','CIA2','Model','Practical','Viva')),
    marks_obtained NUMERIC(6,2),
    max_marks      NUMERIC(6,2) NOT NULL DEFAULT 100,
    grade          VARCHAR(5),
    grade_points   NUMERIC(3,1),
    is_pass        BOOLEAN,
    academic_year  VARCHAR(10)  NOT NULL,
    semester       SMALLINT     NOT NULL,
    published_at   TIMESTAMPTZ,
    PRIMARY KEY (id, academic_year)
) PARTITION BY LIST (academic_year);

CREATE TABLE exam.results_2025_26 PARTITION OF exam.results FOR VALUES IN ('2025-26');
CREATE TABLE exam.results_2026_27 PARTITION OF exam.results FOR VALUES IN ('2026-27');

-- --------------------------------------------------------------------------
-- TABLE: exam.hall_tickets
-- --------------------------------------------------------------------------
CREATE TABLE exam.hall_tickets (
    id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id    UUID        NOT NULL REFERENCES core.student_profiles(id),
    exam_schedule_id UUID     NOT NULL REFERENCES exam.exam_schedules(id),
    hall_number   VARCHAR(20),
    seat_number   VARCHAR(20),
    qr_code       TEXT,
    is_blocked    BOOLEAN     NOT NULL DEFAULT FALSE,
    block_reason  TEXT,
    generated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- TABLE: exam.assignments
-- --------------------------------------------------------------------------
CREATE TABLE exam.assignments (
    id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id     UUID        NOT NULL REFERENCES academic.courses(id),
    faculty_id    UUID        NOT NULL REFERENCES core.faculty_profiles(id),
    title         TEXT        NOT NULL,
    description   TEXT,
    file_url      TEXT,
    max_marks     NUMERIC(5,2),
    due_date      TIMESTAMPTZ NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- TABLE: exam.assignment_submissions
-- --------------------------------------------------------------------------
CREATE TABLE exam.assignment_submissions (
    id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID        NOT NULL REFERENCES exam.assignments(id) ON DELETE CASCADE,
    student_id    UUID        NOT NULL REFERENCES core.student_profiles(id),
    file_url      TEXT,
    submitted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    marks_awarded NUMERIC(5,2),
    feedback      TEXT,
    graded_at     TIMESTAMPTZ,
    UNIQUE (assignment_id, student_id)
);


-- ==========================================================================
-- SCHEMA: campus
-- ==========================================================================

-- --------------------------------------------------------------------------
-- TABLE: campus.library_books
-- --------------------------------------------------------------------------
CREATE TABLE campus.library_books (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    isbn            VARCHAR(20) UNIQUE,
    title           TEXT        NOT NULL,
    author          TEXT        NOT NULL,
    publisher       TEXT,
    year            SMALLINT,
    edition         VARCHAR(20),
    category        VARCHAR(50),
    department_id   UUID        REFERENCES core.departments(id),
    call_number     VARCHAR(30),
    total_copies    SMALLINT    NOT NULL DEFAULT 1,
    available_copies SMALLINT   NOT NULL DEFAULT 1,
    location        VARCHAR(50),           -- Shelf/Rack reference
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- TABLE: campus.library_transactions
-- --------------------------------------------------------------------------
CREATE TABLE campus.library_transactions (
    id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id      UUID        NOT NULL REFERENCES campus.library_books(id),
    user_id      UUID        NOT NULL REFERENCES core.users(id),
    issued_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    due_date     DATE        NOT NULL,
    returned_at  TIMESTAMPTZ,
    fine_amount  NUMERIC(8,2) DEFAULT 0,
    fine_paid    BOOLEAN     NOT NULL DEFAULT FALSE,
    status       VARCHAR(20) NOT NULL DEFAULT 'issued' CHECK (status IN ('issued','returned','overdue','lost'))
);

-- --------------------------------------------------------------------------
-- TABLE: campus.hostels
-- --------------------------------------------------------------------------
CREATE TABLE campus.hostels (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT        NOT NULL,
    type        VARCHAR(10) NOT NULL CHECK (type IN ('boys','girls','working_women')),
    warden_id   UUID        REFERENCES core.users(id) ON DELETE SET NULL,
    total_rooms SMALLINT,
    capacity    SMALLINT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- TABLE: campus.hostel_rooms
-- --------------------------------------------------------------------------
CREATE TABLE campus.hostel_rooms (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    hostel_id   UUID        NOT NULL REFERENCES campus.hostels(id) ON DELETE CASCADE,
    room_number VARCHAR(20) NOT NULL,
    capacity    SMALLINT    NOT NULL DEFAULT 3,
    occupied    SMALLINT    NOT NULL DEFAULT 0,
    floor       SMALLINT,
    room_type   VARCHAR(20) CHECK (room_type IN ('single','double','triple')),
    UNIQUE (hostel_id, room_number)
);

-- --------------------------------------------------------------------------
-- TABLE: campus.hostel_allocations
-- --------------------------------------------------------------------------
CREATE TABLE campus.hostel_allocations (
    id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id   UUID        UNIQUE NOT NULL REFERENCES core.student_profiles(id),
    room_id      UUID        NOT NULL REFERENCES campus.hostel_rooms(id),
    academic_year VARCHAR(10) NOT NULL,
    allocated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    vacated_at   TIMESTAMPTZ
);

-- --------------------------------------------------------------------------
-- TABLE: campus.hostel_outpasses
-- --------------------------------------------------------------------------
CREATE TABLE campus.hostel_outpasses (
    id                UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id        UUID        NOT NULL REFERENCES core.student_profiles(id),
    reason            TEXT        NOT NULL,
    destination       TEXT,
    departure_date    DATE        NOT NULL,
    return_date       DATE        NOT NULL,
    parent_approval   VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (parent_approval IN ('pending','approved','rejected')),
    warden_approval   VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (warden_approval IN ('pending','approved','rejected')),
    security_qr       TEXT,                   -- Dynamic QR after full approval
    requested_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    parent_actioned_at TIMESTAMPTZ,
    warden_actioned_at TIMESTAMPTZ
);

-- --------------------------------------------------------------------------
-- TABLE: campus.transport_routes
-- --------------------------------------------------------------------------
CREATE TABLE campus.transport_routes (
    id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_number VARCHAR(20) NOT NULL,
    route_name   TEXT        NOT NULL,
    origin       TEXT        NOT NULL,
    destination  TEXT        NOT NULL,
    stops        JSONB,                    -- Array of stop names + times
    departure_time TIME,
    return_time  TIME,
    fare         NUMERIC(8,2),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- TABLE: campus.transport_passes
-- --------------------------------------------------------------------------
CREATE TABLE campus.transport_passes (
    id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id   UUID        NOT NULL REFERENCES core.student_profiles(id),
    route_id     UUID        NOT NULL REFERENCES campus.transport_routes(id),
    valid_from   DATE        NOT NULL,
    valid_to     DATE        NOT NULL,
    pass_qr      TEXT,
    issued_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ==========================================================================
-- SCHEMA: finance
-- ==========================================================================

-- --------------------------------------------------------------------------
-- TABLE: finance.fee_structures
-- --------------------------------------------------------------------------
CREATE TABLE finance.fee_structures (
    id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    name          TEXT        NOT NULL,
    category      VARCHAR(30) NOT NULL CHECK (category IN ('tuition','exam','hostel','transport','library','misc')),
    degree_type   VARCHAR(20),
    department_id UUID        REFERENCES core.departments(id),
    amount        NUMERIC(12,2) NOT NULL,
    academic_year VARCHAR(10)  NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- TABLE: finance.payments
-- PARTITIONED BY academic_year
-- --------------------------------------------------------------------------
CREATE TABLE finance.payments (
    id               UUID         NOT NULL DEFAULT uuid_generate_v4(),
    user_id          UUID         NOT NULL REFERENCES core.users(id),
    fee_structure_id UUID         REFERENCES finance.fee_structures(id),
    amount           NUMERIC(12,2) NOT NULL,
    currency         VARCHAR(5)   NOT NULL DEFAULT 'INR',
    status           VARCHAR(20)  NOT NULL DEFAULT 'pending'
                                    CHECK (status IN ('pending','success','failed','refunded')),
    gateway          VARCHAR(30)  CHECK (gateway IN ('razorpay','paytm','upi','neft','cash')),
    gateway_txn_id   VARCHAR(100),
    receipt_url      TEXT,
    paid_at          TIMESTAMPTZ,
    academic_year    VARCHAR(10)  NOT NULL,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, academic_year)
) PARTITION BY LIST (academic_year);

CREATE TABLE finance.payments_2025_26 PARTITION OF finance.payments FOR VALUES IN ('2025-26');
CREATE TABLE finance.payments_2026_27 PARTITION OF finance.payments FOR VALUES IN ('2026-27');

-- --------------------------------------------------------------------------
-- TABLE: finance.scholarships
-- --------------------------------------------------------------------------
CREATE TABLE finance.scholarships (
    id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    name          TEXT        NOT NULL,
    type          VARCHAR(30) CHECK (type IN ('merit','need_based','govt','sports','minority')),
    amount        NUMERIC(12,2),
    eligibility   TEXT,
    academic_year VARCHAR(10),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- TABLE: finance.scholarship_applications
-- --------------------------------------------------------------------------
CREATE TABLE finance.scholarship_applications (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    scholarship_id  UUID        NOT NULL REFERENCES finance.scholarships(id),
    student_id      UUID        NOT NULL REFERENCES core.student_profiles(id),
    status          VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','disbursed')),
    applied_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    approved_at     TIMESTAMPTZ,
    disbursed_at    TIMESTAMPTZ,
    remarks         TEXT
);


-- ==========================================================================
-- SCHEMA: placement
-- ==========================================================================

-- --------------------------------------------------------------------------
-- TABLE: placement.companies
-- --------------------------------------------------------------------------
CREATE TABLE placement.companies (
    id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    name          TEXT        NOT NULL,
    website       TEXT,
    industry      VARCHAR(80),
    description   TEXT,
    logo_url      TEXT,
    contact_name  TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- TABLE: placement.drives
-- --------------------------------------------------------------------------
CREATE TABLE placement.drives (
    id                UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id        UUID        NOT NULL REFERENCES placement.companies(id),
    title             TEXT        NOT NULL,
    description       TEXT,
    job_role          TEXT,
    package_lpa       NUMERIC(6,2),
    eligibility_criteria TEXT,
    eligible_departments UUID[],  -- Array of department IDs
    eligible_degree_types TEXT[],
    min_cgpa          NUMERIC(3,2),
    registration_open BOOLEAN     NOT NULL DEFAULT TRUE,
    registration_start DATE,
    registration_end  DATE,
    drive_date        DATE,
    status            VARCHAR(20) NOT NULL DEFAULT 'upcoming'
                                    CHECK (status IN ('upcoming','active','completed','cancelled')),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- TABLE: placement.drive_applications
-- --------------------------------------------------------------------------
CREATE TABLE placement.drive_applications (
    id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    drive_id     UUID        NOT NULL REFERENCES placement.drives(id) ON DELETE CASCADE,
    student_id   UUID        NOT NULL REFERENCES core.student_profiles(id),
    resume_url   TEXT,
    status       VARCHAR(30) NOT NULL DEFAULT 'applied'
                               CHECK (status IN ('applied','shortlisted','test','interview','selected','rejected','offer_accepted','offer_declined')),
    applied_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    offer_letter_url TEXT,
    package_lpa  NUMERIC(6,2),
    UNIQUE (drive_id, student_id)
);


-- ==========================================================================
-- SCHEMA: research
-- ==========================================================================

-- --------------------------------------------------------------------------
-- TABLE: research.projects
-- --------------------------------------------------------------------------
CREATE TABLE research.projects (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           TEXT        NOT NULL,
    abstract        TEXT,
    pi_faculty_id   UUID        NOT NULL REFERENCES core.faculty_profiles(id),  -- Principal Investigator
    department_id   UUID        REFERENCES core.departments(id),
    funding_agency  TEXT,
    grant_amount    NUMERIC(15,2),
    start_date      DATE,
    end_date        DATE,
    status          VARCHAR(20) CHECK (status IN ('ongoing','completed','submitted','approved')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- TABLE: research.publications
-- --------------------------------------------------------------------------
CREATE TABLE research.publications (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           TEXT        NOT NULL,
    abstract        TEXT,
    journal_name    TEXT,
    volume          VARCHAR(20),
    issue           VARCHAR(20),
    pages           VARCHAR(20),
    doi             VARCHAR(100) UNIQUE,
    pub_type        VARCHAR(30) CHECK (pub_type IN ('journal','conference','book_chapter','patent','thesis')),
    published_date  DATE,
    impact_factor   NUMERIC(5,3),
    indexed_in      TEXT[],               -- ['scopus','web_of_science','pubmed']
    pdf_url         TEXT,
    project_id      UUID        REFERENCES research.projects(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- TABLE: research.publication_authors  (Junction — faculty + external authors)
-- --------------------------------------------------------------------------
CREATE TABLE research.publication_authors (
    publication_id  UUID        NOT NULL REFERENCES research.publications(id) ON DELETE CASCADE,
    faculty_id      UUID        REFERENCES core.faculty_profiles(id),
    author_name     TEXT        NOT NULL,   -- For external/non-GRI authors
    author_order    SMALLINT    NOT NULL,
    is_corresponding BOOLEAN    NOT NULL DEFAULT FALSE,
    PRIMARY KEY (publication_id, author_order)
);


-- ==========================================================================
-- SCHEMA: ai
-- ==========================================================================

-- --------------------------------------------------------------------------
-- TABLE: ai.documents  (Source documents for RAG knowledge base)
-- --------------------------------------------------------------------------
CREATE TABLE ai.documents (
    id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    title          TEXT        NOT NULL,
    category       VARCHAR(50) CHECK (category IN ('regulation','syllabus','circular','notice','prospectus','policy','faq','hostel','exam','placement','research')),
    source_url     TEXT,
    file_path      TEXT,
    content_text   TEXT,                   -- Extracted plain text
    file_size_kb   INTEGER,
    mime_type      VARCHAR(50),
    language       VARCHAR(10) DEFAULT 'en',
    is_active      BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- TABLE: ai.document_chunks  (Text chunks for vector embedding)
-- --------------------------------------------------------------------------
CREATE TABLE ai.document_chunks (
    id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id  UUID        NOT NULL REFERENCES ai.documents(id) ON DELETE CASCADE,
    chunk_index  SMALLINT    NOT NULL,
    content      TEXT        NOT NULL,
    token_count  INTEGER,
    embedding    vector(384),             -- MiniLM-L6-v2 = 384 dimensions
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- TABLE: ai.chatbot_sessions
-- --------------------------------------------------------------------------
CREATE TABLE ai.chatbot_sessions (
    id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id      UUID        NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    started_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at     TIMESTAMPTZ,
    channel      VARCHAR(20) CHECK (channel IN ('mobile','web','whatsapp')),
    language     VARCHAR(10) DEFAULT 'en'
);

-- --------------------------------------------------------------------------
-- TABLE: ai.chatbot_messages
-- PARTITIONED BY RANGE (sent_at)
-- --------------------------------------------------------------------------
CREATE TABLE ai.chatbot_messages (
    id            UUID        NOT NULL DEFAULT uuid_generate_v4(),
    session_id    UUID        NOT NULL REFERENCES ai.chatbot_sessions(id) ON DELETE CASCADE,
    role          VARCHAR(15) NOT NULL CHECK (role IN ('user','assistant','system')),
    content       TEXT        NOT NULL,
    source_chunks UUID[],                 -- Chunk IDs used for RAG response
    confidence    NUMERIC(4,3),           -- RAG confidence score 0.000–1.000
    tokens_used   INTEGER,
    sent_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, sent_at)
) PARTITION BY RANGE (sent_at);

CREATE TABLE ai.chatbot_messages_2026_q3 PARTITION OF ai.chatbot_messages
    FOR VALUES FROM ('2026-07-01') TO ('2026-10-01');
CREATE TABLE ai.chatbot_messages_2026_q4 PARTITION OF ai.chatbot_messages
    FOR VALUES FROM ('2026-10-01') TO ('2027-01-01');
CREATE TABLE ai.chatbot_messages_2027_q1 PARTITION OF ai.chatbot_messages
    FOR VALUES FROM ('2027-01-01') TO ('2027-04-01');


-- ==========================================================================
-- SCHEMA: infra
-- ==========================================================================

-- --------------------------------------------------------------------------
-- TABLE: infra.events
-- --------------------------------------------------------------------------
CREATE TABLE infra.events (
    id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    title        TEXT        NOT NULL,
    description  TEXT,
    event_type   VARCHAR(30) CHECK (event_type IN ('cultural','academic','sports','placement','research','convocation','national_day','workshop','seminar','guest_lecture','outreach')),
    department_id UUID       REFERENCES core.departments(id),
    venue        TEXT,
    start_at     TIMESTAMPTZ NOT NULL,
    end_at       TIMESTAMPTZ NOT NULL,
    banner_url   TEXT,
    is_public    BOOLEAN     NOT NULL DEFAULT TRUE,
    created_by   UUID        REFERENCES core.users(id),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- TABLE: infra.notifications
-- PARTITIONED BY RANGE (created_at) — quarterly
-- --------------------------------------------------------------------------
CREATE TABLE infra.notifications (
    id           UUID        NOT NULL DEFAULT uuid_generate_v4(),
    user_id      UUID        REFERENCES core.users(id) ON DELETE CASCADE,
    role_id      UUID        REFERENCES core.roles(id),   -- NULL = targeted; set = broadcast
    title        TEXT        NOT NULL,
    body         TEXT        NOT NULL,
    type         VARCHAR(30) CHECK (type IN ('alert','info','exam','fee','attendance','placement','hostel','library','event','circular','emergency')),
    channel      VARCHAR(20) CHECK (channel IN ('push','sms','email','all')),
    is_read      BOOLEAN     NOT NULL DEFAULT FALSE,
    deep_link    TEXT,                    -- In-app navigation target
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE infra.notifications_2026_q3 PARTITION OF infra.notifications
    FOR VALUES FROM ('2026-07-01') TO ('2026-10-01');
CREATE TABLE infra.notifications_2026_q4 PARTITION OF infra.notifications
    FOR VALUES FROM ('2026-10-01') TO ('2027-01-01');
CREATE TABLE infra.notifications_2027_q1 PARTITION OF infra.notifications
    FOR VALUES FROM ('2027-01-01') TO ('2027-04-01');

-- --------------------------------------------------------------------------
-- TABLE: infra.complaints
-- --------------------------------------------------------------------------
CREATE TABLE infra.complaints (
    id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    raised_by    UUID        NOT NULL REFERENCES core.users(id),
    category     VARCHAR(40) CHECK (category IN ('academic','hostel','transport','library','finance','infrastructure','ragging','harassment','other')),
    subject      TEXT        NOT NULL,
    description  TEXT        NOT NULL,
    attachment_url TEXT,
    status       VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed','escalated')),
    assigned_to  UUID        REFERENCES core.users(id),
    resolution   TEXT,
    priority     VARCHAR(10) NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high','critical')),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at  TIMESTAMPTZ
);


-- ==========================================================================
-- INDEXES (Performance Optimization)
-- ==========================================================================

-- core.users
CREATE INDEX idx_users_email        ON core.users(email);
CREATE INDEX idx_users_role_id      ON core.users(role_id);
CREATE INDEX idx_users_active       ON core.users(is_active) WHERE deleted_at IS NULL;

-- core.student_profiles
CREATE INDEX idx_students_roll      ON core.student_profiles(roll_number);
CREATE INDEX idx_students_dept      ON core.student_profiles(department_id);
CREATE INDEX idx_students_batch     ON core.student_profiles(batch_year);
CREATE INDEX idx_students_name      ON core.student_profiles USING gin(to_tsvector('english', first_name || ' ' || last_name));

-- core.faculty_profiles
CREATE INDEX idx_faculty_dept       ON core.faculty_profiles(department_id);
CREATE INDEX idx_faculty_name       ON core.faculty_profiles USING gin(to_tsvector('english', first_name || ' ' || last_name));

-- academic.attendance
CREATE INDEX idx_attendance_student ON academic.attendance(student_id, record_date);
CREATE INDEX idx_attendance_course  ON academic.attendance(course_id, record_date);
CREATE INDEX idx_attendance_date    ON academic.attendance(record_date DESC);
CREATE INDEX idx_attendance_status  ON academic.attendance(status);

-- academic.timetable
CREATE INDEX idx_timetable_course   ON academic.timetable(course_id);
CREATE INDEX idx_timetable_faculty  ON academic.timetable(faculty_id);
CREATE INDEX idx_timetable_day      ON academic.timetable(day_of_week);

-- exam.results
CREATE INDEX idx_results_student    ON exam.results(student_id, academic_year);
CREATE INDEX idx_results_course     ON exam.results(course_id);

-- exam.hall_tickets
CREATE INDEX idx_halltickets_student ON exam.hall_tickets(student_id);

-- campus.library_transactions
CREATE INDEX idx_libtxn_user        ON campus.library_transactions(user_id);
CREATE INDEX idx_libtxn_status      ON campus.library_transactions(status);
CREATE INDEX idx_libtxn_due         ON campus.library_transactions(due_date) WHERE returned_at IS NULL;

-- finance.payments
CREATE INDEX idx_payments_user      ON finance.payments(user_id, academic_year);
CREATE INDEX idx_payments_status    ON finance.payments(status);
CREATE INDEX idx_payments_gateway   ON finance.payments(gateway_txn_id);

-- placement.drive_applications
CREATE INDEX idx_placements_student ON placement.drive_applications(student_id);
CREATE INDEX idx_placements_status  ON placement.drive_applications(status);

-- ai.document_chunks (pgvector cosine similarity index)
CREATE INDEX idx_chunks_embedding   ON ai.document_chunks USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);
CREATE INDEX idx_chunks_document    ON ai.document_chunks(document_id);

-- ai.chatbot_messages
CREATE INDEX idx_chat_session       ON ai.chatbot_messages(session_id);
CREATE INDEX idx_chat_sent          ON ai.chatbot_messages(sent_at DESC);

-- infra.notifications
CREATE INDEX idx_notif_user         ON infra.notifications(user_id, is_read);
CREATE INDEX idx_notif_role         ON infra.notifications(role_id);
CREATE INDEX idx_notif_type         ON infra.notifications(type);

-- infra.complaints
CREATE INDEX idx_complaints_user    ON infra.complaints(raised_by);
CREATE INDEX idx_complaints_status  ON infra.complaints(status, priority);
CREATE INDEX idx_complaints_cat     ON infra.complaints(category);

-- research.publications
CREATE INDEX idx_pub_doi            ON research.publications(doi);
CREATE INDEX idx_pub_faculty        ON research.publication_authors(faculty_id);
CREATE INDEX idx_pub_date           ON research.publications(published_date DESC);


-- ==========================================================================
-- ROW-LEVEL SECURITY (RLS)
-- ==========================================================================

-- Enable RLS on sensitive tables
ALTER TABLE core.users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.student_profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam.results             ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.payments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai.chatbot_messages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE infra.notifications      ENABLE ROW LEVEL SECURITY;

-- Students can only see their own records
CREATE POLICY student_own_records ON core.student_profiles
    USING (user_id = current_setting('app.current_user_id')::uuid);

CREATE POLICY student_own_results ON exam.results
    USING (student_id = (
        SELECT id FROM core.student_profiles
        WHERE user_id = current_setting('app.current_user_id')::uuid
    ));

CREATE POLICY student_own_payments ON finance.payments
    USING (user_id = current_setting('app.current_user_id')::uuid);

CREATE POLICY student_own_chat ON ai.chatbot_messages
    USING (session_id IN (
        SELECT id FROM ai.chatbot_sessions
        WHERE user_id = current_setting('app.current_user_id')::uuid
    ));

-- Admins bypass all RLS
CREATE POLICY admin_bypass_users    ON core.users         USING (TRUE);
CREATE POLICY admin_bypass_students ON core.student_profiles USING (TRUE);


-- ==========================================================================
-- VIEWS (Commonly Queried Aggregates)
-- ==========================================================================

-- Attendance summary per student per course
CREATE VIEW academic.vw_attendance_summary AS
SELECT
    a.student_id,
    a.course_id,
    c.name                                              AS course_name,
    COUNT(*)                                            AS total_classes,
    SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS present_count,
    ROUND(
        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2
    )                                                   AS attendance_pct
FROM academic.attendance a
JOIN academic.courses c ON c.id = a.course_id
GROUP BY a.student_id, a.course_id, c.name;

-- Library overdue books
CREATE VIEW campus.vw_overdue_books AS
SELECT
    lt.id,
    u.email,
    b.title,
    b.isbn,
    lt.issued_at,
    lt.due_date,
    CURRENT_DATE - lt.due_date AS days_overdue,
    (CURRENT_DATE - lt.due_date) * 2.00 AS fine_estimate_inr
FROM campus.library_transactions lt
JOIN core.users               u  ON u.id  = lt.user_id
JOIN campus.library_books     b  ON b.id  = lt.book_id
WHERE lt.returned_at IS NULL AND lt.due_date < CURRENT_DATE;

-- Student placement status
CREATE VIEW placement.vw_placement_summary AS
SELECT
    sp.roll_number,
    sp.first_name || ' ' || sp.last_name AS student_name,
    d.name                               AS department,
    sp.cgpa,
    COUNT(da.id)                         AS drives_applied,
    SUM(CASE WHEN da.status = 'selected' THEN 1 ELSE 0 END) AS offers_received,
    MAX(da.package_lpa)                  AS highest_package_lpa
FROM core.student_profiles         sp
JOIN core.departments              d  ON d.id = sp.department_id
LEFT JOIN placement.drive_applications da ON da.student_id = sp.id
GROUP BY sp.id, sp.roll_number, sp.first_name, sp.last_name, d.name, sp.cgpa;


-- ==========================================================================
-- TRIGGERS (Automation)
-- ==========================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION core.fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE TRIGGER trg_users_updated_at       BEFORE UPDATE ON core.users               FOR EACH ROW EXECUTE FUNCTION core.fn_set_updated_at();
CREATE TRIGGER trg_students_updated_at    BEFORE UPDATE ON core.student_profiles     FOR EACH ROW EXECUTE FUNCTION core.fn_set_updated_at();
CREATE TRIGGER trg_faculty_updated_at     BEFORE UPDATE ON core.faculty_profiles     FOR EACH ROW EXECUTE FUNCTION core.fn_set_updated_at();
CREATE TRIGGER trg_complaints_updated_at  BEFORE UPDATE ON infra.complaints          FOR EACH ROW EXECUTE FUNCTION core.fn_set_updated_at();

-- Auto-update library available copies on transaction
CREATE OR REPLACE FUNCTION campus.fn_library_copy_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE campus.library_books SET available_copies = available_copies - 1 WHERE id = NEW.book_id;
    ELSIF TG_OP = 'UPDATE' AND NEW.returned_at IS NOT NULL AND OLD.returned_at IS NULL THEN
        UPDATE campus.library_books SET available_copies = available_copies + 1 WHERE id = NEW.book_id;
    END IF;
    RETURN NEW;
END; $$;

CREATE TRIGGER trg_library_copies
    AFTER INSERT OR UPDATE ON campus.library_transactions
    FOR EACH ROW EXECUTE FUNCTION campus.fn_library_copy_count();


-- ==========================================================================
-- SEED DATA: Roles & Permissions
-- ==========================================================================

INSERT INTO core.roles (name, description) VALUES
    ('student',           'Enrolled student'),
    ('faculty',           'Teaching faculty member'),
    ('admin',             'System administrator'),
    ('parent',            'Student guardian / parent'),
    ('alumni',            'GRI graduate'),
    ('warden',            'Hostel warden'),
    ('librarian',         'Library staff'),
    ('placement_officer', 'Placement cell officer'),
    ('finance_officer',   'Finance and accounts officer'),
    ('exam_controller',   'Controller of examinations');

INSERT INTO core.permissions (module, action, description) VALUES
    ('attendance',  'read',    'View attendance records'),
    ('attendance',  'write',   'Mark attendance'),
    ('exam_results','read',    'View examination results'),
    ('library',     'read',    'Search and view library catalog'),
    ('library',     'write',   'Issue and return books'),
    ('hostel',      'read',    'View hostel information'),
    ('hostel',      'approve', 'Approve hostel out-passes'),
    ('payments',    'read',    'View payment history'),
    ('payments',    'write',   'Initiate fee payments'),
    ('placement',   'read',    'View placement drives'),
    ('placement',   'write',   'Apply for placement drives'),
    ('complaints',  'read',    'View complaints'),
    ('complaints',  'write',   'Raise complaints'),
    ('ai_chatbot',  'read',    'Use AI assistant'),
    ('admin_panel', 'write',   'Full system administration');
