WITH inserted_passage AS (
  INSERT INTO reading_passages (title, passage_text, difficulty)
  SELECT
    'Urban Green Spaces',
    'In many large cities, parks and public gardens are no longer treated as decorative extras. They are increasingly seen as essential infrastructure, much like roads, drainage systems, or public transport. A growing body of research suggests that access to green spaces can improve physical health, reduce stress, and strengthen community ties.

One reason urban parks matter is that they provide places for everyday exercise. People who live near safe and attractive green spaces are more likely to walk, run, or cycle regularly. This does not mean that a park alone can solve public health problems, but it can make healthy routines easier to maintain.

Green spaces can also reduce the urban heat island effect. Concrete and asphalt absorb heat during the day and release it slowly at night, causing city centres to remain warmer than surrounding rural areas. Trees provide shade and cool the air through evapotranspiration. As heatwaves become more common, this cooling effect is becoming increasingly valuable.

However, creating successful green spaces is not simply a matter of planting trees. Poorly designed parks may be underused or may feel unsafe. Maintenance is also important: broken lighting, litter, and damaged paths can quickly discourage visitors. In addition, some neighbourhoods have much better access to green spaces than others, raising questions of fairness and urban planning.

For these reasons, many planners now argue that parks should be planned as part of a wider city system. A small local garden, a tree-lined street, and a large regional park can each serve different needs. When these spaces are connected, they can support biodiversity, improve movement through the city, and give residents more chances to spend time outdoors.',
    'medium'
  WHERE NOT EXISTS (
    SELECT 1 FROM reading_passages WHERE title = 'Urban Green Spaces'
  )
  RETURNING id
),
passage AS (
  SELECT id FROM inserted_passage
  UNION ALL
  SELECT id FROM reading_passages WHERE title = 'Urban Green Spaces'
  LIMIT 1
)
INSERT INTO reading_questions (
  passage_id,
  question_type,
  question_text,
  options,
  correct_answer,
  explanation,
  order_index
)
SELECT passage.id, q.question_type::reading_question_type, q.question_text, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM passage
CROSS JOIN (
  VALUES
    (1, 'multiple-choice', 'According to the passage, urban parks are increasingly viewed as', '["a luxury mainly used by wealthy residents.","a necessary part of city infrastructure.","a replacement for public transport systems.","a decorative feature with limited practical value."]', 'a necessary part of city infrastructure.', 'The first paragraph says parks are now seen as essential infrastructure, similar to roads or transport.'),
    (2, 'true-false-not-given', 'People living near attractive green spaces are more likely to exercise regularly.', '["True","False","Not Given"]', 'True', 'Paragraph 2 states that people near safe and attractive green spaces are more likely to walk, run, or cycle.'),
    (3, 'true-false-not-given', 'The passage says parks completely solve public health problems.', '["True","False","Not Given"]', 'False', 'The passage says a park alone cannot solve public health problems, so the statement contradicts the text.'),
    (4, 'multiple-choice', 'What problem can trees help reduce in cities?', '["The cost of public transport","The urban heat island effect","The need for street lighting","The number of damaged paths"]', 'The urban heat island effect', 'Paragraph 3 explains that trees provide shade and cool the air, reducing the urban heat island effect.'),
    (5, 'multiple-choice', 'What does the writer suggest about successful green spaces?', '["They only need more trees.","They should be isolated from other city systems.","They require design, maintenance, and fair access.","They are useful only during heatwaves."]', 'They require design, maintenance, and fair access.', 'Paragraph 4 discusses design, safety, maintenance, and unequal access as important issues.'),
    (6, 'matching-headings', 'Choose the best heading for paragraph 3.', '["The social value of parks","How trees cool urban areas","Why parks replace public transport","The cost of maintaining public gardens"]', 'How trees cool urban areas', 'Paragraph 3 focuses on the urban heat island effect and how trees cool the air.'),
    (7, 'sentence-completion', 'Complete the sentence: Concrete and asphalt absorb heat during the day and release it slowly at _____.', '["night","weekends","rural areas","public gardens"]', 'night', 'Paragraph 3 says concrete and asphalt release heat slowly at night.')
) AS q(order_index, question_type, question_text, options, correct_answer, explanation)
WHERE NOT EXISTS (
  SELECT 1 FROM reading_questions rq
  WHERE rq.passage_id = passage.id AND rq.order_index = q.order_index
);

