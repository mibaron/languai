import type { BooksData } from "@/types/content";

export const BOOKS: BooksData = {
  "A1.1": {
    "grammar": [
      {
        "title": "1. Personal Pronouns — Nominativ",
        "note": "These are the SUBJECT pronouns (who is doing the action).",
        "type": "table",
        "headers": [
          "Pronomen",
          "English"
        ],
        "rows": [
          [
            "ich",
            "I"
          ],
          [
            "du",
            "you (informal)"
          ],
          [
            "er / sie / es",
            "he / she / it"
          ],
          [
            "wir",
            "we"
          ],
          [
            "ihr",
            "you all (informal)"
          ],
          [
            "sie / Sie",
            "they / you (formal)"
          ]
        ]
      },
      {
        "title": "2. Formal Sie vs Informal du",
        "type": "notes",
        "notes": [
          "✦ du → friends, family, children, peers",
          "✦ Sie (always capital S) → strangers, bosses, older people",
          "✦ ihr → informal plural (talking to a group of friends)",
          "✦ Wie heißt du? (informal) vs Wie heißen Sie? (formal)"
        ]
      },
      {
        "title": "3. Verb: sein (to be)",
        "type": "table",
        "headers": [
          "Pronomen",
          "sein",
          "Example"
        ],
        "rows": [
          [
            "ich",
            "bin",
            "Ich bin Anna."
          ],
          [
            "du",
            "bist",
            "Du bist müde."
          ],
          [
            "er/sie/es",
            "ist",
            "Er ist Lehrer."
          ],
          [
            "wir",
            "sind",
            "Wir sind hier."
          ],
          [
            "ihr",
            "seid",
            "Ihr seid spät."
          ],
          [
            "sie/Sie",
            "sind",
            "Sie sind nett."
          ]
        ]
      },
      {
        "title": "4. Verb: haben (to have)",
        "type": "table",
        "headers": [
          "Pronomen",
          "haben",
          "Example"
        ],
        "rows": [
          [
            "ich",
            "habe",
            "Ich habe ein Buch."
          ],
          [
            "du",
            "hast",
            "Du hast Zeit."
          ],
          [
            "er/sie/es",
            "hat",
            "Sie hat Hunger."
          ],
          [
            "wir",
            "haben",
            "Wir haben Kinder."
          ],
          [
            "ihr",
            "habt",
            "Ihr habt Glück."
          ],
          [
            "sie/Sie",
            "haben",
            "Sie haben ein Auto."
          ]
        ]
      },
      {
        "title": "5. Regular Verb Conjugation (Präsens)",
        "note": "Remove -en from infinitive → add endings below.",
        "type": "table",
        "headers": [
          "Ending",
          "Example: wohnen",
          "Example: lernen"
        ],
        "rows": [
          [
            "-e  (ich)",
            "ich wohn-e",
            "ich lern-e"
          ],
          [
            "-st  (du)",
            "du wohn-st",
            "du lern-st"
          ],
          [
            "-t  (er/sie/es)",
            "er wohn-t",
            "er lern-t"
          ],
          [
            "-en  (wir)",
            "wir wohn-en",
            "wir lern-en"
          ],
          [
            "-t  (ihr)",
            "ihr wohn-t",
            "ihr lern-t"
          ],
          [
            "-en  (sie/Sie)",
            "sie wohn-en",
            "sie lern-en"
          ]
        ]
      },
      {
        "title": "6. Stem-Changing (Irregular) Verbs",
        "note": "⚠ Only du and er/sie/es forms change. e→i or a→ä.",
        "type": "table",
        "headers": [
          "Verb",
          "ich",
          "du ⚠",
          "er/sie/es ⚠",
          "wir"
        ],
        "rows": [
          [
            "sprechen (speak)",
            "spreche",
            "sprichst",
            "spricht",
            "sprechen"
          ],
          [
            "essen (eat)",
            "esse",
            "isst",
            "isst",
            "essen"
          ],
          [
            "lesen (read)",
            "lese",
            "liest",
            "liest",
            "lesen"
          ],
          [
            "fahren (drive)",
            "fahre",
            "fährst",
            "fährt",
            "fahren"
          ],
          [
            "schlafen (sleep)",
            "schlafe",
            "schläfst",
            "schläft",
            "schlafen"
          ],
          [
            "sehen (see)",
            "sehe",
            "siehst",
            "sieht",
            "sehen"
          ]
        ]
      },
      {
        "title": "7. Articles — Nominativ (Subject)",
        "note": "Nominativ = who/what is the subject of the sentence.",
        "type": "table",
        "headers": [
          "Gender",
          "Definite (the)",
          "Indefinite (a/an)",
          "Negative (no/not a)"
        ],
        "rows": [
          [
            "Maskulin (m)",
            "der",
            "ein",
            "kein"
          ],
          [
            "Feminin (f)",
            "die",
            "eine",
            "keine"
          ],
          [
            "Neutrum (n)",
            "das",
            "ein",
            "kein"
          ],
          [
            "Plural",
            "die",
            "---",
            "keine"
          ]
        ]
      },
      {
        "title": "8. Articles — Akkusativ (Direct Object)",
        "note": "Akkusativ = the thing directly receiving the action. Ask: Wen? Was? (Whom? What?) ⚠ Only MASKULIN changes: der→den, ein→einen, kein→keinen.",
        "type": "table",
        "headers": [
          "Gender",
          "Definite (the)",
          "Indefinite (a/an)",
          "Negative (no)"
        ],
        "rows": [
          [
            "Maskulin (m) ⚠",
            "den",
            "einen",
            "keinen"
          ],
          [
            "Feminin (f)",
            "die",
            "eine",
            "keine"
          ],
          [
            "Neutrum (n)",
            "das",
            "ein",
            "kein"
          ],
          [
            "Plural",
            "die",
            "---",
            "keine"
          ]
        ]
      },
      {
        "title": "9. Nominativ vs Akkusativ — Quick Examples",
        "type": "notes",
        "notes": [
          "✦ Der Mann kauft einen Apfel.  → 'Der Mann' = Nominativ (subject); 'einen Apfel' = Akkusativ (object, maskulin → einen)",
          "✦ Ich sehe die Frau.  → 'die Frau' = Akkusativ (feminin, no change)",
          "✦ Er hat ein Kind.  → 'ein Kind' = Akkusativ (neutrum, no change)",
          "✦ Ich kaufe keinen Kaffee.  → maskulin negation in Akkusativ → keinen"
        ]
      },
      {
        "title": "10. Negation: nicht vs kein",
        "note": "Two ways to say 'no/not' — use the right one!",
        "type": "table",
        "headers": [
          "Rule",
          "Example",
          "Meaning"
        ],
        "rows": [
          [
            "nicht → negates verbs, adjectives, adverbs",
            "Ich arbeite nicht.",
            "I don't work."
          ],
          [
            "nicht → negates specific nouns with definite article",
            "Ich kaufe das Buch nicht.",
            "I'm not buying the book."
          ],
          [
            "kein/keine → negates nouns with indefinite article or no article",
            "Ich habe kein Auto.",
            "I have no car."
          ],
          [
            "kein/keine → also replaces ein/eine",
            "Das ist kein Lehrer.",
            "That's not a teacher."
          ]
        ]
      },
      {
        "title": "11. Noun Plurals — 5 Main Patterns",
        "note": "German plurals are irregular — always learn noun + article + plural together!",
        "type": "table",
        "headers": [
          "Pattern",
          "Example Singular",
          "Example Plural"
        ],
        "rows": [
          [
            "-e  (often maskulin)",
            "der Tag",
            "die Tage"
          ],
          [
            "-(e)n  (often feminin)",
            "die Frau",
            "die Frauen"
          ],
          [
            "-er  (often neutrum)",
            "das Kind",
            "die Kinder"
          ],
          [
            "umlaut + -e",
            "der Mann",
            "die Männer"
          ],
          [
            "-s  (foreign words)",
            "das Auto",
            "die Autos"
          ],
          [
            "no change",
            "der Lehrer",
            "die Lehrer"
          ]
        ]
      },
      {
        "title": "12. Separable Verbs (Trennbare Verben)",
        "note": "Prefix splits off → goes to END of sentence. Infinitive stays together.",
        "type": "table",
        "headers": [
          "Verb",
          "Conjugated Example",
          "Meaning"
        ],
        "rows": [
          [
            "aufstehen",
            "Ich stehe um 7 auf.",
            "to get up"
          ],
          [
            "anrufen",
            "Er ruft seine Mutter an.",
            "to call (phone)"
          ],
          [
            "einkaufen",
            "Wir kaufen heute ein.",
            "to go shopping"
          ],
          [
            "fernsehen",
            "Sie sieht abends fern.",
            "to watch TV"
          ],
          [
            "ankommen",
            "Der Zug kommt an.",
            "to arrive"
          ],
          [
            "mitkommen",
            "Kommst du mit?",
            "to come along"
          ]
        ]
      },
      {
        "title": "13. Sentence Structure (Wortstellung)",
        "type": "notes",
        "notes": [
          "✦ Statement:       Subject → Verb(pos.2) → Rest     |  Ich wohne in Berlin.",
          "✦ Inversion:       Adverb → Verb(pos.2) → Subject   |  Heute wohne ich in Berlin.",
          "✦ Yes/No question: Verb → Subject → Rest?           |  Wohnst du in Berlin?",
          "✦ W-question:      W-Wort → Verb → Subject → Rest?  |  Wo wohnst du?",
          "✦ With separable:  Prefix goes to very end           |  Er ruft um 8 an.",
          "⚠ The conjugated verb is ALWAYS in position 2 in statements."
        ]
      },
      {
        "title": "14. W-Questions (W-Fragen)",
        "type": "table",
        "headers": [
          "Frage",
          "Meaning",
          "Example"
        ],
        "rows": [
          [
            "Wer?",
            "Who?",
            "Wer bist du?"
          ],
          [
            "Was?",
            "What?",
            "Was machst du?"
          ],
          [
            "Wo?",
            "Where? (location)",
            "Wo wohnst du?"
          ],
          [
            "Woher?",
            "Where from?",
            "Woher kommst du?"
          ],
          [
            "Wohin?",
            "Where to?",
            "Wohin gehst du?"
          ],
          [
            "Wann?",
            "When?",
            "Wann kommst du?"
          ],
          [
            "Wie?",
            "How?",
            "Wie heißt du?"
          ],
          [
            "Wie viel?",
            "How much?",
            "Wie viel kostet das?"
          ],
          [
            "Warum?",
            "Why?",
            "Warum lernst du Deutsch?"
          ],
          [
            "Welch-?",
            "Which?",
            "Welchen Kurs machst du?"
          ]
        ]
      }
    ],
    "vocab": [
      {
        "title": "Greetings & Farewells",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "rows": [
          [
            "Guten Morgen",
            "Good morning"
          ],
          [
            "Guten Tag",
            "Good day / Hello"
          ],
          [
            "Guten Abend",
            "Good evening"
          ],
          [
            "Hallo / Hi",
            "Hello / Hi (informal)"
          ],
          [
            "Auf Wiedersehen",
            "Goodbye (formal)"
          ],
          [
            "Tschüss / Tschau",
            "Bye (informal)"
          ],
          [
            "Bis bald / Bis später",
            "See you soon / later"
          ],
          [
            "Bis morgen",
            "See you tomorrow"
          ]
        ]
      },
      {
        "title": "Numbers 0–1000",
        "type": "grid",
        "rows": [
          [
            "0 null",
            "1 eins",
            "2 zwei",
            "3 drei",
            "4 vier",
            "5 fünf"
          ],
          [
            "6 sechs",
            "7 sieben",
            "8 acht",
            "9 neun",
            "10 zehn",
            "11 elf"
          ],
          [
            "12 zwölf",
            "13 dreizehn",
            "14 vierzehn",
            "15 fünfzehn",
            "16 sechzehn",
            "17 siebzehn"
          ],
          [
            "18 achtzehn",
            "19 neunzehn",
            "20 zwanzig",
            "21 einundzwanzig",
            "30 dreißig",
            "40 vierzig"
          ],
          [
            "50 fünfzig",
            "60 sechzig",
            "70 siebzig",
            "80 achtzig",
            "90 neunzig",
            "100 hundert"
          ],
          [
            "200 zweihundert",
            "1000 tausend",
            "",
            "",
            "",
            ""
          ]
        ]
      }
    ],
    "verbs": [
      {
        "title": "Core A1.1 Verb List",
        "type": "table",
        "headers": [
          "Infinitiv",
          "Meaning",
          "Type"
        ],
        "rows": [
          [
            "sein",
            "to be",
            "irregular"
          ],
          [
            "haben",
            "to have",
            "irregular"
          ],
          [
            "heißen",
            "to be called",
            "regular"
          ],
          [
            "kommen",
            "to come",
            "regular"
          ],
          [
            "wohnen",
            "to live/reside",
            "regular"
          ],
          [
            "arbeiten",
            "to work",
            "regular"
          ],
          [
            "lernen",
            "to learn",
            "regular"
          ],
          [
            "machen",
            "to do/make",
            "regular"
          ],
          [
            "schreiben",
            "to write",
            "regular"
          ],
          [
            "lesen",
            "to read",
            "stem-change e→ie"
          ],
          [
            "sprechen",
            "to speak",
            "stem-change e→i"
          ],
          [
            "essen",
            "to eat",
            "stem-change e→i"
          ],
          [
            "fahren",
            "to drive/travel",
            "stem-change a→ä"
          ],
          [
            "gehen",
            "to go (on foot)",
            "regular"
          ],
          [
            "kaufen",
            "to buy",
            "regular"
          ],
          [
            "trinken",
            "to drink",
            "regular"
          ],
          [
            "hören",
            "to hear/listen",
            "regular"
          ],
          [
            "fragen",
            "to ask",
            "regular"
          ],
          [
            "antworten",
            "to answer",
            "regular"
          ],
          [
            "verstehen",
            "to understand",
            "regular"
          ],
          [
            "aufstehen",
            "to get up",
            "separable"
          ],
          [
            "anrufen",
            "to call",
            "separable"
          ],
          [
            "einkaufen",
            "to shop",
            "separable"
          ]
        ]
      }
    ],
    "phrases": [
      {
        "title": "Introductions",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "rows": [
          [
            "Ich heiße … / Mein Name ist …",
            "My name is …"
          ],
          [
            "Ich bin … Jahre alt.",
            "I am … years old."
          ],
          [
            "Ich komme aus …",
            "I come from …"
          ],
          [
            "Ich wohne in …",
            "I live in …"
          ],
          [
            "Ich bin … (Beruf)",
            "I am a … (profession)"
          ],
          [
            "Ich spreche … (Sprache)",
            "I speak … (language)"
          ],
          [
            "Ich buchstabiere: …",
            "I spell it: …"
          ],
          [
            "Ich bin verheiratet / ledig.",
            "I am married / single."
          ],
          [
            "Ich habe … Kinder.",
            "I have … children."
          ]
        ]
      },
      {
        "title": "Classroom & Polite Phrases",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "rows": [
          [
            "Wie bitte?",
            "Pardon? / Could you repeat?"
          ],
          [
            "Ich verstehe nicht.",
            "I don't understand."
          ],
          [
            "Was bedeutet …?",
            "What does … mean?"
          ],
          [
            "Können Sie bitte langsamer sprechen?",
            "Can you please speak slower?"
          ],
          [
            "Bitte.",
            "Please / You're welcome."
          ],
          [
            "Danke / Danke schön.",
            "Thank you / Thank you very much."
          ],
          [
            "Entschuldigung.",
            "Excuse me / Sorry."
          ],
          [
            "Kein Problem.",
            "No problem."
          ]
        ]
      }
    ]
  },
  "A1.2": {
    "grammar": [
      {
        "title": "1. Possessive Articles (Possessivartikel)",
        "note": "Possessive articles work like ein/kein → they follow the same endings.",
        "type": "table",
        "headers": [
          "Pronomen",
          "Maskulin (Nom)",
          "Feminin (Nom)",
          "Neutrum (Nom)",
          "Plural (Nom)"
        ],
        "rows": [
          [
            "ich →",
            "mein",
            "meine",
            "mein",
            "meine"
          ],
          [
            "du →",
            "dein",
            "deine",
            "dein",
            "deine"
          ],
          [
            "er/es →",
            "sein",
            "seine",
            "sein",
            "seine"
          ],
          [
            "sie →",
            "ihr",
            "ihre",
            "ihr",
            "ihre"
          ],
          [
            "wir →",
            "unser",
            "unsere",
            "unser",
            "unsere"
          ],
          [
            "ihr →",
            "euer",
            "eure",
            "euer",
            "eure"
          ],
          [
            "sie/Sie →",
            "ihr/Ihr",
            "ihre/Ihre",
            "ihr/Ihr",
            "ihre/Ihre"
          ]
        ]
      },
      {
        "title": "2. Possessive Articles — Akkusativ",
        "note": "⚠ Only Maskulin changes in Akkusativ: mein→meinen, dein→deinen, etc.",
        "type": "table",
        "headers": [
          "Gender",
          "Nominativ",
          "Akkusativ"
        ],
        "rows": [
          [
            "Maskulin ⚠",
            "mein Vater",
            "meinen Vater"
          ],
          [
            "Feminin",
            "meine Mutter",
            "meine Mutter"
          ],
          [
            "Neutrum",
            "mein Kind",
            "mein Kind"
          ],
          [
            "Plural",
            "meine Eltern",
            "meine Eltern"
          ]
        ]
      },
      {
        "title": "3. Dative Case (Dativ)",
        "note": "Dativ = indirect object. Ask: Wem? (To whom?) Used after prepositions: mit, bei, nach, seit, von, zu, aus, gegenüber.",
        "type": "table",
        "headers": [
          "Gender",
          "Definite (dem/der)",
          "Indefinite (einem/einer)"
        ],
        "rows": [
          [
            "Maskulin",
            "dem",
            "einem"
          ],
          [
            "Feminin",
            "der",
            "einer"
          ],
          [
            "Neutrum",
            "dem",
            "einem"
          ],
          [
            "Plural",
            "den (+n on noun)",
            "--- (keinen)"
          ]
        ]
      },
      {
        "title": "4. All 3 Cases Side by Side",
        "note": "Learn this table — it's the heart of German grammar.",
        "type": "table",
        "headers": [
          "Case",
          "Maskulin",
          "Feminin",
          "Neutrum",
          "Plural"
        ],
        "rows": [
          [
            "Nominativ (Wer?)",
            "der / ein",
            "die / eine",
            "das / ein",
            "die / ---"
          ],
          [
            "Akkusativ (Wen/Was?)",
            "den / einen ⚠",
            "die / eine",
            "das / ein",
            "die / ---"
          ],
          [
            "Dativ (Wem?)",
            "dem / einem",
            "der / einer",
            "dem / einem",
            "den(+n) / ---"
          ]
        ]
      },
      {
        "title": "5. Modal Verbs (Modalverben)",
        "note": "Modal verb goes in position 2 (conjugated). Infinitive goes to END.",
        "type": "table",
        "headers": [
          "Verb",
          "Meaning",
          "ich",
          "du",
          "er/sie/es",
          "wir",
          "ihr",
          "sie/Sie"
        ],
        "rows": [
          [
            "können",
            "can/able to",
            "kann",
            "kannst",
            "kann",
            "können",
            "könnt",
            "können"
          ],
          [
            "müssen",
            "must/have to",
            "muss",
            "musst",
            "muss",
            "müssen",
            "müsst",
            "müssen"
          ],
          [
            "wollen",
            "want to",
            "will",
            "willst",
            "will",
            "wollen",
            "wollt",
            "wollen"
          ],
          [
            "dürfen",
            "may/allowed to",
            "darf",
            "darfst",
            "darf",
            "dürfen",
            "dürft",
            "dürfen"
          ],
          [
            "sollen",
            "should/supposed to",
            "soll",
            "sollst",
            "soll",
            "sollen",
            "sollt",
            "sollen"
          ],
          [
            "möchten",
            "would like to",
            "möchte",
            "möchtest",
            "möchte",
            "möchten",
            "möchtet",
            "möchten"
          ]
        ]
      },
      {
        "title": "6. Modal Verb Sentence Structure",
        "type": "notes",
        "notes": [
          "✦ Modal (pos. 2) + ... + Infinitive (END)",
          "✦ Ich kann gut Deutsch sprechen.  (I can speak German well.)",
          "✦ Er muss heute arbeiten.  (He has to work today.)",
          "✦ Wir möchten einen Kaffee trinken.  (We would like to drink a coffee.)",
          "✦ Negative: Ich kann nicht kommen. / Ich muss nicht arbeiten.",
          "⚠ möchten is technically Konjunktiv II of mögen — treat it as its own verb."
        ]
      },
      {
        "title": "7. Präteritum of sein & haben",
        "note": "These past forms are used in both spoken and written German.",
        "type": "table",
        "headers": [
          "Pronomen",
          "sein (war)",
          "haben (hatte)"
        ],
        "rows": [
          [
            "ich",
            "war",
            "hatte"
          ],
          [
            "du",
            "warst",
            "hattest"
          ],
          [
            "er/sie/es",
            "war",
            "hatte"
          ],
          [
            "wir",
            "waren",
            "hatten"
          ],
          [
            "ihr",
            "wart",
            "hattet"
          ],
          [
            "sie/Sie",
            "waren",
            "hatten"
          ]
        ]
      },
      {
        "title": "8. Perfekt (Conversational Past Tense)",
        "note": "Most verbs use HABEN as auxiliary. Motion/state-change verbs use SEIN.",
        "type": "notes",
        "notes": [
          "✦ Structure: haben/sein (pos. 2) + ... + Partizip II (END)",
          "✦ Ich habe gegessen.  (I have eaten / I ate.)",
          "✦ Er hat gearbeitet.  (He worked.)",
          "✦ Wir sind gegangen.  (We went.) ← sein verb",
          "✦ Sie ist gefahren.  (She drove.) ← sein verb",
          "─── Partizip II formation ───",
          "✦ Regular: ge- + stem + -t  |  machen → gemacht, kaufen → gekauft",
          "✦ Irregular: ge- + stem + -en  |  gehen → gegangen, essen → gegessen",
          "✦ Separable: prefix + ge + stem  |  eingekauft, angerufen",
          "✦ Verbs ending -ieren: no ge-  |  studieren → studiert"
        ]
      },
      {
        "title": "9. Common Partizip II Forms",
        "type": "table",
        "headers": [
          "Infinitiv",
          "Partizip II",
          "Auxiliary"
        ],
        "rows": [
          [
            "machen",
            "gemacht",
            "haben"
          ],
          [
            "kaufen",
            "gekauft",
            "haben"
          ],
          [
            "arbeiten",
            "gearbeitet",
            "haben"
          ],
          [
            "schreiben",
            "geschrieben",
            "haben"
          ],
          [
            "trinken",
            "getrunken",
            "haben"
          ],
          [
            "essen",
            "gegessen",
            "haben"
          ],
          [
            "lesen",
            "gelesen",
            "haben"
          ],
          [
            "sehen",
            "gesehen",
            "haben"
          ],
          [
            "sprechen",
            "gesprochen",
            "haben"
          ],
          [
            "gehen",
            "gegangen",
            "sein"
          ],
          [
            "fahren",
            "gefahren",
            "sein"
          ],
          [
            "kommen",
            "gekommen",
            "sein"
          ],
          [
            "aufstehen",
            "aufgestanden",
            "sein"
          ],
          [
            "sein",
            "gewesen",
            "sein"
          ],
          [
            "haben",
            "gehabt",
            "haben"
          ]
        ]
      },
      {
        "title": "10. Imperative (Imperativ)",
        "note": "Commands. Three forms: du (informal), ihr (group informal), Sie (formal).",
        "type": "table",
        "headers": [
          "Verb",
          "du-form",
          "ihr-form",
          "Sie-form"
        ],
        "rows": [
          [
            "kommen",
            "Komm!",
            "Kommt!",
            "Kommen Sie!"
          ],
          [
            "gehen",
            "Geh!",
            "Geht!",
            "Gehen Sie!"
          ],
          [
            "lesen",
            "Lies!",
            "Lest!",
            "Lesen Sie!"
          ],
          [
            "sprechen",
            "Sprich!",
            "Sprecht!",
            "Sprechen Sie!"
          ],
          [
            "aufstehen",
            "Steh auf!",
            "Steht auf!",
            "Stehen Sie auf!"
          ]
        ],
        "note2": "du-form: remove -en → often remove final -e too. Stem-changers keep the change (sprechen → Sprich!)"
      },
      {
        "title": "11. Prepositions with Dativ",
        "note": "These ALWAYS take Dativ — memorize as a group!",
        "type": "table",
        "headers": [
          "Preposition",
          "Meaning",
          "Example"
        ],
        "rows": [
          [
            "mit",
            "with",
            "Ich fahre mit dem Bus."
          ],
          [
            "bei",
            "at / near / with (someone's place)",
            "Ich bin bei meiner Freundin."
          ],
          [
            "nach",
            "after / to (cities/countries)",
            "Ich fahre nach Berlin."
          ],
          [
            "seit",
            "since / for (time)",
            "Ich lerne seit zwei Jahren Deutsch."
          ],
          [
            "von",
            "from / of / by",
            "Das ist ein Brief von meiner Mutter."
          ],
          [
            "zu",
            "to (people/places)",
            "Ich gehe zum Arzt."
          ],
          [
            "aus",
            "from (origin) / out of",
            "Ich komme aus Iran."
          ],
          [
            "gegenüber",
            "opposite / across from",
            "Die Bank ist gegenüber dem Bahnhof."
          ]
        ]
      },
      {
        "title": "12. Prepositions with Akkusativ",
        "note": "These ALWAYS take Akkusativ — memorize as a group!",
        "type": "table",
        "headers": [
          "Preposition",
          "Meaning",
          "Example"
        ],
        "rows": [
          [
            "durch",
            "through",
            "Wir gehen durch den Park."
          ],
          [
            "für",
            "for",
            "Das ist für meinen Vater."
          ],
          [
            "gegen",
            "against / around (time)",
            "Gegen 8 Uhr."
          ],
          [
            "ohne",
            "without",
            "Kaffee ohne Zucker."
          ],
          [
            "um",
            "around / at (time)",
            "Um 9 Uhr."
          ]
        ]
      },
      {
        "title": "13. Coordinating Conjunctions",
        "note": "These connect two main clauses. Word order does NOT change after them.",
        "type": "table",
        "headers": [
          "Konjunktion",
          "Meaning",
          "Example"
        ],
        "rows": [
          [
            "und",
            "and",
            "Ich arbeite und sie lernt."
          ],
          [
            "oder",
            "or",
            "Kommst du oder bleibst du?"
          ],
          [
            "aber",
            "but",
            "Ich möchte, aber ich kann nicht."
          ],
          [
            "denn",
            "because / for",
            "Ich lerne Deutsch, denn ich brauche es."
          ],
          [
            "sondern",
            "but rather (after negation)",
            "Ich trinke keinen Kaffee, sondern Tee."
          ]
        ]
      },
      {
        "title": "14. Time Expressions (Zeitadverbien)",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "rows": [
          [
            "gestern",
            "yesterday"
          ],
          [
            "heute",
            "today"
          ],
          [
            "morgen",
            "tomorrow"
          ],
          [
            "jetzt / gerade",
            "now / right now"
          ],
          [
            "immer",
            "always"
          ],
          [
            "oft / manchmal",
            "often / sometimes"
          ],
          [
            "selten / nie",
            "rarely / never"
          ],
          [
            "schon / noch nicht",
            "already / not yet"
          ],
          [
            "früh / spät",
            "early / late"
          ]
        ]
      }
    ],
    "vocab": [
      {
        "title": "Family (Familie)",
        "type": "table",
        "headers": [
          "Deutsch",
          "Plural",
          "English"
        ],
        "rows": [
          [
            "der Vater",
            "die Väter",
            "father"
          ],
          [
            "die Mutter",
            "die Mütter",
            "mother"
          ],
          [
            "der Bruder",
            "die Brüder",
            "brother"
          ],
          [
            "die Schwester",
            "die Schwestern",
            "sister"
          ],
          [
            "der Sohn",
            "die Söhne",
            "son"
          ],
          [
            "die Tochter",
            "die Töchter",
            "daughter"
          ],
          [
            "der Mann",
            "die Männer",
            "husband / man"
          ],
          [
            "die Frau",
            "die Frauen",
            "wife / woman"
          ],
          [
            "die Eltern",
            "(plural only)",
            "parents"
          ],
          [
            "die Geschwister",
            "(plural only)",
            "siblings"
          ],
          [
            "der Großvater / Opa",
            "die Großväter",
            "grandfather"
          ],
          [
            "die Großmutter / Oma",
            "die Großmütter",
            "grandmother"
          ]
        ]
      },
      {
        "title": "Days, Months & Time",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "rows": [
          [
            "Montag, Dienstag, Mittwoch",
            "Monday, Tuesday, Wednesday"
          ],
          [
            "Donnerstag, Freitag",
            "Thursday, Friday"
          ],
          [
            "Samstag, Sonntag",
            "Saturday, Sunday"
          ],
          [
            "Januar … Dezember",
            "January … December"
          ],
          [
            "Wie spät ist es?",
            "What time is it?"
          ],
          [
            "Es ist 3 Uhr.",
            "It's 3 o'clock."
          ],
          [
            "Es ist halb vier.",
            "It's half past three. (3:30)"
          ],
          [
            "Es ist Viertel nach zwei.",
            "It's quarter past two."
          ],
          [
            "Es ist Viertel vor fünf.",
            "It's quarter to five."
          ]
        ]
      }
    ],
    "verbs": [
      {
        "title": "New A1.2 Verbs",
        "type": "table",
        "headers": [
          "Infinitiv",
          "Meaning",
          "Partizip II",
          "Auxiliary"
        ],
        "rows": [
          [
            "aufräumen",
            "to tidy up",
            "aufgeräumt",
            "haben"
          ],
          [
            "einladen",
            "to invite",
            "eingeladen",
            "haben"
          ],
          [
            "anziehen",
            "to put on (clothes)",
            "angezogen",
            "haben"
          ],
          [
            "ausziehen",
            "to take off / move out",
            "ausgezogen",
            "haben/sein"
          ],
          [
            "fernsehen",
            "to watch TV",
            "ferngesehen",
            "haben"
          ],
          [
            "besuchen",
            "to visit",
            "besucht",
            "haben"
          ],
          [
            "helfen",
            "to help",
            "geholfen",
            "haben"
          ],
          [
            "schlafen",
            "to sleep",
            "geschlafen",
            "haben"
          ],
          [
            "bleiben",
            "to stay/remain",
            "geblieben",
            "sein"
          ],
          [
            "reisen",
            "to travel",
            "gereist",
            "sein"
          ],
          [
            "mögen",
            "to like",
            "gemocht",
            "haben"
          ],
          [
            "brauchen",
            "to need",
            "gebraucht",
            "haben"
          ]
        ]
      }
    ],
    "phrases": [
      {
        "title": "Talking about the Past",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "rows": [
          [
            "Was hast du gestern gemacht?",
            "What did you do yesterday?"
          ],
          [
            "Ich habe … gegessen/getrunken.",
            "I ate/drank …"
          ],
          [
            "Ich bin ins Kino gegangen.",
            "I went to the cinema."
          ],
          [
            "Ich war zu Hause.",
            "I was at home."
          ],
          [
            "Ich hatte keine Zeit.",
            "I had no time."
          ]
        ]
      },
      {
        "title": "Expressing Wishes & Ability",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "rows": [
          [
            "Ich möchte … bestellen.",
            "I would like to order …"
          ],
          [
            "Kann ich … haben?",
            "Can I have …?"
          ],
          [
            "Ich kann leider nicht kommen.",
            "Unfortunately I can't come."
          ],
          [
            "Ich muss früh aufstehen.",
            "I have to get up early."
          ],
          [
            "Darf ich hier parken?",
            "Am I allowed to park here?"
          ],
          [
            "Du sollst das nicht machen.",
            "You're not supposed to do that."
          ]
        ]
      }
    ]
  },
  "A2.2": {
    "grammar": [
      {
        "title": "1. Passive Voice — Präsens (Passiv Präsens)",
        "note": "Passiv shifts focus from WHO does the action to WHAT is being done. The doer becomes optional (with 'von + Dativ').",
        "type": "table",
        "headers": [
          "Structure",
          "Example",
          "Meaning"
        ],
        "rows": [
          [
            "werden (pos.2) + Partizip II (end)",
            "Das Buch wird gelesen.",
            "The book is being read."
          ],
          [
            "with agent: von + Dativ",
            "Das Buch wird von ihr gelesen.",
            "The book is being read by her."
          ],
          [
            "ich werde + P.II",
            "Ich werde eingeladen.",
            "I am being invited."
          ],
          [
            "du wirst + P.II",
            "Du wirst gefragt.",
            "You are being asked."
          ],
          [
            "er/sie/es wird + P.II",
            "Er wird bezahlt.",
            "He is being paid."
          ],
          [
            "wir werden + P.II",
            "Wir werden informiert.",
            "We are being informed."
          ],
          [
            "ihr werdet + P.II",
            "Ihr werdet gerufen.",
            "You are being called."
          ],
          [
            "sie/Sie werden + P.II",
            "Sie werden erwartet.",
            "They are being expected."
          ]
        ],
        "note2": "Active → Passive: Das Objekt (Akk.) becomes the subject. | Active: Man repariert das Auto. → Passive: Das Auto wird repariert."
      },
      {
        "title": "2. Passive Voice — Präteritum (Passiv Präteritum)",
        "note": "Used for passive in written/past contexts. Replace 'wird' with 'wurde'.",
        "type": "table",
        "headers": [
          "Präsens Passiv",
          "Präteritum Passiv",
          "Meaning"
        ],
        "rows": [
          [
            "wird gebaut",
            "wurde gebaut",
            "is/was being built"
          ],
          [
            "wird geöffnet",
            "wurde geöffnet",
            "is/was being opened"
          ],
          [
            "wird gemacht",
            "wurde gemacht",
            "is/was being done"
          ],
          [
            "wird gefragt",
            "wurde gefragt",
            "is/was being asked"
          ],
          [
            "wird eingeladen",
            "wurde eingeladen",
            "is/was being invited"
          ]
        ],
        "note2": "Full conjugation: ich wurde, du wurdest, er/sie/es wurde, wir wurden, ihr wurdet, sie/Sie wurden — all + Partizip II at end."
      },
      {
        "title": "3. Futur I (werden + Infinitiv)",
        "note": "Used for future plans, predictions, and intentions. In everyday speech, Präsens + time expression is often preferred.",
        "type": "table",
        "headers": [
          "Pronomen",
          "Futur I",
          "Example"
        ],
        "rows": [
          [
            "ich",
            "werde + Inf.",
            "Ich werde morgen kommen."
          ],
          [
            "du",
            "wirst + Inf.",
            "Du wirst es schaffen."
          ],
          [
            "er/sie/es",
            "wird + Inf.",
            "Es wird regnen."
          ],
          [
            "wir",
            "werden + Inf.",
            "Wir werden das lösen."
          ],
          [
            "ihr",
            "werdet + Inf.",
            "Ihr werdet sehen."
          ],
          [
            "sie/Sie",
            "werden + Inf.",
            "Sie werden gewinnen."
          ]
        ],
        "note2": "⚠ Don't confuse Futur I (werden + Infinitiv) with Passiv (werden + Partizip II)! | Futur: Er wird arbeiten. (He will work.) | Passiv: Er wird gefragt. (He is being asked.)"
      },
      {
        "title": "4. Plusquamperfekt (Past Perfect)",
        "note": "Used for an action that happened BEFORE another past action. 'The earlier past.' Formed like Perfekt but with hatte/war instead of habe/bin.",
        "type": "notes",
        "notes": [
          "✦ Structure: hatte/war (conj.) + ... + Partizip II (end)",
          "✦ haben verbs → hatte + P.II  |  Ich hatte das Buch gelesen, bevor er kam.",
          "✦ sein verbs → war + P.II     |  Er war schon gegangen, als ich ankam.",
          "─── Common trigger words ───",
          "✦ nachdem (after) → always triggers Plusquamperfekt in the subordinate clause",
          "    Nachdem er gegessen hatte, ging er schlafen.",
          "✦ bevor (before), als (when/once), weil (because) can also trigger it",
          "─── hatte vs war table ───",
          "✦ ich hatte / war,  du hattest / warst,  er hatte / war",
          "✦ wir hatten / waren,  ihr hattet / wart,  sie hatten / waren"
        ]
      },
      {
        "title": "5. Genitiv Case",
        "note": "Genitiv = possession. Answers: Wessen? (Whose?). Also used after certain prepositions.",
        "type": "table",
        "headers": [
          "Gender",
          "Definite Art.",
          "Indefinite Art.",
          "Noun ending",
          "Example"
        ],
        "rows": [
          [
            "Maskulin",
            "des",
            "eines",
            "+-(e)s",
            "das Auto des Mannes"
          ],
          [
            "Feminin",
            "der",
            "einer",
            "no change",
            "die Tasche der Frau"
          ],
          [
            "Neutrum",
            "des",
            "eines",
            "+-(e)s",
            "der Name des Kindes"
          ],
          [
            "Plural",
            "der",
            "---",
            "no change",
            "die Bücher der Kinder"
          ]
        ],
        "note2": "Common Genitiv prepositions: wegen (because of), während (during), trotz (despite), statt/anstatt (instead of). | Wegen des Wetters blieben wir zu Hause. | Trotz des Regens gingen wir spazieren."
      },
      {
        "title": "6. Indirect Questions (Indirekte Fragen)",
        "note": "Indirect questions are embedded inside a main clause. The question word becomes the subordinating conjunction → verb goes to END.",
        "type": "table",
        "headers": [
          "Direct question",
          "Indirect question",
          "Conjunction"
        ],
        "rows": [
          [
            "Wo wohnt er?",
            "Ich weiß nicht, wo er wohnt.",
            "W-word"
          ],
          [
            "Wann kommt sie?",
            "Ich frage mich, wann sie kommt.",
            "W-word"
          ],
          [
            "Warum lernst du Deutsch?",
            "Er möchte wissen, warum du Deutsch lernst.",
            "W-word"
          ],
          [
            "Kommt er? (yes/no)",
            "Ich weiß nicht, ob er kommt.",
            "ob"
          ],
          [
            "Hat sie angerufen? (yes/no)",
            "Kannst du sagen, ob sie angerufen hat?",
            "ob"
          ]
        ],
        "note2": "Common introductions: Ich weiß nicht, … | Kannst du mir sagen, … | Ich frage mich, … | Er fragt, … | Ich bin nicht sicher, … | Weißt du, …?"
      },
      {
        "title": "7. Präpositionaladverbien (da(r)- & wo(r)-)",
        "note": "Instead of preposition + pronoun for things/ideas, German uses da(r)- compounds. For questions about things, use wo(r)- compounds. (Only for THINGS, not people!)",
        "type": "table",
        "headers": [
          "Preposition",
          "da(r)- form",
          "wo(r)- form",
          "Example"
        ],
        "rows": [
          [
            "auf",
            "darauf",
            "worauf",
            "Ich warte darauf. — Worauf wartest du?"
          ],
          [
            "für",
            "dafür",
            "wofür",
            "Ich bin dafür. — Wofür ist das gut?"
          ],
          [
            "mit",
            "damit",
            "womit",
            "Ich bin damit einverstanden. — Womit schreibst du?"
          ],
          [
            "über",
            "darüber",
            "worüber",
            "Wir reden darüber. — Worüber redet ihr?"
          ],
          [
            "an",
            "daran",
            "woran",
            "Ich denke daran. — Woran denkst du?"
          ],
          [
            "in",
            "darin",
            "worin",
            "Er liegt darin. — Worin liegt das Problem?"
          ],
          [
            "von",
            "davon",
            "wovon",
            "Ich weiß davon nichts. — Wovon sprichst du?"
          ],
          [
            "zu",
            "dazu",
            "wozu",
            "Was sagst du dazu? — Wozu brauchst du das?"
          ]
        ],
        "note2": "⚠ Add -r- when preposition starts with a vowel: darauf, darüber, daran, darin, worauf, worüber. For PEOPLE use: für ihn, mit ihr, auf ihn — NOT dafür/damit for people."
      },
      {
        "title": "8. Verben mit Präpositionen (Verb + Fixed Preposition)",
        "note": "Many German verbs require a fixed preposition. The preposition determines the case. Must be memorized per verb.",
        "type": "table",
        "headers": [
          "Verb + Prep.",
          "Case",
          "Example"
        ],
        "rows": [
          [
            "warten auf",
            "Akk.",
            "Ich warte auf den Bus."
          ],
          [
            "sich freuen auf",
            "Akk.",
            "Ich freue mich auf den Urlaub."
          ],
          [
            "sich freuen über",
            "Akk.",
            "Ich freue mich über das Geschenk."
          ],
          [
            "denken an",
            "Akk.",
            "Ich denke oft an dich."
          ],
          [
            "sich erinnern an",
            "Akk.",
            "Er erinnert sich an die Reise."
          ],
          [
            "sich interessieren für",
            "Akk.",
            "Sie interessiert sich für Musik."
          ],
          [
            "sich ärgern über",
            "Akk.",
            "Er ärgert sich über den Fehler."
          ],
          [
            "sprechen über",
            "Akk.",
            "Wir sprechen über das Problem."
          ],
          [
            "fragen nach",
            "Dat.",
            "Er fragt nach dem Weg."
          ],
          [
            "suchen nach",
            "Dat.",
            "Ich suche nach meinem Schlüssel."
          ],
          [
            "träumen von",
            "Dat.",
            "Sie träumt von einem Urlaub."
          ],
          [
            "sich beschäftigen mit",
            "Dat.",
            "Er beschäftigt sich mit dem Thema."
          ],
          [
            "gehören zu",
            "Dat.",
            "Das gehört zu meinen Aufgaben."
          ],
          [
            "anfangen mit",
            "Dat.",
            "Wir fangen mit der Arbeit an."
          ]
        ]
      },
      {
        "title": "9. Final & Modal Clauses: um…zu, damit, ohne…zu, statt…zu",
        "note": "These express purpose, result without, or alternative action. 'um…zu' and 'ohne…zu' require same subject as main clause — otherwise use 'damit' / 'ohne dass'.",
        "type": "table",
        "headers": [
          "Structure",
          "Meaning",
          "Example"
        ],
        "rows": [
          [
            "um … zu + Inf.",
            "in order to",
            "Ich lerne Deutsch, um in Deutschland zu arbeiten."
          ],
          [
            "ohne … zu + Inf.",
            "without (doing)",
            "Er ging weg, ohne sich zu verabschieden."
          ],
          [
            "(an)statt … zu + Inf.",
            "instead of (doing)",
            "Sie schläft, statt zu lernen."
          ],
          [
            "damit + Nebensatz",
            "so that (different subject)",
            "Ich erkläre es langsam, damit er es versteht."
          ],
          [
            "ohne dass + Nebensatz",
            "without (different subject)",
            "Er geht, ohne dass ich es bemerke."
          ]
        ],
        "note2": "⚠ Same subject → use um/ohne/statt + zu + Inf. | Different subjects → use damit / ohne dass + full subordinate clause (verb at end)."
      },
      {
        "title": "10. Adjective Endings — Without Article (Strong Endings)",
        "note": "When there is NO article before the adjective, the adjective itself must show the gender/case. It takes the endings that der/die/das would have had.",
        "type": "table",
        "headers": [
          "Case",
          "Maskulin",
          "Feminin",
          "Neutrum",
          "Plural"
        ],
        "rows": [
          [
            "Nominativ",
            "kalter Kaffee",
            "frische Milch",
            "heißes Wasser",
            "alte Bücher"
          ],
          [
            "Akkusativ",
            "kalten Kaffee",
            "frische Milch",
            "heißes Wasser",
            "alte Bücher"
          ],
          [
            "Dativ",
            "kaltem Kaffee",
            "frischer Milch",
            "heißem Wasser",
            "alten Büchern"
          ]
        ],
        "note2": "Tip: The strong ending = the definite article ending with the first letter removed (der→-r, die→-e, das→-s, den→-n, dem→-m). Mostly found after: numbers, viel, wenig, einige, mehrere, kein (plural)."
      },
      {
        "title": "11. Verb: lassen",
        "note": "'lassen' has two main uses: (1) to let/allow, (2) to have something done (causative). It behaves like a modal — infinitive goes to end.",
        "type": "table",
        "headers": [
          "Use",
          "Example",
          "Meaning"
        ],
        "rows": [
          [
            "Allow / let",
            "Lass mich das machen.",
            "Let me do that."
          ],
          [
            "Allow / let",
            "Er lässt sie gehen.",
            "He lets her go."
          ],
          [
            "Have sth done (causative)",
            "Ich lasse mein Auto reparieren.",
            "I'm having my car repaired."
          ],
          [
            "Have sth done (causative)",
            "Sie lässt sich die Haare schneiden.",
            "She's having her hair cut."
          ],
          [
            "Leave sth somewhere",
            "Ich habe mein Handy zu Hause gelassen.",
            "I left my phone at home."
          ]
        ],
        "note2": "Conjugation: ich lasse, du lässt, er/sie/es lässt, wir lassen, ihr lasst, sie lassen. | Präteritum: ließ. | Perfekt: hat gelassen (or hat lassen with double infinitive)."
      },
      {
        "title": "12. Connectors: deshalb, trotzdem, deswegen, außerdem",
        "note": "These are Konjunktionaladverbien — they connect two main clauses. They cause INVERSION: the verb stays in position 2, so the subject follows the verb.",
        "type": "table",
        "headers": [
          "Word",
          "Meaning",
          "Example"
        ],
        "rows": [
          [
            "deshalb / deswegen",
            "therefore / that's why",
            "Es regnet. Deshalb bleiben wir zu Hause."
          ],
          [
            "trotzdem",
            "nevertheless / despite that",
            "Es regnet. Trotzdem gehen wir spazieren."
          ],
          [
            "außerdem",
            "besides / in addition",
            "Er ist klug. Außerdem ist er fleißig."
          ],
          [
            "dennoch",
            "yet / still / nonetheless",
            "Es war schwer. Dennoch hat er es geschafft."
          ],
          [
            "allerdings",
            "however / though",
            "Das klingt gut. Allerdings ist es teuer."
          ],
          [
            "sonst",
            "otherwise / or else",
            "Beeil dich, sonst kommen wir zu spät."
          ]
        ],
        "note2": "⚠ Structure after deshalb/trotzdem etc.: [word] + VERB + Subject + rest | 'Deshalb gehe ich.' NOT 'Deshalb ich gehe.' The verb jumps forward!"
      },
      {
        "title": "13. Indefinite Pronouns",
        "note": "These refer to unspecified people or things. 'man' is extremely common in formal German.",
        "type": "table",
        "headers": [
          "Pronomen",
          "Meaning",
          "Example"
        ],
        "rows": [
          [
            "man",
            "one / you / people in general",
            "Man spricht hier Deutsch. (German is spoken here.)"
          ],
          [
            "jemand",
            "someone / somebody",
            "Jemand hat angerufen."
          ],
          [
            "niemand",
            "no one / nobody",
            "Niemand weiß die Antwort."
          ],
          [
            "etwas",
            "something / some",
            "Ich möchte etwas essen."
          ],
          [
            "nichts",
            "nothing",
            "Ich habe nichts verstanden."
          ],
          [
            "alle",
            "all / everyone",
            "Alle sind gekommen."
          ],
          [
            "alles",
            "everything",
            "Alles ist gut."
          ],
          [
            "viele",
            "many (people/things)",
            "Viele lernen Deutsch."
          ],
          [
            "wenige",
            "few (people/things)",
            "Wenige wissen das."
          ],
          [
            "manche",
            "some / several",
            "Manche Leute mögen das."
          ]
        ],
        "note2": "'man' always takes er/sie/es verb form: Man sagt. Man muss. Man hat. | 'jemand/niemand' can take endings in cases: jemanden (Akk.), jemandem (Dat.)."
      },
      {
        "title": "14. Relative Clauses — Dativ & Genitiv",
        "note": "Building on A2.1 Relativsätze (Nom. & Akk.) — now adding Dativ and dessen/deren (Genitiv).",
        "type": "table",
        "headers": [
          "Case",
          "Maskulin",
          "Feminin",
          "Neutrum",
          "Plural"
        ],
        "rows": [
          [
            "Nominativ",
            "der",
            "die",
            "das",
            "die"
          ],
          [
            "Akkusativ",
            "den",
            "die",
            "das",
            "die"
          ],
          [
            "Dativ",
            "dem",
            "der",
            "dem",
            "denen"
          ],
          [
            "Genitiv (whose)",
            "dessen",
            "deren",
            "dessen",
            "deren"
          ]
        ],
        "note2": "Dativ example: Das ist der Mann, dem ich geholfen habe. (That's the man I helped.) | Genitiv example: Das ist die Frau, deren Auto gestohlen wurde. (That's the woman whose car was stolen.)"
      }
    ],
    "vocab": [
      {
        "title": "Work & Career (Beruf & Arbeit)",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "rows": [
          [
            "der Beruf / die Stelle",
            "profession / position/job"
          ],
          [
            "die Bewerbung / der Lebenslauf",
            "application / CV"
          ],
          [
            "das Vorstellungsgespräch",
            "job interview"
          ],
          [
            "der Arbeitgeber / Arbeitnehmer",
            "employer / employee"
          ],
          [
            "die Ausbildung / das Studium",
            "vocational training / university studies"
          ],
          [
            "das Gehalt / der Lohn",
            "salary / wage"
          ],
          [
            "die Überstunden (pl.)",
            "overtime"
          ],
          [
            "kündigen / entlassen werden",
            "to quit / to be fired"
          ],
          [
            "sich bewerben um + Akk.",
            "to apply for"
          ]
        ]
      },
      {
        "title": "Media & Technology (Medien & Technik)",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "rows": [
          [
            "die Nachricht / die Meldung",
            "news item / report"
          ],
          [
            "herunterladen / hochladen",
            "to download / to upload"
          ],
          [
            "die App / die Website / das Netz",
            "app / website / internet"
          ],
          [
            "drucken / speichern / löschen",
            "to print / to save / to delete"
          ],
          [
            "die Datei / der Anhang",
            "file / attachment"
          ],
          [
            "sich anmelden / abmelden",
            "to log in / to log out"
          ],
          [
            "die Verbindung / der Akku",
            "connection / battery"
          ]
        ]
      }
    ],
    "verbs": [
      {
        "title": "A2.2 Key Verbs with Prepositions",
        "type": "table",
        "headers": [
          "Verb + Präp.",
          "Präteritum (ich)",
          "Partizip II",
          "Meaning"
        ],
        "rows": [
          [
            "warten auf (Akk.)",
            "wartete auf",
            "gewartet",
            "to wait for"
          ],
          [
            "sich freuen auf (Akk.)",
            "freute mich auf",
            "gefreut",
            "to look forward to"
          ],
          [
            "denken an (Akk.)",
            "dachte an",
            "gedacht",
            "to think of/about"
          ],
          [
            "sich erinnern an (Akk.)",
            "erinnerte mich an",
            "erinnert",
            "to remember"
          ],
          [
            "sich ärgern über (Akk.)",
            "ärgerte mich über",
            "geärgert",
            "to be annoyed about"
          ],
          [
            "sprechen über (Akk.)",
            "sprach über",
            "gesprochen",
            "to talk about"
          ],
          [
            "sich interessieren für (Akk.)",
            "interessierte mich für",
            "interessiert",
            "to be interested in"
          ],
          [
            "träumen von (Dat.)",
            "träumte von",
            "geträumt",
            "to dream of"
          ],
          [
            "gehören zu (Dat.)",
            "gehörte zu",
            "gehört",
            "to belong to"
          ],
          [
            "lassen",
            "ließ",
            "gelassen",
            "to let / to have done"
          ]
        ]
      }
    ],
    "phrases": [
      {
        "title": "Talking about Passive Events",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "rows": [
          [
            "Das wird (nicht) gemacht.",
            "That is (not) being done."
          ],
          [
            "Es wurde gesagt, dass …",
            "It was said that …"
          ],
          [
            "Hier wird Deutsch gesprochen.",
            "German is spoken here."
          ],
          [
            "Der Brief wurde gestern geschrieben.",
            "The letter was written yesterday."
          ],
          [
            "Das Auto wird repariert.",
            "The car is being repaired."
          ]
        ]
      },
      {
        "title": "Expressing Purpose & Consequence",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "rows": [
          [
            "Ich spare Geld, um ein Auto zu kaufen.",
            "I'm saving money in order to buy a car."
          ],
          [
            "Er lernt viel, damit er besteht.",
            "He studies a lot so that he passes."
          ],
          [
            "Sie ging ohne ein Wort zu sagen.",
            "She left without saying a word."
          ],
          [
            "Statt zu lernen, schläft er.",
            "Instead of studying, he sleeps."
          ],
          [
            "Es hat geregnet. Trotzdem sind wir gegangen.",
            "It rained. Nevertheless we went."
          ],
          [
            "Ich war müde. Deshalb bin ich früh ins Bett.",
            "I was tired. That's why I went to bed early."
          ]
        ]
      },
      {
        "title": "Formal Writing & Email Phrases",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "rows": [
          [
            "Sehr geehrte Damen und Herren,",
            "Dear Sir or Madam,"
          ],
          [
            "Ich schreibe Ihnen bezüglich …",
            "I am writing to you regarding …"
          ],
          [
            "Ich würde mich freuen, wenn …",
            "I would be pleased if …"
          ],
          [
            "Mit freundlichen Grüßen",
            "Yours sincerely / Kind regards"
          ],
          [
            "Ich bewerbe mich um die Stelle als …",
            "I am applying for the position of …"
          ],
          [
            "Für Rückfragen stehe ich gern zur Verfügung.",
            "I am happy to answer any questions."
          ]
        ]
      }
    ]
  },
  "A2.1": {
    "grammar": [
      {
        "title": "1. Präteritum — Regular Verbs",
        "note": "Präteritum = simple past, mainly used in WRITING and formal speech. For conversation, use Perfekt instead (except sein/haben/modals).",
        "type": "table",
        "headers": [
          "Pronomen",
          "machen (regular)",
          "arbeiten (stem ends -t/-d)"
        ],
        "rows": [
          [
            "ich",
            "machte",
            "arbeitete"
          ],
          [
            "du",
            "machtest",
            "arbeitetest"
          ],
          [
            "er/sie/es",
            "machte",
            "arbeitete"
          ],
          [
            "wir",
            "machten",
            "arbeiteten"
          ],
          [
            "ihr",
            "machtet",
            "arbeitetet"
          ],
          [
            "sie/Sie",
            "machten",
            "arbeiteten"
          ]
        ],
        "note2": "Regular formula: stem + -te + personal ending. If stem ends in -t or -d, insert -e- (arbeitete, redete)."
      },
      {
        "title": "2. Präteritum — Key Irregular Verbs",
        "note": "These must be memorized — no predictable pattern. Most common ones below.",
        "type": "table",
        "headers": [
          "Infinitiv",
          "ich",
          "du",
          "er/sie/es",
          "wir",
          "sie/Sie"
        ],
        "rows": [
          [
            "gehen",
            "ging",
            "gingst",
            "ging",
            "gingen",
            "gingen"
          ],
          [
            "kommen",
            "kam",
            "kamst",
            "kam",
            "kamen",
            "kamen"
          ],
          [
            "fahren",
            "fuhr",
            "fuhrst",
            "fuhr",
            "fuhren",
            "fuhren"
          ],
          [
            "schreiben",
            "schrieb",
            "schriebst",
            "schrieb",
            "schrieben",
            "schrieben"
          ],
          [
            "lesen",
            "las",
            "last",
            "las",
            "lasen",
            "lasen"
          ],
          [
            "sprechen",
            "sprach",
            "sprachst",
            "sprach",
            "sprachen",
            "sprachen"
          ],
          [
            "essen",
            "aß",
            "aßest",
            "aß",
            "aßen",
            "aßen"
          ],
          [
            "trinken",
            "trank",
            "trankst",
            "trank",
            "tranken",
            "tranken"
          ],
          [
            "schlafen",
            "schlief",
            "schliefst",
            "schlief",
            "schliefen",
            "schliefen"
          ],
          [
            "stehen",
            "stand",
            "standst",
            "stand",
            "standen",
            "standen"
          ],
          [
            "finden",
            "fand",
            "fandst",
            "fand",
            "fanden",
            "fanden"
          ],
          [
            "nehmen",
            "nahm",
            "nahmst",
            "nahm",
            "nahmen",
            "nahmen"
          ],
          [
            "geben",
            "gab",
            "gabst",
            "gab",
            "gaben",
            "gaben"
          ],
          [
            "wissen",
            "wusste",
            "wusstest",
            "wusste",
            "wussten",
            "wussten"
          ]
        ]
      },
      {
        "title": "3. Präteritum — Modal Verbs",
        "note": "Modal Präteritum is used even in SPOKEN German. More natural than Perfekt for modals.",
        "type": "table",
        "headers": [
          "Modal",
          "ich / er",
          "du",
          "wir / sie",
          "Meaning"
        ],
        "rows": [
          [
            "können",
            "konnte",
            "konntest",
            "konnten",
            "could"
          ],
          [
            "müssen",
            "musste",
            "musstest",
            "mussten",
            "had to"
          ],
          [
            "wollen",
            "wollte",
            "wolltest",
            "wollten",
            "wanted to"
          ],
          [
            "dürfen",
            "durfte",
            "durftest",
            "durften",
            "was allowed to"
          ],
          [
            "sollen",
            "sollte",
            "solltest",
            "sollten",
            "was supposed to"
          ],
          [
            "mögen/möchten",
            "mochte",
            "mochtest",
            "mochten",
            "liked / wanted"
          ]
        ]
      },
      {
        "title": "4. Adjective Endings — After Definite Article (der/die/das)",
        "note": "After der/die/das/diese/jede/welche → only TWO endings: -e or -en. Easy rule: Nom. all genders + Akk. fem/neut = -e. Everything else = -en.",
        "type": "table",
        "headers": [
          "Case",
          "Maskulin",
          "Feminin",
          "Neutrum",
          "Plural"
        ],
        "rows": [
          [
            "Nominativ",
            "der alt-e Mann",
            "die alt-e Frau",
            "das alt-e Kind",
            "die alt-en Kinder"
          ],
          [
            "Akkusativ",
            "den alt-en Mann ⚠",
            "die alt-e Frau",
            "das alt-e Kind",
            "die alt-en Kinder"
          ],
          [
            "Dativ",
            "dem alt-en Mann",
            "der alt-en Frau",
            "dem alt-en Kind",
            "den alt-en Kindern"
          ]
        ]
      },
      {
        "title": "5. Adjective Endings — After Indefinite Article (ein/eine/kein/mein…)",
        "note": "After ein/eine/kein/mein etc. → the adjective must 'show' the gender itself where the article doesn't. Endings: -er/-e/-es in Nominativ; -en in most other cases.",
        "type": "table",
        "headers": [
          "Case",
          "Maskulin",
          "Feminin",
          "Neutrum",
          "Plural (kein-)"
        ],
        "rows": [
          [
            "Nominativ",
            "ein alt-er Mann ⚠",
            "eine alt-e Frau",
            "ein alt-es Kind ⚠",
            "keine alt-en Kinder"
          ],
          [
            "Akkusativ",
            "einen alt-en Mann",
            "eine alt-e Frau",
            "ein alt-es Kind",
            "keine alt-en Kinder"
          ],
          [
            "Dativ",
            "einem alt-en Mann",
            "einer alt-en Frau",
            "einem alt-en Kind",
            "keinen alt-en Kindern"
          ]
        ],
        "note2": "Memory trick: where the article already shows gender (die, der, das, den…), adjective = -en. Where it doesn't (ein, ein), adjective carries the gender signal (-er, -es)."
      },
      {
        "title": "6. Komparativ & Superlativ",
        "note": "Komparativ: adjective + -er. Superlativ: am + adjective + -sten (predicative) OR definite article + adjective + -sten (attributive).",
        "type": "table",
        "headers": [
          "Grundform",
          "Komparativ",
          "Superlativ",
          "English"
        ],
        "rows": [
          [
            "schnell",
            "schneller",
            "am schnellsten",
            "fast → faster → fastest"
          ],
          [
            "groß",
            "größer",
            "am größten",
            "big → bigger → biggest"
          ],
          [
            "alt",
            "älter",
            "am ältesten",
            "old → older → oldest"
          ],
          [
            "jung",
            "jünger",
            "am jüngsten",
            "young → younger → youngest"
          ],
          [
            "warm",
            "wärmer",
            "am wärmsten",
            "warm → warmer → warmest"
          ],
          [
            "lang",
            "länger",
            "am längsten",
            "long → longer → longest"
          ],
          [
            "── IRREGULAR ──",
            "",
            "",
            ""
          ],
          [
            "gut",
            "besser",
            "am besten",
            "good → better → best"
          ],
          [
            "viel",
            "mehr",
            "am meisten",
            "much/many → more → most"
          ],
          [
            "gern",
            "lieber",
            "am liebsten",
            "gladly → prefer → like most"
          ],
          [
            "hoch",
            "höher",
            "am höchsten",
            "high → higher → highest"
          ],
          [
            "nah",
            "näher",
            "am nächsten",
            "near → nearer → nearest"
          ]
        ]
      },
      {
        "title": "7. Comparisons with als & wie",
        "type": "notes",
        "notes": [
          "✦ Equal: genauso … wie  |  Er ist genauso groß wie ich.  (He is as tall as me.)",
          "✦ Not equal: nicht so … wie  |  Sie ist nicht so alt wie er.  (She is not as old as him.)",
          "✦ Unequal (more/less): Komparativ + als  |  Berlin ist größer als München.  (Berlin is bigger than Munich.)",
          "⚠ Never use 'wie' with Komparativ! Wrong: *größer wie. Correct: größer als."
        ]
      },
      {
        "title": "8. Subordinate Clauses — weil, dass, wenn, ob",
        "note": "In a Nebensatz (subordinate clause), the VERB moves to the END.",
        "type": "table",
        "headers": [
          "Konjunktion",
          "Meaning",
          "Example"
        ],
        "rows": [
          [
            "weil",
            "because (reason)",
            "Ich lerne Deutsch, weil ich in Deutschland arbeiten will."
          ],
          [
            "dass",
            "that",
            "Ich glaube, dass er heute kommt."
          ],
          [
            "wenn",
            "when / if (repeated/hypothetical)",
            "Wenn ich Zeit habe, gehe ich ins Kino."
          ],
          [
            "ob",
            "whether / if (indirect yes/no question)",
            "Ich weiß nicht, ob er kommt."
          ],
          [
            "obwohl",
            "although",
            "Ich gehe spazieren, obwohl es regnet."
          ],
          [
            "damit",
            "so that / in order that",
            "Ich lerne viel, damit ich die Prüfung bestehe."
          ]
        ],
        "note2": "Structure: Main clause, [Konjunktion] + Subject + ... + VERB (last). | Ich bleibe zu Hause, weil ich krank bin."
      },
      {
        "title": "9. Temporal Conjunctions: als & wenn",
        "type": "notes",
        "notes": [
          "✦ als → ONE specific past event (always past tense context)",
          "    Als ich Kind war, spielte ich Fußball.  (When I was a child, I played football.)",
          "✦ wenn → repeated events OR future/present",
          "    Wenn ich Ferien habe, fahre ich ans Meer.  (Whenever I have holidays, I go to the sea.)",
          "⚠ Common mistake: using 'wenn' for a single past event. Always use 'als' for: 'when I was young / when it happened'."
        ]
      },
      {
        "title": "10. Wechselpräpositionen (Two-Way Prepositions)",
        "note": "These 9 prepositions take AKKUSATIV for movement/direction (Wohin?) and DATIV for location (Wo?).",
        "type": "table",
        "headers": [
          "Prep.",
          "Meaning",
          "Dativ (Wo?)",
          "Akkusativ (Wohin?)"
        ],
        "rows": [
          [
            "an",
            "at / on (vertical)",
            "Das Bild hängt an der Wand.",
            "Ich hänge das Bild an die Wand."
          ],
          [
            "auf",
            "on (horizontal)",
            "Das Buch liegt auf dem Tisch.",
            "Ich lege das Buch auf den Tisch."
          ],
          [
            "in",
            "in / into",
            "Er ist in der Schule.",
            "Er geht in die Schule."
          ],
          [
            "über",
            "over / above / across",
            "Die Lampe hängt über dem Tisch.",
            "Ich hänge die Lampe über den Tisch."
          ],
          [
            "unter",
            "under / below",
            "Die Katze liegt unter dem Bett.",
            "Die Katze läuft unter das Bett."
          ],
          [
            "vor",
            "in front of / ago",
            "Er steht vor dem Haus.",
            "Er stellt sich vor das Haus."
          ],
          [
            "hinter",
            "behind",
            "Sie steht hinter der Tür.",
            "Sie geht hinter die Tür."
          ],
          [
            "neben",
            "next to / beside",
            "Er sitzt neben mir.",
            "Er setzt sich neben mich."
          ],
          [
            "zwischen",
            "between",
            "Es liegt zwischen den Büchern.",
            "Leg es zwischen die Bücher."
          ]
        ],
        "note2": "Key verbs with Dativ (location): liegen, stehen, hängen, sitzen, sein. Key verbs with Akkusativ (movement): legen, stellen, hängen, setzen, gehen."
      },
      {
        "title": "11. Reflexive Verbs (Reflexivverben)",
        "note": "Reflexive verbs use a reflexive pronoun (sich). The action 'reflects back' on the subject. Most use Akkusativ pronoun; some use Dativ.",
        "type": "table",
        "headers": [
          "Pronomen",
          "Reflexiv (Akk.)",
          "Reflexiv (Dat.)"
        ],
        "rows": [
          [
            "ich",
            "mich",
            "mir"
          ],
          [
            "du",
            "dich",
            "dir"
          ],
          [
            "er/sie/es",
            "sich",
            "sich"
          ],
          [
            "wir",
            "uns",
            "uns"
          ],
          [
            "ihr",
            "euch",
            "euch"
          ],
          [
            "sie/Sie",
            "sich",
            "sich"
          ]
        ],
        "note2": "Common reflexive verbs: sich freuen (to be happy), sich erinnern (to remember), sich befinden (to be located), sich fühlen (to feel), sich beeilen (to hurry), sich waschen (to wash oneself), sich vorstellen (to introduce oneself)."
      },
      {
        "title": "12. Reflexive Verbs — Examples",
        "type": "notes",
        "notes": [
          "✦ Akkusativ reflexive: Ich wasche mich.  (I wash myself.)",
          "✦ Akkusativ reflexive: Er freut sich auf den Urlaub.  (He looks forward to the holiday.)",
          "✦ Dativ reflexive (when there's another object): Ich wasche mir die Hände.  (I wash my hands.)",
          "✦ Dativ reflexive: Kannst du dir das vorstellen?  (Can you imagine that?)",
          "⚠ When another accusative object is present, the reflexive pronoun switches to Dativ."
        ]
      },
      {
        "title": "13. Konjunktiv II — Polite Requests & Hypotheticals",
        "note": "Used for: polite requests, suggestions, wishes, and hypothetical situations. Most common forms: würde + infinitive, könnte, hätte, wäre.",
        "type": "table",
        "headers": [
          "Verb",
          "ich",
          "du",
          "er/sie/es",
          "wir",
          "sie/Sie",
          "Use"
        ],
        "rows": [
          [
            "würde+inf.",
            "würde",
            "würdest",
            "würde",
            "würden",
            "würden",
            "general polite/hypothetical"
          ],
          [
            "können",
            "könnte",
            "könntest",
            "könnte",
            "könnten",
            "könnten",
            "ability / polite request"
          ],
          [
            "haben",
            "hätte",
            "hättest",
            "hätte",
            "hätten",
            "hätten",
            "hypothetical having"
          ],
          [
            "sein",
            "wäre",
            "wärst",
            "wäre",
            "wären",
            "wären",
            "hypothetical being"
          ],
          [
            "müssen",
            "müsste",
            "müsstest",
            "müsste",
            "müssten",
            "müssten",
            "obligation (softer)"
          ],
          [
            "dürfen",
            "dürfte",
            "dürftest",
            "dürfte",
            "dürften",
            "dürften",
            "permission (softer)"
          ]
        ],
        "note2": "Examples: Könnten Sie mir helfen? (Could you help me?) | Ich würde gern mitkommen. (I would like to come along.) | Das wäre schön. (That would be nice.)"
      },
      {
        "title": "14. Relative Clauses (Relativsätze)",
        "note": "A relative clause describes a noun. It starts with a relative pronoun (like 'who/which/that' in English) and the VERB goes to the END.",
        "type": "table",
        "headers": [
          "Case",
          "Maskulin",
          "Feminin",
          "Neutrum",
          "Plural"
        ],
        "rows": [
          [
            "Nominativ (subject of rel. clause)",
            "der",
            "die",
            "das",
            "die"
          ],
          [
            "Akkusativ (object of rel. clause)",
            "den",
            "die",
            "das",
            "die"
          ],
          [
            "Dativ (after dative prepositions)",
            "dem",
            "der",
            "dem",
            "denen"
          ]
        ],
        "note2": "Examples: Das ist der Mann, der hier arbeitet.  (That's the man who works here.) | Ich kenne die Frau, die du meinst.  (I know the woman you mean.) | Das ist das Buch, das ich gelesen habe.  (That's the book that I read.)"
      },
      {
        "title": "15. Infinitiv mit zu",
        "note": "Many verbs and expressions are followed by 'zu + infinitive'. The infinitive goes to the END. With separable verbs: prefix + zu + stem.",
        "type": "notes",
        "notes": [
          "✦ Structure: [main clause] + zu + Infinitiv (at end)",
          "✦ Ich versuche, Deutsch zu lernen.  (I try to learn German.)",
          "✦ Es ist wichtig, pünktlich zu sein.  (It's important to be on time.)",
          "✦ Ich habe keine Lust, aufzuräumen.  (I don't feel like tidying up.) ← separable: auf+zu+räumen",
          "✦ Er vergisst immer, anzurufen.  (He always forgets to call.) ← anzu+rufen",
          "─── Common triggers for 'zu + Inf.' ───",
          "✦ versuchen, vergessen, beginnen, aufhören, vorhaben, planen, hoffen, erlauben",
          "✦ Es ist + adj.: wichtig, schön, einfach, schwierig, möglich, nötig",
          "⚠ After modal verbs (können, müssen…): NO 'zu' — just plain infinitive!"
        ]
      }
    ],
    "vocab": [
      {
        "title": "Health & Body (Gesundheit & Körper)",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "rows": [
          [
            "der Kopf / die Kopfschmerzen",
            "head / headache"
          ],
          [
            "der Bauch / die Bauchschmerzen",
            "stomach / stomachache"
          ],
          [
            "der Rücken / die Rückenschmerzen",
            "back / backache"
          ],
          [
            "das Fieber haben",
            "to have a fever"
          ],
          [
            "sich erkälten",
            "to catch a cold"
          ],
          [
            "der Arzt / die Ärztin",
            "doctor (m/f)"
          ],
          [
            "das Rezept",
            "prescription / recipe"
          ],
          [
            "die Apotheke",
            "pharmacy"
          ],
          [
            "Ich fühle mich nicht wohl.",
            "I don't feel well."
          ],
          [
            "Mir ist schlecht / schwindelig.",
            "I feel sick / dizzy."
          ]
        ]
      },
      {
        "title": "Housing & Directions (Wohnen & Wegbeschreibung)",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "rows": [
          [
            "die Wohnung / das Haus",
            "apartment / house"
          ],
          [
            "das Zimmer / die Küche / das Bad",
            "room / kitchen / bathroom"
          ],
          [
            "der Aufzug / die Treppe",
            "elevator / stairs"
          ],
          [
            "geradeaus / links / rechts",
            "straight ahead / left / right"
          ],
          [
            "an der Ampel / Kreuzung",
            "at the traffic light / intersection"
          ],
          [
            "gegenüber / neben / hinter",
            "opposite / next to / behind"
          ],
          [
            "Wie komme ich zu …?",
            "How do I get to …?"
          ],
          [
            "Das ist in der Nähe von …",
            "That is near …"
          ]
        ]
      }
    ],
    "verbs": [
      {
        "title": "Key A2.1 Verbs + Präteritum",
        "type": "table",
        "headers": [
          "Infinitiv",
          "Präteritum (ich)",
          "Perfekt (ich)",
          "Meaning"
        ],
        "rows": [
          [
            "gehen",
            "ging",
            "bin gegangen",
            "to go"
          ],
          [
            "kommen",
            "kam",
            "bin gekommen",
            "to come"
          ],
          [
            "fahren",
            "fuhr",
            "bin gefahren",
            "to drive/travel"
          ],
          [
            "fliegen",
            "flog",
            "bin geflogen",
            "to fly"
          ],
          [
            "laufen",
            "lief",
            "bin gelaufen",
            "to run/walk"
          ],
          [
            "bleiben",
            "blieb",
            "bin geblieben",
            "to stay"
          ],
          [
            "schreiben",
            "schrieb",
            "habe geschrieben",
            "to write"
          ],
          [
            "lesen",
            "las",
            "habe gelesen",
            "to read"
          ],
          [
            "finden",
            "fand",
            "habe gefunden",
            "to find"
          ],
          [
            "nehmen",
            "nahm",
            "habe genommen",
            "to take"
          ],
          [
            "geben",
            "gab",
            "habe gegeben",
            "to give"
          ],
          [
            "sehen",
            "sah",
            "habe gesehen",
            "to see"
          ],
          [
            "stehen",
            "stand",
            "habe gestanden",
            "to stand"
          ],
          [
            "liegen",
            "lag",
            "habe gelegen",
            "to lie/be located"
          ],
          [
            "sich freuen",
            "freute sich",
            "hat sich gefreut",
            "to be happy/look forward"
          ],
          [
            "sich fühlen",
            "fühlte sich",
            "hat sich gefühlt",
            "to feel"
          ],
          [
            "sich erinnern",
            "erinnerte sich",
            "hat sich erinnert",
            "to remember"
          ],
          [
            "versuchen",
            "versuchte",
            "habe versucht",
            "to try"
          ],
          [
            "vergessen",
            "vergaß",
            "habe vergessen",
            "to forget"
          ],
          [
            "beginnen",
            "begann",
            "habe begonnen",
            "to begin"
          ]
        ]
      }
    ],
    "phrases": [
      {
        "title": "Expressing Opinions & Reasons",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "rows": [
          [
            "Ich finde, dass …",
            "I think that …"
          ],
          [
            "Meiner Meinung nach …",
            "In my opinion …"
          ],
          [
            "Ich bin der Meinung, dass …",
            "I am of the opinion that …"
          ],
          [
            "Das stimmt (nicht).",
            "That is (not) correct."
          ],
          [
            "Ich bin damit einverstanden.",
            "I agree with that."
          ],
          [
            "Ich bin dagegen / dafür.",
            "I'm against it / for it."
          ],
          [
            "Das liegt daran, dass …",
            "That is because …"
          ],
          [
            "Deshalb / Deswegen …",
            "Therefore / That's why …"
          ]
        ]
      },
      {
        "title": "Making Polite Requests (Konjunktiv II)",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "rows": [
          [
            "Könnten Sie mir bitte helfen?",
            "Could you please help me?"
          ],
          [
            "Würden Sie das bitte wiederholen?",
            "Would you please repeat that?"
          ],
          [
            "Ich würde gern … bestellen.",
            "I would like to order …"
          ],
          [
            "Dürfte ich kurz …?",
            "Might I briefly …?"
          ],
          [
            "Hätten Sie einen Moment?",
            "Would you have a moment?"
          ],
          [
            "Das wäre sehr nett.",
            "That would be very kind."
          ],
          [
            "Ich hätte gern …",
            "I would like … (ordering)"
          ]
        ]
      },
      {
        "title": "Describing the Past (Präteritum in use)",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "rows": [
          [
            "Als ich jung war, …",
            "When I was young, …"
          ],
          [
            "Früher hatte ich …",
            "In the past I had …"
          ],
          [
            "Damals wohnte ich in …",
            "Back then I lived in …"
          ],
          [
            "Ich konnte nicht kommen, weil …",
            "I couldn't come because …"
          ],
          [
            "Er wollte, aber er musste arbeiten.",
            "He wanted to, but he had to work."
          ]
        ]
      }
    ]
  }
};
