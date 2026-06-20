import factory

from apps.content.models import (
    ConversationLine,
    ConversationPart,
    FillBlankPart,
    Page,
    PageLexicalItem,
    PagePart,
    PagePartType,
    TeachingNotePart,
)
from apps.knowledge.tests.factories import LexicalItemFactory
from apps.packs.tests.factories import PackFactory


class PageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Page

    pack = factory.SubFactory(PackFactory)
    title = factory.Sequence(lambda n: f"Test Page {n}")
    order = factory.Sequence(lambda n: n)


class PageLexicalItemFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = PageLexicalItem

    page = factory.SubFactory(PageFactory)
    item = factory.SubFactory(LexicalItemFactory)
    order = 0


class PagePartFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = PagePart

    page = factory.SubFactory(PageFactory)
    part_type = PagePartType.NOTE
    order = factory.Sequence(lambda n: n)


class TeachingNotePartFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = TeachingNotePart

    page_part = factory.SubFactory(PagePartFactory, part_type=PagePartType.NOTE)
    content = "This is a teaching note."


class FillBlankPartFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = FillBlankPart

    page_part = factory.SubFactory(PagePartFactory, part_type=PagePartType.FILL_BLANK)
    text_before = "Können"
    text_after = "mir helfen?"
    answer = "Sie"


class ConversationPartFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ConversationPart

    page_part = factory.SubFactory(PagePartFactory, part_type=PagePartType.CONVERSATION)
    context = "At a café"


class ConversationLineFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ConversationLine

    conversation = factory.SubFactory(ConversationPartFactory)
    order = factory.Sequence(lambda n: n)
    speaker = "Anna"
    text = "Guten Tag!"
    translation = "Good day!"
