"""
Seed LexicalItems and ReferenceSheets from the german-cheatsheet.jsx data.

Idempotent: uses get_or_create so it can be run multiple times safely.
Links items to existing English packs via PackItem/PackReferenceSheet.
"""

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.content.models import Level
from apps.knowledge.constants import LexicalItemType, ReferenceSheetType
from apps.knowledge.models import (
    LexicalItem,
    NounDetail,
    ReferenceSheet,
    VerbDetail,
)
from apps.packs.models import Pack, PackItem, PackReferenceSheet

CHEATSHEET = {
    "A1.1": {
        "grammar": [
            {
                "title": "1. Personal Pronouns — Nominativ",
                "type": "table",
                "headers": ["Pronomen", "English"],
                "rows": [
                    ["ich", "I"],
                    ["du", "you (informal)"],
                    ["er / sie / es", "he / she / it"],
                    ["wir", "we"],
                    ["ihr", "you all (informal)"],
                    ["sie / Sie", "they / you (formal)"],
                ],
            },
            {
                "title": "2. Formal Sie vs Informal du",
                "type": "notes",
                "notes": [
                    "du → friends, family, children, peers",
                    "Sie (always capital S) → strangers, bosses, older people",
                    "ihr → informal plural (talking to a group of friends)",
                    "Wie heißt du? (informal) vs Wie heißen Sie? (formal)",
                ],
            },
            {
                "title": "3. Verb: sein (to be)",
                "type": "table",
                "headers": ["Pronomen", "sein", "Example"],
                "rows": [
                    ["ich", "bin", "Ich bin Anna."],
                    ["du", "bist", "Du bist müde."],
                    ["er/sie/es", "ist", "Er ist Lehrer."],
                    ["wir", "sind", "Wir sind hier."],
                    ["ihr", "seid", "Ihr seid spät."],
                    ["sie/Sie", "sind", "Sie sind nett."],
                ],
            },
            {
                "title": "4. Verb: haben (to have)",
                "type": "table",
                "headers": ["Pronomen", "haben", "Example"],
                "rows": [
                    ["ich", "habe", "Ich habe ein Buch."],
                    ["du", "hast", "Du hast Zeit."],
                    ["er/sie/es", "hat", "Sie hat Hunger."],
                    ["wir", "haben", "Wir haben Kinder."],
                    ["ihr", "habt", "Ihr habt Glück."],
                    ["sie/Sie", "haben", "Sie haben ein Auto."],
                ],
            },
            {
                "title": "5. Regular Verb Conjugation (Präsens)",
                "type": "table",
                "headers": ["Ending", "Example: wohnen", "Example: lernen"],
                "rows": [
                    ["-e  (ich)", "ich wohn-e", "ich lern-e"],
                    ["-st  (du)", "du wohn-st", "du lern-st"],
                    ["-t  (er/sie/es)", "er wohn-t", "er lern-t"],
                    ["-en  (wir)", "wir wohn-en", "wir lern-en"],
                    ["-t  (ihr)", "ihr wohn-t", "ihr lern-t"],
                    ["-en  (sie/Sie)", "sie wohn-en", "sie lern-en"],
                ],
            },
            {
                "title": "6. Stem-Changing (Irregular) Verbs",
                "type": "table",
                "headers": ["Verb", "ich", "du", "er/sie/es", "wir"],
                "rows": [
                    ["sprechen (speak)", "spreche", "sprichst", "spricht", "sprechen"],
                    ["essen (eat)", "esse", "isst", "isst", "essen"],
                    ["lesen (read)", "lese", "liest", "liest", "lesen"],
                    ["fahren (drive)", "fahre", "fährst", "fährt", "fahren"],
                    ["schlafen (sleep)", "schlafe", "schläfst", "schläft", "schlafen"],
                    ["sehen (see)", "sehe", "siehst", "sieht", "sehen"],
                ],
            },
            {
                "title": "7. Articles — Nominativ (Subject)",
                "type": "table",
                "headers": ["Gender", "Definite (the)", "Indefinite (a/an)", "Negative (no/not a)"],
                "rows": [
                    ["Maskulin (m)", "der", "ein", "kein"],
                    ["Feminin (f)", "die", "eine", "keine"],
                    ["Neutrum (n)", "das", "ein", "kein"],
                    ["Plural", "die", "---", "keine"],
                ],
            },
            {
                "title": "8. Articles — Akkusativ (Direct Object)",
                "type": "table",
                "headers": ["Gender", "Definite (the)", "Indefinite (a/an)", "Negative (no)"],
                "rows": [
                    ["Maskulin (m)", "den", "einen", "keinen"],
                    ["Feminin (f)", "die", "eine", "keine"],
                    ["Neutrum (n)", "das", "ein", "kein"],
                    ["Plural", "die", "---", "keine"],
                ],
            },
            {
                "title": "9. Nominativ vs Akkusativ — Quick Examples",
                "type": "notes",
                "notes": [
                    "Der Mann kauft einen Apfel. → 'Der Mann' = Nominativ; 'einen Apfel' = Akkusativ",
                    "Ich sehe die Frau. → 'die Frau' = Akkusativ (feminin, no change)",
                    "Er hat ein Kind. → 'ein Kind' = Akkusativ (neutrum, no change)",
                    "Ich kaufe keinen Kaffee. → maskulin negation in Akkusativ → keinen",
                ],
            },
            {
                "title": "10. Negation: nicht vs kein",
                "type": "table",
                "headers": ["Rule", "Example", "Meaning"],
                "rows": [
                    ["nicht → negates verbs, adjectives, adverbs", "Ich arbeite nicht.", "I don't work."],
                    ["nicht → negates specific nouns with definite article", "Ich kaufe das Buch nicht.", "I'm not buying the book."],
                    ["kein/keine → negates nouns with indefinite article", "Ich habe kein Auto.", "I have no car."],
                    ["kein/keine → also replaces ein/eine", "Das ist kein Lehrer.", "That's not a teacher."],
                ],
            },
            {
                "title": "11. Noun Plurals — 5 Main Patterns",
                "type": "table",
                "headers": ["Pattern", "Example Singular", "Example Plural"],
                "rows": [
                    ["-e (often maskulin)", "der Tag", "die Tage"],
                    ["-(e)n (often feminin)", "die Frau", "die Frauen"],
                    ["-er (often neutrum)", "das Kind", "die Kinder"],
                    ["umlaut + -e", "der Mann", "die Männer"],
                    ["-s (foreign words)", "das Auto", "die Autos"],
                    ["no change", "der Lehrer", "die Lehrer"],
                ],
            },
            {
                "title": "12. Separable Verbs (Trennbare Verben)",
                "type": "table",
                "headers": ["Verb", "Conjugated Example", "Meaning"],
                "rows": [
                    ["aufstehen", "Ich stehe um 7 auf.", "to get up"],
                    ["anrufen", "Er ruft seine Mutter an.", "to call (phone)"],
                    ["einkaufen", "Wir kaufen heute ein.", "to go shopping"],
                    ["fernsehen", "Sie sieht abends fern.", "to watch TV"],
                    ["ankommen", "Der Zug kommt an.", "to arrive"],
                    ["mitkommen", "Kommst du mit?", "to come along"],
                ],
            },
            {
                "title": "13. Sentence Structure (Wortstellung)",
                "type": "notes",
                "notes": [
                    "Statement: Subject → Verb(pos.2) → Rest",
                    "Inversion: Adverb → Verb(pos.2) → Subject",
                    "Yes/No question: Verb → Subject → Rest?",
                    "W-question: W-Wort → Verb → Subject → Rest?",
                    "With separable: Prefix goes to very end",
                    "The conjugated verb is ALWAYS in position 2 in statements.",
                ],
            },
            {
                "title": "14. W-Questions (W-Fragen)",
                "type": "table",
                "headers": ["Frage", "Meaning", "Example"],
                "rows": [
                    ["Wer?", "Who?", "Wer bist du?"],
                    ["Was?", "What?", "Was machst du?"],
                    ["Wo?", "Where? (location)", "Wo wohnst du?"],
                    ["Woher?", "Where from?", "Woher kommst du?"],
                    ["Wohin?", "Where to?", "Wohin gehst du?"],
                    ["Wann?", "When?", "Wann kommst du?"],
                    ["Wie?", "How?", "Wie heißt du?"],
                    ["Wie viel?", "How much?", "Wie viel kostet das?"],
                    ["Warum?", "Why?", "Warum lernst du Deutsch?"],
                    ["Welch-?", "Which?", "Welchen Kurs machst du?"],
                ],
            },
        ],
        "vocab": [
            {
                "title": "Greetings & Farewells",
                "rows": [
                    ["Guten Morgen", "Good morning"],
                    ["Guten Tag", "Good day / Hello"],
                    ["Guten Abend", "Good evening"],
                    ["Hallo / Hi", "Hello / Hi (informal)"],
                    ["Auf Wiedersehen", "Goodbye (formal)"],
                    ["Tschüss / Tschau", "Bye (informal)"],
                    ["Bis bald / Bis später", "See you soon / later"],
                    ["Bis morgen", "See you tomorrow"],
                ],
            },
        ],
        "verbs": [
            {
                "title": "Core A1.1 Verb List",
                "rows": [
                    ["sein", "to be", "irregular"],
                    ["haben", "to have", "irregular"],
                    ["heißen", "to be called", "regular"],
                    ["kommen", "to come", "regular"],
                    ["wohnen", "to live/reside", "regular"],
                    ["arbeiten", "to work", "regular"],
                    ["lernen", "to learn", "regular"],
                    ["machen", "to do/make", "regular"],
                    ["schreiben", "to write", "regular"],
                    ["lesen", "to read", "stem-change e→ie"],
                    ["sprechen", "to speak", "stem-change e→i"],
                    ["essen", "to eat", "stem-change e→i"],
                    ["fahren", "to drive/travel", "stem-change a→ä"],
                    ["gehen", "to go (on foot)", "regular"],
                    ["kaufen", "to buy", "regular"],
                    ["trinken", "to drink", "regular"],
                    ["hören", "to hear/listen", "regular"],
                    ["fragen", "to ask", "regular"],
                    ["antworten", "to answer", "regular"],
                    ["verstehen", "to understand", "regular"],
                    ["aufstehen", "to get up", "separable"],
                    ["anrufen", "to call", "separable"],
                    ["einkaufen", "to shop", "separable"],
                ],
            },
        ],
        "phrases": [
            {
                "title": "Introductions",
                "rows": [
                    ["Ich heiße … / Mein Name ist …", "My name is …"],
                    ["Ich bin … Jahre alt.", "I am … years old."],
                    ["Ich komme aus …", "I come from …"],
                    ["Ich wohne in …", "I live in …"],
                    ["Ich bin … (Beruf)", "I am a … (profession)"],
                    ["Ich spreche … (Sprache)", "I speak … (language)"],
                    ["Ich buchstabiere: …", "I spell it: …"],
                    ["Ich bin verheiratet / ledig.", "I am married / single."],
                    ["Ich habe … Kinder.", "I have … children."],
                ],
            },
            {
                "title": "Classroom & Polite Phrases",
                "rows": [
                    ["Wie bitte?", "Pardon? / Could you repeat?"],
                    ["Ich verstehe nicht.", "I don't understand."],
                    ["Was bedeutet …?", "What does … mean?"],
                    ["Können Sie bitte langsamer sprechen?", "Can you please speak slower?"],
                    ["Bitte.", "Please / You're welcome."],
                    ["Danke / Danke schön.", "Thank you / Thank you very much."],
                    ["Entschuldigung.", "Excuse me / Sorry."],
                    ["Kein Problem.", "No problem."],
                ],
            },
        ],
    },
    "A1.2": {
        "grammar": [
            {
                "title": "1. Possessive Articles (Possessivartikel)",
                "type": "table",
                "headers": ["Pronomen", "Maskulin (Nom)", "Feminin (Nom)", "Neutrum (Nom)", "Plural (Nom)"],
                "rows": [
                    ["ich →", "mein", "meine", "mein", "meine"],
                    ["du →", "dein", "deine", "dein", "deine"],
                    ["er/es →", "sein", "seine", "sein", "seine"],
                    ["sie →", "ihr", "ihre", "ihr", "ihre"],
                    ["wir →", "unser", "unsere", "unser", "unsere"],
                    ["ihr →", "euer", "eure", "euer", "eure"],
                    ["sie/Sie →", "ihr/Ihr", "ihre/Ihre", "ihr/Ihr", "ihre/Ihre"],
                ],
            },
            {
                "title": "3. Dative Case (Dativ)",
                "type": "table",
                "headers": ["Gender", "Definite (dem/der)", "Indefinite (einem/einer)"],
                "rows": [
                    ["Maskulin", "dem", "einem"],
                    ["Feminin", "der", "einer"],
                    ["Neutrum", "dem", "einem"],
                    ["Plural", "den (+n on noun)", "--- (keinen)"],
                ],
            },
            {
                "title": "4. All 3 Cases Side by Side",
                "type": "table",
                "headers": ["Case", "Maskulin", "Feminin", "Neutrum", "Plural"],
                "rows": [
                    ["Nominativ (Wer?)", "der / ein", "die / eine", "das / ein", "die / ---"],
                    ["Akkusativ (Wen/Was?)", "den / einen", "die / eine", "das / ein", "die / ---"],
                    ["Dativ (Wem?)", "dem / einem", "der / einer", "dem / einem", "den(+n) / ---"],
                ],
            },
            {
                "title": "5. Modal Verbs (Modalverben)",
                "type": "table",
                "headers": ["Verb", "Meaning", "ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"],
                "rows": [
                    ["können", "can/able to", "kann", "kannst", "kann", "können", "könnt", "können"],
                    ["müssen", "must/have to", "muss", "musst", "muss", "müssen", "müsst", "müssen"],
                    ["wollen", "want to", "will", "willst", "will", "wollen", "wollt", "wollen"],
                    ["dürfen", "may/allowed to", "darf", "darfst", "darf", "dürfen", "dürft", "dürfen"],
                    ["sollen", "should", "soll", "sollst", "soll", "sollen", "sollt", "sollen"],
                    ["möchten", "would like to", "möchte", "möchtest", "möchte", "möchten", "möchtet", "möchten"],
                ],
            },
            {
                "title": "7. Präteritum of sein & haben",
                "type": "table",
                "headers": ["Pronomen", "sein (war)", "haben (hatte)"],
                "rows": [
                    ["ich", "war", "hatte"],
                    ["du", "warst", "hattest"],
                    ["er/sie/es", "war", "hatte"],
                    ["wir", "waren", "hatten"],
                    ["ihr", "wart", "hattet"],
                    ["sie/Sie", "waren", "hatten"],
                ],
            },
            {
                "title": "8. Perfekt (Conversational Past Tense)",
                "type": "notes",
                "notes": [
                    "Structure: haben/sein (pos. 2) + ... + Partizip II (END)",
                    "Regular: ge- + stem + -t  |  machen → gemacht",
                    "Irregular: ge- + stem + -en  |  gehen → gegangen",
                    "Separable: prefix + ge + stem  |  eingekauft, angerufen",
                    "Verbs ending -ieren: no ge-  |  studieren → studiert",
                ],
            },
            {
                "title": "9. Common Partizip II Forms",
                "type": "table",
                "headers": ["Infinitiv", "Partizip II", "Auxiliary"],
                "rows": [
                    ["machen", "gemacht", "haben"],
                    ["kaufen", "gekauft", "haben"],
                    ["schreiben", "geschrieben", "haben"],
                    ["trinken", "getrunken", "haben"],
                    ["essen", "gegessen", "haben"],
                    ["gehen", "gegangen", "sein"],
                    ["fahren", "gefahren", "sein"],
                    ["kommen", "gekommen", "sein"],
                    ["sein", "gewesen", "sein"],
                    ["haben", "gehabt", "haben"],
                ],
            },
        ],
        "vocab": [
            {
                "title": "Family (Familie)",
                "rows": [
                    ["der Vater", "father"],
                    ["die Mutter", "mother"],
                    ["der Bruder", "brother"],
                    ["die Schwester", "sister"],
                    ["der Sohn", "son"],
                    ["die Tochter", "daughter"],
                    ["der Mann", "husband / man"],
                    ["die Frau", "wife / woman"],
                    ["die Eltern", "parents"],
                    ["die Geschwister", "siblings"],
                    ["der Großvater / Opa", "grandfather"],
                    ["die Großmutter / Oma", "grandmother"],
                ],
            },
        ],
        "verbs": [
            {
                "title": "New A1.2 Verbs",
                "rows": [
                    ["aufräumen", "to tidy up"],
                    ["einladen", "to invite"],
                    ["anziehen", "to put on (clothes)"],
                    ["ausziehen", "to take off / move out"],
                    ["fernsehen", "to watch TV"],
                    ["besuchen", "to visit"],
                    ["helfen", "to help"],
                    ["schlafen", "to sleep"],
                    ["bleiben", "to stay/remain"],
                    ["reisen", "to travel"],
                    ["mögen", "to like"],
                    ["brauchen", "to need"],
                ],
            },
        ],
        "phrases": [
            {
                "title": "Talking about the Past",
                "rows": [
                    ["Was hast du gestern gemacht?", "What did you do yesterday?"],
                    ["Ich habe … gegessen/getrunken.", "I ate/drank …"],
                    ["Ich bin ins Kino gegangen.", "I went to the cinema."],
                    ["Ich war zu Hause.", "I was at home."],
                    ["Ich hatte keine Zeit.", "I had no time."],
                ],
            },
            {
                "title": "Expressing Wishes & Ability",
                "rows": [
                    ["Ich möchte … bestellen.", "I would like to order …"],
                    ["Kann ich … haben?", "Can I have …?"],
                    ["Ich kann leider nicht kommen.", "Unfortunately I can't come."],
                    ["Ich muss früh aufstehen.", "I have to get up early."],
                    ["Darf ich hier parken?", "Am I allowed to park here?"],
                    ["Du sollst das nicht machen.", "You're not supposed to do that."],
                ],
            },
        ],
    },
    "A2.1": {
        "grammar": [
            {
                "title": "4. Adjective Endings — After Definite Article",
                "type": "table",
                "headers": ["Case", "Maskulin", "Feminin", "Neutrum", "Plural"],
                "rows": [
                    ["Nominativ", "der alt-e Mann", "die alt-e Frau", "das alt-e Kind", "die alt-en Kinder"],
                    ["Akkusativ", "den alt-en Mann", "die alt-e Frau", "das alt-e Kind", "die alt-en Kinder"],
                    ["Dativ", "dem alt-en Mann", "der alt-en Frau", "dem alt-en Kind", "den alt-en Kindern"],
                ],
            },
            {
                "title": "6. Komparativ & Superlativ",
                "type": "table",
                "headers": ["Grundform", "Komparativ", "Superlativ", "English"],
                "rows": [
                    ["schnell", "schneller", "am schnellsten", "fast"],
                    ["groß", "größer", "am größten", "big"],
                    ["alt", "älter", "am ältesten", "old"],
                    ["gut", "besser", "am besten", "good"],
                    ["viel", "mehr", "am meisten", "much/many"],
                    ["gern", "lieber", "am liebsten", "gladly"],
                ],
            },
            {
                "title": "8. Subordinate Clauses — weil, dass, wenn, ob",
                "type": "notes",
                "notes": [
                    "In a Nebensatz, the VERB moves to the END.",
                    "weil = because: Ich lerne Deutsch, weil ich in Deutschland arbeiten will.",
                    "dass = that: Ich glaube, dass er heute kommt.",
                    "wenn = when/if: Wenn ich Zeit habe, gehe ich ins Kino.",
                    "ob = whether: Ich weiß nicht, ob er kommt.",
                ],
            },
            {
                "title": "10. Wechselpräpositionen (Two-Way Prepositions)",
                "type": "table",
                "headers": ["Prep.", "Meaning", "Dativ (Wo?)", "Akkusativ (Wohin?)"],
                "rows": [
                    ["an", "at/on", "Das Bild hängt an der Wand.", "Ich hänge das Bild an die Wand."],
                    ["auf", "on", "Das Buch liegt auf dem Tisch.", "Ich lege das Buch auf den Tisch."],
                    ["in", "in/into", "Er ist in der Schule.", "Er geht in die Schule."],
                    ["über", "over/above", "Die Lampe hängt über dem Tisch.", "Ich hänge die Lampe über den Tisch."],
                    ["unter", "under", "Die Katze liegt unter dem Bett.", "Die Katze läuft unter das Bett."],
                    ["vor", "in front of", "Er steht vor dem Haus.", "Er stellt sich vor das Haus."],
                    ["hinter", "behind", "Sie steht hinter der Tür.", "Sie geht hinter die Tür."],
                    ["neben", "next to", "Er sitzt neben mir.", "Er setzt sich neben mich."],
                    ["zwischen", "between", "Es liegt zwischen den Büchern.", "Leg es zwischen die Bücher."],
                ],
            },
            {
                "title": "11. Reflexive Verbs (Reflexivverben)",
                "type": "table",
                "headers": ["Pronomen", "Reflexiv (Akk.)", "Reflexiv (Dat.)"],
                "rows": [
                    ["ich", "mich", "mir"],
                    ["du", "dich", "dir"],
                    ["er/sie/es", "sich", "sich"],
                    ["wir", "uns", "uns"],
                    ["ihr", "euch", "euch"],
                    ["sie/Sie", "sich", "sich"],
                ],
            },
        ],
        "vocab": [
            {
                "title": "Health & Body (Gesundheit & Körper)",
                "rows": [
                    ["der Kopf", "head"],
                    ["der Bauch", "stomach"],
                    ["der Rücken", "back"],
                    ["der Arzt / die Ärztin", "doctor (m/f)"],
                    ["das Rezept", "prescription"],
                    ["die Apotheke", "pharmacy"],
                    ["Ich fühle mich nicht wohl.", "I don't feel well."],
                ],
            },
            {
                "title": "Housing & Directions",
                "rows": [
                    ["die Wohnung", "apartment"],
                    ["das Haus", "house"],
                    ["das Zimmer", "room"],
                    ["die Küche", "kitchen"],
                    ["das Bad", "bathroom"],
                    ["geradeaus", "straight ahead"],
                    ["links / rechts", "left / right"],
                    ["Wie komme ich zu …?", "How do I get to …?"],
                ],
            },
        ],
        "verbs": [
            {
                "title": "Key A2.1 Verbs",
                "rows": [
                    ["fliegen", "to fly"],
                    ["laufen", "to run/walk"],
                    ["finden", "to find"],
                    ["nehmen", "to take"],
                    ["geben", "to give"],
                    ["sehen", "to see"],
                    ["stehen", "to stand"],
                    ["liegen", "to lie/be located"],
                    ["sich freuen", "to be happy/look forward"],
                    ["sich fühlen", "to feel"],
                    ["sich erinnern", "to remember"],
                    ["versuchen", "to try"],
                    ["vergessen", "to forget"],
                    ["beginnen", "to begin"],
                ],
            },
        ],
        "phrases": [
            {
                "title": "Expressing Opinions & Reasons",
                "rows": [
                    ["Ich finde, dass …", "I think that …"],
                    ["Meiner Meinung nach …", "In my opinion …"],
                    ["Das stimmt (nicht).", "That is (not) correct."],
                    ["Ich bin damit einverstanden.", "I agree with that."],
                    ["Ich bin dagegen / dafür.", "I'm against it / for it."],
                    ["Deshalb / Deswegen …", "Therefore / That's why …"],
                ],
            },
            {
                "title": "Making Polite Requests (Konjunktiv II)",
                "rows": [
                    ["Könnten Sie mir bitte helfen?", "Could you please help me?"],
                    ["Würden Sie das bitte wiederholen?", "Would you please repeat that?"],
                    ["Ich würde gern … bestellen.", "I would like to order …"],
                    ["Hätten Sie einen Moment?", "Would you have a moment?"],
                    ["Das wäre sehr nett.", "That would be very kind."],
                    ["Ich hätte gern …", "I would like … (ordering)"],
                ],
            },
        ],
    },
}

