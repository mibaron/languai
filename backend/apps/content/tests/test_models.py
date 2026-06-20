import pytest
from django.db import IntegrityError

from apps.content.models import PagePartType

from .factories import (
    ConversationLineFactory,
    ConversationPartFactory,
    FillBlankPartFactory,
    PageFactory,
    PageLexicalItemFactory,
    PagePartFactory,
    TeachingNotePartFactory,
)


@pytest.mark.django_db
class TestPage:
    def test_create_page(self):
        page = PageFactory(title="Formal Sie vs. Informal Du")
        assert page.title == "Formal Sie vs. Informal Du"
        assert page.pack is not None

    def test_unique_order_per_pack(self):
        page = PageFactory(order=0)
        with pytest.raises(IntegrityError):
            PageFactory(pack=page.pack, order=0)

    def test_pages_ordered_by_pack_and_order(self):
        page = PageFactory(order=0)
        p2 = PageFactory(pack=page.pack, order=2)
        p1 = PageFactory(pack=page.pack, order=1)
        pages = list(page.pack.pages.all())
        assert pages == [page, p1, p2]

    def test_str(self):
        page = PageFactory(title="Greetings")
        assert "Greetings" in str(page)


@pytest.mark.django_db
class TestPageLexicalItem:
    def test_bind_item_to_page(self):
        pli = PageLexicalItemFactory(display_label="zu + Dativ")
        assert pli.display_label == "zu + Dativ"
        assert pli.page.items.count() == 1

    def test_unique_item_per_page(self):
        pli = PageLexicalItemFactory()
        with pytest.raises(IntegrityError):
            PageLexicalItemFactory(page=pli.page, item=pli.item)

    def test_same_item_in_different_pages(self):
        pli = PageLexicalItemFactory()
        pli2 = PageLexicalItemFactory(item=pli.item)
        assert pli.item == pli2.item
        assert pli.page != pli2.page

    def test_display_label_defaults_empty(self):
        pli = PageLexicalItemFactory()
        assert pli.display_label == ""

    def test_str_uses_display_label_or_item_text(self):
        pli = PageLexicalItemFactory(display_label="Custom")
        assert "Custom" in str(pli)


@pytest.mark.django_db
class TestPagePart:
    def test_create_teaching_note_part(self):
        note = TeachingNotePartFactory(content="German has two forms of 'you'.")
        assert note.page_part.part_type == PagePartType.NOTE
        assert note.content == "German has two forms of 'you'."

    def test_create_fill_blank_part(self):
        fb = FillBlankPartFactory(
            text_before="Ich",
            text_after="Anna.",
            answer="heiße",
            hint="Verb for 'to be called'",
        )
        assert fb.page_part.part_type == PagePartType.FILL_BLANK
        assert fb.answer == "heiße"
        assert fb.hint == "Verb for 'to be called'"

    def test_fill_blank_optional_item_link(self):
        fb = FillBlankPartFactory(item=None)
        assert fb.item is None

    def test_create_conversation_part(self):
        conv = ConversationPartFactory(context="At a hotel")
        assert conv.page_part.part_type == PagePartType.CONVERSATION
        assert conv.context == "At a hotel"

    def test_unique_order_per_page(self):
        part = PagePartFactory(order=0)
        with pytest.raises(IntegrityError):
            PagePartFactory(page=part.page, order=0)

    def test_parts_ordered_by_order(self):
        page = PageFactory()
        p2 = PagePartFactory(page=page, order=2)
        p0 = PagePartFactory(page=page, order=0)
        p1 = PagePartFactory(page=page, order=1)
        parts = list(page.parts.all())
        assert parts == [p0, p1, p2]


@pytest.mark.django_db
class TestConversationLine:
    def test_create_line(self):
        line = ConversationLineFactory(
            speaker="Max",
            text="Wie heißen Sie?",
            translation="What is your name?",
        )
        assert line.speaker == "Max"
        assert line.translation == "What is your name?"

    def test_blank_line(self):
        line = ConversationLineFactory(
            is_blank=True,
            blank_answer="Sie",
            text="Können ___ mir helfen?",
        )
        assert line.is_blank is True
        assert line.blank_answer == "Sie"

    def test_unique_order_per_conversation(self):
        line = ConversationLineFactory(order=0)
        with pytest.raises(IntegrityError):
            ConversationLineFactory(conversation=line.conversation, order=0)

    def test_lines_ordered(self):
        conv = ConversationPartFactory()
        l2 = ConversationLineFactory(conversation=conv, order=2, speaker="B")
        l0 = ConversationLineFactory(conversation=conv, order=0, speaker="A")
        l1 = ConversationLineFactory(conversation=conv, order=1, speaker="B")
        lines = list(conv.lines.all())
        assert lines == [l0, l1, l2]
