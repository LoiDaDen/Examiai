WITH inserted_test AS (
  INSERT INTO listening_tests (title, difficulty)
  SELECT 'Library Membership Enquiry', 'easy'
  WHERE NOT EXISTS (
    SELECT 1 FROM listening_tests WHERE title = 'Library Membership Enquiry'
  )
  RETURNING id
),
test_row AS (
  SELECT id FROM inserted_test
  UNION ALL
  SELECT id FROM listening_tests WHERE title = 'Library Membership Enquiry'
  LIMIT 1
),
inserted_section AS (
  INSERT INTO listening_sections (test_id, section_number, title, transcript)
  SELECT
    test_row.id,
    1,
    'Joining a Community Library',
    'Woman: Good morning. I would like to join the community library.

Man: Of course. Have you been a member here before?

Woman: No, this is my first time. I moved to the area last week.

Man: Welcome. I need to take a few details. Could I have your full name?

Woman: It is Anna Collins. That is C O L L I N S.

Man: Thank you. And your address?

Woman: 42 Green Street, Flat 6.

Man: Is that near the station?

Woman: Yes, about five minutes away. My postcode is BR2 8QA.

Man: Great. What type of membership would you like? The standard membership is free, but the premium membership costs 18 pounds per year and lets you borrow DVDs and audio books.

Woman: I will start with the standard membership, please.

Man: No problem. You can borrow up to six books at a time for three weeks. If you return them late, the fine is 50 pence per book per day.

Woman: I see. Are there any computer facilities?

Man: Yes. Members can use the computers for one hour per day. You need to book at the information desk.

Woman: That sounds useful. When does the library close on Saturdays?

Man: At four thirty. During the week we close at seven.

Woman: Perfect. Thank you.'
  FROM test_row
  WHERE NOT EXISTS (
    SELECT 1
    FROM listening_sections
    WHERE title = 'Joining a Community Library'
  )
  RETURNING id
),
section_row AS (
  SELECT id FROM inserted_section
  UNION ALL
  SELECT id FROM listening_sections WHERE title = 'Joining a Community Library'
  LIMIT 1
)
INSERT INTO listening_questions (
  section_id,
  question_type,
  question_text,
  options,
  correct_answer,
  explanation,
  order_index
)
SELECT section_row.id, q.question_type::listening_question_type, q.question_text, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM section_row
CROSS JOIN (
  VALUES
    (1, 'form-completion', 'Full name: Anna ____', '["Collins","Collin","Colins","Columns"]', 'Collins', 'The speaker says her name is Anna Collins and spells C O L L I N S.'),
    (2, 'form-completion', 'Address: 42 ____ Street, Flat 6', '["Green","Queen","Grove","Grange"]', 'Green', 'The speaker gives the address as 42 Green Street, Flat 6.'),
    (3, 'multiple-choice', 'Which membership does the woman choose?', '["Standard membership","Premium membership","Student membership","Family membership"]', 'Standard membership', 'She says she will start with the standard membership.'),
    (4, 'note-completion', 'Members can borrow up to ____ books at a time.', '["six","three","four","seven"]', 'six', 'The librarian says members can borrow up to six books at a time.'),
    (5, 'sentence-completion', 'The late fine is ____ pence per book per day.', '["50","15","40","60"]', '50', 'The librarian says the fine is 50 pence per book per day.'),
    (6, 'multiple-choice', 'On Saturdays, the library closes at', '["4:30","5:00","7:00","8:30"]', '4:30', 'The librarian says the library closes at four thirty on Saturdays.')
) AS q(order_index, question_type, question_text, options, correct_answer, explanation)
WHERE NOT EXISTS (
  SELECT 1 FROM listening_questions lq
  WHERE lq.section_id = section_row.id AND lq.order_index = q.order_index
);