WITH inserted_passage AS (
  INSERT INTO reading_passages (title, passage_text, difficulty)
  SELECT
    'The Rise of Remote Work',
    'Remote work existed long before it became a common topic of public discussion. For decades, some writers, consultants, and technology workers carried out their jobs away from traditional offices. What changed in recent years was not the invention of remote work, but its rapid movement into mainstream employment.

Supporters argue that remote work gives employees greater control over their time. Without a daily commute, workers may have more hours for family, rest, or exercise. Some also report that they can concentrate better at home, especially when office environments are noisy or frequently interrupted.

Employers may also benefit. Companies can recruit from a wider geographic area and may reduce spending on office space. However, these advantages depend on good management. Remote teams need clear communication, reliable digital tools, and trust. Without these, projects can slow down and employees may feel isolated.

Critics point out that remote work is not suitable for every role. Many jobs in healthcare, hospitality, manufacturing, and transport must be done in person. There is also a risk that remote workers miss informal learning opportunities that happen naturally in offices, such as observing experienced colleagues or having quick conversations after meetings.

The future is therefore likely to be mixed rather than fully remote. Many organizations are experimenting with hybrid arrangements, where employees divide their time between home and office. The success of these models will depend less on location itself and more on whether work is organized clearly and fairly.',
    'medium'
  WHERE NOT EXISTS (
    SELECT 1 FROM reading_passages WHERE title = 'The Rise of Remote Work'
  )
  RETURNING id
),
passage AS (
  SELECT id FROM inserted_passage
  UNION ALL
  SELECT id FROM reading_passages WHERE title = 'The Rise of Remote Work'
  LIMIT 1
)
INSERT INTO reading_questions (
  passage_id,
  question_type,
  question_text,
  options,
  correct_answer,
  explanation,
  order_index
)
SELECT passage.id, q.question_type::reading_question_type, q.question_text, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM passage
CROSS JOIN (
  VALUES
    (1, 'multiple-choice', 'What does the passage say changed in recent years?', '["Remote work was invented.","Remote work entered mainstream employment.","Most office jobs disappeared.","Technology workers stopped working remotely."]', 'Remote work entered mainstream employment.', 'Paragraph 1 says the change was remote work moving rapidly into mainstream employment.'),
    (2, 'true-false-not-given', 'All remote workers concentrate better at home.', '["True","False","Not Given"]', 'False', 'The passage says some workers report better concentration, not all workers.'),
    (3, 'multiple-choice', 'Which condition is mentioned as necessary for successful remote teams?', '["Longer meetings","Clear communication","Higher salaries","Permanent office closures"]', 'Clear communication', 'Paragraph 3 states remote teams need clear communication, reliable tools, and trust.'),
    (4, 'true-false-not-given', 'Healthcare and hospitality jobs can always be done remotely.', '["True","False","Not Given"]', 'False', 'Paragraph 4 says many jobs in healthcare and hospitality must be done in person.'),
    (5, 'multiple-choice', 'What future pattern does the writer consider likely?', '["A fully remote future for every worker","A complete return to traditional offices","Mixed or hybrid working arrangements","The end of digital communication tools"]', 'Mixed or hybrid working arrangements', 'The final paragraph says the future is likely to be mixed and mentions hybrid arrangements.'),
    (6, 'matching-information', 'Which paragraph mentions informal learning opportunities?', '["Paragraph 1","Paragraph 2","Paragraph 3","Paragraph 4"]', 'Paragraph 4', 'Paragraph 4 mentions informal learning opportunities that happen naturally in offices.'),
    (7, 'choose-a-title', 'Choose the best title for the passage.', '["The End of Office Work","Remote Work and the Move Toward Hybrid Models","Why Digital Tools Fail","The History of Healthcare Jobs"]', 'Remote Work and the Move Toward Hybrid Models', 'The passage explains the growth, benefits, limits, and likely hybrid future of remote work.')
) AS q(order_index, question_type, question_text, options, correct_answer, explanation)
WHERE NOT EXISTS (
  SELECT 1 FROM reading_questions rq
  WHERE rq.passage_id = passage.id AND rq.order_index = q.order_index
);

