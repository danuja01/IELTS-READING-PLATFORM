-- Seed: reading_test_001 (maps supabase/seed/reading_test_001.json into normalized tables)
-- Run AFTER supabase/migrations/0001_exam_engine.sql
-- Safe to re-run: removes prior row by slug then re-inserts.

begin;

delete from public.exam_tests where slug = 'reading_test_001';

do $$
declare
  v_module uuid;
  v_test uuid;
  v_s1 uuid;
  v_s2 uuid;
  v_s3 uuid;
  v_g1 uuid;
  v_g2 uuid;
  v_g3 uuid;
  v_g4 uuid;
begin
  select id into v_module from public.exam_modules where code = 'READING' limit 1;
  if v_module is null then
    raise exception 'exam_modules.READING missing; run migration 0001_exam_engine.sql first';
  end if;

  insert into public.exam_tests (module_id, slug, title, version, total_questions, duration_seconds, status)
  values (
    v_module,
    'reading_test_001',
    'Cambridge Style Reading Test 001',
    1,
    40,
    3600,
    'PUBLISHED'
  )
  returning id into v_test;

  -- Passage 1
  insert into public.exam_sections (test_id, section_order, title, content_html, content_markdown, mapping)
  values (
    v_test,
    1,
    'Passage 1',
    $html$<h2>The Importance of Children's Play</h2><p id='pA'><strong>A</strong> Brick by brick, six-year-old Alice is building a magical kingdom...</p><p id='pB'><strong>B</strong> Minutes later, Alice has abandoned the kingdom in favour of playing schools...</p><p id='pC'><strong>C</strong> Play in all its rich variety is one of the highest achievements...</p>$html$,
    $md$## The Importance of Children's Play

A. Brick by brick, six-year-old Alice is building a magical kingdom...

B. Minutes later, Alice has abandoned the kingdom...

C. Play in all its rich variety is one of the highest achievements...$md$,
    '{"paragraphAnchors":[{"id":"s1_a","label":"A","paragraphIndex":0},{"id":"s1_b","label":"B","paragraphIndex":1},{"id":"s1_c","label":"C","paragraphIndex":2}]}'::jsonb
  )
  returning id into v_s1;

  -- Passage 2
  insert into public.exam_sections (test_id, section_order, title, content_html, content_markdown, mapping)
  values (
    v_test,
    2,
    'Passage 2',
    $html$<h2>The Growth of Bike-sharing Schemes</h2><p id='pA'><strong>A</strong> The original idea for an urban bike-sharing scheme dates back...</p><p id='pB'><strong>B</strong> As cities became denser, demand for alternatives rose...</p>$html$,
    $md$## The Growth of Bike-sharing Schemes

A. The original idea for an urban bike-sharing scheme dates back...

B. As cities became denser, demand for alternatives rose...$md$,
    '{"paragraphAnchors":[{"id":"s2_a","label":"A","paragraphIndex":0},{"id":"s2_b","label":"B","paragraphIndex":1}]}'::jsonb
  )
  returning id into v_s2;

  -- Passage 3
  insert into public.exam_sections (test_id, section_order, title, content_html, content_markdown, mapping)
  values (
    v_test,
    3,
    'Passage 3',
    $html$<h2>Motivational Factors and Hospitality</h2><p id='pA'><strong>A</strong> A critical ingredient in hotel success is superior staff performance...</p><p id='pB'><strong>B</strong> Motivation is influenced by growth pathways and management style...</p>$html$,
    $md$## Motivational Factors and Hospitality

A. A critical ingredient in hotel success is superior staff performance...

B. Motivation is influenced by growth pathways and management style...$md$,
    '{"paragraphAnchors":[{"id":"s3_a","label":"A","paragraphIndex":0},{"id":"s3_b","label":"B","paragraphIndex":1}]}'::jsonb
  )
  returning id into v_s3;

  insert into public.exam_question_groups (test_id, section_id, group_order, title, instructions, shared_config)
  values
    (v_test, v_s1, 1, 'Questions 1-8', 'Complete the notes below. Choose ONE WORD ONLY from the passage.', '{}'::jsonb)
  returning id into v_g1;

  insert into public.exam_question_groups (test_id, section_id, group_order, title, instructions, shared_config)
  values
    (v_test, v_s1, 2, 'Questions 9-13', 'Do the following statements agree with the information in Reading Passage 1?', '{}'::jsonb)
  returning id into v_g2;

  insert into public.exam_question_groups (test_id, section_id, group_order, title, instructions, shared_config)
  values
    (v_test, v_s2, 3, 'Questions 14-20', 'Complete each question according to the instructions in the panel.', '{}'::jsonb)
  returning id into v_g3;

  insert into public.exam_question_groups (test_id, section_id, group_order, title, instructions, shared_config)
  values
    (v_test, v_s3, 4, 'Questions 21-40', 'Answer all questions.', '{}'::jsonb)
  returning id into v_g4;

  -- Questions (subset matching JSON file; see supabase/seed/README.md)
  insert into public.exam_questions (test_id, section_id, group_id, question_number, question_type, prompt, config, answer_key, mapping)
  values
    (
      v_test,
      v_s1,
      v_g1,
      1,
      'FILL_BLANK',
      'Building a magical kingdom may help develop ______.',
      '{"responseMode":"WORD_LIMIT","maxWords":1}'::jsonb,
      '{"acceptedAnswers":["creativity"]}'::jsonb,
      '{"paragraphRefs":["A"]}'::jsonb
    ),
    (
      v_test,
      v_s1,
      v_g1,
      2,
      'FILL_BLANK',
      'Board games involve ______ and turn-taking.',
      '{"responseMode":"WORD_LIMIT","maxWords":1}'::jsonb,
      '{"acceptedAnswers":["rules"]}'::jsonb,
      '{"paragraphRefs":["B"]}'::jsonb
    ),
    (
      v_test,
      v_s1,
      v_g2,
      9,
      'TFNG',
      'Children with self-control are better at problem-solving.',
      '{"options":["TRUE","FALSE","NOT_GIVEN"]}'::jsonb,
      '{"answerKey":"TRUE"}'::jsonb,
      '{"paragraphRefs":["C"]}'::jsonb
    ),
    (
      v_test,
      v_s2,
      v_g3,
      14,
      'MATCH_HEADINGS',
      'A description of how people misused a bike-sharing scheme.',
      '{"availableHeadings":[{"key":"A","text":"Origins of urban bike sharing"},{"key":"B","text":"Technology-enabled recovery and growth"},{"key":"C","text":"Reasons for project rejection"},{"key":"D","text":"Misuse and vandalism problems"}],"paragraphTargets":[{"paragraphLabel":"E","slotId":"slot-e"}]}'::jsonb,
      '{"answerHeadingKey":"D"}'::jsonb,
      '{"paragraphRefs":["E"]}'::jsonb
    ),
    (
      v_test,
      v_s2,
      v_g3,
      19,
      'MCQ_SINGLE',
      'Which statement best describes the second-generation scheme?',
      '{"options":[{"key":"A","label":"It failed due to high user fees."},{"key":"B","label":"It failed when a partner withdrew support."},{"key":"C","label":"It succeeded only in suburban areas."},{"key":"D","label":"It never launched publicly."}]}'::jsonb,
      '{"answerKey":"B"}'::jsonb,
      '{}'::jsonb
    ),
    (
      v_test,
      v_s3,
      v_g4,
      40,
      'FILL_BLANK',
      'Complete the summary with one word: Staff stay longer when ______ is encouraged.',
      '{"responseMode":"WORD_LIMIT","maxWords":1}'::jsonb,
      '{"acceptedAnswers":["cooperation","collaboration"]}'::jsonb,
      '{}'::jsonb
    );
end $$;

commit;
