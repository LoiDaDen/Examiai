DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'listening'
      AND enumtypid = 'conversation_type'::regtype
  ) THEN
    ALTER TYPE conversation_type ADD VALUE 'listening';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listening_question_type') THEN
    CREATE TYPE listening_question_type AS ENUM (
      'multiple-choice',
      'form-completion',
      'note-completion',
      'sentence-completion',
      'matching',
      'map-label'
    );
  END IF;
END $$;

DO $$
DECLARE
  value text;
BEGIN
  FOREACH value IN ARRAY ARRAY[
    'multiple-choice',
    'form-completion',
    'note-completion',
    'sentence-completion',
    'matching',
    'map-label'
  ] LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_enum
      WHERE enumlabel = value
        AND enumtypid = 'listening_question_type'::regtype
    ) THEN
      EXECUTE format('ALTER TYPE listening_question_type ADD VALUE %L', value);
    END IF;
  END LOOP;
END $$;

CREATE TABLE IF NOT EXISTS listening_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar(256) NOT NULL,
  difficulty varchar(32) NOT NULL DEFAULT 'medium',
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS listening_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid NOT NULL REFERENCES listening_tests(id) ON DELETE CASCADE,
  section_number integer NOT NULL,
  title varchar(256) NOT NULL,
  audio_url text,
  transcript text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

ALTER TABLE listening_sections
  ALTER COLUMN transcript DROP NOT NULL;

CREATE TABLE IF NOT EXISTS listening_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES listening_sections(id) ON DELETE CASCADE,
  question_type listening_question_type NOT NULL,
  question_text text NOT NULL,
  options jsonb,
  correct_answer text NOT NULL,
  explanation text NOT NULL,
  order_index integer NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS listening_sections_test_id_idx
  ON listening_sections(test_id);

CREATE INDEX IF NOT EXISTS listening_questions_section_id_idx
  ON listening_questions(section_id);
