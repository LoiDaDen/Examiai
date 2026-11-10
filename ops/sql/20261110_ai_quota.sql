CREATE TABLE IF NOT EXISTS public.ai_daily_quota (
    quota_date DATE NOT NULL,
    scope TEXT NOT NULL
        CHECK (scope IN ('global', 'user')),
    subject_id UUID NOT NULL,
    used_units INTEGER NOT NULL DEFAULT 0
        CHECK (used_units >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (quota_date, scope, subject_id)
);
