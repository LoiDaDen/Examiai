INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Test Format',
  'IELTS has four skills: Listening, Reading, Writing, and Speaking. Listening takes about 30 minutes plus transfer/checking time depending on test format. Reading takes 60 minutes. Writing takes 60 minutes and has two tasks. Speaking takes about 11 to 14 minutes with an examiner and has three parts. IELTS Academic is commonly used for university or professional registration. IELTS General Training is commonly used for migration, work, or non-academic training.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Test Format'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Band Scores',
  'IELTS reports scores from Band 0 to Band 9. Test takers receive a band score for each skill and an overall band score. The overall score is the average of Listening, Reading, Writing, and Speaking, rounded to the nearest whole or half band according to IELTS scoring rules. Writing and Speaking are assessed by trained examiners using public band descriptors.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Band Scores'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Task 1',
  'In IELTS Academic Writing Task 1, candidates describe visual information such as a graph, chart, table, process, or map. Candidates should write at least 150 words and spend about 20 minutes. A strong answer includes a clear overview, selects key features, compares important data, and avoids personal opinions. Assessment criteria include Task Achievement, Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Task 1'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Task 2',
  'In IELTS Writing Task 2, candidates write an essay of at least 250 words and should spend about 40 minutes. Common question types include opinion, discussion, advantages and disadvantages, problem and solution, and two-part questions. A strong essay directly answers all parts of the question, presents a clear position when required, develops ideas with explanation and examples, and uses clear paragraphing.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Task 2'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Speaking Test',
  'The IELTS Speaking test is a face-to-face interview with an examiner and usually lasts 11 to 14 minutes. Part 1 asks familiar questions about the candidate and everyday topics. Part 2 gives a cue card and one minute to prepare before speaking for up to two minutes. Part 3 asks more abstract follow-up questions related to the Part 2 topic. Speaking is assessed by Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy, and Pronunciation.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Speaking Test'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Common Mistakes',
  'Common Writing mistakes include not answering every part of the question, writing a weak or missing overview in Task 1, giving opinions in Task 1, using memorized phrases unnaturally, overusing linking words, developing ideas too generally, copying too much language from the prompt, and making frequent grammar errors that reduce clarity. High-scoring answers are clear, relevant, well organized, and natural.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Common Mistakes'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Listening Test',
  'The IELTS Listening test has four parts and 40 questions. Candidates hear recordings once only and answer questions while listening. The recordings include everyday social situations, practical information, academic or training contexts, and a longer academic-style talk. Common question types include multiple choice, matching, form completion, note completion, table completion, sentence completion, and map or diagram labelling.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Listening Test'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Reading Test',
  'The IELTS Reading test has 40 questions and lasts 60 minutes. IELTS Academic Reading uses three longer texts from books, journals, magazines, or newspapers. IELTS General Training Reading uses texts from everyday, workplace, and general interest contexts. Common question types include matching headings, true false not given, yes no not given, multiple choice, sentence completion, summary completion, and matching information.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Reading Test'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Academic vs General Training',
  'IELTS Academic and IELTS General Training share the same Listening and Speaking tests. The Reading and Writing tests are different. Academic Writing Task 1 asks candidates to describe visual information such as charts, maps, processes, or tables. General Training Writing Task 1 asks candidates to write a letter. Academic Reading uses academic-style texts, while General Training Reading uses more everyday and workplace texts.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Academic vs General Training'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Assessment Criteria',
  'IELTS Writing is assessed using four criteria. Task Achievement or Task Response checks how well the answer addresses the task. Coherence and Cohesion checks organization, paragraphing, and logical flow. Lexical Resource checks vocabulary range, accuracy, and natural word choice. Grammatical Range and Accuracy checks sentence variety, grammar control, punctuation, and how errors affect communication.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Assessment Criteria'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Task Response',
  'Task Response is a Writing Task 2 criterion. A strong response answers all parts of the question, gives a clear position when the task asks for one, and develops relevant main ideas. Weak responses often discuss the topic generally without answering the exact question, ignore part of a multi-part prompt, present an unclear opinion, or use examples without explaining how they support the argument.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Task Response'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Task Achievement',
  'Task Achievement is a Writing Task 1 criterion. A strong answer covers the task requirements, selects the most important information, presents a clear overview, and supports key features with accurate data or descriptions. Weak answers often miss the overview, describe every detail mechanically, include inaccurate data, or add opinions that are not required.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Task Achievement'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Coherence and Cohesion',
  'Coherence and Cohesion measures how clearly writing is organized and connected. Good writing uses logical paragraphs, clear topic progression, and linking devices naturally. Candidates should avoid overusing connectors such as moreover and furthermore in every sentence. Paragraphs should each have a clear purpose, and pronouns or referencing words should be easy to follow.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Coherence and Cohesion'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Lexical Resource',
  'Lexical Resource measures vocabulary range and accuracy. Strong writing uses topic-appropriate words, natural collocations, and flexible paraphrasing. Candidates do not need rare words to score well. Forced advanced vocabulary, wrong word forms, awkward collocations, and repeated misuse of words can reduce clarity. Natural and precise language is better than memorized phrases.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Lexical Resource'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Grammar',
  'Grammatical Range and Accuracy measures sentence variety and control. Strong writing uses a mix of simple and complex sentences accurately. Candidates should prioritize clear grammar over unnecessarily complicated structures. Common problems include subject verb agreement errors, article errors, tense inconsistency, comma splices, fragments, and unclear clauses.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Grammar'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Speaking Assessment Criteria',
  'IELTS Speaking is assessed using four criteria: Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy, and Pronunciation. Examiners consider how smoothly the candidate speaks, how clearly ideas are connected, how flexible and accurate vocabulary is, how well grammar is controlled, and how easy the speech is to understand.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Speaking Assessment Criteria'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Speaking Fluency and Coherence',
  'Fluency and Coherence in Speaking measures the ability to keep speaking naturally and organize ideas clearly. Good answers are not memorized speeches. It is acceptable to pause briefly to think, but long silence, frequent self-correction, or disconnected ideas can reduce performance. Candidates should answer directly, extend with reasons or examples, and keep ideas logically connected.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Speaking Fluency and Coherence'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Speaking Lexical Resource',
  'Lexical Resource in Speaking measures vocabulary range, precision, and flexibility. Strong candidates can paraphrase when they forget a word, use topic-specific vocabulary naturally, and avoid repeating the same simple words too often. Accuracy matters more than using rare words. Idioms should only be used if they sound natural and fit the context.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Speaking Lexical Resource'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Speaking Pronunciation',
  'Pronunciation in IELTS Speaking is about being easy to understand, not having a native accent. Examiners consider individual sounds, word stress, sentence stress, rhythm, and intonation. Candidates can have an accent and still score well if their speech is clear. Problems arise when pronunciation frequently makes words hard to recognize or meaning hard to follow.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Speaking Pronunciation'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Speaking Part 1 Strategy',
  'In Speaking Part 1, candidates answer short questions about familiar topics such as work, study, hometown, hobbies, daily life, food, travel, or technology. Answers should usually be one to three sentences. A useful pattern is answer directly, add a reason, and give a small example. Candidates should avoid memorized long answers that sound unnatural.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Speaking Part 1 Strategy'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Speaking Part 2 Strategy',
  'In Speaking Part 2, candidates receive a cue card and one minute to prepare. They should speak for up to two minutes. Good preparation notes include keywords, not full sentences. A strong answer covers the bullet points, adds personal details, gives a clear story or structure, and keeps speaking until the examiner stops the candidate.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Speaking Part 2 Strategy'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Speaking Part 3 Strategy',
  'Speaking Part 3 contains more abstract and discussion-style questions connected to the Part 2 topic. Candidates should explain opinions, compare ideas, discuss causes, effects, advantages, disadvantages, or future trends. Strong answers are developed but still natural. A useful structure is opinion, reason, example, and a short wider comment.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Speaking Part 3 Strategy'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Task 2 Essay Structure',
  'A clear Task 2 essay often has four paragraphs: introduction, body paragraph 1, body paragraph 2, and conclusion. The introduction should paraphrase the task and present a clear position when needed. Each body paragraph should focus on one main idea and develop it with explanation and example. The conclusion should summarize the answer without adding a new main idea.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Task 2 Essay Structure'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Task 2 Opinion Essays',
  'For opinion essays, candidates should clearly state their position and support it throughout the essay. The position can be fully agree, fully disagree, or partly agree depending on the prompt. A strong essay avoids sitting on the fence unless the question allows a balanced view. Each body paragraph should support the chosen position with clear reasoning.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Task 2 Opinion Essays'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Task 2 Discussion Essays',
  'Discussion essays ask candidates to discuss two views and often give their own opinion. A strong answer explains both views fairly and then makes the candidate position clear. One common structure is introduction with opinion, one body paragraph for the first view, one body paragraph for the second view plus candidate opinion, and a conclusion.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Task 2 Discussion Essays'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Task 2 Problem Solution Essays',
  'Problem solution essays ask about causes, problems, measures, or solutions. Candidates should identify specific problems and propose realistic solutions that match those problems. Strong answers explain why the problem happens or why the solution would work. Weak answers list many problems or solutions without enough development.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Task 2 Problem Solution Essays'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Task 2 Advantages and Disadvantages',
  'Advantages and disadvantages essays ask candidates to examine positive and negative sides of an issue. If the prompt asks whether advantages outweigh disadvantages, the answer must make a clear judgement. Strong essays compare the importance of each side instead of simply listing points. Examples should support the argument and remain realistic.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Task 2 Advantages and Disadvantages'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Task 1 Overview',
  'The overview is one of the most important parts of Academic Writing Task 1. It summarizes the main trends, stages, differences, or key features without listing every number. For charts, mention the biggest changes, highest or lowest categories, or overall patterns. For maps, mention the main changes. For processes, mention the number of stages and general flow.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Task 1 Overview'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Task 1 Charts',
  'For charts in Academic Writing Task 1, candidates should identify key features, compare important data, and group information logically. They should not describe every number. Useful language includes increased, decreased, remained stable, fluctuated, peaked, reached a low, accounted for, compared with, and the highest or lowest figure. Accuracy is more important than complex vocabulary.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Task 1 Charts'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Task 1 Maps',
  'For map questions, candidates describe changes between places or times. A strong answer mentions the most important changes in the overview, then groups details logically by area or type of change. Useful language includes was replaced by, was converted into, was expanded, was demolished, was constructed, to the north of, adjacent to, and in the centre of.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Task 1 Maps'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Task 1 Process Diagrams',
  'For process diagrams, candidates describe stages in order. A strong answer includes an overview that states the number of stages and whether the process is linear, cyclical, natural, or man-made. Use passive voice when the process is man-made, such as is heated, is mixed, is transported. Avoid personal opinions and unnecessary explanations beyond the diagram.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Task 1 Process Diagrams'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Reading Strategy',
  'Good Reading strategy includes previewing the passage, identifying question types, scanning for names, numbers, dates, or keywords, and reading around the answer carefully. Candidates should not spend too long on one question. For true false not given and yes no not given, the answer must be based only on the passage, not background knowledge.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Reading Strategy'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Listening Strategy',
  'Good Listening strategy includes reading the questions before the audio starts, predicting the type of answer, watching for paraphrase, and checking spelling and grammar. Candidates hear the recording only once, so they should keep moving if they miss an answer. Distractors are common, where a speaker mentions one answer then corrects it or gives a different final answer.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Listening Strategy'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Time Management',
  'Time management is important in IELTS. In Writing, candidates should spend about 20 minutes on Task 1 and 40 minutes on Task 2 because Task 2 carries more weight. In Reading, candidates have 60 minutes for all answers and should not spend too long on one passage or question. In Speaking, candidates should answer naturally and not worry about timing except in Part 2.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Time Management'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Paraphrasing',
  'Paraphrasing means expressing the same idea in different words. Good paraphrasing can use synonyms, changed word forms, changed sentence structure, or a different grammatical pattern. Poor paraphrasing changes the meaning or uses unnatural synonyms. In IELTS Writing, candidates should paraphrase the task carefully but do not need to replace every word.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Paraphrasing'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Formality and Tone',
  'IELTS Writing usually requires a clear academic or semi-formal style, especially in Academic Task 1 and Task 2. Formality does not mean using complicated words. Good tone is precise, neutral, and natural. Avoid slang, contractions in formal essays, emotional language, and unsupported claims. In Speaking, a natural conversational tone is appropriate.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Formality and Tone'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Examples in Writing',
  'Examples in IELTS Writing should support the main idea and be realistic. Candidates can use general examples from society, education, work, technology, or personal observation. They should avoid invented statistics because unrealistic numbers can weaken credibility. The explanation of the example is more important than making it sound impressive.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Examples in Writing'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Band 7 Writing Characteristics',
  'A typical Band 7 Writing answer addresses the task clearly, presents a clear position where required, organizes ideas logically, uses a range of vocabulary with some flexibility, and uses a variety of sentence forms. Errors may still occur, but they do not usually prevent communication. Ideas are generally developed, although some parts may be less precise or less fully extended.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Band 7 Writing Characteristics'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Band 6 Writing Characteristics',
  'A typical Band 6 Writing answer addresses the task but may be uneven, with some ideas underdeveloped or some parts of the prompt handled better than others. Organization is generally clear but may be mechanical. Vocabulary is adequate but may include repetition or inaccurate word choice. Grammar includes a mix of simple and complex structures, with errors that sometimes affect clarity.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Band 6 Writing Characteristics'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Band 8 Writing Characteristics',
  'A typical Band 8 Writing answer responds fully to the task, develops ideas well, uses logical organization, and shows flexible vocabulary and grammar. Minor errors may appear, but they are rare and do not reduce clarity. The writing sounds natural, controlled, and precise. It does not rely on memorized phrases or unnecessarily complex language.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Band 8 Writing Characteristics'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Band 5 Writing Characteristics',
  'A typical Band 5 Writing answer may address the task only partially, with limited development or unclear organization. Ideas may be present but not fully explained. Vocabulary is usually limited and may be repetitive or inaccurate. Grammar errors are frequent and can make meaning unclear. To improve, candidates should focus on answering the exact question, paragraphing clearly, and writing accurate sentences.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Band 5 Writing Characteristics'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Band 9 Writing Characteristics',
  'A typical Band 9 Writing answer fully satisfies the task, presents a clear and well-developed response, and uses organization, vocabulary, and grammar with very high control. The answer sounds natural, precise, and fluent. Errors are very rare. Band 9 writing does not require obscure vocabulary; it requires complete task fulfilment, excellent clarity, and flexible language used accurately.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Band 9 Writing Characteristics'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Band 6 to 7 Writing Improvement',
  'To move from Band 6 to Band 7 in Writing, candidates usually need clearer task response, better developed ideas, more logical paragraphing, and fewer grammar or vocabulary errors. Focus on answering every part of the question, explaining ideas instead of listing them, using natural topic vocabulary, and improving sentence accuracy. Avoid memorized templates and overused linking phrases.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Band 6 to 7 Writing Improvement'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Band 7 to 8 Writing Improvement',
  'To move from Band 7 to Band 8 in Writing, candidates need more precision, stronger idea development, and better control of language. The essay should answer the task fully, maintain a clear position, use paragraphing naturally, and avoid small but repeated vocabulary or grammar problems. Improvement often comes from refining explanations, using more exact word choice, and reducing awkward phrasing.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Band 7 to 8 Writing Improvement'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Introduction',
  'A good IELTS Writing Task 2 introduction usually paraphrases the question and gives a clear thesis or position when required. It should be concise and directly connected to the task. Candidates should avoid memorized opening phrases, broad background statements, and claims that are too general. The introduction should prepare the reader for the argument that follows.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Introduction'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Conclusion',
  'A good IELTS Writing Task 2 conclusion summarizes the main answer and restates the position clearly. It should not introduce a new main idea. A conclusion can be short, but it should feel complete. Candidates should avoid adding new examples, new arguments, or memorized dramatic phrases. The conclusion should match the essay body.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Conclusion'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Body Paragraphs',
  'Strong body paragraphs in IELTS Writing usually contain one main idea, explanation, and support. The paragraph should not simply state a point and move on. A useful pattern is topic sentence, explanation, example or evidence, and link back to the question. Paragraphs should be balanced, but they do not need to be exactly the same length.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Body Paragraphs'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Topic Sentences',
  'A topic sentence introduces the main idea of a body paragraph. In IELTS Writing, clear topic sentences help the examiner follow the argument. A good topic sentence is specific enough to show the direction of the paragraph but not so detailed that there is nothing left to explain. It should directly relate to the question.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Topic Sentences'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Overusing Linking Words',
  'Linking words help connect ideas, but overusing them can make writing mechanical. Candidates should not start every sentence with moreover, furthermore, therefore, or however. Strong cohesion also comes from logical sequencing, pronouns, repeated key concepts, synonyms, and clear paragraphing. Natural connection is better than a long list of connectors.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Overusing Linking Words'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Memorized Templates',
  'Memorized templates can make IELTS Writing sound unnatural and may not fit the question. Phrases such as this essay will discuss both sides before reaching a conclusion are often unnecessary. Candidates should learn flexible structures, not fixed sentences. A strong answer responds naturally to the exact wording of the task.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Memorized Templates'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Word Count',
  'IELTS Writing Task 1 asks for at least 150 words and Task 2 asks for at least 250 words. Writing far below the required length can make it difficult to fully address the task. Writing much more than necessary can increase errors and waste time. A practical target is around 170 to 190 words for Task 1 and 270 to 310 words for Task 2.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Word Count'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Planning',
  'Planning before writing helps candidates answer the question accurately and organize ideas. For Task 2, spend a few minutes identifying the question type, deciding the position, choosing two main ideas, and thinking of support. Planning reduces repetition and unclear paragraphs. A short plan is better than writing immediately and changing direction halfway.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Planning'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Checking',
  'Candidates should leave time to check their writing. Useful checks include subject verb agreement, articles, plural nouns, verb tense, punctuation, spelling, and whether the answer directly addresses every part of the task. Checking should focus on errors that affect clarity. It is better to fix common repeated errors than to rewrite large sections at the end.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Checking'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Complex Sentences',
  'Complex sentences can help show grammatical range, but they must be accurate and clear. A complex sentence uses dependent clauses, relative clauses, conditional clauses, or other structures to connect ideas. Candidates should not make every sentence long. A mix of accurate simple, compound, and complex sentences is usually stronger than forced complexity.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Complex Sentences'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Collocations',
  'Collocations are words that naturally go together, such as make a decision, heavy traffic, public transport, play a role, and have an impact. Accurate collocations improve Lexical Resource. Incorrect collocations such as do a decision or strong rain can sound unnatural. Candidates should learn vocabulary in phrases, not only single words.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Collocations'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Common Grammar Errors',
  'Common IELTS Writing grammar errors include missing articles, wrong plural forms, subject verb agreement mistakes, tense shifts, incorrect prepositions, comma splices, run-on sentences, and unclear relative clauses. Candidates should identify their repeated error patterns and fix them systematically. Accuracy matters because frequent errors can reduce clarity and confidence.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Common Grammar Errors'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Agree or Disagree Questions',
  'Agree or disagree questions ask candidates to take a position on a statement. The essay should make the position clear and support it consistently. Candidates can fully agree, fully disagree, or partly agree if the answer is logically explained. The key is not the chosen side but how clearly and fully it is developed.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Agree or Disagree Questions'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing To What Extent Questions',
  'To what extent questions require candidates to show the strength of their agreement or disagreement. A strong answer states the extent clearly, such as completely agree, mostly agree, or agree only in certain cases. The body paragraphs should match that position. Avoid giving both sides equally if the final position is unclear.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing To What Extent Questions'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Two-Part Questions',
  'Two-part questions ask candidates to answer two related questions in one essay. A strong structure usually gives one body paragraph to each question or combines them logically. Both parts must be answered clearly. A common mistake is spending most of the essay on the first question and only briefly mentioning the second.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Two-Part Questions'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing Cause and Effect Essays',
  'Cause and effect essays ask candidates to explain why something happens and what results from it. Strong answers identify specific causes and effects, then explain the connection clearly. Avoid listing many causes without development. Use precise language such as leads to, results in, contributes to, is caused by, and has a significant effect on.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing Cause and Effect Essays'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Writing General Training Letter',
  'IELTS General Training Writing Task 1 asks candidates to write a letter of at least 150 words. The letter may be formal, semi-formal, or informal depending on the situation and recipient. Candidates should cover all bullet points, use an appropriate tone, organize information clearly, and include a suitable opening and closing.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Writing General Training Letter'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Formal Letter',
  'A formal IELTS letter is used for situations such as complaints, applications, requests, or official communication. The tone should be polite and professional. Avoid contractions and slang. Useful openings include Dear Sir or Madam when the name is unknown. Useful closings include Yours faithfully or Yours sincerely depending on whether the recipient name is known.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Formal Letter'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Informal Letter',
  'An informal IELTS letter is written to someone the candidate knows well, such as a friend or family member. The tone can be friendly and natural. Contractions are acceptable. The letter should still answer all bullet points clearly. A natural opening, personal details, and a friendly closing help create the right tone.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Informal Letter'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Semi-Formal Letter',
  'A semi-formal IELTS letter is used when writing to someone the candidate knows in a formal context, such as a teacher, landlord, manager, or colleague. The tone should be polite but not overly distant. Candidates should avoid slang while still sounding natural. The purpose of the letter should be clear from the first paragraph.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Semi-Formal Letter'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Speaking Band 6 Characteristics',
  'A typical Band 6 Speaking performance communicates meaning but may include hesitation, repetition, or self-correction. Vocabulary is adequate for familiar topics but may lack flexibility. Grammar includes some complex structures but errors are common. Pronunciation is generally understandable, although some features may reduce clarity. To improve, candidates should extend answers and build accuracy.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Speaking Band 6 Characteristics'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Speaking Band 7 Characteristics',
  'A typical Band 7 Speaking performance is clear and reasonably fluent. The candidate can speak at length without major strain, uses a range of vocabulary, and produces some flexible grammar. Errors may occur but usually do not block meaning. Pronunciation is generally clear. To move higher, candidates need more natural precision, fewer repeated errors, and stronger development.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Speaking Band 7 Characteristics'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Speaking Band 8 Characteristics',
  'A typical Band 8 Speaking performance is fluent, flexible, and easy to understand. The candidate develops answers naturally, uses precise vocabulary, and controls grammar well. Occasional errors or hesitation may occur, but they are minor. Pronunciation is clear and effective. The speech sounds natural rather than memorized.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Speaking Band 8 Characteristics'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Speaking How to Extend Answers',
  'To extend IELTS Speaking answers, candidates can add reasons, examples, comparisons, personal experience, or consequences. For example, after answering yes or no, explain why and give a short example. Long answers are not always better, but answers should be developed enough to show language ability. Avoid memorized stories that do not answer the question.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Speaking How to Extend Answers'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Speaking Handling Unknown Questions',
  'If a candidate gets an unfamiliar Speaking question, they can answer honestly and use thinking phrases naturally. It is acceptable to say they have not thought about the topic before, then give a reasonable opinion. The goal is to communicate, not to give expert knowledge. Candidates should avoid silence and try to explain their thoughts clearly.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Speaking Handling Unknown Questions'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Speaking Fillers',
  'Natural fillers can help candidates think briefly in IELTS Speaking, but they should not be overused. Phrases like let me think, that is an interesting question, or I suppose can be useful. Too many fillers can reduce fluency. Candidates should use short thinking phrases and then answer directly.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Speaking Fillers'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Speaking Self Correction',
  'Self correction is normal in IELTS Speaking and can show awareness, but frequent correction can interrupt fluency. If a candidate makes a small mistake but the meaning is clear, it is often better to continue. Correct mistakes when they affect meaning or when the correction can be made quickly and naturally.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Speaking Self Correction'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Speaking Accent',
  'IELTS Speaking does not require a British, American, or native-like accent. The important point is intelligibility. Candidates can keep their accent as long as pronunciation, stress, rhythm, and intonation make the message easy to understand. Practice should focus on clarity and natural delivery, not copying a specific accent perfectly.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Speaking Accent'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Speaking Cue Card Notes',
  'For Speaking Part 2 cue card notes, candidates should write keywords rather than full sentences. Good notes can include who, where, when, what happened, feelings, and why it matters. Notes are only support; the candidate should not read a script. Flexible notes help the answer sound more natural.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Speaking Cue Card Notes'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Speaking Part 3 Abstract Answers',
  'Part 3 questions often ask about society, change, advantages, disadvantages, reasons, or the future. Candidates should move beyond personal stories and discuss broader ideas. A strong answer explains the point, gives an example, and sometimes contrasts different groups or situations. The answer should still be clear and not overly academic.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Speaking Part 3 Abstract Answers'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Reading True False Not Given',
  'In True False Not Given questions, True means the statement agrees with the passage, False means it contradicts the passage, and Not Given means the passage does not provide enough information. Candidates should not use outside knowledge. Pay attention to qualifying words such as all, some, always, never, most, and only.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Reading True False Not Given'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Reading Yes No Not Given',
  'Yes No Not Given questions test the writer opinion or claims. Yes means the statement agrees with the writer, No means it contradicts the writer, and Not Given means there is not enough information. These are similar to True False Not Given but focus more on views, claims, or opinions rather than factual information.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Reading Yes No Not Given'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Reading Matching Headings',
  'For matching headings, candidates should identify the main idea of each paragraph, not choose a heading based on one repeated word. Read the first and last sentences, then scan the middle for the paragraph focus. Eliminate headings that are too narrow, too broad, or only mention a detail. Paraphrase is common.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Reading Matching Headings'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Reading Matching Information',
  'Matching information questions ask candidates to find where specific information appears in the passage. The answers may not follow passage order. Candidates should scan for names, dates, numbers, or key concepts, then read carefully around the location. Keywords are often paraphrased, so matching meaning is more important than matching exact words.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Reading Matching Information'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Reading Multiple Choice',
  'For Reading multiple choice questions, candidates should read the question stem carefully, predict the type of answer, and then compare each option with the passage. Wrong options may include words from the passage but change the meaning. The correct answer must be fully supported by the text, not just sound plausible.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Reading Multiple Choice'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Reading Summary Completion',
  'Summary completion questions require candidates to complete a summary using words from the passage or a list. Pay attention to grammar, word limits, and meaning. Predict whether the missing word is a noun, verb, adjective, or number. The summary may paraphrase the passage, so candidates should search for meaning, not only exact words.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Reading Summary Completion'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Reading Sentence Completion',
  'Sentence completion questions require candidates to complete sentences with information from the passage. Always follow the word limit. The completed sentence must be grammatically correct and match the passage meaning. Candidates should locate the relevant part of the passage, then choose only the necessary word or words.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Reading Sentence Completion'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Reading Skimming and Scanning',
  'Skimming means reading quickly to understand the general idea. Scanning means searching quickly for specific information such as names, dates, numbers, or keywords. IELTS Reading requires both. Candidates should skim for structure and scan for answer locations, then read carefully around the relevant sentences before choosing an answer.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Reading Skimming and Scanning'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Listening Multiple Choice',
  'Listening multiple choice questions often include distractors. A speaker may mention an option but then reject, correct, or qualify it. Candidates should read options before listening and focus on meaning. The correct answer may be paraphrased rather than repeated exactly. Do not choose an answer just because you hear the same word.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Listening Multiple Choice'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Listening Map Labelling',
  'Map labelling questions require candidates to follow directions and locations. Useful language includes opposite, next to, between, on the left, on the right, at the end of, entrance, corner, north, south, east, and west. Candidates should look at the map before the audio starts and identify the starting point.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Listening Map Labelling'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Listening Form Completion',
  'Form completion questions often appear in everyday conversations. Candidates may need names, addresses, phone numbers, dates, prices, or short details. Spelling matters. Listen for corrections, because speakers often spell a word, repeat a number, or change information. Check the word limit and whether a number or word is required.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Listening Form Completion'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Listening Note Completion',
  'Note completion questions require candidates to fill gaps in notes. Before listening, read the notes and predict the missing word type. During listening, follow the structure and listen for paraphrase. The exact answer usually fits grammatically into the notes. After listening, check spelling, singular or plural forms, and word limit.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Listening Note Completion'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Listening Distractors',
  'Distractors are misleading pieces of information in Listening. A speaker may first give one answer and then change it, mention several options, or correct another speaker. Candidates should wait for the final confirmed information. Words such as actually, however, no, sorry, instead, and I mean can signal a correction.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Listening Distractors'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Listening Spelling',
  'Spelling is important in IELTS Listening. Incorrect spelling can make an answer wrong even if the candidate heard the right word. Candidates should practice common names, addresses, days, months, numbers, and academic vocabulary. Pay attention to singular and plural nouns. If a word is spelled in the audio, write it carefully.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Listening Spelling'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Computer Delivered Test',
  'In computer-delivered IELTS, candidates take Listening, Reading, and Writing on a computer. Speaking is still conducted with an examiner. The content, timing, question types, and scoring are the same as paper-based IELTS. Candidates should choose the format they are more comfortable with, especially for typing speed, screen reading, and editing writing.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Computer Delivered Test'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Paper Based Test',
  'In paper-based IELTS, candidates write answers by hand for Reading, Listening, and Writing. Speaking is conducted with an examiner. Candidates should make handwriting clear enough to read and manage time carefully when transferring or checking answers according to the test format. The scoring standards are the same as computer-delivered IELTS.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Paper Based Test'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Retaking the Test',
  'Candidates can retake IELTS if they need a higher score. Before retaking, they should identify which skill or criterion is limiting their score. Simply taking the test again without targeted practice may not improve results. A good retake plan includes error analysis, timed practice, feedback, and work on the weakest scoring areas.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Retaking the Test'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Practice Routine',
  'An effective IELTS practice routine combines skill practice, language improvement, and timed test practice. Candidates should not only do full tests. They should review mistakes, learn vocabulary in context, improve grammar accuracy, practice speaking aloud, and get feedback on writing. Consistent targeted practice is usually better than random high-volume practice.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Practice Routine'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Vocabulary Learning',
  'IELTS vocabulary should be learned by topic and by phrase. Useful topics include education, work, technology, environment, health, transport, cities, crime, media, culture, and family. Candidates should learn collocations, word forms, and example sentences. Using vocabulary accurately and naturally is more important than memorizing rare words.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Vocabulary Learning'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Grammar Improvement',
  'IELTS grammar improvement should focus on accuracy and range. Candidates should master sentence boundaries, verb tenses, articles, subject verb agreement, noun forms, relative clauses, conditionals, and complex sentence structures. The goal is not to use difficult grammar everywhere, but to choose suitable structures and control them accurately.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Grammar Improvement'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Pronunciation Practice',
  'IELTS pronunciation practice should focus on clarity. Useful areas include difficult sounds, word stress, sentence stress, connected speech, rhythm, and intonation. Recording and listening back can help candidates identify unclear words. Shadowing short audio clips can improve rhythm, but candidates should still keep their own natural voice.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Pronunciation Practice'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Common Myths',
  'Common IELTS myths include believing that only native-like accents score high in Speaking, that rare vocabulary is necessary for Writing, that every essay needs idioms, that Task 1 needs a conclusion, or that longer answers always get higher scores. IELTS rewards clear communication, task fulfilment, organization, accurate language, and appropriate range.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Common Myths'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Reading Multiple Choice Strategy',
  'Multiple Choice questions test detailed understanding, main ideas, and paraphrase recognition. Read the question first, identify keywords, skim the relevant part of the passage, and compare each option with the text. Wrong options often reuse passage words but change the meaning. Eliminate choices that are too broad, too narrow, contradicted, or not supported.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Reading Multiple Choice Strategy'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Reading True False Not Given Strategy',
  'True False Not Given questions test whether factual statements agree with the passage. True means the statement matches the text. False means the text says the opposite or contradicts it. Not Given means the information is not stated clearly enough. Do not use outside knowledge, and watch absolute words such as all, always, never, only, and most.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Reading True False Not Given Strategy'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Reading Yes No Not Given Strategy',
  'Yes No Not Given questions test whether statements match the writer opinion or claims. Yes means the statement agrees with the writer. No means it contradicts the writer. Not Given means the writer does not give enough information. Focus on viewpoint and claims, not only factual details.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Reading Yes No Not Given Strategy'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Reading Matching Headings Strategy',
  'Matching Headings questions test the main idea of each paragraph. Read the list of headings first, then skim each paragraph for its overall purpose. Do not choose a heading just because one word appears in the paragraph. The correct heading usually summarizes the whole paragraph, not one small detail.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Reading Matching Headings Strategy'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Reading Matching Information Strategy',
  'Matching Information questions ask you to locate specific information such as a reason, description, definition, example, or result. The answers may not follow passage order. Identify keywords in the question, scan the passage, then read around the matching area carefully. Expect paraphrase rather than exact wording.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Reading Matching Information Strategy'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Reading Matching Features Strategy',
  'Matching Features questions ask you to match names, people, places, dates, theories, or events with related statements. First identify the feature list, then scan the whole passage for each feature. Read nearby sentences carefully because the answer may be paraphrased. Keep track of which features have already been used.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Reading Matching Features Strategy'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Reading Matching Sentence Endings Strategy',
  'Matching Sentence Endings questions ask you to connect the first half of a sentence with a correct ending. Understand the grammar and meaning of the first half, locate the related information in the passage, and choose an ending that fits both meaning and sentence structure. Do not choose an ending only because it sounds grammatically possible.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Reading Matching Sentence Endings Strategy'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Reading Sentence Completion Strategy',
  'Sentence Completion questions ask you to fill a blank with words from the passage. Check the word limit, predict the part of speech, scan for the relevant information, and copy the answer exactly. The completed sentence must be grammatical and match the passage meaning. Check spelling and singular or plural forms.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Reading Sentence Completion Strategy'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Reading Summary Completion Strategy',
  'Summary Completion questions ask you to complete a summary of part or all of a passage. Read the summary first, predict the missing word types, locate the relevant section, and fill each gap with words that fit grammar and meaning. The summary often paraphrases the passage, so search for meaning rather than exact wording.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Reading Summary Completion Strategy'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Reading Table Completion Strategy',
  'Table Completion questions ask you to complete organized information in rows and columns. Read the headings to understand the category of each gap. Predict whether the answer is a name, number, noun, adjective, or phrase. Scan the passage for related information and follow the word limit exactly.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Reading Table Completion Strategy'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Reading Flow Chart Completion Strategy',
  'Flow-chart Completion questions ask you to complete steps in a process or sequence. Identify the order of stages first, then scan the passage for the process description. Use sequence markers such as first, then, after, before, finally, or passive process language. Copy words accurately and respect the word limit.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Reading Flow Chart Completion Strategy'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Reading Diagram Label Strategy',
  'Diagram Label questions ask you to label parts of a diagram, map, object, or process. Study the diagram before reading, predict possible word types, and locate the section of the passage that describes it. Use position and function clues, scan for technical terms, and check the word limit carefully.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Reading Diagram Label Strategy'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Reading Choose a Title Strategy',
  'Choose a Title questions test the overall purpose of the whole passage. It is often better to answer this after other questions because you will understand the passage better. Skim the introduction, topic sentences, and conclusion, then choose the title that captures the whole passage, not only one paragraph or detail.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Reading Choose a Title Strategy'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Reading Short Answer Questions Strategy',
  'Short Answer questions ask for a brief answer, usually one to three words or a number. Read the word limit carefully, identify keywords in the question, scan the passage, and write only the required information. Check spelling, number format, and whether the answer grammatically fits the question.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Reading Short Answer Questions Strategy'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Reading Classification and List Selection Strategy',
  'Classification and List Selection questions ask you to classify information or choose items from a list. Identify the categories or list options first, then scan for matching information. Check whether the passage supports the match directly. Pay attention to paraphrase, order, and whether options may be used more than once.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Reading Classification and List Selection Strategy'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Listening Form Completion Strategy',
  'Form Completion questions often ask for names, addresses, numbers, dates, prices, or short details. Read the form before listening, predict the type of answer, and listen for spelling or corrections. Check the word limit, singular and plural forms, and spelling carefully.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Listening Form Completion Strategy'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Listening Note Completion Strategy',
  'Note Completion questions require you to follow organized notes while listening. Read the notes first, predict whether each gap needs a noun, verb, adjective, number, or phrase, and listen for paraphrase. After answering, check grammar, spelling, and whether the answer fits the note.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Listening Note Completion Strategy'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Listening Multiple Choice Strategy',
  'Multiple Choice questions in Listening often include distractors. A speaker may mention one option, reject it, then give the real answer. Read the options before listening and focus on meaning, not only repeated words. Listen for correction signals such as actually, however, sorry, instead, and I mean.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Listening Multiple Choice Strategy'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Listening Map Label Strategy',
  'Map Label questions test direction and location language. Before listening, identify the starting point and nearby landmarks. Listen for phrases such as opposite, next to, between, on the left, turn right, past, at the end of, north, south, east, and west. Follow the route step by step.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Listening Map Label Strategy'
);

INSERT INTO ielts_knowledge (title, content)
SELECT
  'IELTS Listening Matching Strategy',
  'Matching questions ask you to connect people, places, options, or features with statements. Read the list before listening and underline key differences between options. The speaker may discuss options in a different order and use paraphrase, so listen for meaning rather than exact words.'
WHERE NOT EXISTS (
  SELECT 1 FROM ielts_knowledge WHERE title = 'IELTS Listening Matching Strategy'
);
