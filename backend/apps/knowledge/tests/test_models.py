import pytest
from django.db import IntegrityError

from apps.knowledge.constants import LexicalItemType, RelationshipType
from apps.knowledge.tests.factories import (
    ExampleSentenceFactory,
    GrammarRuleDetailFactory,
    ItemRelationshipFactory,
    LearningGoalFactory,
    LexicalItemFactory,
    NounDetailFactory,
    PhraseDetailFactory,
    ReferenceSheetFactory,
    VerbDetailFactory,
)


@pytest.mark.django_db
class TestLearningGoal:
    def test_str(self):
        goal = LearningGoalFactory(name="Exam prep")
        assert str(goal) == "Exam prep"

    def test_unique_slug(self):
        LearningGoalFactory(slug="test-goal")
        with pytest.raises(IntegrityError):
            LearningGoalFactory(slug="test-goal")


@pytest.mark.django_db
class TestLexicalItem:
    def test_str(self):
        item = LexicalItemFactory(text="Tisch", type=LexicalItemType.VOCAB)
        assert "Tisch" in str(item)
        assert "Vocabulary" in str(item)

    def test_unique_constraint_text_type_level(self):
        item = LexicalItemFactory(text="Haus", type=LexicalItemType.VOCAB)
        with pytest.raises(IntegrityError):
            LexicalItemFactory(
                text="Haus",
                type=LexicalItemType.VOCAB,
                level=item.level,
            )

    def test_same_text_different_type_allowed(self):
        item = LexicalItemFactory(text="laufen", type=LexicalItemType.VOCAB)
        item2 = LexicalItemFactory(
            text="laufen",
            type=LexicalItemType.VERB,
            level=item.level,
        )
        assert item.pk != item2.pk


@pytest.mark.django_db
class TestDetailTables:
    def test_noun_detail_cascades_on_item_delete(self):
        noun = NounDetailFactory()
        item_pk = noun.item.pk
        noun.item.delete()
        from apps.knowledge.models import NounDetail

        assert not NounDetail.objects.filter(item_id=item_pk).exists()

    def test_verb_detail_str(self):
        verb = VerbDetailFactory(auxiliary_verb="haben")
        assert "haben" in str(verb)

    def test_phrase_detail_str(self):
        phrase = PhraseDetailFactory()
        assert "Neutral" in str(phrase)

    def test_grammar_rule_detail_str(self):
        rule = GrammarRuleDetailFactory()
        assert rule.item.text in str(rule)


@pytest.mark.django_db
class TestItemRelationship:
    def test_str(self):
        rel = ItemRelationshipFactory(relationship_type=RelationshipType.SYNONYM)
        assert "synonym" in str(rel)

    def test_unique_constraint(self):
        rel = ItemRelationshipFactory()
        with pytest.raises(IntegrityError):
            ItemRelationshipFactory(
                from_item=rel.from_item,
                to_item=rel.to_item,
                relationship_type=rel.relationship_type,
            )

    def test_different_relationship_type_allowed(self):
        rel = ItemRelationshipFactory(relationship_type=RelationshipType.SYNONYM)
        rel2 = ItemRelationshipFactory(
            from_item=rel.from_item,
            to_item=rel.to_item,
            relationship_type=RelationshipType.CONFUSABLE,
        )
        assert rel.pk != rel2.pk


@pytest.mark.django_db
class TestExampleSentence:
    def test_str(self):
        ex = ExampleSentenceFactory(text="Der Tisch ist groß.")
        assert "Der Tisch ist groß." in str(ex)


@pytest.mark.django_db
class TestReferenceSheet:
    def test_str(self):
        sheet = ReferenceSheetFactory(title="Verb Conjugations")
        assert "Verb Conjugations" in str(sheet)
