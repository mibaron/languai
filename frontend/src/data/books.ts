// Retired from active use — kept as reference data for migration to database.
// See seed_content management command for the DB import process.

type SectionItem = { order: number; cells: string[] };
type Section = { title: string; type: string; note?: string; note2?: string; headers?: string[]; items: SectionItem[] };
type LevelContent = Record<string, Section[]>;
type BooksData = Record<string, LevelContent>;

export const BOOKS: BooksData = {
  "A1.1": {
    "grammar": [
      {
        "title": "1. Personal Pronouns — Nominativ",
        "type": "table",
        "note": "These are the SUBJECT pronouns (who is doing the action).",
        "headers": [
          "Pronomen",
          "English"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "ich",
              "I"
            ]
          },
          {
            "order": 1,
            "cells": [
              "du",
              "you (informal)"
            ]
          },
          {
            "order": 2,
            "cells": [
              "er / sie / es",
              "he / she / it"
            ]
          },
          {
            "order": 3,
            "cells": [
              "wir",
              "we"
            ]
          },
          {
            "order": 4,
            "cells": [
              "ihr",
              "you all (informal)"
            ]
          },
          {
            "order": 5,
            "cells": [
              "sie / Sie",
              "they / you (formal)"
            ]
          }
        ]
      },
      {
        "title": "2. Formal Sie vs Informal du",
        "type": "notes",
        "items": [
          {
            "order": 0,
            "cells": [
              "✦ du → friends, family, children, peers"
            ]
          },
          {
            "order": 1,
            "cells": [
              "✦ Sie (always capital S) → strangers, bosses, older people"
            ]
          },
          {
            "order": 2,
            "cells": [
              "✦ ihr → informal plural (talking to a group of friends)"
            ]
          },
          {
            "order": 3,
            "cells": [
              "✦ Wie heißt du? (informal) vs Wie heißen Sie? (formal)"
            ]
          }
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
        "items": [
          {
            "order": 0,
            "cells": [
              "ich",
              "bin",
              "Ich bin Anna."
            ]
          },
          {
            "order": 1,
            "cells": [
              "du",
              "bist",
              "Du bist müde."
            ]
          },
          {
            "order": 2,
            "cells": [
              "er/sie/es",
              "ist",
              "Er ist Lehrer."
            ]
          },
          {
            "order": 3,
            "cells": [
              "wir",
              "sind",
              "Wir sind hier."
            ]
          },
          {
            "order": 4,
            "cells": [
              "ihr",
              "seid",
              "Ihr seid spät."
            ]
          },
          {
            "order": 5,
            "cells": [
              "sie/Sie",
              "sind",
              "Sie sind nett."
            ]
          }
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
        "items": [
          {
            "order": 0,
            "cells": [
              "ich",
              "habe",
              "Ich habe ein Buch."
            ]
          },
          {
            "order": 1,
            "cells": [
              "du",
              "hast",
              "Du hast Zeit."
            ]
          },
          {
            "order": 2,
            "cells": [
              "er/sie/es",
              "hat",
              "Sie hat Hunger."
            ]
          },
          {
            "order": 3,
            "cells": [
              "wir",
              "haben",
              "Wir haben Kinder."
            ]
          },
          {
            "order": 4,
            "cells": [
              "ihr",
              "habt",
              "Ihr habt Glück."
            ]
          },
          {
            "order": 5,
            "cells": [
              "sie/Sie",
              "haben",
              "Sie haben ein Auto."
            ]
          }
        ]
      },
      {
        "title": "5. Regular Verb Conjugation (Präsens)",
        "type": "table",
        "note": "Remove -en from infinitive → add endings below.",
        "headers": [
          "Ending",
          "Example: wohnen",
          "Example: lernen"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "-e  (ich)",
              "ich wohn-e",
              "ich lern-e"
            ]
          },
          {
            "order": 1,
            "cells": [
              "-st  (du)",
              "du wohn-st",
              "du lern-st"
            ]
          },
          {
            "order": 2,
            "cells": [
              "-t  (er/sie/es)",
              "er wohn-t",
              "er lern-t"
            ]
          },
          {
            "order": 3,
            "cells": [
              "-en  (wir)",
              "wir wohn-en",
              "wir lern-en"
            ]
          },
          {
            "order": 4,
            "cells": [
              "-t  (ihr)",
              "ihr wohn-t",
              "ihr lern-t"
            ]
          },
          {
            "order": 5,
            "cells": [
              "-en  (sie/Sie)",
              "sie wohn-en",
              "sie lern-en"
            ]
          }
        ]
      },
      {
        "title": "6. Stem-Changing (Irregular) Verbs",
        "type": "table",
        "note": "⚠ Only du and er/sie/es forms change. e→i or a→ä.",
        "headers": [
          "Verb",
          "ich",
          "du ⚠",
          "er/sie/es ⚠",
          "wir"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "sprechen (speak)",
              "spreche",
              "sprichst",
              "spricht",
              "sprechen"
            ]
          },
          {
            "order": 1,
            "cells": [
              "essen (eat)",
              "esse",
              "isst",
              "isst",
              "essen"
            ]
          },
          {
            "order": 2,
            "cells": [
              "lesen (read)",
              "lese",
              "liest",
              "liest",
              "lesen"
            ]
          },
          {
            "order": 3,
            "cells": [
              "fahren (drive)",
              "fahre",
              "fährst",
              "fährt",
              "fahren"
            ]
          },
          {
            "order": 4,
            "cells": [
              "schlafen (sleep)",
              "schlafe",
              "schläfst",
              "schläft",
              "schlafen"
            ]
          },
          {
            "order": 5,
            "cells": [
              "sehen (see)",
              "sehe",
              "siehst",
              "sieht",
              "sehen"
            ]
          }
        ]
      },
      {
        "title": "7. Articles — Nominativ (Subject)",
        "type": "table",
        "note": "Nominativ = who/what is the subject of the sentence.",
        "headers": [
          "Gender",
          "Definite (the)",
          "Indefinite (a/an)",
          "Negative (no/not a)"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "Maskulin (m)",
              "der",
              "ein",
              "kein"
            ]
          },
          {
            "order": 1,
            "cells": [
              "Feminin (f)",
              "die",
              "eine",
              "keine"
            ]
          },
          {
            "order": 2,
            "cells": [
              "Neutrum (n)",
              "das",
              "ein",
              "kein"
            ]
          },
          {
            "order": 3,
            "cells": [
              "Plural",
              "die",
              "---",
              "keine"
            ]
          }
        ]
      },
      {
        "title": "8. Articles — Akkusativ (Direct Object)",
        "type": "table",
        "note": "Akkusativ = the thing directly receiving the action. Ask: Wen? Was? (Whom? What?) ⚠ Only MASKULIN changes: der→den, ein→einen, kein→keinen.",
        "headers": [
          "Gender",
          "Definite (the)",
          "Indefinite (a/an)",
          "Negative (no)"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "Maskulin (m) ⚠",
              "den",
              "einen",
              "keinen"
            ]
          },
          {
            "order": 1,
            "cells": [
              "Feminin (f)",
              "die",
              "eine",
              "keine"
            ]
          },
          {
            "order": 2,
            "cells": [
              "Neutrum (n)",
              "das",
              "ein",
              "kein"
            ]
          },
          {
            "order": 3,
            "cells": [
              "Plural",
              "die",
              "---",
              "keine"
            ]
          }
        ]
      },
      {
        "title": "9. Nominativ vs Akkusativ — Quick Examples",
        "type": "notes",
        "items": [
          {
            "order": 0,
            "cells": [
              "✦ Der Mann kauft einen Apfel.  → 'Der Mann' = Nominativ (subject); 'einen Apfel' = Akkusativ (object, maskulin → einen)"
            ]
          },
          {
            "order": 1,
            "cells": [
              "✦ Ich sehe die Frau.  → 'die Frau' = Akkusativ (feminin, no change)"
            ]
          },
          {
            "order": 2,
            "cells": [
              "✦ Er hat ein Kind.  → 'ein Kind' = Akkusativ (neutrum, no change)"
            ]
          },
          {
            "order": 3,
            "cells": [
              "✦ Ich kaufe keinen Kaffee.  → maskulin negation in Akkusativ → keinen"
            ]
          }
        ]
      },
      {
        "title": "10. Negation: nicht vs kein",
        "type": "table",
        "note": "Two ways to say 'no/not' — use the right one!",
        "headers": [
          "Rule",
          "Example",
          "Meaning"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "nicht → negates verbs, adjectives, adverbs",
              "Ich arbeite nicht.",
              "I don't work."
            ]
          },
          {
            "order": 1,
            "cells": [
              "nicht → negates specific nouns with definite article",
              "Ich kaufe das Buch nicht.",
              "I'm not buying the book."
            ]
          },
          {
            "order": 2,
            "cells": [
              "kein/keine → negates nouns with indefinite article or no article",
              "Ich habe kein Auto.",
              "I have no car."
            ]
          },
          {
            "order": 3,
            "cells": [
              "kein/keine → also replaces ein/eine",
              "Das ist kein Lehrer.",
              "That's not a teacher."
            ]
          }
        ]
      },
      {
        "title": "11. Noun Plurals — 5 Main Patterns",
        "type": "table",
        "note": "German plurals are irregular — always learn noun + article + plural together!",
        "headers": [
          "Pattern",
          "Example Singular",
          "Example Plural"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "-e  (often maskulin)",
              "der Tag",
              "die Tage"
            ]
          },
          {
            "order": 1,
            "cells": [
              "-(e)n  (often feminin)",
              "die Frau",
              "die Frauen"
            ]
          },
          {
            "order": 2,
            "cells": [
              "-er  (often neutrum)",
              "das Kind",
              "die Kinder"
            ]
          },
          {
            "order": 3,
            "cells": [
              "umlaut + -e",
              "der Mann",
              "die Männer"
            ]
          },
          {
            "order": 4,
            "cells": [
              "-s  (foreign words)",
              "das Auto",
              "die Autos"
            ]
          },
          {
            "order": 5,
            "cells": [
              "no change",
              "der Lehrer",
              "die Lehrer"
            ]
          }
        ]
      },
      {
        "title": "12. Separable Verbs (Trennbare Verben)",
        "type": "table",
        "note": "Prefix splits off → goes to END of sentence. Infinitive stays together.",
        "headers": [
          "Verb",
          "Conjugated Example",
          "Meaning"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "aufstehen",
              "Ich stehe um 7 auf.",
              "to get up"
            ]
          },
          {
            "order": 1,
            "cells": [
              "anrufen",
              "Er ruft seine Mutter an.",
              "to call (phone)"
            ]
          },
          {
            "order": 2,
            "cells": [
              "einkaufen",
              "Wir kaufen heute ein.",
              "to go shopping"
            ]
          },
          {
            "order": 3,
            "cells": [
              "fernsehen",
              "Sie sieht abends fern.",
              "to watch TV"
            ]
          },
          {
            "order": 4,
            "cells": [
              "ankommen",
              "Der Zug kommt an.",
              "to arrive"
            ]
          },
          {
            "order": 5,
            "cells": [
              "mitkommen",
              "Kommst du mit?",
              "to come along"
            ]
          }
        ]
      },
      {
        "title": "13. Sentence Structure (Wortstellung)",
        "type": "notes",
        "items": [
          {
            "order": 0,
            "cells": [
              "✦ Statement:       Subject → Verb(pos.2) → Rest     |  Ich wohne in Berlin."
            ]
          },
          {
            "order": 1,
            "cells": [
              "✦ Inversion:       Adverb → Verb(pos.2) → Subject   |  Heute wohne ich in Berlin."
            ]
          },
          {
            "order": 2,
            "cells": [
              "✦ Yes/No question: Verb → Subject → Rest?           |  Wohnst du in Berlin?"
            ]
          },
          {
            "order": 3,
            "cells": [
              "✦ W-question:      W-Wort → Verb → Subject → Rest?  |  Wo wohnst du?"
            ]
          },
          {
            "order": 4,
            "cells": [
              "✦ With separable:  Prefix goes to very end           |  Er ruft um 8 an."
            ]
          },
          {
            "order": 5,
            "cells": [
              "⚠ The conjugated verb is ALWAYS in position 2 in statements."
            ]
          }
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
        "items": [
          {
            "order": 0,
            "cells": [
              "Wer?",
              "Who?",
              "Wer bist du?"
            ]
          },
          {
            "order": 1,
            "cells": [
              "Was?",
              "What?",
              "Was machst du?"
            ]
          },
          {
            "order": 2,
            "cells": [
              "Wo?",
              "Where? (location)",
              "Wo wohnst du?"
            ]
          },
          {
            "order": 3,
            "cells": [
              "Woher?",
              "Where from?",
              "Woher kommst du?"
            ]
          },
          {
            "order": 4,
            "cells": [
              "Wohin?",
              "Where to?",
              "Wohin gehst du?"
            ]
          },
          {
            "order": 5,
            "cells": [
              "Wann?",
              "When?",
              "Wann kommst du?"
            ]
          },
          {
            "order": 6,
            "cells": [
              "Wie?",
              "How?",
              "Wie heißt du?"
            ]
          },
          {
            "order": 7,
            "cells": [
              "Wie viel?",
              "How much?",
              "Wie viel kostet das?"
            ]
          },
          {
            "order": 8,
            "cells": [
              "Warum?",
              "Why?",
              "Warum lernst du Deutsch?"
            ]
          },
          {
            "order": 9,
            "cells": [
              "Welch-?",
              "Which?",
              "Welchen Kurs machst du?"
            ]
          }
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
        "items": [
          {
            "order": 0,
            "cells": [
              "Guten Morgen",
              "Good morning"
            ]
          },
          {
            "order": 1,
            "cells": [
              "Guten Tag",
              "Good day / Hello"
            ]
          },
          {
            "order": 2,
            "cells": [
              "Guten Abend",
              "Good evening"
            ]
          },
          {
            "order": 3,
            "cells": [
              "Hallo / Hi",
              "Hello / Hi (informal)"
            ]
          },
          {
            "order": 4,
            "cells": [
              "Auf Wiedersehen",
              "Goodbye (formal)"
            ]
          },
          {
            "order": 5,
            "cells": [
              "Tschüss / Tschau",
              "Bye (informal)"
            ]
          },
          {
            "order": 6,
            "cells": [
              "Bis bald / Bis später",
              "See you soon / later"
            ]
          },
          {
            "order": 7,
            "cells": [
              "Bis morgen",
              "See you tomorrow"
            ]
          }
        ]
      },
      {
        "title": "Numbers 0–1000",
        "type": "grid",
        "items": [
          {
            "order": 0,
            "cells": [
              "0 null",
              "1 eins",
              "2 zwei",
              "3 drei",
              "4 vier",
              "5 fünf"
            ]
          },
          {
            "order": 1,
            "cells": [
              "6 sechs",
              "7 sieben",
              "8 acht",
              "9 neun",
              "10 zehn",
              "11 elf"
            ]
          },
          {
            "order": 2,
            "cells": [
              "12 zwölf",
              "13 dreizehn",
              "14 vierzehn",
              "15 fünfzehn",
              "16 sechzehn",
              "17 siebzehn"
            ]
          },
          {
            "order": 3,
            "cells": [
              "18 achtzehn",
              "19 neunzehn",
              "20 zwanzig",
              "21 einundzwanzig",
              "30 dreißig",
              "40 vierzig"
            ]
          },
          {
            "order": 4,
            "cells": [
              "50 fünfzig",
              "60 sechzig",
              "70 siebzig",
              "80 achtzig",
              "90 neunzig",
              "100 hundert"
            ]
          },
          {
            "order": 5,
            "cells": [
              "200 zweihundert",
              "1000 tausend",
              "",
              "",
              "",
              ""
            ]
          }
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
        "items": [
          {
            "order": 0,
            "cells": [
              "sein",
              "to be",
              "irregular"
            ]
          },
          {
            "order": 1,
            "cells": [
              "haben",
              "to have",
              "irregular"
            ]
          },
          {
            "order": 2,
            "cells": [
              "heißen",
              "to be called",
              "regular"
            ]
          },
          {
            "order": 3,
            "cells": [
              "kommen",
              "to come",
              "regular"
            ]
          },
          {
            "order": 4,
            "cells": [
              "wohnen",
              "to live/reside",
              "regular"
            ]
          },
          {
            "order": 5,
            "cells": [
              "arbeiten",
              "to work",
              "regular"
            ]
          },
          {
            "order": 6,
            "cells": [
              "lernen",
              "to learn",
              "regular"
            ]
          },
          {
            "order": 7,
            "cells": [
              "machen",
              "to do/make",
              "regular"
            ]
          },
          {
            "order": 8,
            "cells": [
              "schreiben",
              "to write",
              "regular"
            ]
          },
          {
            "order": 9,
            "cells": [
              "lesen",
              "to read",
              "stem-change e→ie"
            ]
          },
          {
            "order": 10,
            "cells": [
              "sprechen",
              "to speak",
              "stem-change e→i"
            ]
          },
          {
            "order": 11,
            "cells": [
              "essen",
              "to eat",
              "stem-change e→i"
            ]
          },
          {
            "order": 12,
            "cells": [
              "fahren",
              "to drive/travel",
              "stem-change a→ä"
            ]
          },
          {
            "order": 13,
            "cells": [
              "gehen",
              "to go (on foot)",
              "regular"
            ]
          },
          {
            "order": 14,
            "cells": [
              "kaufen",
              "to buy",
              "regular"
            ]
          },
          {
            "order": 15,
            "cells": [
              "trinken",
              "to drink",
              "regular"
            ]
          },
          {
            "order": 16,
            "cells": [
              "hören",
              "to hear/listen",
              "regular"
            ]
          },
          {
            "order": 17,
            "cells": [
              "fragen",
              "to ask",
              "regular"
            ]
          },
          {
            "order": 18,
            "cells": [
              "antworten",
              "to answer",
              "regular"
            ]
          },
          {
            "order": 19,
            "cells": [
              "verstehen",
              "to understand",
              "regular"
            ]
          },
          {
            "order": 20,
            "cells": [
              "aufstehen",
              "to get up",
              "separable"
            ]
          },
          {
            "order": 21,
            "cells": [
              "anrufen",
              "to call",
              "separable"
            ]
          },
          {
            "order": 22,
            "cells": [
              "einkaufen",
              "to shop",
              "separable"
            ]
          }
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
        "items": [
          {
            "order": 0,
            "cells": [
              "Ich heiße … / Mein Name ist …",
              "My name is …"
            ]
          },
          {
            "order": 1,
            "cells": [
              "Ich bin … Jahre alt.",
              "I am … years old."
            ]
          },
          {
            "order": 2,
            "cells": [
              "Ich komme aus …",
              "I come from …"
            ]
          },
          {
            "order": 3,
            "cells": [
              "Ich wohne in …",
              "I live in …"
            ]
          },
          {
            "order": 4,
            "cells": [
              "Ich bin … (Beruf)",
              "I am a … (profession)"
            ]
          },
          {
            "order": 5,
            "cells": [
              "Ich spreche … (Sprache)",
              "I speak … (language)"
            ]
          },
          {
            "order": 6,
            "cells": [
              "Ich buchstabiere: …",
              "I spell it: …"
            ]
          },
          {
            "order": 7,
            "cells": [
              "Ich bin verheiratet / ledig.",
              "I am married / single."
            ]
          },
          {
            "order": 8,
            "cells": [
              "Ich habe … Kinder.",
              "I have … children."
            ]
          }
        ]
      },
      {
        "title": "Classroom & Polite Phrases",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "Wie bitte?",
              "Pardon? / Could you repeat?"
            ]
          },
          {
            "order": 1,
            "cells": [
              "Ich verstehe nicht.",
              "I don't understand."
            ]
          },
          {
            "order": 2,
            "cells": [
              "Was bedeutet …?",
              "What does … mean?"
            ]
          },
          {
            "order": 3,
            "cells": [
              "Können Sie bitte langsamer sprechen?",
              "Can you please speak slower?"
            ]
          },
          {
            "order": 4,
            "cells": [
              "Bitte.",
              "Please / You're welcome."
            ]
          },
          {
            "order": 5,
            "cells": [
              "Danke / Danke schön.",
              "Thank you / Thank you very much."
            ]
          },
          {
            "order": 6,
            "cells": [
              "Entschuldigung.",
              "Excuse me / Sorry."
            ]
          },
          {
            "order": 7,
            "cells": [
              "Kein Problem.",
              "No problem."
            ]
          }
        ]
      }
    ]
  },
  "A1.2": {
    "grammar": [
      {
        "title": "1. Possessive Articles (Possessivartikel)",
        "type": "table",
        "note": "Possessive articles work like ein/kein → they follow the same endings.",
        "headers": [
          "Pronomen",
          "Maskulin (Nom)",
          "Feminin (Nom)",
          "Neutrum (Nom)",
          "Plural (Nom)"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "ich →",
              "mein",
              "meine",
              "mein",
              "meine"
            ]
          },
          {
            "order": 1,
            "cells": [
              "du →",
              "dein",
              "deine",
              "dein",
              "deine"
            ]
          },
          {
            "order": 2,
            "cells": [
              "er/es →",
              "sein",
              "seine",
              "sein",
              "seine"
            ]
          },
          {
            "order": 3,
            "cells": [
              "sie →",
              "ihr",
              "ihre",
              "ihr",
              "ihre"
            ]
          },
          {
            "order": 4,
            "cells": [
              "wir →",
              "unser",
              "unsere",
              "unser",
              "unsere"
            ]
          },
          {
            "order": 5,
            "cells": [
              "ihr →",
              "euer",
              "eure",
              "euer",
              "eure"
            ]
          },
          {
            "order": 6,
            "cells": [
              "sie/Sie →",
              "ihr/Ihr",
              "ihre/Ihre",
              "ihr/Ihr",
              "ihre/Ihre"
            ]
          }
        ]
      },
      {
        "title": "2. Possessive Articles — Akkusativ",
        "type": "table",
        "note": "⚠ Only Maskulin changes in Akkusativ: mein→meinen, dein→deinen, etc.",
        "headers": [
          "Gender",
          "Nominativ",
          "Akkusativ"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "Maskulin ⚠",
              "mein Vater",
              "meinen Vater"
            ]
          },
          {
            "order": 1,
            "cells": [
              "Feminin",
              "meine Mutter",
              "meine Mutter"
            ]
          },
          {
            "order": 2,
            "cells": [
              "Neutrum",
              "mein Kind",
              "mein Kind"
            ]
          },
          {
            "order": 3,
            "cells": [
              "Plural",
              "meine Eltern",
              "meine Eltern"
            ]
          }
        ]
      },
      {
        "title": "3. Dative Case (Dativ)",
        "type": "table",
        "note": "Dativ = indirect object. Ask: Wem? (To whom?) Used after prepositions: mit, bei, nach, seit, von, zu, aus, gegenüber.",
        "headers": [
          "Gender",
          "Definite (dem/der)",
          "Indefinite (einem/einer)"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "Maskulin",
              "dem",
              "einem"
            ]
          },
          {
            "order": 1,
            "cells": [
              "Feminin",
              "der",
              "einer"
            ]
          },
          {
            "order": 2,
            "cells": [
              "Neutrum",
              "dem",
              "einem"
            ]
          },
          {
            "order": 3,
            "cells": [
              "Plural",
              "den (+n on noun)",
              "--- (keinen)"
            ]
          }
        ]
      },
      {
        "title": "4. All 3 Cases Side by Side",
        "type": "table",
        "note": "Learn this table — it's the heart of German grammar.",
        "headers": [
          "Case",
          "Maskulin",
          "Feminin",
          "Neutrum",
          "Plural"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "Nominativ (Wer?)",
              "der / ein",
              "die / eine",
              "das / ein",
              "die / ---"
            ]
          },
          {
            "order": 1,
            "cells": [
              "Akkusativ (Wen/Was?)",
              "den / einen ⚠",
              "die / eine",
              "das / ein",
              "die / ---"
            ]
          },
          {
            "order": 2,
            "cells": [
              "Dativ (Wem?)",
              "dem / einem",
              "der / einer",
              "dem / einem",
              "den(+n) / ---"
            ]
          }
        ]
      },
      {
        "title": "5. Modal Verbs (Modalverben)",
        "type": "table",
        "note": "Modal verb goes in position 2 (conjugated). Infinitive goes to END.",
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
        "items": [
          {
            "order": 0,
            "cells": [
              "können",
              "can/able to",
              "kann",
              "kannst",
              "kann",
              "können",
              "könnt",
              "können"
            ]
          },
          {
            "order": 1,
            "cells": [
              "müssen",
              "must/have to",
              "muss",
              "musst",
              "muss",
              "müssen",
              "müsst",
              "müssen"
            ]
          },
          {
            "order": 2,
            "cells": [
              "wollen",
              "want to",
              "will",
              "willst",
              "will",
              "wollen",
              "wollt",
              "wollen"
            ]
          },
          {
            "order": 3,
            "cells": [
              "dürfen",
              "may/allowed to",
              "darf",
              "darfst",
              "darf",
              "dürfen",
              "dürft",
              "dürfen"
            ]
          },
          {
            "order": 4,
            "cells": [
              "sollen",
              "should/supposed to",
              "soll",
              "sollst",
              "soll",
              "sollen",
              "sollt",
              "sollen"
            ]
          },
          {
            "order": 5,
            "cells": [
              "möchten",
              "would like to",
              "möchte",
              "möchtest",
              "möchte",
              "möchten",
              "möchtet",
              "möchten"
            ]
          }
        ]
      },
      {
        "title": "6. Modal Verb Sentence Structure",
        "type": "notes",
        "items": [
          {
            "order": 0,
            "cells": [
              "✦ Modal (pos. 2) + ... + Infinitive (END)"
            ]
          },
          {
            "order": 1,
            "cells": [
              "✦ Ich kann gut Deutsch sprechen.  (I can speak German well.)"
            ]
          },
          {
            "order": 2,
            "cells": [
              "✦ Er muss heute arbeiten.  (He has to work today.)"
            ]
          },
          {
            "order": 3,
            "cells": [
              "✦ Wir möchten einen Kaffee trinken.  (We would like to drink a coffee.)"
            ]
          },
          {
            "order": 4,
            "cells": [
              "✦ Negative: Ich kann nicht kommen. / Ich muss nicht arbeiten."
            ]
          },
          {
            "order": 5,
            "cells": [
              "⚠ möchten is technically Konjunktiv II of mögen — treat it as its own verb."
            ]
          }
        ]
      },
      {
        "title": "7. Präteritum of sein & haben",
        "type": "table",
        "note": "These past forms are used in both spoken and written German.",
        "headers": [
          "Pronomen",
          "sein (war)",
          "haben (hatte)"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "ich",
              "war",
              "hatte"
            ]
          },
          {
            "order": 1,
            "cells": [
              "du",
              "warst",
              "hattest"
            ]
          },
          {
            "order": 2,
            "cells": [
              "er/sie/es",
              "war",
              "hatte"
            ]
          },
          {
            "order": 3,
            "cells": [
              "wir",
              "waren",
              "hatten"
            ]
          },
          {
            "order": 4,
            "cells": [
              "ihr",
              "wart",
              "hattet"
            ]
          },
          {
            "order": 5,
            "cells": [
              "sie/Sie",
              "waren",
              "hatten"
            ]
          }
        ]
      },
      {
        "title": "8. Perfekt (Conversational Past Tense)",
        "type": "notes",
        "note": "Most verbs use HABEN as auxiliary. Motion/state-change verbs use SEIN.",
        "items": [
          {
            "order": 0,
            "cells": [
              "✦ Structure: haben/sein (pos. 2) + ... + Partizip II (END)"
            ]
          },
          {
            "order": 1,
            "cells": [
              "✦ Ich habe gegessen.  (I have eaten / I ate.)"
            ]
          },
          {
            "order": 2,
            "cells": [
              "✦ Er hat gearbeitet.  (He worked.)"
            ]
          },
          {
            "order": 3,
            "cells": [
              "✦ Wir sind gegangen.  (We went.) ← sein verb"
            ]
          },
          {
            "order": 4,
            "cells": [
              "✦ Sie ist gefahren.  (She drove.) ← sein verb"
            ]
          },
          {
            "order": 5,
            "cells": [
              "─── Partizip II formation ───"
            ]
          },
          {
            "order": 6,
            "cells": [
              "✦ Regular: ge- + stem + -t  |  machen → gemacht, kaufen → gekauft"
            ]
          },
          {
            "order": 7,
            "cells": [
              "✦ Irregular: ge- + stem + -en  |  gehen → gegangen, essen → gegessen"
            ]
          },
          {
            "order": 8,
            "cells": [
              "✦ Separable: prefix + ge + stem  |  eingekauft, angerufen"
            ]
          },
          {
            "order": 9,
            "cells": [
              "✦ Verbs ending -ieren: no ge-  |  studieren → studiert"
            ]
          }
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
        "items": [
          {
            "order": 0,
            "cells": [
              "machen",
              "gemacht",
              "haben"
            ]
          },
          {
            "order": 1,
            "cells": [
              "kaufen",
              "gekauft",
              "haben"
            ]
          },
          {
            "order": 2,
            "cells": [
              "arbeiten",
              "gearbeitet",
              "haben"
            ]
          },
          {
            "order": 3,
            "cells": [
              "schreiben",
              "geschrieben",
              "haben"
            ]
          },
          {
            "order": 4,
            "cells": [
              "trinken",
              "getrunken",
              "haben"
            ]
          },
          {
            "order": 5,
            "cells": [
              "essen",
              "gegessen",
              "haben"
            ]
          },
          {
            "order": 6,
            "cells": [
              "lesen",
              "gelesen",
              "haben"
            ]
          },
          {
            "order": 7,
            "cells": [
              "sehen",
              "gesehen",
              "haben"
            ]
          },
          {
            "order": 8,
            "cells": [
              "sprechen",
              "gesprochen",
              "haben"
            ]
          },
          {
            "order": 9,
            "cells": [
              "gehen",
              "gegangen",
              "sein"
            ]
          },
          {
            "order": 10,
            "cells": [
              "fahren",
              "gefahren",
              "sein"
            ]
          },
          {
            "order": 11,
            "cells": [
              "kommen",
              "gekommen",
              "sein"
            ]
          },
          {
            "order": 12,
            "cells": [
              "aufstehen",
              "aufgestanden",
              "sein"
            ]
          },
          {
            "order": 13,
            "cells": [
              "sein",
              "gewesen",
              "sein"
            ]
          },
          {
            "order": 14,
            "cells": [
              "haben",
              "gehabt",
              "haben"
            ]
          }
        ]
      },
      {
        "title": "10. Imperative (Imperativ)",
        "type": "table",
        "note": "Commands. Three forms: du (informal), ihr (group informal), Sie (formal).",
        "note2": "du-form: remove -en → often remove final -e too. Stem-changers keep the change (sprechen → Sprich!)",
        "headers": [
          "Verb",
          "du-form",
          "ihr-form",
          "Sie-form"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "kommen",
              "Komm!",
              "Kommt!",
              "Kommen Sie!"
            ]
          },
          {
            "order": 1,
            "cells": [
              "gehen",
              "Geh!",
              "Geht!",
              "Gehen Sie!"
            ]
          },
          {
            "order": 2,
            "cells": [
              "lesen",
              "Lies!",
              "Lest!",
              "Lesen Sie!"
            ]
          },
          {
            "order": 3,
            "cells": [
              "sprechen",
              "Sprich!",
              "Sprecht!",
              "Sprechen Sie!"
            ]
          },
          {
            "order": 4,
            "cells": [
              "aufstehen",
              "Steh auf!",
              "Steht auf!",
              "Stehen Sie auf!"
            ]
          }
        ]
      },
      {
        "title": "11. Prepositions with Dativ",
        "type": "table",
        "note": "These ALWAYS take Dativ — memorize as a group!",
        "headers": [
          "Preposition",
          "Meaning",
          "Example"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "mit",
              "with",
              "Ich fahre mit dem Bus."
            ]
          },
          {
            "order": 1,
            "cells": [
              "bei",
              "at / near / with (someone's place)",
              "Ich bin bei meiner Freundin."
            ]
          },
          {
            "order": 2,
            "cells": [
              "nach",
              "after / to (cities/countries)",
              "Ich fahre nach Berlin."
            ]
          },
          {
            "order": 3,
            "cells": [
              "seit",
              "since / for (time)",
              "Ich lerne seit zwei Jahren Deutsch."
            ]
          },
          {
            "order": 4,
            "cells": [
              "von",
              "from / of / by",
              "Das ist ein Brief von meiner Mutter."
            ]
          },
          {
            "order": 5,
            "cells": [
              "zu",
              "to (people/places)",
              "Ich gehe zum Arzt."
            ]
          },
          {
            "order": 6,
            "cells": [
              "aus",
              "from (origin) / out of",
              "Ich komme aus Iran."
            ]
          },
          {
            "order": 7,
            "cells": [
              "gegenüber",
              "opposite / across from",
              "Die Bank ist gegenüber dem Bahnhof."
            ]
          }
        ]
      },
      {
        "title": "12. Prepositions with Akkusativ",
        "type": "table",
        "note": "These ALWAYS take Akkusativ — memorize as a group!",
        "headers": [
          "Preposition",
          "Meaning",
          "Example"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "durch",
              "through",
              "Wir gehen durch den Park."
            ]
          },
          {
            "order": 1,
            "cells": [
              "für",
              "for",
              "Das ist für meinen Vater."
            ]
          },
          {
            "order": 2,
            "cells": [
              "gegen",
              "against / around (time)",
              "Gegen 8 Uhr."
            ]
          },
          {
            "order": 3,
            "cells": [
              "ohne",
              "without",
              "Kaffee ohne Zucker."
            ]
          },
          {
            "order": 4,
            "cells": [
              "um",
              "around / at (time)",
              "Um 9 Uhr."
            ]
          }
        ]
      },
      {
        "title": "13. Coordinating Conjunctions",
        "type": "table",
        "note": "These connect two main clauses. Word order does NOT change after them.",
        "headers": [
          "Konjunktion",
          "Meaning",
          "Example"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "und",
              "and",
              "Ich arbeite und sie lernt."
            ]
          },
          {
            "order": 1,
            "cells": [
              "oder",
              "or",
              "Kommst du oder bleibst du?"
            ]
          },
          {
            "order": 2,
            "cells": [
              "aber",
              "but",
              "Ich möchte, aber ich kann nicht."
            ]
          },
          {
            "order": 3,
            "cells": [
              "denn",
              "because / for",
              "Ich lerne Deutsch, denn ich brauche es."
            ]
          },
          {
            "order": 4,
            "cells": [
              "sondern",
              "but rather (after negation)",
              "Ich trinke keinen Kaffee, sondern Tee."
            ]
          }
        ]
      },
      {
        "title": "14. Time Expressions (Zeitadverbien)",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "gestern",
              "yesterday"
            ]
          },
          {
            "order": 1,
            "cells": [
              "heute",
              "today"
            ]
          },
          {
            "order": 2,
            "cells": [
              "morgen",
              "tomorrow"
            ]
          },
          {
            "order": 3,
            "cells": [
              "jetzt / gerade",
              "now / right now"
            ]
          },
          {
            "order": 4,
            "cells": [
              "immer",
              "always"
            ]
          },
          {
            "order": 5,
            "cells": [
              "oft / manchmal",
              "often / sometimes"
            ]
          },
          {
            "order": 6,
            "cells": [
              "selten / nie",
              "rarely / never"
            ]
          },
          {
            "order": 7,
            "cells": [
              "schon / noch nicht",
              "already / not yet"
            ]
          },
          {
            "order": 8,
            "cells": [
              "früh / spät",
              "early / late"
            ]
          }
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
        "items": [
          {
            "order": 0,
            "cells": [
              "der Vater",
              "die Väter",
              "father"
            ]
          },
          {
            "order": 1,
            "cells": [
              "die Mutter",
              "die Mütter",
              "mother"
            ]
          },
          {
            "order": 2,
            "cells": [
              "der Bruder",
              "die Brüder",
              "brother"
            ]
          },
          {
            "order": 3,
            "cells": [
              "die Schwester",
              "die Schwestern",
              "sister"
            ]
          },
          {
            "order": 4,
            "cells": [
              "der Sohn",
              "die Söhne",
              "son"
            ]
          },
          {
            "order": 5,
            "cells": [
              "die Tochter",
              "die Töchter",
              "daughter"
            ]
          },
          {
            "order": 6,
            "cells": [
              "der Mann",
              "die Männer",
              "husband / man"
            ]
          },
          {
            "order": 7,
            "cells": [
              "die Frau",
              "die Frauen",
              "wife / woman"
            ]
          },
          {
            "order": 8,
            "cells": [
              "die Eltern",
              "(plural only)",
              "parents"
            ]
          },
          {
            "order": 9,
            "cells": [
              "die Geschwister",
              "(plural only)",
              "siblings"
            ]
          },
          {
            "order": 10,
            "cells": [
              "der Großvater / Opa",
              "die Großväter",
              "grandfather"
            ]
          },
          {
            "order": 11,
            "cells": [
              "die Großmutter / Oma",
              "die Großmütter",
              "grandmother"
            ]
          }
        ]
      },
      {
        "title": "Days, Months & Time",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "Montag, Dienstag, Mittwoch",
              "Monday, Tuesday, Wednesday"
            ]
          },
          {
            "order": 1,
            "cells": [
              "Donnerstag, Freitag",
              "Thursday, Friday"
            ]
          },
          {
            "order": 2,
            "cells": [
              "Samstag, Sonntag",
              "Saturday, Sunday"
            ]
          },
          {
            "order": 3,
            "cells": [
              "Januar … Dezember",
              "January … December"
            ]
          },
          {
            "order": 4,
            "cells": [
              "Wie spät ist es?",
              "What time is it?"
            ]
          },
          {
            "order": 5,
            "cells": [
              "Es ist 3 Uhr.",
              "It's 3 o'clock."
            ]
          },
          {
            "order": 6,
            "cells": [
              "Es ist halb vier.",
              "It's half past three. (3:30)"
            ]
          },
          {
            "order": 7,
            "cells": [
              "Es ist Viertel nach zwei.",
              "It's quarter past two."
            ]
          },
          {
            "order": 8,
            "cells": [
              "Es ist Viertel vor fünf.",
              "It's quarter to five."
            ]
          }
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
        "items": [
          {
            "order": 0,
            "cells": [
              "aufräumen",
              "to tidy up",
              "aufgeräumt",
              "haben"
            ]
          },
          {
            "order": 1,
            "cells": [
              "einladen",
              "to invite",
              "eingeladen",
              "haben"
            ]
          },
          {
            "order": 2,
            "cells": [
              "anziehen",
              "to put on (clothes)",
              "angezogen",
              "haben"
            ]
          },
          {
            "order": 3,
            "cells": [
              "ausziehen",
              "to take off / move out",
              "ausgezogen",
              "haben/sein"
            ]
          },
          {
            "order": 4,
            "cells": [
              "fernsehen",
              "to watch TV",
              "ferngesehen",
              "haben"
            ]
          },
          {
            "order": 5,
            "cells": [
              "besuchen",
              "to visit",
              "besucht",
              "haben"
            ]
          },
          {
            "order": 6,
            "cells": [
              "helfen",
              "to help",
              "geholfen",
              "haben"
            ]
          },
          {
            "order": 7,
            "cells": [
              "schlafen",
              "to sleep",
              "geschlafen",
              "haben"
            ]
          },
          {
            "order": 8,
            "cells": [
              "bleiben",
              "to stay/remain",
              "geblieben",
              "sein"
            ]
          },
          {
            "order": 9,
            "cells": [
              "reisen",
              "to travel",
              "gereist",
              "sein"
            ]
          },
          {
            "order": 10,
            "cells": [
              "mögen",
              "to like",
              "gemocht",
              "haben"
            ]
          },
          {
            "order": 11,
            "cells": [
              "brauchen",
              "to need",
              "gebraucht",
              "haben"
            ]
          }
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
        "items": [
          {
            "order": 0,
            "cells": [
              "Was hast du gestern gemacht?",
              "What did you do yesterday?"
            ]
          },
          {
            "order": 1,
            "cells": [
              "Ich habe … gegessen/getrunken.",
              "I ate/drank …"
            ]
          },
          {
            "order": 2,
            "cells": [
              "Ich bin ins Kino gegangen.",
              "I went to the cinema."
            ]
          },
          {
            "order": 3,
            "cells": [
              "Ich war zu Hause.",
              "I was at home."
            ]
          },
          {
            "order": 4,
            "cells": [
              "Ich hatte keine Zeit.",
              "I had no time."
            ]
          }
        ]
      },
      {
        "title": "Expressing Wishes & Ability",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "Ich möchte … bestellen.",
              "I would like to order …"
            ]
          },
          {
            "order": 1,
            "cells": [
              "Kann ich … haben?",
              "Can I have …?"
            ]
          },
          {
            "order": 2,
            "cells": [
              "Ich kann leider nicht kommen.",
              "Unfortunately I can't come."
            ]
          },
          {
            "order": 3,
            "cells": [
              "Ich muss früh aufstehen.",
              "I have to get up early."
            ]
          },
          {
            "order": 4,
            "cells": [
              "Darf ich hier parken?",
              "Am I allowed to park here?"
            ]
          },
          {
            "order": 5,
            "cells": [
              "Du sollst das nicht machen.",
              "You're not supposed to do that."
            ]
          }
        ]
      }
    ]
  },
  "A2.2": {
    "grammar": [
      {
        "title": "1. Passive Voice — Präsens (Passiv Präsens)",
        "type": "table",
        "note": "Passiv shifts focus from WHO does the action to WHAT is being done. The doer becomes optional (with 'von + Dativ').",
        "note2": "Active → Passive: Das Objekt (Akk.) becomes the subject. | Active: Man repariert das Auto. → Passive: Das Auto wird repariert.",
        "headers": [
          "Structure",
          "Example",
          "Meaning"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "werden (pos.2) + Partizip II (end)",
              "Das Buch wird gelesen.",
              "The book is being read."
            ]
          },
          {
            "order": 1,
            "cells": [
              "with agent: von + Dativ",
              "Das Buch wird von ihr gelesen.",
              "The book is being read by her."
            ]
          },
          {
            "order": 2,
            "cells": [
              "ich werde + P.II",
              "Ich werde eingeladen.",
              "I am being invited."
            ]
          },
          {
            "order": 3,
            "cells": [
              "du wirst + P.II",
              "Du wirst gefragt.",
              "You are being asked."
            ]
          },
          {
            "order": 4,
            "cells": [
              "er/sie/es wird + P.II",
              "Er wird bezahlt.",
              "He is being paid."
            ]
          },
          {
            "order": 5,
            "cells": [
              "wir werden + P.II",
              "Wir werden informiert.",
              "We are being informed."
            ]
          },
          {
            "order": 6,
            "cells": [
              "ihr werdet + P.II",
              "Ihr werdet gerufen.",
              "You are being called."
            ]
          },
          {
            "order": 7,
            "cells": [
              "sie/Sie werden + P.II",
              "Sie werden erwartet.",
              "They are being expected."
            ]
          }
        ]
      },
      {
        "title": "2. Passive Voice — Präteritum (Passiv Präteritum)",
        "type": "table",
        "note": "Used for passive in written/past contexts. Replace 'wird' with 'wurde'.",
        "note2": "Full conjugation: ich wurde, du wurdest, er/sie/es wurde, wir wurden, ihr wurdet, sie/Sie wurden — all + Partizip II at end.",
        "headers": [
          "Präsens Passiv",
          "Präteritum Passiv",
          "Meaning"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "wird gebaut",
              "wurde gebaut",
              "is/was being built"
            ]
          },
          {
            "order": 1,
            "cells": [
              "wird geöffnet",
              "wurde geöffnet",
              "is/was being opened"
            ]
          },
          {
            "order": 2,
            "cells": [
              "wird gemacht",
              "wurde gemacht",
              "is/was being done"
            ]
          },
          {
            "order": 3,
            "cells": [
              "wird gefragt",
              "wurde gefragt",
              "is/was being asked"
            ]
          },
          {
            "order": 4,
            "cells": [
              "wird eingeladen",
              "wurde eingeladen",
              "is/was being invited"
            ]
          }
        ]
      },
      {
        "title": "3. Futur I (werden + Infinitiv)",
        "type": "table",
        "note": "Used for future plans, predictions, and intentions. In everyday speech, Präsens + time expression is often preferred.",
        "note2": "⚠ Don't confuse Futur I (werden + Infinitiv) with Passiv (werden + Partizip II)! | Futur: Er wird arbeiten. (He will work.) | Passiv: Er wird gefragt. (He is being asked.)",
        "headers": [
          "Pronomen",
          "Futur I",
          "Example"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "ich",
              "werde + Inf.",
              "Ich werde morgen kommen."
            ]
          },
          {
            "order": 1,
            "cells": [
              "du",
              "wirst + Inf.",
              "Du wirst es schaffen."
            ]
          },
          {
            "order": 2,
            "cells": [
              "er/sie/es",
              "wird + Inf.",
              "Es wird regnen."
            ]
          },
          {
            "order": 3,
            "cells": [
              "wir",
              "werden + Inf.",
              "Wir werden das lösen."
            ]
          },
          {
            "order": 4,
            "cells": [
              "ihr",
              "werdet + Inf.",
              "Ihr werdet sehen."
            ]
          },
          {
            "order": 5,
            "cells": [
              "sie/Sie",
              "werden + Inf.",
              "Sie werden gewinnen."
            ]
          }
        ]
      },
      {
        "title": "4. Plusquamperfekt (Past Perfect)",
        "type": "notes",
        "note": "Used for an action that happened BEFORE another past action. 'The earlier past.' Formed like Perfekt but with hatte/war instead of habe/bin.",
        "items": [
          {
            "order": 0,
            "cells": [
              "✦ Structure: hatte/war (conj.) + ... + Partizip II (end)"
            ]
          },
          {
            "order": 1,
            "cells": [
              "✦ haben verbs → hatte + P.II  |  Ich hatte das Buch gelesen, bevor er kam."
            ]
          },
          {
            "order": 2,
            "cells": [
              "✦ sein verbs → war + P.II     |  Er war schon gegangen, als ich ankam."
            ]
          },
          {
            "order": 3,
            "cells": [
              "─── Common trigger words ───"
            ]
          },
          {
            "order": 4,
            "cells": [
              "✦ nachdem (after) → always triggers Plusquamperfekt in the subordinate clause"
            ]
          },
          {
            "order": 5,
            "cells": [
              "    Nachdem er gegessen hatte, ging er schlafen."
            ]
          },
          {
            "order": 6,
            "cells": [
              "✦ bevor (before), als (when/once), weil (because) can also trigger it"
            ]
          },
          {
            "order": 7,
            "cells": [
              "─── hatte vs war table ───"
            ]
          },
          {
            "order": 8,
            "cells": [
              "✦ ich hatte / war,  du hattest / warst,  er hatte / war"
            ]
          },
          {
            "order": 9,
            "cells": [
              "✦ wir hatten / waren,  ihr hattet / wart,  sie hatten / waren"
            ]
          }
        ]
      },
      {
        "title": "5. Genitiv Case",
        "type": "table",
        "note": "Genitiv = possession. Answers: Wessen? (Whose?). Also used after certain prepositions.",
        "note2": "Common Genitiv prepositions: wegen (because of), während (during), trotz (despite), statt/anstatt (instead of). | Wegen des Wetters blieben wir zu Hause. | Trotz des Regens gingen wir spazieren.",
        "headers": [
          "Gender",
          "Definite Art.",
          "Indefinite Art.",
          "Noun ending",
          "Example"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "Maskulin",
              "des",
              "eines",
              "+-(e)s",
              "das Auto des Mannes"
            ]
          },
          {
            "order": 1,
            "cells": [
              "Feminin",
              "der",
              "einer",
              "no change",
              "die Tasche der Frau"
            ]
          },
          {
            "order": 2,
            "cells": [
              "Neutrum",
              "des",
              "eines",
              "+-(e)s",
              "der Name des Kindes"
            ]
          },
          {
            "order": 3,
            "cells": [
              "Plural",
              "der",
              "---",
              "no change",
              "die Bücher der Kinder"
            ]
          }
        ]
      },
      {
        "title": "6. Indirect Questions (Indirekte Fragen)",
        "type": "table",
        "note": "Indirect questions are embedded inside a main clause. The question word becomes the subordinating conjunction → verb goes to END.",
        "note2": "Common introductions: Ich weiß nicht, … | Kannst du mir sagen, … | Ich frage mich, … | Er fragt, … | Ich bin nicht sicher, … | Weißt du, …?",
        "headers": [
          "Direct question",
          "Indirect question",
          "Conjunction"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "Wo wohnt er?",
              "Ich weiß nicht, wo er wohnt.",
              "W-word"
            ]
          },
          {
            "order": 1,
            "cells": [
              "Wann kommt sie?",
              "Ich frage mich, wann sie kommt.",
              "W-word"
            ]
          },
          {
            "order": 2,
            "cells": [
              "Warum lernst du Deutsch?",
              "Er möchte wissen, warum du Deutsch lernst.",
              "W-word"
            ]
          },
          {
            "order": 3,
            "cells": [
              "Kommt er? (yes/no)",
              "Ich weiß nicht, ob er kommt.",
              "ob"
            ]
          },
          {
            "order": 4,
            "cells": [
              "Hat sie angerufen? (yes/no)",
              "Kannst du sagen, ob sie angerufen hat?",
              "ob"
            ]
          }
        ]
      },
      {
        "title": "7. Präpositionaladverbien (da(r)- & wo(r)-)",
        "type": "table",
        "note": "Instead of preposition + pronoun for things/ideas, German uses da(r)- compounds. For questions about things, use wo(r)- compounds. (Only for THINGS, not people!)",
        "note2": "⚠ Add -r- when preposition starts with a vowel: darauf, darüber, daran, darin, worauf, worüber. For PEOPLE use: für ihn, mit ihr, auf ihn — NOT dafür/damit for people.",
        "headers": [
          "Preposition",
          "da(r)- form",
          "wo(r)- form",
          "Example"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "auf",
              "darauf",
              "worauf",
              "Ich warte darauf. — Worauf wartest du?"
            ]
          },
          {
            "order": 1,
            "cells": [
              "für",
              "dafür",
              "wofür",
              "Ich bin dafür. — Wofür ist das gut?"
            ]
          },
          {
            "order": 2,
            "cells": [
              "mit",
              "damit",
              "womit",
              "Ich bin damit einverstanden. — Womit schreibst du?"
            ]
          },
          {
            "order": 3,
            "cells": [
              "über",
              "darüber",
              "worüber",
              "Wir reden darüber. — Worüber redet ihr?"
            ]
          },
          {
            "order": 4,
            "cells": [
              "an",
              "daran",
              "woran",
              "Ich denke daran. — Woran denkst du?"
            ]
          },
          {
            "order": 5,
            "cells": [
              "in",
              "darin",
              "worin",
              "Er liegt darin. — Worin liegt das Problem?"
            ]
          },
          {
            "order": 6,
            "cells": [
              "von",
              "davon",
              "wovon",
              "Ich weiß davon nichts. — Wovon sprichst du?"
            ]
          },
          {
            "order": 7,
            "cells": [
              "zu",
              "dazu",
              "wozu",
              "Was sagst du dazu? — Wozu brauchst du das?"
            ]
          }
        ]
      },
      {
        "title": "8. Verben mit Präpositionen (Verb + Fixed Preposition)",
        "type": "table",
        "note": "Many German verbs require a fixed preposition. The preposition determines the case. Must be memorized per verb.",
        "headers": [
          "Verb + Prep.",
          "Case",
          "Example"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "warten auf",
              "Akk.",
              "Ich warte auf den Bus."
            ]
          },
          {
            "order": 1,
            "cells": [
              "sich freuen auf",
              "Akk.",
              "Ich freue mich auf den Urlaub."
            ]
          },
          {
            "order": 2,
            "cells": [
              "sich freuen über",
              "Akk.",
              "Ich freue mich über das Geschenk."
            ]
          },
          {
            "order": 3,
            "cells": [
              "denken an",
              "Akk.",
              "Ich denke oft an dich."
            ]
          },
          {
            "order": 4,
            "cells": [
              "sich erinnern an",
              "Akk.",
              "Er erinnert sich an die Reise."
            ]
          },
          {
            "order": 5,
            "cells": [
              "sich interessieren für",
              "Akk.",
              "Sie interessiert sich für Musik."
            ]
          },
          {
            "order": 6,
            "cells": [
              "sich ärgern über",
              "Akk.",
              "Er ärgert sich über den Fehler."
            ]
          },
          {
            "order": 7,
            "cells": [
              "sprechen über",
              "Akk.",
              "Wir sprechen über das Problem."
            ]
          },
          {
            "order": 8,
            "cells": [
              "fragen nach",
              "Dat.",
              "Er fragt nach dem Weg."
            ]
          },
          {
            "order": 9,
            "cells": [
              "suchen nach",
              "Dat.",
              "Ich suche nach meinem Schlüssel."
            ]
          },
          {
            "order": 10,
            "cells": [
              "träumen von",
              "Dat.",
              "Sie träumt von einem Urlaub."
            ]
          },
          {
            "order": 11,
            "cells": [
              "sich beschäftigen mit",
              "Dat.",
              "Er beschäftigt sich mit dem Thema."
            ]
          },
          {
            "order": 12,
            "cells": [
              "gehören zu",
              "Dat.",
              "Das gehört zu meinen Aufgaben."
            ]
          },
          {
            "order": 13,
            "cells": [
              "anfangen mit",
              "Dat.",
              "Wir fangen mit der Arbeit an."
            ]
          }
        ]
      },
      {
        "title": "9. Final & Modal Clauses: um…zu, damit, ohne…zu, statt…zu",
        "type": "table",
        "note": "These express purpose, result without, or alternative action. 'um…zu' and 'ohne…zu' require same subject as main clause — otherwise use 'damit' / 'ohne dass'.",
        "note2": "⚠ Same subject → use um/ohne/statt + zu + Inf. | Different subjects → use damit / ohne dass + full subordinate clause (verb at end).",
        "headers": [
          "Structure",
          "Meaning",
          "Example"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "um … zu + Inf.",
              "in order to",
              "Ich lerne Deutsch, um in Deutschland zu arbeiten."
            ]
          },
          {
            "order": 1,
            "cells": [
              "ohne … zu + Inf.",
              "without (doing)",
              "Er ging weg, ohne sich zu verabschieden."
            ]
          },
          {
            "order": 2,
            "cells": [
              "(an)statt … zu + Inf.",
              "instead of (doing)",
              "Sie schläft, statt zu lernen."
            ]
          },
          {
            "order": 3,
            "cells": [
              "damit + Nebensatz",
              "so that (different subject)",
              "Ich erkläre es langsam, damit er es versteht."
            ]
          },
          {
            "order": 4,
            "cells": [
              "ohne dass + Nebensatz",
              "without (different subject)",
              "Er geht, ohne dass ich es bemerke."
            ]
          }
        ]
      },
      {
        "title": "10. Adjective Endings — Without Article (Strong Endings)",
        "type": "table",
        "note": "When there is NO article before the adjective, the adjective itself must show the gender/case. It takes the endings that der/die/das would have had.",
        "note2": "Tip: The strong ending = the definite article ending with the first letter removed (der→-r, die→-e, das→-s, den→-n, dem→-m). Mostly found after: numbers, viel, wenig, einige, mehrere, kein (plural).",
        "headers": [
          "Case",
          "Maskulin",
          "Feminin",
          "Neutrum",
          "Plural"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "Nominativ",
              "kalter Kaffee",
              "frische Milch",
              "heißes Wasser",
              "alte Bücher"
            ]
          },
          {
            "order": 1,
            "cells": [
              "Akkusativ",
              "kalten Kaffee",
              "frische Milch",
              "heißes Wasser",
              "alte Bücher"
            ]
          },
          {
            "order": 2,
            "cells": [
              "Dativ",
              "kaltem Kaffee",
              "frischer Milch",
              "heißem Wasser",
              "alten Büchern"
            ]
          }
        ]
      },
      {
        "title": "11. Verb: lassen",
        "type": "table",
        "note": "'lassen' has two main uses: (1) to let/allow, (2) to have something done (causative). It behaves like a modal — infinitive goes to end.",
        "note2": "Conjugation: ich lasse, du lässt, er/sie/es lässt, wir lassen, ihr lasst, sie lassen. | Präteritum: ließ. | Perfekt: hat gelassen (or hat lassen with double infinitive).",
        "headers": [
          "Use",
          "Example",
          "Meaning"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "Allow / let",
              "Lass mich das machen.",
              "Let me do that."
            ]
          },
          {
            "order": 1,
            "cells": [
              "Allow / let",
              "Er lässt sie gehen.",
              "He lets her go."
            ]
          },
          {
            "order": 2,
            "cells": [
              "Have sth done (causative)",
              "Ich lasse mein Auto reparieren.",
              "I'm having my car repaired."
            ]
          },
          {
            "order": 3,
            "cells": [
              "Have sth done (causative)",
              "Sie lässt sich die Haare schneiden.",
              "She's having her hair cut."
            ]
          },
          {
            "order": 4,
            "cells": [
              "Leave sth somewhere",
              "Ich habe mein Handy zu Hause gelassen.",
              "I left my phone at home."
            ]
          }
        ]
      },
      {
        "title": "12. Connectors: deshalb, trotzdem, deswegen, außerdem",
        "type": "table",
        "note": "These are Konjunktionaladverbien — they connect two main clauses. They cause INVERSION: the verb stays in position 2, so the subject follows the verb.",
        "note2": "⚠ Structure after deshalb/trotzdem etc.: [word] + VERB + Subject + rest | 'Deshalb gehe ich.' NOT 'Deshalb ich gehe.' The verb jumps forward!",
        "headers": [
          "Word",
          "Meaning",
          "Example"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "deshalb / deswegen",
              "therefore / that's why",
              "Es regnet. Deshalb bleiben wir zu Hause."
            ]
          },
          {
            "order": 1,
            "cells": [
              "trotzdem",
              "nevertheless / despite that",
              "Es regnet. Trotzdem gehen wir spazieren."
            ]
          },
          {
            "order": 2,
            "cells": [
              "außerdem",
              "besides / in addition",
              "Er ist klug. Außerdem ist er fleißig."
            ]
          },
          {
            "order": 3,
            "cells": [
              "dennoch",
              "yet / still / nonetheless",
              "Es war schwer. Dennoch hat er es geschafft."
            ]
          },
          {
            "order": 4,
            "cells": [
              "allerdings",
              "however / though",
              "Das klingt gut. Allerdings ist es teuer."
            ]
          },
          {
            "order": 5,
            "cells": [
              "sonst",
              "otherwise / or else",
              "Beeil dich, sonst kommen wir zu spät."
            ]
          }
        ]
      },
      {
        "title": "13. Indefinite Pronouns",
        "type": "table",
        "note": "These refer to unspecified people or things. 'man' is extremely common in formal German.",
        "note2": "'man' always takes er/sie/es verb form: Man sagt. Man muss. Man hat. | 'jemand/niemand' can take endings in cases: jemanden (Akk.), jemandem (Dat.).",
        "headers": [
          "Pronomen",
          "Meaning",
          "Example"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "man",
              "one / you / people in general",
              "Man spricht hier Deutsch. (German is spoken here.)"
            ]
          },
          {
            "order": 1,
            "cells": [
              "jemand",
              "someone / somebody",
              "Jemand hat angerufen."
            ]
          },
          {
            "order": 2,
            "cells": [
              "niemand",
              "no one / nobody",
              "Niemand weiß die Antwort."
            ]
          },
          {
            "order": 3,
            "cells": [
              "etwas",
              "something / some",
              "Ich möchte etwas essen."
            ]
          },
          {
            "order": 4,
            "cells": [
              "nichts",
              "nothing",
              "Ich habe nichts verstanden."
            ]
          },
          {
            "order": 5,
            "cells": [
              "alle",
              "all / everyone",
              "Alle sind gekommen."
            ]
          },
          {
            "order": 6,
            "cells": [
              "alles",
              "everything",
              "Alles ist gut."
            ]
          },
          {
            "order": 7,
            "cells": [
              "viele",
              "many (people/things)",
              "Viele lernen Deutsch."
            ]
          },
          {
            "order": 8,
            "cells": [
              "wenige",
              "few (people/things)",
              "Wenige wissen das."
            ]
          },
          {
            "order": 9,
            "cells": [
              "manche",
              "some / several",
              "Manche Leute mögen das."
            ]
          }
        ]
      },
      {
        "title": "14. Relative Clauses — Dativ & Genitiv",
        "type": "table",
        "note": "Building on A2.1 Relativsätze (Nom. & Akk.) — now adding Dativ and dessen/deren (Genitiv).",
        "note2": "Dativ example: Das ist der Mann, dem ich geholfen habe. (That's the man I helped.) | Genitiv example: Das ist die Frau, deren Auto gestohlen wurde. (That's the woman whose car was stolen.)",
        "headers": [
          "Case",
          "Maskulin",
          "Feminin",
          "Neutrum",
          "Plural"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "Nominativ",
              "der",
              "die",
              "das",
              "die"
            ]
          },
          {
            "order": 1,
            "cells": [
              "Akkusativ",
              "den",
              "die",
              "das",
              "die"
            ]
          },
          {
            "order": 2,
            "cells": [
              "Dativ",
              "dem",
              "der",
              "dem",
              "denen"
            ]
          },
          {
            "order": 3,
            "cells": [
              "Genitiv (whose)",
              "dessen",
              "deren",
              "dessen",
              "deren"
            ]
          }
        ]
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
        "items": [
          {
            "order": 0,
            "cells": [
              "der Beruf / die Stelle",
              "profession / position/job"
            ]
          },
          {
            "order": 1,
            "cells": [
              "die Bewerbung / der Lebenslauf",
              "application / CV"
            ]
          },
          {
            "order": 2,
            "cells": [
              "das Vorstellungsgespräch",
              "job interview"
            ]
          },
          {
            "order": 3,
            "cells": [
              "der Arbeitgeber / Arbeitnehmer",
              "employer / employee"
            ]
          },
          {
            "order": 4,
            "cells": [
              "die Ausbildung / das Studium",
              "vocational training / university studies"
            ]
          },
          {
            "order": 5,
            "cells": [
              "das Gehalt / der Lohn",
              "salary / wage"
            ]
          },
          {
            "order": 6,
            "cells": [
              "die Überstunden (pl.)",
              "overtime"
            ]
          },
          {
            "order": 7,
            "cells": [
              "kündigen / entlassen werden",
              "to quit / to be fired"
            ]
          },
          {
            "order": 8,
            "cells": [
              "sich bewerben um + Akk.",
              "to apply for"
            ]
          }
        ]
      },
      {
        "title": "Media & Technology (Medien & Technik)",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "die Nachricht / die Meldung",
              "news item / report"
            ]
          },
          {
            "order": 1,
            "cells": [
              "herunterladen / hochladen",
              "to download / to upload"
            ]
          },
          {
            "order": 2,
            "cells": [
              "die App / die Website / das Netz",
              "app / website / internet"
            ]
          },
          {
            "order": 3,
            "cells": [
              "drucken / speichern / löschen",
              "to print / to save / to delete"
            ]
          },
          {
            "order": 4,
            "cells": [
              "die Datei / der Anhang",
              "file / attachment"
            ]
          },
          {
            "order": 5,
            "cells": [
              "sich anmelden / abmelden",
              "to log in / to log out"
            ]
          },
          {
            "order": 6,
            "cells": [
              "die Verbindung / der Akku",
              "connection / battery"
            ]
          }
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
        "items": [
          {
            "order": 0,
            "cells": [
              "warten auf (Akk.)",
              "wartete auf",
              "gewartet",
              "to wait for"
            ]
          },
          {
            "order": 1,
            "cells": [
              "sich freuen auf (Akk.)",
              "freute mich auf",
              "gefreut",
              "to look forward to"
            ]
          },
          {
            "order": 2,
            "cells": [
              "denken an (Akk.)",
              "dachte an",
              "gedacht",
              "to think of/about"
            ]
          },
          {
            "order": 3,
            "cells": [
              "sich erinnern an (Akk.)",
              "erinnerte mich an",
              "erinnert",
              "to remember"
            ]
          },
          {
            "order": 4,
            "cells": [
              "sich ärgern über (Akk.)",
              "ärgerte mich über",
              "geärgert",
              "to be annoyed about"
            ]
          },
          {
            "order": 5,
            "cells": [
              "sprechen über (Akk.)",
              "sprach über",
              "gesprochen",
              "to talk about"
            ]
          },
          {
            "order": 6,
            "cells": [
              "sich interessieren für (Akk.)",
              "interessierte mich für",
              "interessiert",
              "to be interested in"
            ]
          },
          {
            "order": 7,
            "cells": [
              "träumen von (Dat.)",
              "träumte von",
              "geträumt",
              "to dream of"
            ]
          },
          {
            "order": 8,
            "cells": [
              "gehören zu (Dat.)",
              "gehörte zu",
              "gehört",
              "to belong to"
            ]
          },
          {
            "order": 9,
            "cells": [
              "lassen",
              "ließ",
              "gelassen",
              "to let / to have done"
            ]
          }
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
        "items": [
          {
            "order": 0,
            "cells": [
              "Das wird (nicht) gemacht.",
              "That is (not) being done."
            ]
          },
          {
            "order": 1,
            "cells": [
              "Es wurde gesagt, dass …",
              "It was said that …"
            ]
          },
          {
            "order": 2,
            "cells": [
              "Hier wird Deutsch gesprochen.",
              "German is spoken here."
            ]
          },
          {
            "order": 3,
            "cells": [
              "Der Brief wurde gestern geschrieben.",
              "The letter was written yesterday."
            ]
          },
          {
            "order": 4,
            "cells": [
              "Das Auto wird repariert.",
              "The car is being repaired."
            ]
          }
        ]
      },
      {
        "title": "Expressing Purpose & Consequence",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "Ich spare Geld, um ein Auto zu kaufen.",
              "I'm saving money in order to buy a car."
            ]
          },
          {
            "order": 1,
            "cells": [
              "Er lernt viel, damit er besteht.",
              "He studies a lot so that he passes."
            ]
          },
          {
            "order": 2,
            "cells": [
              "Sie ging ohne ein Wort zu sagen.",
              "She left without saying a word."
            ]
          },
          {
            "order": 3,
            "cells": [
              "Statt zu lernen, schläft er.",
              "Instead of studying, he sleeps."
            ]
          },
          {
            "order": 4,
            "cells": [
              "Es hat geregnet. Trotzdem sind wir gegangen.",
              "It rained. Nevertheless we went."
            ]
          },
          {
            "order": 5,
            "cells": [
              "Ich war müde. Deshalb bin ich früh ins Bett.",
              "I was tired. That's why I went to bed early."
            ]
          }
        ]
      },
      {
        "title": "Formal Writing & Email Phrases",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "Sehr geehrte Damen und Herren,",
              "Dear Sir or Madam,"
            ]
          },
          {
            "order": 1,
            "cells": [
              "Ich schreibe Ihnen bezüglich …",
              "I am writing to you regarding …"
            ]
          },
          {
            "order": 2,
            "cells": [
              "Ich würde mich freuen, wenn …",
              "I would be pleased if …"
            ]
          },
          {
            "order": 3,
            "cells": [
              "Mit freundlichen Grüßen",
              "Yours sincerely / Kind regards"
            ]
          },
          {
            "order": 4,
            "cells": [
              "Ich bewerbe mich um die Stelle als …",
              "I am applying for the position of …"
            ]
          },
          {
            "order": 5,
            "cells": [
              "Für Rückfragen stehe ich gern zur Verfügung.",
              "I am happy to answer any questions."
            ]
          }
        ]
      }
    ]
  },
  "A2.1": {
    "grammar": [
      {
        "title": "1. Präteritum — Regular Verbs",
        "type": "table",
        "note": "Präteritum = simple past, mainly used in WRITING and formal speech. For conversation, use Perfekt instead (except sein/haben/modals).",
        "note2": "Regular formula: stem + -te + personal ending. If stem ends in -t or -d, insert -e- (arbeitete, redete).",
        "headers": [
          "Pronomen",
          "machen (regular)",
          "arbeiten (stem ends -t/-d)"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "ich",
              "machte",
              "arbeitete"
            ]
          },
          {
            "order": 1,
            "cells": [
              "du",
              "machtest",
              "arbeitetest"
            ]
          },
          {
            "order": 2,
            "cells": [
              "er/sie/es",
              "machte",
              "arbeitete"
            ]
          },
          {
            "order": 3,
            "cells": [
              "wir",
              "machten",
              "arbeiteten"
            ]
          },
          {
            "order": 4,
            "cells": [
              "ihr",
              "machtet",
              "arbeitetet"
            ]
          },
          {
            "order": 5,
            "cells": [
              "sie/Sie",
              "machten",
              "arbeiteten"
            ]
          }
        ]
      },
      {
        "title": "2. Präteritum — Key Irregular Verbs",
        "type": "table",
        "note": "These must be memorized — no predictable pattern. Most common ones below.",
        "headers": [
          "Infinitiv",
          "ich",
          "du",
          "er/sie/es",
          "wir",
          "sie/Sie"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "gehen",
              "ging",
              "gingst",
              "ging",
              "gingen",
              "gingen"
            ]
          },
          {
            "order": 1,
            "cells": [
              "kommen",
              "kam",
              "kamst",
              "kam",
              "kamen",
              "kamen"
            ]
          },
          {
            "order": 2,
            "cells": [
              "fahren",
              "fuhr",
              "fuhrst",
              "fuhr",
              "fuhren",
              "fuhren"
            ]
          },
          {
            "order": 3,
            "cells": [
              "schreiben",
              "schrieb",
              "schriebst",
              "schrieb",
              "schrieben",
              "schrieben"
            ]
          },
          {
            "order": 4,
            "cells": [
              "lesen",
              "las",
              "last",
              "las",
              "lasen",
              "lasen"
            ]
          },
          {
            "order": 5,
            "cells": [
              "sprechen",
              "sprach",
              "sprachst",
              "sprach",
              "sprachen",
              "sprachen"
            ]
          },
          {
            "order": 6,
            "cells": [
              "essen",
              "aß",
              "aßest",
              "aß",
              "aßen",
              "aßen"
            ]
          },
          {
            "order": 7,
            "cells": [
              "trinken",
              "trank",
              "trankst",
              "trank",
              "tranken",
              "tranken"
            ]
          },
          {
            "order": 8,
            "cells": [
              "schlafen",
              "schlief",
              "schliefst",
              "schlief",
              "schliefen",
              "schliefen"
            ]
          },
          {
            "order": 9,
            "cells": [
              "stehen",
              "stand",
              "standst",
              "stand",
              "standen",
              "standen"
            ]
          },
          {
            "order": 10,
            "cells": [
              "finden",
              "fand",
              "fandst",
              "fand",
              "fanden",
              "fanden"
            ]
          },
          {
            "order": 11,
            "cells": [
              "nehmen",
              "nahm",
              "nahmst",
              "nahm",
              "nahmen",
              "nahmen"
            ]
          },
          {
            "order": 12,
            "cells": [
              "geben",
              "gab",
              "gabst",
              "gab",
              "gaben",
              "gaben"
            ]
          },
          {
            "order": 13,
            "cells": [
              "wissen",
              "wusste",
              "wusstest",
              "wusste",
              "wussten",
              "wussten"
            ]
          }
        ]
      },
      {
        "title": "3. Präteritum — Modal Verbs",
        "type": "table",
        "note": "Modal Präteritum is used even in SPOKEN German. More natural than Perfekt for modals.",
        "headers": [
          "Modal",
          "ich / er",
          "du",
          "wir / sie",
          "Meaning"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "können",
              "konnte",
              "konntest",
              "konnten",
              "could"
            ]
          },
          {
            "order": 1,
            "cells": [
              "müssen",
              "musste",
              "musstest",
              "mussten",
              "had to"
            ]
          },
          {
            "order": 2,
            "cells": [
              "wollen",
              "wollte",
              "wolltest",
              "wollten",
              "wanted to"
            ]
          },
          {
            "order": 3,
            "cells": [
              "dürfen",
              "durfte",
              "durftest",
              "durften",
              "was allowed to"
            ]
          },
          {
            "order": 4,
            "cells": [
              "sollen",
              "sollte",
              "solltest",
              "sollten",
              "was supposed to"
            ]
          },
          {
            "order": 5,
            "cells": [
              "mögen/möchten",
              "mochte",
              "mochtest",
              "mochten",
              "liked / wanted"
            ]
          }
        ]
      },
      {
        "title": "4. Adjective Endings — After Definite Article (der/die/das)",
        "type": "table",
        "note": "After der/die/das/diese/jede/welche → only TWO endings: -e or -en. Easy rule: Nom. all genders + Akk. fem/neut = -e. Everything else = -en.",
        "headers": [
          "Case",
          "Maskulin",
          "Feminin",
          "Neutrum",
          "Plural"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "Nominativ",
              "der alt-e Mann",
              "die alt-e Frau",
              "das alt-e Kind",
              "die alt-en Kinder"
            ]
          },
          {
            "order": 1,
            "cells": [
              "Akkusativ",
              "den alt-en Mann ⚠",
              "die alt-e Frau",
              "das alt-e Kind",
              "die alt-en Kinder"
            ]
          },
          {
            "order": 2,
            "cells": [
              "Dativ",
              "dem alt-en Mann",
              "der alt-en Frau",
              "dem alt-en Kind",
              "den alt-en Kindern"
            ]
          }
        ]
      },
      {
        "title": "5. Adjective Endings — After Indefinite Article (ein/eine/kein/mein…)",
        "type": "table",
        "note": "After ein/eine/kein/mein etc. → the adjective must 'show' the gender itself where the article doesn't. Endings: -er/-e/-es in Nominativ; -en in most other cases.",
        "note2": "Memory trick: where the article already shows gender (die, der, das, den…), adjective = -en. Where it doesn't (ein, ein), adjective carries the gender signal (-er, -es).",
        "headers": [
          "Case",
          "Maskulin",
          "Feminin",
          "Neutrum",
          "Plural (kein-)"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "Nominativ",
              "ein alt-er Mann ⚠",
              "eine alt-e Frau",
              "ein alt-es Kind ⚠",
              "keine alt-en Kinder"
            ]
          },
          {
            "order": 1,
            "cells": [
              "Akkusativ",
              "einen alt-en Mann",
              "eine alt-e Frau",
              "ein alt-es Kind",
              "keine alt-en Kinder"
            ]
          },
          {
            "order": 2,
            "cells": [
              "Dativ",
              "einem alt-en Mann",
              "einer alt-en Frau",
              "einem alt-en Kind",
              "keinen alt-en Kindern"
            ]
          }
        ]
      },
      {
        "title": "6. Komparativ & Superlativ",
        "type": "table",
        "note": "Komparativ: adjective + -er. Superlativ: am + adjective + -sten (predicative) OR definite article + adjective + -sten (attributive).",
        "headers": [
          "Grundform",
          "Komparativ",
          "Superlativ",
          "English"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "schnell",
              "schneller",
              "am schnellsten",
              "fast → faster → fastest"
            ]
          },
          {
            "order": 1,
            "cells": [
              "groß",
              "größer",
              "am größten",
              "big → bigger → biggest"
            ]
          },
          {
            "order": 2,
            "cells": [
              "alt",
              "älter",
              "am ältesten",
              "old → older → oldest"
            ]
          },
          {
            "order": 3,
            "cells": [
              "jung",
              "jünger",
              "am jüngsten",
              "young → younger → youngest"
            ]
          },
          {
            "order": 4,
            "cells": [
              "warm",
              "wärmer",
              "am wärmsten",
              "warm → warmer → warmest"
            ]
          },
          {
            "order": 5,
            "cells": [
              "lang",
              "länger",
              "am längsten",
              "long → longer → longest"
            ]
          },
          {
            "order": 6,
            "cells": [
              "── IRREGULAR ──",
              "",
              "",
              ""
            ]
          },
          {
            "order": 7,
            "cells": [
              "gut",
              "besser",
              "am besten",
              "good → better → best"
            ]
          },
          {
            "order": 8,
            "cells": [
              "viel",
              "mehr",
              "am meisten",
              "much/many → more → most"
            ]
          },
          {
            "order": 9,
            "cells": [
              "gern",
              "lieber",
              "am liebsten",
              "gladly → prefer → like most"
            ]
          },
          {
            "order": 10,
            "cells": [
              "hoch",
              "höher",
              "am höchsten",
              "high → higher → highest"
            ]
          },
          {
            "order": 11,
            "cells": [
              "nah",
              "näher",
              "am nächsten",
              "near → nearer → nearest"
            ]
          }
        ]
      },
      {
        "title": "7. Comparisons with als & wie",
        "type": "notes",
        "items": [
          {
            "order": 0,
            "cells": [
              "✦ Equal: genauso … wie  |  Er ist genauso groß wie ich.  (He is as tall as me.)"
            ]
          },
          {
            "order": 1,
            "cells": [
              "✦ Not equal: nicht so … wie  |  Sie ist nicht so alt wie er.  (She is not as old as him.)"
            ]
          },
          {
            "order": 2,
            "cells": [
              "✦ Unequal (more/less): Komparativ + als  |  Berlin ist größer als München.  (Berlin is bigger than Munich.)"
            ]
          },
          {
            "order": 3,
            "cells": [
              "⚠ Never use 'wie' with Komparativ! Wrong: *größer wie. Correct: größer als."
            ]
          }
        ]
      },
      {
        "title": "8. Subordinate Clauses — weil, dass, wenn, ob",
        "type": "table",
        "note": "In a Nebensatz (subordinate clause), the VERB moves to the END.",
        "note2": "Structure: Main clause, [Konjunktion] + Subject + ... + VERB (last). | Ich bleibe zu Hause, weil ich krank bin.",
        "headers": [
          "Konjunktion",
          "Meaning",
          "Example"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "weil",
              "because (reason)",
              "Ich lerne Deutsch, weil ich in Deutschland arbeiten will."
            ]
          },
          {
            "order": 1,
            "cells": [
              "dass",
              "that",
              "Ich glaube, dass er heute kommt."
            ]
          },
          {
            "order": 2,
            "cells": [
              "wenn",
              "when / if (repeated/hypothetical)",
              "Wenn ich Zeit habe, gehe ich ins Kino."
            ]
          },
          {
            "order": 3,
            "cells": [
              "ob",
              "whether / if (indirect yes/no question)",
              "Ich weiß nicht, ob er kommt."
            ]
          },
          {
            "order": 4,
            "cells": [
              "obwohl",
              "although",
              "Ich gehe spazieren, obwohl es regnet."
            ]
          },
          {
            "order": 5,
            "cells": [
              "damit",
              "so that / in order that",
              "Ich lerne viel, damit ich die Prüfung bestehe."
            ]
          }
        ]
      },
      {
        "title": "9. Temporal Conjunctions: als & wenn",
        "type": "notes",
        "items": [
          {
            "order": 0,
            "cells": [
              "✦ als → ONE specific past event (always past tense context)"
            ]
          },
          {
            "order": 1,
            "cells": [
              "    Als ich Kind war, spielte ich Fußball.  (When I was a child, I played football.)"
            ]
          },
          {
            "order": 2,
            "cells": [
              "✦ wenn → repeated events OR future/present"
            ]
          },
          {
            "order": 3,
            "cells": [
              "    Wenn ich Ferien habe, fahre ich ans Meer.  (Whenever I have holidays, I go to the sea.)"
            ]
          },
          {
            "order": 4,
            "cells": [
              "⚠ Common mistake: using 'wenn' for a single past event. Always use 'als' for: 'when I was young / when it happened'."
            ]
          }
        ]
      },
      {
        "title": "10. Wechselpräpositionen (Two-Way Prepositions)",
        "type": "table",
        "note": "These 9 prepositions take AKKUSATIV for movement/direction (Wohin?) and DATIV for location (Wo?).",
        "note2": "Key verbs with Dativ (location): liegen, stehen, hängen, sitzen, sein. Key verbs with Akkusativ (movement): legen, stellen, hängen, setzen, gehen.",
        "headers": [
          "Prep.",
          "Meaning",
          "Dativ (Wo?)",
          "Akkusativ (Wohin?)"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "an",
              "at / on (vertical)",
              "Das Bild hängt an der Wand.",
              "Ich hänge das Bild an die Wand."
            ]
          },
          {
            "order": 1,
            "cells": [
              "auf",
              "on (horizontal)",
              "Das Buch liegt auf dem Tisch.",
              "Ich lege das Buch auf den Tisch."
            ]
          },
          {
            "order": 2,
            "cells": [
              "in",
              "in / into",
              "Er ist in der Schule.",
              "Er geht in die Schule."
            ]
          },
          {
            "order": 3,
            "cells": [
              "über",
              "over / above / across",
              "Die Lampe hängt über dem Tisch.",
              "Ich hänge die Lampe über den Tisch."
            ]
          },
          {
            "order": 4,
            "cells": [
              "unter",
              "under / below",
              "Die Katze liegt unter dem Bett.",
              "Die Katze läuft unter das Bett."
            ]
          },
          {
            "order": 5,
            "cells": [
              "vor",
              "in front of / ago",
              "Er steht vor dem Haus.",
              "Er stellt sich vor das Haus."
            ]
          },
          {
            "order": 6,
            "cells": [
              "hinter",
              "behind",
              "Sie steht hinter der Tür.",
              "Sie geht hinter die Tür."
            ]
          },
          {
            "order": 7,
            "cells": [
              "neben",
              "next to / beside",
              "Er sitzt neben mir.",
              "Er setzt sich neben mich."
            ]
          },
          {
            "order": 8,
            "cells": [
              "zwischen",
              "between",
              "Es liegt zwischen den Büchern.",
              "Leg es zwischen die Bücher."
            ]
          }
        ]
      },
      {
        "title": "11. Reflexive Verbs (Reflexivverben)",
        "type": "table",
        "note": "Reflexive verbs use a reflexive pronoun (sich). The action 'reflects back' on the subject. Most use Akkusativ pronoun; some use Dativ.",
        "note2": "Common reflexive verbs: sich freuen (to be happy), sich erinnern (to remember), sich befinden (to be located), sich fühlen (to feel), sich beeilen (to hurry), sich waschen (to wash oneself), sich vorstellen (to introduce oneself).",
        "headers": [
          "Pronomen",
          "Reflexiv (Akk.)",
          "Reflexiv (Dat.)"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "ich",
              "mich",
              "mir"
            ]
          },
          {
            "order": 1,
            "cells": [
              "du",
              "dich",
              "dir"
            ]
          },
          {
            "order": 2,
            "cells": [
              "er/sie/es",
              "sich",
              "sich"
            ]
          },
          {
            "order": 3,
            "cells": [
              "wir",
              "uns",
              "uns"
            ]
          },
          {
            "order": 4,
            "cells": [
              "ihr",
              "euch",
              "euch"
            ]
          },
          {
            "order": 5,
            "cells": [
              "sie/Sie",
              "sich",
              "sich"
            ]
          }
        ]
      },
      {
        "title": "12. Reflexive Verbs — Examples",
        "type": "notes",
        "items": [
          {
            "order": 0,
            "cells": [
              "✦ Akkusativ reflexive: Ich wasche mich.  (I wash myself.)"
            ]
          },
          {
            "order": 1,
            "cells": [
              "✦ Akkusativ reflexive: Er freut sich auf den Urlaub.  (He looks forward to the holiday.)"
            ]
          },
          {
            "order": 2,
            "cells": [
              "✦ Dativ reflexive (when there's another object): Ich wasche mir die Hände.  (I wash my hands.)"
            ]
          },
          {
            "order": 3,
            "cells": [
              "✦ Dativ reflexive: Kannst du dir das vorstellen?  (Can you imagine that?)"
            ]
          },
          {
            "order": 4,
            "cells": [
              "⚠ When another accusative object is present, the reflexive pronoun switches to Dativ."
            ]
          }
        ]
      },
      {
        "title": "13. Konjunktiv II — Polite Requests & Hypotheticals",
        "type": "table",
        "note": "Used for: polite requests, suggestions, wishes, and hypothetical situations. Most common forms: würde + infinitive, könnte, hätte, wäre.",
        "note2": "Examples: Könnten Sie mir helfen? (Could you help me?) | Ich würde gern mitkommen. (I would like to come along.) | Das wäre schön. (That would be nice.)",
        "headers": [
          "Verb",
          "ich",
          "du",
          "er/sie/es",
          "wir",
          "sie/Sie",
          "Use"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "würde+inf.",
              "würde",
              "würdest",
              "würde",
              "würden",
              "würden",
              "general polite/hypothetical"
            ]
          },
          {
            "order": 1,
            "cells": [
              "können",
              "könnte",
              "könntest",
              "könnte",
              "könnten",
              "könnten",
              "ability / polite request"
            ]
          },
          {
            "order": 2,
            "cells": [
              "haben",
              "hätte",
              "hättest",
              "hätte",
              "hätten",
              "hätten",
              "hypothetical having"
            ]
          },
          {
            "order": 3,
            "cells": [
              "sein",
              "wäre",
              "wärst",
              "wäre",
              "wären",
              "wären",
              "hypothetical being"
            ]
          },
          {
            "order": 4,
            "cells": [
              "müssen",
              "müsste",
              "müsstest",
              "müsste",
              "müssten",
              "müssten",
              "obligation (softer)"
            ]
          },
          {
            "order": 5,
            "cells": [
              "dürfen",
              "dürfte",
              "dürftest",
              "dürfte",
              "dürften",
              "dürften",
              "permission (softer)"
            ]
          }
        ]
      },
      {
        "title": "14. Relative Clauses (Relativsätze)",
        "type": "table",
        "note": "A relative clause describes a noun. It starts with a relative pronoun (like 'who/which/that' in English) and the VERB goes to the END.",
        "note2": "Examples: Das ist der Mann, der hier arbeitet.  (That's the man who works here.) | Ich kenne die Frau, die du meinst.  (I know the woman you mean.) | Das ist das Buch, das ich gelesen habe.  (That's the book that I read.)",
        "headers": [
          "Case",
          "Maskulin",
          "Feminin",
          "Neutrum",
          "Plural"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "Nominativ (subject of rel. clause)",
              "der",
              "die",
              "das",
              "die"
            ]
          },
          {
            "order": 1,
            "cells": [
              "Akkusativ (object of rel. clause)",
              "den",
              "die",
              "das",
              "die"
            ]
          },
          {
            "order": 2,
            "cells": [
              "Dativ (after dative prepositions)",
              "dem",
              "der",
              "dem",
              "denen"
            ]
          }
        ]
      },
      {
        "title": "15. Infinitiv mit zu",
        "type": "notes",
        "note": "Many verbs and expressions are followed by 'zu + infinitive'. The infinitive goes to the END. With separable verbs: prefix + zu + stem.",
        "items": [
          {
            "order": 0,
            "cells": [
              "✦ Structure: [main clause] + zu + Infinitiv (at end)"
            ]
          },
          {
            "order": 1,
            "cells": [
              "✦ Ich versuche, Deutsch zu lernen.  (I try to learn German.)"
            ]
          },
          {
            "order": 2,
            "cells": [
              "✦ Es ist wichtig, pünktlich zu sein.  (It's important to be on time.)"
            ]
          },
          {
            "order": 3,
            "cells": [
              "✦ Ich habe keine Lust, aufzuräumen.  (I don't feel like tidying up.) ← separable: auf+zu+räumen"
            ]
          },
          {
            "order": 4,
            "cells": [
              "✦ Er vergisst immer, anzurufen.  (He always forgets to call.) ← anzu+rufen"
            ]
          },
          {
            "order": 5,
            "cells": [
              "─── Common triggers for 'zu + Inf.' ───"
            ]
          },
          {
            "order": 6,
            "cells": [
              "✦ versuchen, vergessen, beginnen, aufhören, vorhaben, planen, hoffen, erlauben"
            ]
          },
          {
            "order": 7,
            "cells": [
              "✦ Es ist + adj.: wichtig, schön, einfach, schwierig, möglich, nötig"
            ]
          },
          {
            "order": 8,
            "cells": [
              "⚠ After modal verbs (können, müssen…): NO 'zu' — just plain infinitive!"
            ]
          }
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
        "items": [
          {
            "order": 0,
            "cells": [
              "der Kopf / die Kopfschmerzen",
              "head / headache"
            ]
          },
          {
            "order": 1,
            "cells": [
              "der Bauch / die Bauchschmerzen",
              "stomach / stomachache"
            ]
          },
          {
            "order": 2,
            "cells": [
              "der Rücken / die Rückenschmerzen",
              "back / backache"
            ]
          },
          {
            "order": 3,
            "cells": [
              "das Fieber haben",
              "to have a fever"
            ]
          },
          {
            "order": 4,
            "cells": [
              "sich erkälten",
              "to catch a cold"
            ]
          },
          {
            "order": 5,
            "cells": [
              "der Arzt / die Ärztin",
              "doctor (m/f)"
            ]
          },
          {
            "order": 6,
            "cells": [
              "das Rezept",
              "prescription / recipe"
            ]
          },
          {
            "order": 7,
            "cells": [
              "die Apotheke",
              "pharmacy"
            ]
          },
          {
            "order": 8,
            "cells": [
              "Ich fühle mich nicht wohl.",
              "I don't feel well."
            ]
          },
          {
            "order": 9,
            "cells": [
              "Mir ist schlecht / schwindelig.",
              "I feel sick / dizzy."
            ]
          }
        ]
      },
      {
        "title": "Housing & Directions (Wohnen & Wegbeschreibung)",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "die Wohnung / das Haus",
              "apartment / house"
            ]
          },
          {
            "order": 1,
            "cells": [
              "das Zimmer / die Küche / das Bad",
              "room / kitchen / bathroom"
            ]
          },
          {
            "order": 2,
            "cells": [
              "der Aufzug / die Treppe",
              "elevator / stairs"
            ]
          },
          {
            "order": 3,
            "cells": [
              "geradeaus / links / rechts",
              "straight ahead / left / right"
            ]
          },
          {
            "order": 4,
            "cells": [
              "an der Ampel / Kreuzung",
              "at the traffic light / intersection"
            ]
          },
          {
            "order": 5,
            "cells": [
              "gegenüber / neben / hinter",
              "opposite / next to / behind"
            ]
          },
          {
            "order": 6,
            "cells": [
              "Wie komme ich zu …?",
              "How do I get to …?"
            ]
          },
          {
            "order": 7,
            "cells": [
              "Das ist in der Nähe von …",
              "That is near …"
            ]
          }
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
        "items": [
          {
            "order": 0,
            "cells": [
              "gehen",
              "ging",
              "bin gegangen",
              "to go"
            ]
          },
          {
            "order": 1,
            "cells": [
              "kommen",
              "kam",
              "bin gekommen",
              "to come"
            ]
          },
          {
            "order": 2,
            "cells": [
              "fahren",
              "fuhr",
              "bin gefahren",
              "to drive/travel"
            ]
          },
          {
            "order": 3,
            "cells": [
              "fliegen",
              "flog",
              "bin geflogen",
              "to fly"
            ]
          },
          {
            "order": 4,
            "cells": [
              "laufen",
              "lief",
              "bin gelaufen",
              "to run/walk"
            ]
          },
          {
            "order": 5,
            "cells": [
              "bleiben",
              "blieb",
              "bin geblieben",
              "to stay"
            ]
          },
          {
            "order": 6,
            "cells": [
              "schreiben",
              "schrieb",
              "habe geschrieben",
              "to write"
            ]
          },
          {
            "order": 7,
            "cells": [
              "lesen",
              "las",
              "habe gelesen",
              "to read"
            ]
          },
          {
            "order": 8,
            "cells": [
              "finden",
              "fand",
              "habe gefunden",
              "to find"
            ]
          },
          {
            "order": 9,
            "cells": [
              "nehmen",
              "nahm",
              "habe genommen",
              "to take"
            ]
          },
          {
            "order": 10,
            "cells": [
              "geben",
              "gab",
              "habe gegeben",
              "to give"
            ]
          },
          {
            "order": 11,
            "cells": [
              "sehen",
              "sah",
              "habe gesehen",
              "to see"
            ]
          },
          {
            "order": 12,
            "cells": [
              "stehen",
              "stand",
              "habe gestanden",
              "to stand"
            ]
          },
          {
            "order": 13,
            "cells": [
              "liegen",
              "lag",
              "habe gelegen",
              "to lie/be located"
            ]
          },
          {
            "order": 14,
            "cells": [
              "sich freuen",
              "freute sich",
              "hat sich gefreut",
              "to be happy/look forward"
            ]
          },
          {
            "order": 15,
            "cells": [
              "sich fühlen",
              "fühlte sich",
              "hat sich gefühlt",
              "to feel"
            ]
          },
          {
            "order": 16,
            "cells": [
              "sich erinnern",
              "erinnerte sich",
              "hat sich erinnert",
              "to remember"
            ]
          },
          {
            "order": 17,
            "cells": [
              "versuchen",
              "versuchte",
              "habe versucht",
              "to try"
            ]
          },
          {
            "order": 18,
            "cells": [
              "vergessen",
              "vergaß",
              "habe vergessen",
              "to forget"
            ]
          },
          {
            "order": 19,
            "cells": [
              "beginnen",
              "begann",
              "habe begonnen",
              "to begin"
            ]
          }
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
        "items": [
          {
            "order": 0,
            "cells": [
              "Ich finde, dass …",
              "I think that …"
            ]
          },
          {
            "order": 1,
            "cells": [
              "Meiner Meinung nach …",
              "In my opinion …"
            ]
          },
          {
            "order": 2,
            "cells": [
              "Ich bin der Meinung, dass …",
              "I am of the opinion that …"
            ]
          },
          {
            "order": 3,
            "cells": [
              "Das stimmt (nicht).",
              "That is (not) correct."
            ]
          },
          {
            "order": 4,
            "cells": [
              "Ich bin damit einverstanden.",
              "I agree with that."
            ]
          },
          {
            "order": 5,
            "cells": [
              "Ich bin dagegen / dafür.",
              "I'm against it / for it."
            ]
          },
          {
            "order": 6,
            "cells": [
              "Das liegt daran, dass …",
              "That is because …"
            ]
          },
          {
            "order": 7,
            "cells": [
              "Deshalb / Deswegen …",
              "Therefore / That's why …"
            ]
          }
        ]
      },
      {
        "title": "Making Polite Requests (Konjunktiv II)",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "Könnten Sie mir bitte helfen?",
              "Could you please help me?"
            ]
          },
          {
            "order": 1,
            "cells": [
              "Würden Sie das bitte wiederholen?",
              "Would you please repeat that?"
            ]
          },
          {
            "order": 2,
            "cells": [
              "Ich würde gern … bestellen.",
              "I would like to order …"
            ]
          },
          {
            "order": 3,
            "cells": [
              "Dürfte ich kurz …?",
              "Might I briefly …?"
            ]
          },
          {
            "order": 4,
            "cells": [
              "Hätten Sie einen Moment?",
              "Would you have a moment?"
            ]
          },
          {
            "order": 5,
            "cells": [
              "Das wäre sehr nett.",
              "That would be very kind."
            ]
          },
          {
            "order": 6,
            "cells": [
              "Ich hätte gern …",
              "I would like … (ordering)"
            ]
          }
        ]
      },
      {
        "title": "Describing the Past (Präteritum in use)",
        "type": "table",
        "headers": [
          "Deutsch",
          "English"
        ],
        "items": [
          {
            "order": 0,
            "cells": [
              "Als ich jung war, …",
              "When I was young, …"
            ]
          },
          {
            "order": 1,
            "cells": [
              "Früher hatte ich …",
              "In the past I had …"
            ]
          },
          {
            "order": 2,
            "cells": [
              "Damals wohnte ich in …",
              "Back then I lived in …"
            ]
          },
          {
            "order": 3,
            "cells": [
              "Ich konnte nicht kommen, weil …",
              "I couldn't come because …"
            ]
          },
          {
            "order": 4,
            "cells": [
              "Er wollte, aber er musste arbeiten.",
              "He wanted to, but he had to work."
            ]
          }
        ]
      }
    ]
  }
};
