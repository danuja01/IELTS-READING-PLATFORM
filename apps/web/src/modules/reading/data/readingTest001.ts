import type { ExamTestContent } from "@/types/exam";

// Cambridge IELTS 15 Academic – Reading Test 1
export const readingTest001: ExamTestContent = {
  id: "reading_test_001",
  moduleType: "READING",
  title: "Cambridge IELTS 15 – Academic Reading Test 1",
  version: 1,
  totalQuestions: 40,
  durationSeconds: 3600,

  // ─────────────────────────────────────────────────────────
  // SECTIONS  (3 passages)
  // ─────────────────────────────────────────────────────────
  sections: [
    // ── PASSAGE 1 ──────────────────────────────────────────
    {
      id: "s1",
      order: 1,
      title: "Nutmeg – a valuable spice",
      passage: {
        contentHtml: `
<h2>Nutmeg – a valuable spice</h2>
<p>
  The nutmeg tree, <em>Myristica fragrans</em>, is a large evergreen tree native to Southeast
  Asia. Until the late 18th century, it only grew in one place in the world: a small group of
  islands in the Banda Sea, part of the Moluccas – or Spice Islands – in northeastern Indonesia.
  The tree is thickly branched with dense foliage of tough, dark green <strong>oval</strong>
  leaves, and produces small, yellow, bell-shaped flowers and pale yellow pear-shaped fruits.
  The fruit is encased in a fleshy <strong>husk</strong>. When the fruit is ripe, this husk
  splits into two halves along a ridge running the length of the fruit. Inside is a purple-brown
  shiny <strong>seed</strong>, 2–3 cm long by about 2 cm across, surrounded by a lacy red or
  crimson covering called an 'aril'. These are the sources of the two spices nutmeg and
  <strong>mace</strong>, the former being produced from the dried seed and the latter from
  the aril.
</p>
<p>
  Nutmeg was a highly prized and costly ingredient in European cuisine in the Middle Ages, and was
  used as a flavouring, medicinal, and preservative agent. Throughout this period, the
  <strong>Arabs</strong> were the exclusive importers of the spice to Europe. They sold nutmeg for
  high prices to merchants based in Venice, but they never revealed the exact location of the source
  of this extremely valuable commodity. The Arab–Venetian dominance of the trade finally ended in
  1512, when the Portuguese reached the Banda Islands and began exploiting its precious resources.
</p>
<p>
  Always in danger of competition from neighbouring Spain, the Portuguese began subcontracting their
  spice distribution to Dutch traders. Profits began to flow into the Netherlands, and the Dutch
  commercial fleet swiftly grew into one of the largest in the world. The Dutch quietly gained
  control of most of the shipping and trading of spices in Northern Europe. Then, in 1580, Portugal
  fell under Spanish rule, and by the end of the 16th century the Dutch found themselves locked out
  of the market. As prices for pepper, nutmeg, and other spices soared across Europe, they decided
  to fight back.
</p>
<p>
  In 1602, Dutch merchants founded the VOC, a trading corporation better known as the Dutch East
  India Company. By 1617, the VOC was the richest commercial operation in the world. The company
  had 50,000 employees worldwide, with a private army of 30,000 men and a fleet of 200 ships. At
  the same time, thousands of people across Europe were dying of the <strong>plague</strong>, a
  highly contagious and deadly disease. Doctors were desperate for a way to stop the spread of this
  disease, and they decided nutmeg held the cure. Everybody wanted nutmeg, and many were willing to
  spare no expense to have it. Nutmeg bought for a few pennies in Indonesia could be sold for 68,000
  times its original cost on the streets of London. The only problem was the short supply. And
  that's where the Dutch found their opportunity.
</p>
<p>
  The Banda Islands were ruled by local sultans who insisted on maintaining a neutral trading policy
  towards foreign powers. This allowed them to avoid the presence of Portuguese or Spanish troops on
  their soil, but it also left them unprotected from other invaders. In 1621, the Dutch arrived and
  took over. Once securely in control of the Bandas, the Dutch went to work protecting their new
  investment. They concentrated all nutmeg production into a few easily guarded areas, uprooting and
  destroying any trees outside the plantation zones. Anyone caught growing a nutmeg seedling or
  carrying seeds without the proper authority was severely punished. In addition, all exported
  nutmeg was covered with <strong>lime</strong> to make sure there was no chance a fertile seed
  which could be grown elsewhere would leave the islands. There was only one obstacle to Dutch
  domination. One of the Banda Islands, a sliver of land called <strong>Run</strong>, only 3 km
  long by less than 1 km wide, was under the control of the British. After decades of fighting for
  control of this tiny island, the Dutch and British arrived at a compromise settlement, the Treaty
  of Breda, in 1667. Intent on securing their hold over every nutmeg-producing island, the Dutch
  offered a trade: if the British would give them the island of Run, they would in turn give Britain
  a distant and much less valuable island in North America. The British agreed. That other island was
  Manhattan, which is how New Amsterdam became New York. The Dutch now had a monopoly over the
  nutmeg trade which would last for another century.
</p>
<p>
  Then, in 1770, a Frenchman named Pierre Poivre successfully smuggled nutmeg plants to safety in
  <strong>Mauritius</strong>, an island off the coast of Africa. Some of these were later exported
  to the Caribbean where they thrived, especially on the island of Grenada. Next, in 1778, a
  volcanic eruption in the Banda region caused a <strong>tsunami</strong> that wiped out half the
  nutmeg groves. Finally, in 1809, the British returned to Indonesia and seized the Banda Islands by
  force. They returned the islands to the Dutch in 1817, but not before transplanting hundreds of
  nutmeg seedlings to plantations in several locations across southern Asia. The Dutch nutmeg
  monopoly was over.
</p>
<p>
  Today, nutmeg is grown in Indonesia, the Caribbean, India, Malaysia, Papua New Guinea and
  Sri Lanka, and world nutmeg production is estimated to average between 10,000 and 12,000 tonnes
  per year.
</p>`,
      },
      mapping: {
        paragraphAnchors: [
          { id: "s1_p1", label: "§1", paragraphIndex: 0 },
          { id: "s1_p2", label: "§2", paragraphIndex: 1 },
          { id: "s1_p3", label: "§3", paragraphIndex: 2 },
          { id: "s1_p4", label: "§4", paragraphIndex: 3 },
          { id: "s1_p5", label: "§5", paragraphIndex: 4 },
          { id: "s1_p6", label: "§6", paragraphIndex: 5 },
          { id: "s1_p7", label: "§7", paragraphIndex: 6 },
        ],
      },
    },

    // ── PASSAGE 2 ──────────────────────────────────────────
    {
      id: "s2",
      order: 2,
      title: "Driverless cars",
      passage: {
        contentHtml: `
<h2>Driverless cars</h2>
<p id="s2-A"><strong>A</strong>&nbsp; The automotive sector is well used to adapting to automation in manufacturing.
  The implementation of robotic car manufacture from the 1970s onwards led to significant cost
  savings and improvements in the reliability and flexibility of vehicle mass production. A new
  challenge to vehicle production is now on the horizon and, again, it comes from automation.
  However, this time it is not to do with the manufacturing process, but with the vehicles
  themselves.</p>
<p>Research projects on vehicle automation are not new. Vehicles with limited self-driving
  capabilities have been around for more than 50 years, resulting in significant contributions
  towards driver assistance systems. But since Google announced in 2010 that it had been trialling
  self-driving cars on the streets of California, progress in this field has quickly gathered
  pace.</p>
<p id="s2-B"><strong>B</strong>&nbsp; There are many reasons why technology is advancing so fast. One frequently
  cited motive is safety; indeed, research at the UK's Transport Research Laboratory has
  demonstrated that more than 90 percent of road collisions involve <strong>human error</strong>
  as a contributory factor, and it is the primary cause in the vast majority. Automation may
  help to reduce the incidence of this.</p>
<p>Another aim is to free the time people spend driving for other purposes. If the vehicle can do
  some or all of the driving, it may be possible to be productive, to socialise or simply to relax
  while automation systems have responsibility for safe control of the vehicle. If the vehicle can
  do the driving, those who are challenged by existing mobility models – such as older or disabled
  travellers – may be able to enjoy significantly greater travel autonomy.</p>
<p id="s2-C"><strong>C</strong>&nbsp; Beyond these direct benefits, we can consider the wider implications for
  transport and society, and how manufacturing processes might need to respond as a result. At
  present, the average car spends more than 90 percent of its life parked. Automation means that
  initiatives for <strong>car-sharing</strong> become much more viable, particularly in urban
  areas with significant travel demand. If a significant proportion of the population choose to
  use shared automated vehicles, mobility demand can be met by far fewer vehicles.</p>
<p id="s2-D"><strong>D</strong>&nbsp; The Massachusetts Institute of Technology investigated automated mobility in
  Singapore, finding that fewer than 30 percent of the vehicles currently used would be required
  if fully automated car sharing could be implemented. If this is the case, it might mean that we
  need to manufacture far fewer vehicles to meet demand. However, the number of trips being taken
  would probably increase, partly because empty vehicles would have to be moved from one customer
  to the next.</p>
<p>Modelling work by the University of Michigan Transportation Research Institute suggests
  automated vehicles might reduce vehicle <strong>ownership</strong> by 43 percent, but that
  vehicles' average annual <strong>mileage</strong> would double as a result. As a consequence,
  each vehicle would be used more intensively, and might need replacing sooner. This faster rate
  of turnover may mean that vehicle production will not necessarily decrease.</p>
<p id="s2-E"><strong>E</strong>&nbsp; Automation may prompt other changes in vehicle manufacture. If we move to a
  model where consumers are tending not to own a single vehicle but to purchase access to a range
  of vehicles through a mobility provider, drivers will have the freedom to select one that best
  suits their needs for a particular journey, rather than making a compromise across all their
  requirements.</p>
<p>Since, for most of the time, most of the seats in most cars are unoccupied, this may boost
  production of a smaller, more efficient range of vehicles that suit the needs of individuals.
  Specialised vehicles may then be available for exceptional journeys, such as going on a family
  camping trip or helping a son or daughter move to university.</p>
<p id="s2-F"><strong>F</strong>&nbsp; There are a number of hurdles to overcome in delivering automated vehicles to
  our roads. These include the technical difficulties in ensuring that the vehicle works reliably
  in the <strong>infinite range of traffic, weather and road situations</strong> it might
  encounter; the regulatory challenges in understanding how liability and enforcement might change
  when drivers are no longer essential for vehicle operation; and the societal changes that may
  be required for communities to <strong>trust and accept</strong> automated vehicles as being a
  valuable part of the mobility landscape.</p>
<p id="s2-G"><strong>G</strong>&nbsp; It's clear that there are many challenges that need to be addressed but,
  through robust and targeted research, these can most probably be conquered within the
  <strong>next 10 years</strong>. Mobility will change in such potentially significant ways and
  in association with so many other technological developments, such as telepresence and virtual
  reality, that it is hard to make concrete predictions about the future. However, one thing is
  certain: change is coming, and the need to be flexible in response to this will be vital for
  those involved in manufacturing the vehicles that will deliver future mobility.</p>`,
      },
      mapping: {
        paragraphAnchors: [
          { id: "s2_A", label: "A", paragraphIndex: 0 },
          { id: "s2_B", label: "B", paragraphIndex: 2 },
          { id: "s2_C", label: "C", paragraphIndex: 4 },
          { id: "s2_D", label: "D", paragraphIndex: 5 },
          { id: "s2_E", label: "E", paragraphIndex: 7 },
          { id: "s2_F", label: "F", paragraphIndex: 9 },
          { id: "s2_G", label: "G", paragraphIndex: 10 },
        ],
      },
    },

    // ── PASSAGE 3 ──────────────────────────────────────────
    {
      id: "s3",
      order: 3,
      title: "What is exploration?",
      passage: {
        contentHtml: `
<h2>What is exploration?</h2>
<p>
  We are all explorers. Our desire to discover, and then share that new-found knowledge, is part of
  what makes us human – indeed, this has played an important part in our success as a species. Long
  before the first caveman slumped down beside the fire and grunted news that there were plenty of
  wildebeest over yonder, our ancestors had learnt the value of sending out scouts to investigate
  the unknown. This questing nature of ours undoubtedly helped our species spread around the globe,
  just as it nowadays no doubt helps the last nomadic Penan maintain their existence in the depleted
  forests of Borneo, and a visitor negotiate the subways of New York.
</p>
<p>
  Over the years, we've come to think of explorers as a peculiar breed – different from the rest of
  us, different from those of us who are merely 'well travelled', even; and perhaps there is a type
  of person more suited to seeking out the new, a type of caveman more inclined to risk venturing
  out. That, however, doesn't take away from the fact that we all have this enquiring instinct, even
  today; and that in all sorts of professions – whether artist, marine biologist or astronomer –
  borders of the unknown are being tested each day.
</p>
<p>
  Thomas Hardy set some of his novels in Egdon Heath, a fictional area of uncultivated land, and
  used the landscape to suggest the desires and fears of his characters. He is delving into matters
  we all recognise because they are common to humanity. This is surely an act of exploration, and
  into a world as remote as the author chooses. Explorer and travel writer Peter Fleming talks of
  the moment when the explorer returns to the existence he has left behind with his loved ones. The
  traveller 'who has for weeks or months seen himself only as a puny and irrelevant alien crawling
  laboriously over a country in which he has no roots and no background, suddenly encounters his
  other self, a relatively solid figure, with a place in the minds of certain people'.
</p>
<p>
  In this book about the exploration of the earth's surface, I have confined myself to those whose
  travels were real and who also aimed at more than personal discovery. But that still left me with
  another problem: the word 'explorer' has become associated with a past era. We think back to a
  golden age, as if exploration peaked somehow in the 19th century – as if the process of discovery
  is now on the decline, though the truth is that we have named only one and a half million of this
  planet's species, and there may be more than 10 million – and that's not including bacteria. We
  have studied only 5 per cent of the species we know. We have scarcely mapped the ocean floors, and
  know even less about ourselves; we fully understand the workings of only 10 per cent of our
  brains.
</p>
<p>
  Here is how some of today's 'explorers' define the word. Ran Fiennes, dubbed the 'greatest living
  explorer', said, 'An explorer is someone who has done something that no human has done before –
  and also done something scientifically useful.' Chris Bonington, a leading mountaineer, felt
  exploration was to be found in the act of physically touching the unknown: 'You have to have gone
  somewhere new.' Then Robin Hanbury-Tenison, a campaigner on behalf of remote so-called 'tribal'
  peoples, said, 'A traveller simply records information about some far-off world, and reports back;
  but an explorer changes the world.' Wilfred Thesiger, who crossed Arabia's Empty Quarter in 1946,
  and belongs to an era of unmechanised travel now lost to the rest of us, told me, 'If I'd gone
  across by camel when I could have gone by car, it would have been a stunt.' To him, exploration
  meant bringing back information from a remote place regardless of any great self-discovery.
</p>
<p>
  Each definition is slightly different – and tends to reflect the field of endeavour of each
  pioneer. It was the same whoever I asked: the prominent historian would say exploration was a
  thing of the past, the cutting-edge scientist would say it was of the present. And so on. They
  each set their own particular criteria; the common factor in their approach being that they all
  had, unlike many of us who simply enjoy travel or discovering new things, both a very definite
  objective from the outset and also a desire to record their findings.
</p>
<p>
  I'd best declare my own bias. As a writer, I'm interested in the exploration of ideas. I've done
  a great many <strong>expeditions</strong> and each one was unique. I've lived for months alone
  with isolated groups of people all around the world, even two '<strong>uncontacted</strong>
  tribes'. But none of these things is of the slightest interest to anyone unless, through my
  books, I've found a new slant, explored a new idea. Why? Because the world has moved on. The time
  has long passed for the great continental voyages – another walk to the poles, another crossing of
  the Empty Quarter. We know how the <strong>land surface</strong> of our planet lies; exploration
  of it is now down to the details – the habits of microbes, say, or the grazing behaviour of
  buffalo. Aside from the deep sea and deep underground, it's the era of specialists. However, this
  is to disregard the role the human mind has in conveying remote places; and this is what interests
  me: how a fresh interpretation, even of a well-travelled route, can give its readers new insights.
</p>`,
      },
      mapping: {
        paragraphAnchors: [
          { id: "s3_p1", label: "§1", paragraphIndex: 0 },
          { id: "s3_p2", label: "§2", paragraphIndex: 1 },
          { id: "s3_p3", label: "§3", paragraphIndex: 2 },
          { id: "s3_p4", label: "§4", paragraphIndex: 3 },
          { id: "s3_p5", label: "§5", paragraphIndex: 4 },
          { id: "s3_p6", label: "§6", paragraphIndex: 5 },
          { id: "s3_p7", label: "§7", paragraphIndex: 6 },
        ],
      },
    },
  ],

  // ─────────────────────────────────────────────────────────
  // QUESTION GROUPS
  // ─────────────────────────────────────────────────────────
  questionGroups: [
    // Passage 1 – groups
    {
      id: "g1",
      sectionId: "s1",
      title: "Questions 1–4",
      instructions:
        "Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.",
      questionIds: ["q1", "q2", "q3", "q4"],
    },
    {
      id: "g2",
      sectionId: "s1",
      title: "Questions 5–7",
      instructions:
        "Do the following statements agree with the information given in Reading Passage 1?\n\nTRUE  if the statement agrees with the information\nFALSE  if the statement contradicts the information\nNOT GIVEN  if there is no information on this",
      questionIds: ["q5", "q6", "q7"],
    },
    {
      id: "g3",
      sectionId: "s1",
      title: "Questions 8–13",
      instructions:
        "Complete the table below. Choose ONE WORD ONLY from the passage for each answer.",
      questionIds: ["q8", "q9", "q10", "q11", "q12", "q13"],
    },

    // Passage 2 – groups
    {
      id: "g4",
      sectionId: "s2",
      title: "Questions 14–18",
      instructions:
        "Reading Passage 2 has seven paragraphs, A–G.\nWhich paragraph contains the following information?\nWrite the correct letter, A–G, in boxes 14–18 on your answer sheet.\nNB  You may use any letter more than once.",
      questionIds: ["q14", "q15", "q16", "q17", "q18"],
    },
    {
      id: "g5",
      sectionId: "s2",
      title: "Questions 19–22",
      instructions:
        "Complete the summary below.\nChoose NO MORE THAN TWO WORDS from the passage for each answer.",
      questionIds: ["q19", "q20", "q21", "q22"],
    },
    {
      id: "g6",
      sectionId: "s2",
      title: "Questions 23–26",
      instructions:
        "Questions 23–24: Choose TWO letters, A–E.\nWhich TWO benefits of automated vehicles does the writer mention?\n\nQuestions 25–26: Choose TWO letters, A–E.\nWhich TWO challenges to automated vehicle development does the writer mention?",
      questionIds: ["q23_24", "q25_26"],
    },

    // Passage 3 – groups
    {
      id: "g7",
      sectionId: "s3",
      title: "Questions 27–32",
      instructions:
        "Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 27–32 on your answer sheet.",
      questionIds: ["q27", "q28", "q29", "q30", "q31", "q32"],
    },
    {
      id: "g8",
      sectionId: "s3",
      title: "Questions 33–37",
      instructions:
        "Look at the following statements (Questions 33–37) and the list of explorers below.\nMatch each statement with the correct explorer, A–E.\nWrite the correct letter, A–E, in boxes 33–37 on your answer sheet.\nNB  You may use any letter more than once.\n\nList of Explorers\nA  Peter Fleming\nB  Ran Fiennes\nC  Chris Bonington\nD  Robin Hanbury-Tenison\nE  Wilfred Thesiger",
      questionIds: ["q33", "q34", "q35", "q36", "q37"],
    },
    {
      id: "g9",
      sectionId: "s3",
      title: "Questions 38–40",
      instructions:
        "Complete the summary below.\nChoose NO MORE THAN TWO WORDS from the passage for each answer.",
      questionIds: ["q38", "q39", "q40"],
    },
  ],

  // ─────────────────────────────────────────────────────────
  // QUESTIONS  (40 total)
  // ─────────────────────────────────────────────────────────
  questions: [
    // ── Q1–4: Gap fill completion (Passage 1) ─────────────────
    {
      id: "q1",
      number: 1,
      sectionId: "s1",
      groupId: "g1",
      type: "GAP_FILL",
      prompt: "Complete the notes below. Choose NO MORE THAN ONE WORD from the passage for each answer.",
      text: `The nutmeg tree information:
• The leaves of the tree are {{1}} in shape
• The {{2}} surrounds the fruit and breaks open when the fruit is ripe  
• The {{3}} is used to produce the spice nutmeg
• The covering known as the aril is used to produce {{4}}`,
      gaps: [
        {
          id: "gap1",
          position: 1,
          maxWords: 1,
          acceptedAnswers: ["oval"],
          placeholder: "shape"
        },
        {
          id: "gap2", 
          position: 2,
          maxWords: 1,
          acceptedAnswers: ["husk"],
          placeholder: "part"
        },
        {
          id: "gap3",
          position: 3, 
          maxWords: 1,
          acceptedAnswers: ["seed"],
          placeholder: "part"
        },
        {
          id: "gap4",
          position: 4,
          maxWords: 1, 
          acceptedAnswers: ["mace"],
          placeholder: "spice"
        }
      ],
      instructions: "Write your answers in boxes 1-4 on your answer sheet."
    },

    // ── Q5–7: YNNG Questions (Passage 1) ─────────
    {
      id: "q5",
      number: 5,
      sectionId: "s1",
      groupId: "g2",
      type: "YNNG",
      prompt: "In the Middle Ages, most Europeans knew where nutmeg was grown.",
      options: ["YES", "NO", "NOT GIVEN"],
      answerKey: "NO",
    },
    {
      id: "q6", 
      number: 6,
      sectionId: "s1",
      groupId: "g2", 
      type: "YNNG",
      prompt: "The writer believes the VOC was an innovative business model.",
      options: ["YES", "NO", "NOT GIVEN"],
      answerKey: "NOT GIVEN",
    },
    {
      id: "q7",
      number: 7,
      sectionId: "s1", 
      groupId: "g2",
      type: "YNNG",
      prompt: "The writer suggests the Dutch were more strategic than other European powers.",
      options: ["YES", "NO", "NOT GIVEN"],
      answerKey: "YES",
    },

    // ── Q8–13: Table completion (Passage 1) ────────────────
    {
      id: "q8",
      number: 8,
      sectionId: "s1",
      groupId: "g3",
      type: "FILL_BLANK",
      prompt:
        "Middle Ages: Nutmeg imported to Europe exclusively by the ………………",
      responseMode: "WORD_LIMIT",
      maxWords: 1,
      acceptedAnswers: ["Arabs"],
    },
    {
      id: "q9",
      number: 9,
      sectionId: "s1",
      groupId: "g3",
      type: "FILL_BLANK",
      prompt:
        "Early 17th century: Thousands of Europeans dying from the ………………; nutmeg thought to be a cure",
      responseMode: "WORD_LIMIT",
      maxWords: 1,
      acceptedAnswers: ["plague"],
    },
    {
      id: "q10",
      number: 10,
      sectionId: "s1",
      groupId: "g3",
      type: "FILL_BLANK",
      prompt:
        "After 1621: Dutch covered all exported nutmeg with ……………… to prevent fertile seeds leaving the islands",
      responseMode: "WORD_LIMIT",
      maxWords: 1,
      acceptedAnswers: ["lime"],
    },
    {
      id: "q11",
      number: 11,
      sectionId: "s1",
      groupId: "g3",
      type: "FILL_BLANK",
      prompt:
        "1667 Treaty of Breda: British gave the Dutch the island of ………………; Dutch gave Britain Manhattan",
      responseMode: "WORD_LIMIT",
      maxWords: 1,
      acceptedAnswers: ["Run"],
    },
    {
      id: "q12",
      number: 12,
      sectionId: "s1",
      groupId: "g3",
      type: "FILL_BLANK",
      prompt:
        "1770: Pierre Poivre smuggled nutmeg plants to ………………, off the coast of Africa",
      responseMode: "WORD_LIMIT",
      maxWords: 1,
      acceptedAnswers: ["Mauritius"],
    },
    {
      id: "q13",
      number: 13,
      sectionId: "s1",
      groupId: "g3",
      type: "FILL_BLANK",
      prompt:
        "1778: A volcanic eruption caused a ……………… that destroyed half of the nutmeg groves",
      responseMode: "WORD_LIMIT",
      maxWords: 1,
      acceptedAnswers: ["tsunami"],
    },

    // ── Q14–18: Match Headings (Passage 2) ─────────────
    {
      id: "q14",
      number: 14,
      sectionId: "s2", 
      groupId: "g4",
      type: "MATCH_HEAD",
      prompt: "The reading passage has seven paragraphs, A-G. Choose the correct heading for paragraphs B-F from the list of headings below.",
      availableHeadings: [
        { key: "i", text: "The search for the unknown" },
        { key: "ii", text: "Exploration as a universal human trait" },
        { key: "iii", text: "Modern definitions of exploration" },
        { key: "iv", text: "The impact of literature on exploration" },
        { key: "v", text: "Why exploration seems outdated" },
        { key: "vi", text: "The continuing need for exploration" },
        { key: "vii", text: "Personal transformation through travel" },
        { key: "viii", text: "The golden age of exploration" }
      ],
      paragraphTargets: [
        { paragraphLabel: "B", slotId: "para_b" },
        { paragraphLabel: "C", slotId: "para_c" },
        { paragraphLabel: "D", slotId: "para_d" },
        { paragraphLabel: "E", slotId: "para_e" },
        { paragraphLabel: "F", slotId: "para_f" }
      ],
      answerKeys: {
        "para_b": "ii",
        "para_c": "vii", 
        "para_d": "v",
        "para_e": "iii",
        "para_f": "vi"
      },
      instructions: "Write the correct number, i-viii, in boxes 14-18 on your answer sheet."
    },
    {
      id: "q15",
      number: 15,
      sectionId: "s2",
      groupId: "g4",
      type: "MCQ_SINGLE",
      prompt: "mention of several advantages of driverless vehicles for individual road-users",
      options: [
        { key: "A", label: "A" },
        { key: "B", label: "B" },
        { key: "C", label: "C" },
        { key: "D", label: "D" },
        { key: "E", label: "E" },
        { key: "F", label: "F" },
        { key: "G", label: "G" },
      ],
      answerKey: "B",
    },
    {
      id: "q16",
      number: 16,
      sectionId: "s2",
      groupId: "g4",
      type: "MCQ_SINGLE",
      prompt: "reference to the opportunity of choosing the most appropriate vehicle for each trip",
      options: [
        { key: "A", label: "A" },
        { key: "B", label: "B" },
        { key: "C", label: "C" },
        { key: "D", label: "D" },
        { key: "E", label: "E" },
        { key: "F", label: "F" },
        { key: "G", label: "G" },
      ],
      answerKey: "E",
    },
    {
      id: "q17",
      number: 17,
      sectionId: "s2",
      groupId: "g4",
      type: "MCQ_SINGLE",
      prompt: "an estimate of how long it will take to overcome a number of problems",
      options: [
        { key: "A", label: "A" },
        { key: "B", label: "B" },
        { key: "C", label: "C" },
        { key: "D", label: "D" },
        { key: "E", label: "E" },
        { key: "F", label: "F" },
        { key: "G", label: "G" },
      ],
      answerKey: "G",
    },
    {
      id: "q18",
      number: 18,
      sectionId: "s2",
      groupId: "g4",
      type: "MCQ_SINGLE",
      prompt: "a suggestion that the use of driverless cars may have no effect on the number of vehicles manufactured",
      options: [
        { key: "A", label: "A" },
        { key: "B", label: "B" },
        { key: "C", label: "C" },
        { key: "D", label: "D" },
        { key: "E", label: "E" },
        { key: "F", label: "F" },
        { key: "G", label: "G" },
      ],
      answerKey: "D",
    },

    // ── Q19–22: Summary completion (Passage 2) ─────────────
    {
      id: "q19",
      number: 19,
      sectionId: "s2",
      groupId: "g5",
      type: "FILL_BLANK",
      prompt:
        "Figures from the Transport Research Laboratory indicate that most motor accidents are partly due to ………………, so the introduction of driverless vehicles will result in greater safety.",
      responseMode: "PHRASE_LIMIT",
      maxWords: 2,
      acceptedAnswers: ["human error"],
    },
    {
      id: "q20",
      number: 20,
      sectionId: "s2",
      groupId: "g5",
      type: "FILL_BLANK",
      prompt:
        "In addition to the direct benefits of automation, schemes for ……………… will be more workable, especially in towns and cities, resulting in fewer cars on the road.",
      responseMode: "PHRASE_LIMIT",
      maxWords: 2,
      acceptedAnswers: ["car-sharing", "car sharing"],
    },
    {
      id: "q21",
      number: 21,
      sectionId: "s2",
      groupId: "g5",
      type: "FILL_BLANK",
      prompt:
        "According to the University of Michigan Transportation Research Institute, there could be a 43 percent drop in ……………… of cars.",
      responseMode: "WORD_LIMIT",
      maxWords: 1,
      acceptedAnswers: ["ownership"],
    },
    {
      id: "q22",
      number: 22,
      sectionId: "s2",
      groupId: "g5",
      type: "FILL_BLANK",
      prompt:
        "However, the yearly ……………… of each car would, on average, be twice as high as it currently is.",
      responseMode: "WORD_LIMIT",
      maxWords: 1,
      acceptedAnswers: ["mileage"],
    },

    // ── Q23–26: Choose TWO (Passage 2) ─────────────────────
    // Stored as a single MCQ_MULTIPLE per pair (Q23+24 and Q25+26)
    {
      id: "q23_24",
      number: 23,
      sectionId: "s2",
      groupId: "g6",
      type: "MCQ_MULTIPLE",
      prompt:
        "Questions 23–24: Which TWO benefits of automated vehicles does the writer mention?",
      options: [
        { key: "A", label: "A  Car travellers could enjoy considerable cost savings." },
        { key: "B", label: "B  It would be easier to find parking spaces in urban areas." },
        { key: "C", label: "C  Travellers could spend journeys doing something other than driving." },
        { key: "D", label: "D  People who find driving physically difficult could travel independently." },
        { key: "E", label: "E  A reduction in the number of cars would mean a reduction in pollution." },
      ],
      chooseCount: 2,
      answerKeys: ["C", "D"],
    },
    {
      id: "q25_26",
      number: 25,
      sectionId: "s2",
      groupId: "g6",
      type: "MCQ_MULTIPLE",
      prompt:
        "Questions 25–26: Which TWO challenges to automated vehicle development does the writer mention?",
      options: [
        { key: "A", label: "A  Making sure the general public has confidence in automated vehicles." },
        { key: "B", label: "B  Managing the pace of transition from conventional to automated vehicles." },
        { key: "C", label: "C  Deciding how to compensate professional drivers who become redundant." },
        { key: "D", label: "D  Setting up the infrastructure to make roads suitable for automated vehicles." },
        { key: "E", label: "E  Getting automated vehicles to adapt to various different driving conditions." },
      ],
      chooseCount: 2,
      answerKeys: ["A", "E"],
    },

    // ── Q27–32: Multiple choice (Passage 3) ────────────────
    {
      id: "q27",
      number: 27,
      sectionId: "s3",
      groupId: "g7",
      type: "MCQ_SINGLE",
      prompt:
        "27. The writer refers to visitors to New York to illustrate the point that",
      options: [
        { key: "A", label: "A  exploration is an intrinsic element of being human." },
        { key: "B", label: "B  most people are enthusiastic about exploring." },
        { key: "C", label: "C  exploration can lead to surprising results." },
        { key: "D", label: "D  most people find exploration daunting." },
      ],
      answerKey: "A",
    },
    {
      id: "q28",
      number: 28,
      sectionId: "s3",
      groupId: "g7",
      type: "MCQ_SINGLE",
      prompt:
        "28. According to the second paragraph, what is the writer's view of explorers?",
      options: [
        { key: "A", label: "A  Their discoveries have brought both benefits and disadvantages." },
        { key: "B", label: "B  Their main value is in teaching others." },
        { key: "C", label: "C  They act on an urge that is common to everyone." },
        { key: "D", label: "D  They tend to be more attracted to certain professions than to others." },
      ],
      answerKey: "C",
    },
    {
      id: "q29",
      number: 29,
      sectionId: "s3",
      groupId: "g7",
      type: "MCQ_SINGLE",
      prompt:
        "29. The writer refers to a description of Egdon Heath to suggest that",
      options: [
        { key: "A", label: "A  Hardy was writing about his own experience of exploration." },
        { key: "B", label: "B  Hardy was mistaken about the nature of exploration." },
        { key: "C", label: "C  Hardy's aim was to investigate people's emotional states." },
        { key: "D", label: "D  Hardy's aim was to show the attraction of isolation." },
      ],
      answerKey: "C",
    },
    {
      id: "q30",
      number: 30,
      sectionId: "s3",
      groupId: "g7",
      type: "MCQ_SINGLE",
      prompt:
        "30. In the fourth paragraph, the writer refers to 'a golden age' to suggest that",
      options: [
        { key: "A", label: "A  the amount of useful information produced by exploration has decreased." },
        { key: "B", label: "B  fewer people are interested in exploring than in the 19th century." },
        { key: "C", label: "C  recent developments have made exploration less exciting." },
        { key: "D", label: "D  we are wrong to think that exploration is no longer necessary." },
      ],
      answerKey: "D",
    },
    {
      id: "q31",
      number: 31,
      sectionId: "s3",
      groupId: "g7",
      type: "MCQ_SINGLE",
      prompt:
        "31. In the sixth paragraph, when discussing the definition of exploration, the writer argues that",
      options: [
        { key: "A", label: "A  people tend to relate exploration to their own professional interests." },
        { key: "B", label: "B  certain people are likely to misunderstand the nature of exploration." },
        { key: "C", label: "C  the generally accepted definition has changed over time." },
        { key: "D", label: "D  historians and scientists have more valid definitions than the general public." },
      ],
      answerKey: "A",
    },
    {
      id: "q32",
      number: 32,
      sectionId: "s3",
      groupId: "g7",
      type: "MCQ_SINGLE",
      prompt:
        "32. In the last paragraph, the writer explains that he is interested in",
      options: [
        { key: "A", label: "A  how someone's personality is reflected in their choice of places to visit." },
        { key: "B", label: "B  the human ability to cast new light on places that may be familiar." },
        { key: "C", label: "C  how travel writing has evolved to meet changing demands." },
        { key: "D", label: "D  the feelings that writers develop about the places that they explore." },
      ],
      answerKey: "B",
    },

    // ── Q33–37: Match statement to explorer (Passage 3) ────
    {
      id: "q33",
      number: 33,
      sectionId: "s3",
      groupId: "g8",
      type: "MCQ_SINGLE",
      prompt: "33. He referred to the relevance of the form of transport used.",
      options: [
        { key: "A", label: "A  Peter Fleming" },
        { key: "B", label: "B  Ran Fiennes" },
        { key: "C", label: "C  Chris Bonington" },
        { key: "D", label: "D  Robin Hanbury-Tenison" },
        { key: "E", label: "E  Wilfred Thesiger" },
      ],
      answerKey: "E",
    },
    {
      id: "q34",
      number: 34,
      sectionId: "s3",
      groupId: "g8",
      type: "MCQ_SINGLE",
      prompt: "34. He described feelings on coming back home after a long journey.",
      options: [
        { key: "A", label: "A  Peter Fleming" },
        { key: "B", label: "B  Ran Fiennes" },
        { key: "C", label: "C  Chris Bonington" },
        { key: "D", label: "D  Robin Hanbury-Tenison" },
        { key: "E", label: "E  Wilfred Thesiger" },
      ],
      answerKey: "A",
    },
    {
      id: "q35",
      number: 35,
      sectionId: "s3",
      groupId: "g8",
      type: "MCQ_SINGLE",
      prompt: "35. He worked for the benefit of specific groups of people.",
      options: [
        { key: "A", label: "A  Peter Fleming" },
        { key: "B", label: "B  Ran Fiennes" },
        { key: "C", label: "C  Chris Bonington" },
        { key: "D", label: "D  Robin Hanbury-Tenison" },
        { key: "E", label: "E  Wilfred Thesiger" },
      ],
      answerKey: "D",
    },
    {
      id: "q36",
      number: 36,
      sectionId: "s3",
      groupId: "g8",
      type: "MCQ_SINGLE",
      prompt: "36. He did not consider learning about oneself an essential part of exploration.",
      options: [
        { key: "A", label: "A  Peter Fleming" },
        { key: "B", label: "B  Ran Fiennes" },
        { key: "C", label: "C  Chris Bonington" },
        { key: "D", label: "D  Robin Hanbury-Tenison" },
        { key: "E", label: "E  Wilfred Thesiger" },
      ],
      answerKey: "E",
    },
    {
      id: "q37",
      number: 37,
      sectionId: "s3",
      groupId: "g8",
      type: "MCQ_SINGLE",
      prompt: "37. He defined exploration as being both unique and of value to others.",
      options: [
        { key: "A", label: "A  Peter Fleming" },
        { key: "B", label: "B  Ran Fiennes" },
        { key: "C", label: "C  Chris Bonington" },
        { key: "D", label: "D  Robin Hanbury-Tenison" },
        { key: "E", label: "E  Wilfred Thesiger" },
      ],
      answerKey: "B",
    },

    // ── Q38–40: Summary completion (Passage 3) ─────────────
    {
      id: "q38",
      number: 38,
      sectionId: "s3",
      groupId: "g9",
      type: "FILL_BLANK",
      prompt:
        "The writer has experience of a large number of ………………, and each one was unique.",
      responseMode: "WORD_LIMIT",
      maxWords: 1,
      acceptedAnswers: ["expeditions"],
    },
    {
      id: "q39",
      number: 39,
      sectionId: "s3",
      groupId: "g9",
      type: "FILL_BLANK",
      prompt:
        "He was even the first stranger that certain previously ……………… people had encountered.",
      responseMode: "WORD_LIMIT",
      maxWords: 1,
      acceptedAnswers: ["uncontacted", "isolated"],
    },
    {
      id: "q40",
      number: 40,
      sectionId: "s3",
      groupId: "g9",
      type: "FILL_BLANK",
      prompt:
        "He believes there is no need for further exploration of Earth's ……………… except to answer specific questions.",
      responseMode: "PHRASE_LIMIT",
      maxWords: 2,
      acceptedAnswers: ["land surface", "surface"],
    },
  ],
};
