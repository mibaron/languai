from __future__ import annotations

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.content.models import (
    ConversationLine,
    ConversationPart,
    FillBlankPart,
    Page,
    PageLexicalItem,
    PagePart,
    PagePartType,
    TablePart,
    TeachingNotePart,
)
from apps.knowledge.models import LexicalItem
from apps.packs.models import Pack


class Command(BaseCommand):
    help = "Seed learning pages for language packs"

    def add_arguments(self, parser):
        parser.add_argument("--pack", type=str, required=True, help="Pack slug (e.g. a1-1-en)")
        parser.add_argument("--clean", action="store_true", help="Delete existing pages first")

    @transaction.atomic
    def handle(self, *args, **options):
        slug = options["pack"]
        try:
            pack = Pack.objects.get(slug=slug)
        except Pack.DoesNotExist:
            raise CommandError(f"Pack '{slug}' not found.")

        if options["clean"]:
            count = Page.objects.filter(pack=pack).count()
            Page.objects.filter(pack=pack).delete()
            self.stdout.write(f"Deleted {count} existing pages for '{slug}'.")

        if Page.objects.filter(pack=pack).exists():
            self.stdout.write(f"Pages already exist for '{slug}'. Use --clean to recreate.")
            return

        seeders = {
            "a1-1-en": self._seed_a1_1_en,
        }

        seeder = seeders.get(slug)
        if not seeder:
            raise CommandError(f"No seeder defined for pack '{slug}'.")

        seeder(pack)

    # ------------------------------------------------------------------ #
    # Helpers (reusable for future packs)
    # ------------------------------------------------------------------ #

    def _create_page(self, pack: Pack, title: str, description: str, order: int) -> Page:
        page = Page.objects.create(pack=pack, title=title, description=description, order=order)
        self.stdout.write(f"  Page {order}: {title}")
        return page

    def _add_note(self, page: Page, order: int, content: str) -> PagePart:
        part = PagePart.objects.create(page=page, part_type=PagePartType.NOTE, order=order)
        TeachingNotePart.objects.create(page_part=part, content=content)
        return part

    def _add_table(
        self, page: Page, order: int, headers: list[str], rows: list[list[str]], note: str = ""
    ) -> PagePart:
        part = PagePart.objects.create(page=page, part_type=PagePartType.TABLE, order=order)
        TablePart.objects.create(page_part=part, headers=headers, rows=rows, note=note)
        return part

    def _add_fill_blank(
        self,
        page: Page,
        order: int,
        before: str,
        after: str,
        answer: str,
        hint: str = "",
        item: LexicalItem | None = None,
    ) -> PagePart:
        part = PagePart.objects.create(page=page, part_type=PagePartType.FILL_BLANK, order=order)
        FillBlankPart.objects.create(
            page_part=part, text_before=before, text_after=after, answer=answer, hint=hint, item=item
        )
        return part

    def _add_conversation(
        self,
        page: Page,
        order: int,
        context: str,
        lines: list[tuple[str, str, str, bool, str]],
    ) -> PagePart:
        part = PagePart.objects.create(page=page, part_type=PagePartType.CONVERSATION, order=order)
        conv = ConversationPart.objects.create(page_part=part, context=context)
        for i, (speaker, text, translation, is_blank, blank_answer) in enumerate(lines):
            ConversationLine.objects.create(
                conversation=conv,
                order=i,
                speaker=speaker,
                text=text,
                translation=translation,
                is_blank=is_blank,
                blank_answer=blank_answer,
            )
        return part

    def _link_items(self, page: Page, items: list[LexicalItem]) -> None:
        for i, item in enumerate(items):
            PageLexicalItem.objects.create(page=page, item=item, order=i)

    def _find_items(self, level_code: str, item_type: str, texts: list[str]) -> list[LexicalItem]:
        found = []
        for text in texts:
            try:
                item = LexicalItem.objects.get(text=text, type=item_type, level__code=level_code)
                found.append(item)
            except LexicalItem.DoesNotExist:
                self.stderr.write(f"    Warning: {item_type} '{text}' not found in {level_code}")
        return found

    # ------------------------------------------------------------------ #
    # A1.1 English Pack
    # ------------------------------------------------------------------ #

    def _seed_a1_1_en(self, pack: Pack) -> None:
        self.stdout.write(self.style.MIGRATE_HEADING("Seeding A1.1 English pages..."))
        level_code = "A1.1"

        # --- Page 0: Greetings & First Words ---
        p = self._create_page(pack, "Greetings & First Words", "How to greet people in German", 0)
        self._add_note(p, 0, (
            "Germans greet differently depending on the time of day and formality. "
            "'Guten Morgen' (good morning), 'Guten Tag' (good day), and 'Guten Abend' "
            "(good evening) are standard greetings. 'Hallo' works anytime informally."
        ))
        self._add_table(p, 1,
            headers=["Deutsch", "English"],
            rows=[
                ["Guten Morgen", "Good morning"],
                ["Guten Tag", "Good day / Hello"],
                ["Guten Abend", "Good evening"],
                ["Hallo / Hi", "Hello / Hi (informal)"],
                ["Auf Wiedersehen", "Goodbye (formal)"],
                ["Tschüss / Tschau", "Bye (informal)"],
                ["Bis bald / Bis später", "See you soon / later"],
                ["Bis morgen", "See you tomorrow"],
            ],
        )
        self._add_fill_blank(p, 2, "Guten", ", wie geht es Ihnen?", "Tag", "The standard daytime greeting")
        items = self._find_items(level_code, "vocab", [
            "Guten Morgen", "Guten Tag", "Guten Abend", "Hallo / Hi",
            "Auf Wiedersehen", "Tschüss / Tschau", "Bis bald / Bis später", "Bis morgen",
        ])
        self._link_items(p, items)

        # --- Page 1: Introducing Yourself ---
        p = self._create_page(pack, "Introducing Yourself", "Essential phrases for meeting people", 1)
        self._add_note(p, 0, (
            "When you meet someone new in Germany, you'll typically share your name, "
            "where you're from, and what you do. Here are the key phrases."
        ))
        self._add_table(p, 1,
            headers=["Deutsch", "English"],
            rows=[
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
        )
        self._add_conversation(p, 2, "Meeting someone new at a language course", [
            ("Anna", "Hallo! Ich heiße Anna. Wie heißt du?", "Hello! My name is Anna. What's your name?", False, ""),
            ("Ben", "Hi! Ich bin Ben. Ich komme aus England.", "Hi! I'm Ben. I come from England.", False, ""),
            ("Anna", "Schön! Ich ___ aus Berlin.", "Nice! I come from Berlin.", True, "komme"),
            ("Ben", "Was machst du beruflich?", "What do you do for work?", False, ""),
        ])
        self._add_fill_blank(p, 3, "Ich", "Anna.", "heiße", "Verb: 'to be called'")
        items = self._find_items(level_code, "phrase", [
            "Ich heiße … / Mein Name ist …", "Ich bin … Jahre alt.",
            "Ich komme aus …", "Ich wohne in …",
            "Ich bin … (Beruf)", "Ich spreche … (Sprache)",
            "Ich buchstabiere: …", "Ich bin verheiratet / ledig.",
            "Ich habe … Kinder.",
        ])
        self._link_items(p, items)

        # --- Page 2: Personal Pronouns & du vs Sie ---
        p = self._create_page(pack, "Personal Pronouns & du vs Sie", "Subject pronouns and formal vs informal address", 2)
        self._add_note(p, 0, (
            "These are the SUBJECT pronouns (who is doing the action). "
            "Use 'du' with friends, family, children, and peers. "
            "Use 'Sie' (always capital S) with strangers, bosses, and older people. "
            "'ihr' is the informal plural (talking to a group of friends)."
        ))
        self._add_table(p, 1,
            headers=["Pronomen", "English"],
            rows=[
                ["ich", "I"],
                ["du", "you (informal)"],
                ["er / sie / es", "he / she / it"],
                ["wir", "we"],
                ["ihr", "you all (informal)"],
                ["sie / Sie", "they / you (formal)"],
            ],
        )
        self._add_fill_blank(p, 2, "Wie heißen", "?", "Sie", "Use the formal form of 'you'")

        # --- Page 3: sein & haben ---
        p = self._create_page(pack, "sein & haben", "The two most important German verbs", 3)
        self._add_table(p, 0,
            headers=["Pronomen", "sein", "Example"],
            rows=[
                ["ich", "bin", "Ich bin Anna."],
                ["du", "bist", "Du bist müde."],
                ["er/sie/es", "ist", "Er ist Lehrer."],
                ["wir", "sind", "Wir sind hier."],
                ["ihr", "seid", "Ihr seid spät."],
                ["sie/Sie", "sind", "Sie sind nett."],
            ],
        )
        self._add_table(p, 1,
            headers=["Pronomen", "haben", "Example"],
            rows=[
                ["ich", "habe", "Ich habe ein Buch."],
                ["du", "hast", "Du hast Zeit."],
                ["er/sie/es", "hat", "Sie hat Hunger."],
                ["wir", "haben", "Wir haben Kinder."],
                ["ihr", "habt", "Ihr habt Glück."],
                ["sie/Sie", "haben", "Sie haben ein Auto."],
            ],
        )
        self._add_fill_blank(p, 2, "Ich", "Anna.", "bin", "Verb 'sein' — ich form")
        self._add_fill_blank(p, 3, "Du", "Zeit.", "hast", "Verb 'haben' — du form")
        items = self._find_items(level_code, "verb", ["sein", "haben"])
        self._link_items(p, items)

        # --- Page 4: Regular Verb Conjugation ---
        p = self._create_page(pack, "Regular Verb Conjugation", "Present tense endings for regular verbs", 4)
        self._add_note(p, 0, "Remove -en from the infinitive, then add the endings below.")
        self._add_table(p, 1,
            headers=["Ending", "Example: wohnen", "Example: lernen"],
            rows=[
                ["-e  (ich)", "ich wohn-e", "ich lern-e"],
                ["-st  (du)", "du wohn-st", "du lern-st"],
                ["-t  (er/sie/es)", "er wohn-t", "er lern-t"],
                ["-en  (wir)", "wir wohn-en", "wir lern-en"],
                ["-t  (ihr)", "ihr wohn-t", "ihr lern-t"],
                ["-en  (sie/Sie)", "sie wohn-en", "sie lern-en"],
            ],
        )
        self._add_fill_blank(p, 2, "Ich", "in Berlin.", "wohne", "Verb 'wohnen' — ich form")
        items = self._find_items(level_code, "verb", ["wohnen", "lernen", "machen", "arbeiten"])
        self._link_items(p, items)

        # --- Page 5: Stem-Changing Verbs ---
        p = self._create_page(pack, "Stem-Changing Verbs", "Irregular present tense: e→i, e→ie, a→ä", 5)
        self._add_note(p, 0, "⚠ Only the du and er/sie/es forms change. The stem vowel shifts: e→i, e→ie, or a→ä.")
        self._add_table(p, 1,
            headers=["Verb", "ich", "du ⚠", "er/sie/es ⚠", "wir"],
            rows=[
                ["sprechen (speak)", "spreche", "sprichst", "spricht", "sprechen"],
                ["essen (eat)", "esse", "isst", "isst", "essen"],
                ["lesen (read)", "lese", "liest", "liest", "lesen"],
                ["fahren (drive)", "fahre", "fährst", "fährt", "fahren"],
                ["schlafen (sleep)", "schlafe", "schläfst", "schläft", "schlafen"],
                ["sehen (see)", "sehe", "siehst", "sieht", "sehen"],
            ],
        )
        self._add_fill_blank(p, 2, "Er", "ein Buch.", "liest", "Stem-change: lesen → du/er form")
        items = self._find_items(level_code, "verb", ["sprechen", "essen", "lesen", "fahren"])
        self._link_items(p, items)

        # --- Page 6: Separable Verbs ---
        p = self._create_page(pack, "Separable Verbs", "Verbs with prefixes that split off in sentences", 6)
        self._add_note(p, 0, (
            "Separable verbs have a prefix that splits off and goes to the END of the sentence. "
            "In the infinitive form, the prefix stays attached."
        ))
        self._add_table(p, 1,
            headers=["Verb", "Conjugated Example", "Meaning"],
            rows=[
                ["aufstehen", "Ich stehe um 7 auf.", "to get up"],
                ["anrufen", "Er ruft seine Mutter an.", "to call (phone)"],
                ["einkaufen", "Wir kaufen heute ein.", "to go shopping"],
                ["fernsehen", "Sie sieht abends fern.", "to watch TV"],
                ["ankommen", "Der Zug kommt an.", "to arrive"],
                ["mitkommen", "Kommst du mit?", "to come along"],
            ],
        )
        self._add_fill_blank(p, 2, "Ich stehe um 7 Uhr", ".", "auf", "Prefix of 'aufstehen'")
        items = self._find_items(level_code, "verb", ["aufstehen", "anrufen", "einkaufen"])
        self._link_items(p, items)

        # --- Page 7: Core Verb Reference ---
        p = self._create_page(pack, "Core Verb Reference", "All A1.1 verbs at a glance", 7)
        self._add_table(p, 0,
            headers=["Infinitiv", "Meaning", "Type"],
            rows=[
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
        )
        all_verbs = self._find_items(level_code, "verb", [
            "sein", "haben", "heißen", "kommen", "wohnen", "arbeiten", "lernen",
            "machen", "schreiben", "lesen", "sprechen", "essen", "fahren", "gehen",
            "kaufen", "trinken", "hören", "fragen", "antworten", "verstehen",
            "aufstehen", "anrufen", "einkaufen",
        ])
        self._link_items(p, all_verbs)

        # --- Page 8: Articles — Nominativ ---
        p = self._create_page(pack, "Articles: Nominativ", "Definite, indefinite, and negative articles for subjects", 8)
        self._add_note(p, 0, "Nominativ = who/what is the subject of the sentence.")
        self._add_table(p, 1,
            headers=["Gender", "Definite (the)", "Indefinite (a/an)", "Negative (no/not a)"],
            rows=[
                ["Maskulin (m)", "der", "ein", "kein"],
                ["Feminin (f)", "die", "eine", "keine"],
                ["Neutrum (n)", "das", "ein", "kein"],
                ["Plural", "die", "---", "keine"],
            ],
        )
        self._add_fill_blank(p, 2, "", "Mann kauft ein Buch.", "Der", "Definite article for maskulin Nominativ")

        # --- Page 9: Articles — Akkusativ ---
        p = self._create_page(pack, "Articles: Akkusativ", "Articles change for direct objects — only maskulin differs", 9)
        self._add_note(p, 0, (
            "Akkusativ = the thing directly receiving the action. Ask: Wen? Was? (Whom? What?) "
            "⚠ Only MASKULIN changes: der→den, ein→einen, kein→keinen."
        ))
        self._add_table(p, 1,
            headers=["Gender", "Definite (the)", "Indefinite (a/an)", "Negative (no)"],
            rows=[
                ["Maskulin (m) ⚠", "den", "einen", "keinen"],
                ["Feminin (f)", "die", "eine", "keine"],
                ["Neutrum (n)", "das", "ein", "kein"],
                ["Plural", "die", "---", "keine"],
            ],
        )
        self._add_note(p, 2, (
            "Nominativ vs Akkusativ — Quick Examples:\n\n"
            "• Der Mann kauft einen Apfel. → 'Der Mann' = Nominativ (subject); 'einen Apfel' = Akkusativ (maskulin → einen)\n"
            "• Ich sehe die Frau. → 'die Frau' = Akkusativ (feminin, no change)\n"
            "• Er hat ein Kind. → 'ein Kind' = Akkusativ (neutrum, no change)\n"
            "• Ich kaufe keinen Kaffee. → maskulin negation in Akkusativ → keinen"
        ))
        self._add_fill_blank(p, 3, "Der Mann kauft", "Apfel.", "einen", "Maskulin indefinite in Akkusativ")

        # --- Page 10: Negation — nicht vs kein ---
        p = self._create_page(pack, "Negation: nicht vs kein", "Two ways to say no/not in German", 10)
        self._add_note(p, 0, "Two ways to say 'no/not' — use the right one!")
        self._add_table(p, 1,
            headers=["Rule", "Example", "Meaning"],
            rows=[
                ["nicht → negates verbs, adjectives, adverbs", "Ich arbeite nicht.", "I don't work."],
                ["nicht → negates specific nouns with definite article", "Ich kaufe das Buch nicht.", "I'm not buying the book."],
                ["kein/keine → negates nouns with indefinite article or no article", "Ich habe kein Auto.", "I have no car."],
                ["kein/keine → also replaces ein/eine", "Das ist kein Lehrer.", "That's not a teacher."],
            ],
        )
        self._add_fill_blank(p, 2, "Ich habe", "Auto.", "kein", "Negation with indefinite article")

        # --- Page 11: Noun Plurals ---
        p = self._create_page(pack, "Noun Plurals", "The 5 main plural patterns in German", 11)
        self._add_note(p, 0, "German plurals are irregular — always learn noun + article + plural together!")
        self._add_table(p, 1,
            headers=["Pattern", "Example Singular", "Example Plural"],
            rows=[
                ["-e  (often maskulin)", "der Tag", "die Tage"],
                ["-(e)n  (often feminin)", "die Frau", "die Frauen"],
                ["-er  (often neutrum)", "das Kind", "die Kinder"],
                ["umlaut + -e", "der Mann", "die Männer"],
                ["-s  (foreign words)", "das Auto", "die Autos"],
                ["no change", "der Lehrer", "die Lehrer"],
            ],
        )

        # --- Page 12: Sentence Structure & W-Questions ---
        p = self._create_page(pack, "Sentence Structure & W-Questions", "Word order rules and question words", 12)
        self._add_note(p, 0, (
            "Sentence Structure (Wortstellung):\n\n"
            "• Statement: Subject → Verb(pos.2) → Rest  |  Ich wohne in Berlin.\n"
            "• Inversion: Adverb → Verb(pos.2) → Subject  |  Heute wohne ich in Berlin.\n"
            "• Yes/No question: Verb → Subject → Rest?  |  Wohnst du in Berlin?\n"
            "• W-question: W-Wort → Verb → Subject → Rest?  |  Wo wohnst du?\n"
            "• With separable: Prefix goes to very end  |  Er ruft um 8 an.\n\n"
            "⚠ The conjugated verb is ALWAYS in position 2 in statements."
        ))
        self._add_table(p, 1,
            headers=["Frage", "Meaning", "Example"],
            rows=[
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
        )
        self._add_fill_blank(p, 2, "", "wohnst du?", "Wo", "Question word for location")

        # --- Page 13: Classroom Phrases ---
        p = self._create_page(pack, "Classroom Phrases", "Useful phrases for the language classroom", 13)
        self._add_table(p, 0,
            headers=["Deutsch", "English"],
            rows=[
                ["Wie bitte?", "Pardon? / Could you repeat?"],
                ["Ich verstehe nicht.", "I don't understand."],
                ["Was bedeutet …?", "What does … mean?"],
                ["Können Sie bitte langsamer sprechen?", "Can you please speak slower?"],
                ["Bitte.", "Please / You're welcome."],
                ["Danke / Danke schön.", "Thank you / Thank you very much."],
                ["Entschuldigung.", "Excuse me / Sorry."],
                ["Kein Problem.", "No problem."],
            ],
        )
        self._add_conversation(p, 1, "In the classroom", [
            ("Lehrer", "Guten Tag! Heute lernen wir Zahlen.", "Good day! Today we learn numbers.", False, ""),
            ("Schüler", "Wie bitte? Können Sie bitte langsamer sprechen?", "Pardon? Can you please speak slower?", False, ""),
            ("Lehrer", "Natürlich! Heute lernen wir Zahlen.", "Of course! Today we learn numbers.", False, ""),
            ("Schüler", "Danke! Was ___ 'Zahlen'?", "Thanks! What does 'Zahlen' mean?", True, "bedeutet"),
        ])
        self._add_fill_blank(p, 2, "Ich", "nicht.", "verstehe", "Verb: 'to understand'")
        items = self._find_items(level_code, "phrase", [
            "Wie bitte?", "Ich verstehe nicht.", "Was bedeutet …?",
            "Können Sie bitte langsamer sprechen?", "Bitte.",
            "Danke / Danke schön.", "Entschuldigung.", "Kein Problem.",
        ])
        self._link_items(p, items)

        page_count = Page.objects.filter(pack=pack).count()
        part_count = PagePart.objects.filter(page__pack=pack).count()
        item_count = PageLexicalItem.objects.filter(page__pack=pack).count()
        self.stdout.write(self.style.SUCCESS(
            f"\nCreated {page_count} pages, {part_count} parts, {item_count} item links for '{pack.title}'"
        ))
