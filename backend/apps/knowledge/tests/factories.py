import factory

from apps.knowledge.constants import (
    AuxiliaryVerb,
    FormalityLevel,
    Gender,
    LexicalItemType,
    RelationshipType,
)
from apps.knowledge.models import (
    ExampleSentence,
    GrammarRuleDetail,
    ItemRelationship,
    LearningGoal,
    LexicalItem,
    NounDetail,
    PhraseDetail,
    ReferenceSheet,
    VerbDetail,
)
from apps.packs.tests.factories import LevelFactory


class LearningGoalFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = LearningGoal

    name = factory.Sequence(lambda n: f"Goal {n}")
    slug = factory.Sequence(lambda n: f"goal-{n}")
    description = "A test goal."
    order = factory.Sequence(lambda n: n)


class LexicalItemFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = LexicalItem

    type = LexicalItemType.VOCAB
    text = factory.Sequence(lambda n: f"Wort{n}")
    translation = factory.Sequence(lambda n: f"word{n}")
    level = factory.SubFactory(LevelFactory)
    is_active = True


class NounDetailFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = NounDetail

    item = factory.SubFactory(LexicalItemFactory, type=LexicalItemType.VOCAB)
    gender = Gender.MASCULINE
    plural = factory.LazyAttribute(lambda o: f"{o.item.text}e")


class VerbDetailFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = VerbDetail

    item = factory.SubFactory(LexicalItemFactory, type=LexicalItemType.VERB)
    auxiliary_verb = AuxiliaryVerb.HABEN


class PhraseDetailFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = PhraseDetail

    item = factory.SubFactory(LexicalItemFactory, type=LexicalItemType.PHRASE)
    formality_level = FormalityLevel.NEUTRAL


class GrammarRuleDetailFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = GrammarRuleDetail

    item = factory.SubFactory(LexicalItemFactory, type=LexicalItemType.GRAMMAR_RULE)
    description = "A grammar rule description."


class ItemRelationshipFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ItemRelationship

    from_item = factory.SubFactory(LexicalItemFactory)
    to_item = factory.SubFactory(LexicalItemFactory)
    relationship_type = RelationshipType.SYNONYM


class ExampleSentenceFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ExampleSentence

    item = factory.SubFactory(LexicalItemFactory)
    text = "Das ist ein Beispiel."
    translation = "This is an example."
    order = 0


class ReferenceSheetFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ReferenceSheet

    title = factory.Sequence(lambda n: f"Reference Sheet {n}")
    sheet_type = "table"
    level = factory.SubFactory(LevelFactory)
    headers = ["Column A", "Column B"]
    rows = [["a1", "b1"], ["a2", "b2"]]
