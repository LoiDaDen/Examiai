DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'reading'
      AND enumtypid = 'conversation_type'::regtype
  ) THEN
    ALTER TYPE conversation_type ADD VALUE 'reading';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reading_question_type') THEN
    CREATE TYPE reading_question_type AS ENUM (
      'multiple-choice',
      'true-false-not-given',
      'yes-no-not-given',
      'matching-headings',
      'matching-information',
      'matching-features',
      'matching-sentence-endings',
      'sentence-completion',
      'summary-completion',
      'table-completion',
      'flow-chart-completion',
      'diagram-label',
      'choose-a-title',
      'short-answer',
      'classification'
    );
  END IF;
END $$;

DO $$
DECLARE
  value text;
BEGIN
  FOREACH value IN ARRAY ARRAY[
    'multiple-choice',
    'true-false-not-given',
    'yes-no-not-given',
    'matching-headings',
    'matching-information',
    'matching-features',
    'matching-sentence-endings',
    'sentence-completion',
    'summary-completion',
    'table-completion',
    'flow-chart-completion',
    'diagram-label',
    'choose-a-title',
    'short-answer',
    'classification'
  ] LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_enum
      WHERE enumlabel = value
        AND enumtypid = 'reading_question_type'::regtype
    ) THEN
      EXECUTE format('ALTER TYPE reading_question_type ADD VALUE %L', value);
    END IF;
  END LOOP;
END $$;

CREATE TABLE IF NOT EXISTS reading_passages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar(256) NOT NULL,
  passage_text text NOT NULL,
  source_url text,
  difficulty varchar(32) NOT NULL DEFAULT 'medium',
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reading_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  passage_id uuid NOT NULL REFERENCES reading_passages(id) ON DELETE CASCADE,
  question_type reading_question_type NOT NULL,
  question_text text NOT NULL,
  options jsonb,
  correct_answer text NOT NULL,
  explanation text NOT NULL,
  order_index integer NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reading_questions_passage_id_idx
  ON reading_questions(passage_id);
