import pytest
from django.core.management import call_command

from apps.content.models import Page, PageLexicalItem, PagePart, PagePartType, TablePart
from apps.knowledge.tests.factories import LexicalItemFactory
from apps.packs.tests.factories import LevelFactory, PackFactory


@pytest.fixture
def a1_1_pack():
    level = LevelFactory(code="A1.1", name="A1.1")
    return PackFactory(slug="a1-1-en", level=level)


@pytest.fixture
def a1_1_items(a1_1_pack):
    level = a1_1_pack.level
    items = []

    vocab_texts = [
        ("Guten Morgen", "Good morning"),
        ("Guten Tag", "Good day / Hello"),
        ("Guten Abend", "Good evening"),
        ("Hallo / Hi", "Hello / Hi (informal)"),
        ("Auf Wiedersehen", "Goodbye (formal)"),
        ("Tschüss / Tschau", "Bye (informal)"),
        ("Bis bald / Bis später", "See you soon / later"),
        ("Bis morgen", "See you tomorrow"),
    ]
    for text, translation in vocab_texts:
        item = LexicalItemFactory(text=text, translation=translation, type="vocab", level=level)
        items.append(item)
        a1_1_pack.items.add(item)

    verb_texts = [
        ("sein", "to be"), ("haben", "to have"), ("heißen", "to be called"),
        ("kommen", "to come"), ("wohnen", "to live/reside"), ("arbeiten", "to work"),
        ("lernen", "to learn"), ("machen", "to do/make"), ("schreiben", "to write"),
        ("lesen", "to read"), ("sprechen", "to speak"), ("essen", "to eat"),
        ("fahren", "to drive/travel"), ("gehen", "to go (on foot)"), ("kaufen", "to buy"),
        ("trinken", "to drink"), ("hören", "to hear/listen"), ("fragen", "to ask"),
        ("antworten", "to answer"), ("verstehen", "to understand"),
        ("aufstehen", "to get up"), ("anrufen", "to call"), ("einkaufen", "to shop"),
    ]
    for text, translation in verb_texts:
        item = LexicalItemFactory(text=text, translation=translation, type="verb", level=level)
        items.append(item)
        a1_1_pack.items.add(item)

    phrase_texts = [
        ("Ich heiße … / Mein Name ist …", "My name is …"),
        ("Ich bin … Jahre alt.", "I am … years old."),
        ("Ich komme aus …", "I come from …"),
        ("Ich wohne in …", "I live in …"),
        ("Ich bin … (Beruf)", "I am a … (profession)"),
        ("Ich spreche … (Sprache)", "I speak … (language)"),
        ("Ich buchstabiere: …", "I spell it: …"),
        ("Ich bin verheiratet / ledig.", "I am married / single."),
        ("Ich habe … Kinder.", "I have … children."),
        ("Wie bitte?", "Pardon? / Could you repeat?"),
        ("Ich verstehe nicht.", "I don't understand."),
        ("Was bedeutet …?", "What does … mean?"),
        ("Können Sie bitte langsamer sprechen?", "Can you please speak slower?"),
        ("Bitte.", "Please / You're welcome."),
        ("Danke / Danke schön.", "Thank you / Thank you very much."),
        ("Entschuldigung.", "Excuse me / Sorry."),
        ("Kein Problem.", "No problem."),
    ]
    for text, translation in phrase_texts:
        item = LexicalItemFactory(text=text, translation=translation, type="phrase", level=level)
        items.append(item)
        a1_1_pack.items.add(item)

    return items


@pytest.mark.django_db
class TestSeedPagesCommand:
    def test_creates_14_pages(self, a1_1_pack, a1_1_items):
        call_command("seed_pages", pack="a1-1-en")
        assert Page.objects.filter(pack=a1_1_pack).count() == 14

    def test_pages_ordered_0_to_13(self, a1_1_pack, a1_1_items):
        call_command("seed_pages", pack="a1-1-en")
        orders = list(Page.objects.filter(pack=a1_1_pack).values_list("order", flat=True))
        assert orders == list(range(14))

    def test_creates_table_parts(self, a1_1_pack, a1_1_items):
        call_command("seed_pages", pack="a1-1-en")
        table_count = PagePart.objects.filter(
            page__pack=a1_1_pack, part_type=PagePartType.TABLE
        ).count()
        assert table_count > 0
        table_part = TablePart.objects.first()
        assert len(table_part.headers) > 0
        assert len(table_part.rows) > 0

    def test_links_lexical_items(self, a1_1_pack, a1_1_items):
        call_command("seed_pages", pack="a1-1-en")
        link_count = PageLexicalItem.objects.filter(page__pack=a1_1_pack).count()
        assert link_count > 0

    def test_greetings_page_links_vocab(self, a1_1_pack, a1_1_items):
        call_command("seed_pages", pack="a1-1-en")
        greetings_page = Page.objects.get(pack=a1_1_pack, order=0)
        items = greetings_page.items.all()
        assert items.count() == 8
        assert all(i.type == "vocab" for i in items)

    def test_verb_reference_page_links_all_verbs(self, a1_1_pack, a1_1_items):
        call_command("seed_pages", pack="a1-1-en")
        verb_page = Page.objects.get(pack=a1_1_pack, order=7)
        items = verb_page.items.all()
        assert items.count() == 23

    def test_clean_flag_deletes_and_recreates(self, a1_1_pack, a1_1_items):
        call_command("seed_pages", pack="a1-1-en")
        assert Page.objects.filter(pack=a1_1_pack).count() == 14
        call_command("seed_pages", pack="a1-1-en", clean=True)
        assert Page.objects.filter(pack=a1_1_pack).count() == 14

    def test_skips_if_pages_exist(self, a1_1_pack, a1_1_items):
        call_command("seed_pages", pack="a1-1-en")
        first_page_id = Page.objects.filter(pack=a1_1_pack).first().id
        call_command("seed_pages", pack="a1-1-en")
        assert Page.objects.get(id=first_page_id).pack == a1_1_pack

    def test_invalid_pack_raises(self):
        with pytest.raises(Exception, match="not found"):
            call_command("seed_pages", pack="nonexistent")

    def test_mixed_part_types(self, a1_1_pack, a1_1_items):
        call_command("seed_pages", pack="a1-1-en")
        part_types = set(
            PagePart.objects.filter(page__pack=a1_1_pack)
            .values_list("part_type", flat=True)
        )
        assert PagePartType.NOTE in part_types
        assert PagePartType.TABLE in part_types
        assert PagePartType.FILL_BLANK in part_types
        assert PagePartType.CONVERSATION in part_types