WITH inserted_test AS (
  INSERT INTO listening_tests (title, difficulty)
  SELECT 'Full IELTS Listening Demo Test 1', 'medium'
  WHERE NOT EXISTS (
    SELECT 1 FROM listening_tests WHERE title = 'Full IELTS Listening Demo Test 1'
  )
  RETURNING id
),
test_row AS (
  SELECT id FROM inserted_test
  UNION ALL
  SELECT id FROM listening_tests WHERE title = 'Full IELTS Listening Demo Test 1'
  LIMIT 1
),
section_data AS (
  SELECT *
  FROM (
    VALUES
      (
        1,
        'Section 1 - Booking a Language Course',
        'Receptionist: Good afternoon, City Language Centre. How can I help you?

Student: Hello. I would like to ask about evening English courses.

Receptionist: Certainly. We have general English classes on Mondays and Wednesdays, and IELTS preparation on Tuesdays and Thursdays.

Student: I need IELTS preparation. I work during the day, so evening classes would be best.

Receptionist: The evening IELTS course starts at six thirty and finishes at eight. It runs for ten weeks.

Student: That sounds suitable. How much does it cost?

Receptionist: The full course fee is 320 pounds, including materials. If you pay before Friday, there is a discount of 25 pounds.

Student: Great. Where are the classes held?

Receptionist: In Room 14 on the second floor. Please arrive ten minutes early for the first class so we can check your level.

Student: Do I need to bring anything?

Receptionist: Just a notebook and photo ID. We provide the course book.'
      ),
      (
        2,
        'Section 2 - Museum Visit Announcement',
        'Guide: Welcome to the Riverside Museum. Before you begin your visit, I would like to explain the layout of the building.

You are now in the main hall. The information desk is directly in front of you. To the left of the desk is the gift shop, where you can buy postcards and guidebooks.

The history gallery is on the ground floor, next to the cafe. It contains photographs of the town from the last two centuries.

If you go upstairs, you will find the transport exhibition. This is our most popular area, especially with children, because it includes an old tram and several bicycles.

The art gallery is closed this morning for cleaning, but it will reopen at two o clock. The lecture room is beside the art gallery, and today there will be a talk about local architecture at three thirty.

Please remember that food and drinks are only allowed in the cafe.'
      ),
      (
        3,
        'Section 3 - Student Project Discussion',
        'Tutor: So, how is your group project on urban gardens progressing?

Maya: We have collected the survey results from residents. Most people said they liked the idea of more gardens, but they were worried about maintenance.

Leo: Yes, and some residents felt that gardens should be placed near apartment blocks rather than beside main roads.

Tutor: That makes sense. Have you decided how to present the data?

Maya: We thought about using a table, but a chart would show the age differences more clearly.

Leo: I agree. Younger residents preferred shared vegetable gardens, while older residents were more interested in quiet green spaces.

Tutor: Good observation. What about your case study?

Maya: We chose the community garden on North Street because it has been successful for five years.

Leo: The only problem is that we still need permission to use photos from the organizer.

Tutor: Then make that your priority. Also, remember to explain why your recommendations are realistic, not just attractive.'
      ),
      (
        4,
        'Section 4 - Lecture on Sleep and Memory',
        'Lecturer: Today we will look at the relationship between sleep and memory. Researchers have known for many years that sleep is not simply a period of rest. During sleep, the brain remains active and processes information from the day.

One important function of sleep is memory consolidation. This means that new information becomes more stable and easier to retrieve later. For example, students who study a list of words and then sleep often remember more than students who stay awake for the same period.

Different stages of sleep may support different kinds of memory. Deep sleep appears to help with facts and vocabulary, while rapid eye movement sleep may be important for emotional memories and creative problem solving.

Lack of sleep can have the opposite effect. People who sleep too little often find it harder to concentrate, make decisions, and learn new material. Even a small reduction in sleep over several nights can reduce performance.

The practical message is clear. Studying is important, but sleep should be treated as part of learning, not as time wasted.'
      )
  ) AS sections(section_number, title, transcript)
),
inserted_sections AS (
  INSERT INTO listening_sections (test_id, section_number, title, transcript)
  SELECT test_row.id, section_data.section_number, section_data.title, section_data.transcript
  FROM test_row
  CROSS JOIN section_data
  WHERE NOT EXISTS (
    SELECT 1 FROM listening_sections WHERE title = section_data.title
  )
  RETURNING id, section_number
),
section_rows AS (
  SELECT id, section_number FROM inserted_sections
  UNION ALL
  SELECT id, section_number
  FROM listening_sections
  WHERE title IN (
    'Section 1 - Booking a Language Course',
    'Section 2 - Museum Visit Announcement',
    'Section 3 - Student Project Discussion',
    'Section 4 - Lecture on Sleep and Memory'
  )
),
question_data AS (
  SELECT *
  FROM (
    VALUES
      (1, 1, 'form-completion', 'Course chosen: ____ preparation', '["IELTS","General English","Business English","Academic writing"]', 'IELTS', 'The student says she needs IELTS preparation.'),
      (1, 2, 'form-completion', 'The evening course starts at ____.', '["6:30","6:00","8:00","10:00"]', '6:30', 'The receptionist says the course starts at six thirty.'),
      (1, 3, 'sentence-completion', 'The course runs for ____ weeks.', '["ten","two","six","twelve"]', 'ten', 'The receptionist says it runs for ten weeks.'),
      (1, 4, 'multiple-choice', 'What should the student bring to class?', '["A notebook and photo ID","A course book","A laptop and headphones","A payment receipt"]', 'A notebook and photo ID', 'The receptionist says to bring a notebook and photo ID, and the centre provides the course book.'),
      (2, 1, 'map-label', 'The gift shop is located', '["to the left of the information desk","next to the cafe","upstairs","beside the lecture room"]', 'to the left of the information desk', 'The guide says the gift shop is to the left of the desk.'),
      (2, 2, 'matching', 'History gallery: choose the correct description.', '["Photographs of the town","Old tram and bicycles","Talk about architecture","Closed for cleaning"]', 'Photographs of the town', 'The history gallery contains photographs of the town from the last two centuries.'),
      (2, 3, 'multiple-choice', 'Which area is especially popular with children?', '["The transport exhibition","The art gallery","The cafe","The lecture room"]', 'The transport exhibition', 'The guide says the transport exhibition is most popular with children.'),
      (2, 4, 'note-completion', 'The art gallery will reopen at ____ o clock.', '["two","three","three thirty","twelve"]', 'two', 'The guide says the art gallery will reopen at two o clock.'),
      (3, 1, 'multiple-choice', 'What were residents mainly worried about?', '["Maintenance","Noise","Cost","Traffic"]', 'Maintenance', 'Maya says residents liked more gardens but were worried about maintenance.'),
      (3, 2, 'matching', 'Younger residents preferred', '["shared vegetable gardens","quiet green spaces","gardens near main roads","more parking spaces"]', 'shared vegetable gardens', 'Leo says younger residents preferred shared vegetable gardens.'),
      (3, 3, 'sentence-completion', 'The case study garden is on ____ Street.', '["North","High","Green","Station"]', 'North', 'Maya says they chose the community garden on North Street.'),
      (3, 4, 'multiple-choice', 'What does the group still need permission to use?', '["Photos","Survey data","Maps","Charts"]', 'Photos', 'Leo says they still need permission to use photos from the organizer.'),
      (4, 1, 'note-completion', 'Sleep helps with memory ____.', '["consolidation","translation","measurement","competition"]', 'consolidation', 'The lecturer names memory consolidation as an important function of sleep.'),
      (4, 2, 'matching', 'Deep sleep appears to help with', '["facts and vocabulary","emotional memories","creative problem solving","decision making only"]', 'facts and vocabulary', 'The lecturer says deep sleep appears to help with facts and vocabulary.'),
      (4, 3, 'multiple-choice', 'What can lack of sleep make harder?', '["Concentrating and learning new material","Buying materials","Finding classrooms","Using a survey"]', 'Concentrating and learning new material', 'The lecturer says people who sleep too little find it harder to concentrate and learn new material.'),
      (4, 4, 'sentence-completion', 'Sleep should be treated as part of ____.', '["learning","exercise","travel","assessment"]', 'learning', 'The lecturer says sleep should be treated as part of learning, not as time wasted.')
  ) AS questions(section_number, order_index, question_type, question_text, options, correct_answer, explanation)
)
INSERT INTO listening_questions (
  section_id,
  question_type,
  question_text,
  options,
  correct_answer,
  explanation,
  order_index
)
SELECT
  section_rows.id,
  question_data.question_type::listening_question_type,
  question_data.question_text,
  question_data.options::jsonb,
  question_data.correct_answer,
  question_data.explanation,
  question_data.order_index