WITH inserted_passage AS (
  INSERT INTO reading_passages (title, passage_text, difficulty)
  SELECT
    'How Memory Changes Over Time',
    'Memory is often imagined as a kind of recording system, but psychologists have shown that this comparison is misleading. Human memory is active and reconstructive. When people remember an event, they do not simply replay a perfect copy of the past. Instead, they rebuild the memory using stored details, later knowledge, emotions, and expectations.

This reconstructive nature helps explain why two people can remember the same event differently. Each person may focus on different details, interpret actions in different ways, or connect the event to different prior experiences. These differences do not always mean that one person is lying. They may reflect the normal operation of memory.

Memory can also be influenced by information received after an event. In classic experiments, participants who watched the same incident often gave different reports depending on the wording of later questions. A question that suggested a higher speed, for example, could lead participants to remember a more dramatic collision than they had actually seen.

Although this may seem like a weakness, reconstructive memory is also useful. It allows people to connect experiences, make sense of incomplete information, and apply lessons from the past to new situations. A perfectly fixed memory system might be less flexible in everyday life.

For students, the research has practical implications. Reviewing material repeatedly over time is more effective than reading it once. Testing oneself also strengthens memory because it requires active retrieval. In contrast, simply highlighting large sections of text may create a feeling of familiarity without ensuring that the information can be recalled later.',
    'medium'
  WHERE NOT EXISTS (
    SELECT 1 FROM reading_passages WHERE title = 'How Memory Changes Over Time'
  )
  RETURNING id
),
passage AS (
  SELECT id FROM inserted_passage
  UNION ALL
  SELECT id FROM reading_passages WHERE title = 'How Memory Changes Over Time'
  LIMIT 1
)
INSERT INTO reading_questions (
  passage_id,
  question_type,
  question_text,
  options,
  correct_answer,
  explanation,
  order_index
)
SELECT passage.id, q.question_type::reading_question_type, q.question_text, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM passage
CROSS JOIN (
  VALUES
    (1, 'multiple-choice', 'The writer says human memory is best described as', '["a perfect recording of events.","an active reconstruction of past events.","a fixed storage system that never changes.","a simple list of facts."]', 'an active reconstruction of past events.', 'Paragraph 1 directly describes memory as active and reconstructive.'),
    (2, 'true-false-not-given', 'Different memories of the same event always mean someone is lying.', '["True","False","Not Given"]', 'False', 'Paragraph 2 says differences do not always mean that one person is lying.'),
    (3, 'multiple-choice', 'What did classic experiments show?', '["Question wording can influence later reports.","People never change their memories.","Participants remember speed perfectly.","Emotions have no effect on memory."]', 'Question wording can influence later reports.', 'Paragraph 3 explains that later question wording affected participants reports.'),
    (4, 'true-false-not-given', 'The passage says highlighting large sections always improves recall.', '["True","False","Not Given"]', 'False', 'The final paragraph says highlighting may create familiarity without ensuring later recall.'),
    (5, 'multiple-choice', 'Which study method is recommended in the passage?', '["Reading once before the exam","Highlighting entire pages","Testing oneself through active retrieval","Avoiding review after first learning"]', 'Testing oneself through active retrieval', 'The final paragraph says testing oneself strengthens memory because it requires active retrieval.'),
    (6, 'yes-no-not-given', 'The writer believes memory works exactly like a recording system.', '["Yes","No","Not Given"]', 'No', 'The first paragraph says the recording-system comparison is misleading.'),
    (7, 'summary-completion', 'Complete the summary: Memory is reconstructive because people rebuild events using stored details, later knowledge, emotions, and _____.', '["expectations","recordings","statistics","headings"]', 'expectations', 'Paragraph 1 lists expectations as one of the elements used when rebuilding memories.')
) AS q(order_index, question_type, question_text, options, correct_answer, explanation)
WHERE NOT EXISTS (
  SELECT 1 FROM reading_questions rq
  WHERE rq.passage_id = passage.id AND rq.order_index = q.order_index
);