PACK_SLUGS = {
    "A1.1": "a1-1-en",
    "A1.2": "a1-2-en",
    "A2.1": "a2-1-en",
}

SHEET_TYPE_MAP = {
    "table": ReferenceSheetType.TABLE,
    "notes": ReferenceSheetType.NOTES,
    "grid": ReferenceSheetType.GRID,
}


def _detect_gender(text: str) -> str | None:
    if text.startswith("der "):
        return "m"
    if text.startswith("die "):
        return "f"
    if text.startswith("das "):
        return "n"
    return None


def _detect_separable(text: str) -> str | None:
    prefixes = [
        "ab", "an", "auf", "aus", "bei", "ein", "fern", "her", "hin",
        "los", "mit", "nach", "um", "vor", "weg", "zu", "zurück",
    ]
    for p in sorted(prefixes, key=len, reverse=True):
        if text.startswith(p) and len(text) > len(p) + 2:
            return p
    return None


class Command(BaseCommand):
    help = "Seed LexicalItems and ReferenceSheets from german-cheatsheet data"

    @transaction.atomic
    def handle(self, *args, **options):
        total_items = 0
        total_sheets = 0

        for level_code, categories in CHEATSHEET.items():
            level = Level.objects.get(code=level_code)
            pack = Pack.objects.filter(slug=PACK_SLUGS.get(level_code)).first()

            if not pack:
                self.stdout.write(f"  No pack for {level_code}, skipping pack linking")

            # Grammar → ReferenceSheets
            for order, section in enumerate(categories.get("grammar", [])):
                sheet_type = SHEET_TYPE_MAP.get(section["type"], ReferenceSheetType.TABLE)
                sheet, created = ReferenceSheet.objects.get_or_create(
                    title=section["title"],
                    level=level,
                    defaults={
                        "sheet_type": sheet_type,
                        "headers": section.get("headers", []),
                        "rows": section.get("rows", section.get("notes", [])),
                        "order": order,
                    },
                )
                if created:
                    total_sheets += 1
                if pack and created:
                    PackReferenceSheet.objects.get_or_create(
                        pack=pack, sheet=sheet, defaults={"order": order}
                    )

            # Vocab → LexicalItems
            item_order = 0
            for section in categories.get("vocab", []):
                for row in section["rows"]:
                    text, translation = row[0], row[1]
                    gender = _detect_gender(text)

                    item, created = LexicalItem.objects.get_or_create(
                        text=text,
                        type=LexicalItemType.VOCAB,
                        level=level,
                        defaults={
                            "translation": translation,
                            "part_of_speech": "noun" if gender else "",
                            "tags": [section["title"]],
                        },
                    )
                    if created:
                        total_items += 1
                        if gender:
                            NounDetail.objects.get_or_create(
                                item=item, defaults={"gender": gender}
                            )
                    if pack:
                        PackItem.objects.get_or_create(
                            pack=pack, item=item, defaults={"order": item_order}
                        )
                    item_order += 1

            # Verbs → LexicalItems
            for section in categories.get("verbs", []):
                for row in section["rows"]:
                    text, translation = row[0], row[1]
                    sep_prefix = _detect_separable(text)

                    item, created = LexicalItem.objects.get_or_create(
                        text=text,
                        type=LexicalItemType.VERB,
                        level=level,
                        defaults={
                            "translation": translation,
                            "part_of_speech": "verb",
                            "tags": [section["title"]],
                        },
                    )
                    if created:
                        total_items += 1
                        verb_kwargs = {}
                        if sep_prefix:
                            verb_kwargs["separable_prefix"] = sep_prefix
                        if len(row) > 2 and row[2]:
                            verb_kwargs["conjugation_group"] = row[2]
                        VerbDetail.objects.get_or_create(
                            item=item, defaults=verb_kwargs
                        )
                    if pack:
                        PackItem.objects.get_or_create(
                            pack=pack, item=item, defaults={"order": item_order}
                        )
                    item_order += 1

            # Phrases → LexicalItems
            for section in categories.get("phrases", []):
                for row in section["rows"]:
                    text, translation = row[0], row[1]

                    item, created = LexicalItem.objects.get_or_create(
                        text=text,
                        type=LexicalItemType.PHRASE,
                        level=level,
                        defaults={
                            "translation": translation,
                            "part_of_speech": "",
                            "tags": [section["title"]],
                        },
                    )
                    if created:
                        total_items += 1
                        # Add example sentences from grammar tables that reference this item
                    if pack:
                        PackItem.objects.get_or_create(
                            pack=pack, item=item, defaults={"order": item_order}
                        )
                    item_order += 1

            self.stdout.write(f"  {level_code}: seeded")

        self.stdout.write(
            self.style.SUCCESS(
                f"Done: {total_items} items, {total_sheets} reference sheets created"
            )
        )