FROM section_rows
JOIN question_data ON question_data.section_number = section_rows.section_number
WHERE NOT EXISTS (
  SELECT 1
  FROM listening_questions lq
  WHERE lq.section_id = section_rows.id
    AND lq.order_index = question_data.order_index
);

WITH inserted_test AS (
  INSERT INTO listening_tests (title, difficulty)
  SELECT 'Campus Tour Instructions', 'medium'
  WHERE NOT EXISTS (
    SELECT 1 FROM listening_tests WHERE title = 'Campus Tour Instructions'
  )
  RETURNING id
),
test_row AS (
  SELECT id FROM inserted_test
  UNION ALL
  SELECT id FROM listening_tests WHERE title = 'Campus Tour Instructions'
  LIMIT 1
),
inserted_section AS (
  INSERT INTO listening_sections (test_id, section_number, title, transcript)
  SELECT
    test_row.id,
    2,
    'University Open Day Tour',
    'Guide: Welcome to the university open day. We will begin here at the main entrance. On your left is the student services building, where you can ask about accommodation, fees, and visas.

If you walk straight ahead, you will see the central library. It is the tallest building on campus and has a cafe on the ground floor. Behind the library is the science centre, but we will not visit that today.

Our first stop is the lecture theatre. It is opposite the library and next to the careers office. After that, we will go to the sports centre. To reach it, turn right at the fountain and follow the path past the medical clinic.

Please do not enter the engineering workshop. It is closed today because repairs are taking place. The art studio, however, is open until three o clock, and visitors can see a student exhibition there.

At the end of the tour, we will meet outside the cafeteria. The cafeteria is between the bookshop and the language centre. If you have questions after the tour, staff will be waiting there.'
  FROM test_row
  WHERE NOT EXISTS (
    SELECT 1
    FROM listening_sections
    WHERE title = 'University Open Day Tour'
  )
  RETURNING id
),
section_row AS (
  SELECT id FROM inserted_section
  UNION ALL
  SELECT id FROM listening_sections WHERE title = 'University Open Day Tour'
  LIMIT 1
)
INSERT INTO listening_questions (
  section_id,
  question_type,
  question_text,
  options,
  correct_answer,
  explanation,
  order_index
)
SELECT section_row.id, q.question_type::listening_question_type, q.question_text, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM section_row
CROSS JOIN (
  VALUES
    (1, 'matching', 'Student services building: choose the correct description.', '["Accommodation, fees, and visas","Cafe on the ground floor","Student exhibition","Closed for repairs"]', 'Accommodation, fees, and visas', 'The guide says student services handles accommodation, fees, and visas.'),
    (2, 'map-label', 'The lecture theatre is', '["opposite the library","behind the science centre","between the bookshop and language centre","past the medical clinic"]', 'opposite the library', 'The guide says the lecture theatre is opposite the library.'),
    (3, 'map-label', 'To reach the sports centre, visitors should turn right at the', '["fountain","library","bookshop","main entrance"]', 'fountain', 'The guide says to turn right at the fountain and follow the path.'),
    (4, 'multiple-choice', 'Why is the engineering workshop closed?', '["Repairs are taking place","A lecture is happening","It is after three o clock","Staff are waiting there"]', 'Repairs are taking place', 'The guide says the workshop is closed because repairs are taking place.'),
    (5, 'note-completion', 'The art studio is open until ____ o clock.', '["three","two","four","seven"]', 'three', 'The guide says the art studio is open until three o clock.'),
    (6, 'map-label', 'The cafeteria is between the bookshop and the', '["language centre","medical clinic","careers office","science centre"]', 'language centre', 'The guide says the cafeteria is between the bookshop and the language centre.')
) AS q(order_index, question_type, question_text, options, correct_answer, explanation)
WHERE NOT EXISTS (
  SELECT 1 FROM listening_questions lq
  WHERE lq.section_id = section_row.id AND lq.order_index = q.order_index
);
