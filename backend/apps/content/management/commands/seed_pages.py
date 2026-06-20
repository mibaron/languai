from django.core.management.base import BaseCommand
from django.db import transaction

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
from apps.exercise_engine.constants import ExerciseSource, ExerciseType
from apps.exercise_engine.models import (
    Exercise,
    FillBlankExercise,
    FlashcardExercise,
    MCQChoice,
    MCQExercise,
    SentenceOrderExercise,
)
from apps.knowledge.models import LexicalItem
from apps.packs.models import Pack


class Command(BaseCommand):
    help = "Seed dummy pages with parts and exercises for testing"

    @transaction.atomic
    def handle(self, *args, **options):
        pack = Pack.objects.first()
        if not pack:
            self.stderr.write("No packs found. Run seed data first.")
            return

        if Page.objects.filter(pack=pack).exists():
            self.stdout.write(f"Pages already exist for pack '{pack.title}'. Skipping.")
            return

        items = list(LexicalItem.objects.filter(is_active=True)[:5])
        if len(items) < 3:
            self.stderr.write("Need at least 3 LexicalItems. Seed knowledge data first.")
            return

        # --- Page 1: Formal Sie vs. Informal Du ---
        page1 = Page.objects.create(pack=pack, title="Formal Sie vs. Informal Du", order=0)

        for i, item in enumerate(items[:3]):
            PageLexicalItem.objects.create(page=page1, item=item, order=i)

        part1 = PagePart.objects.create(page=page1, part_type=PagePartType.NOTE, order=0)
        TeachingNotePart.objects.create(
            page_part=part1,
            content=(
                "In German, there are two ways to say 'you'. "
                "'Sie' (capitalized) is formal — use it with strangers, "
                "older people, and in professional settings. "
                "'du' is informal — use it with friends, family, and children."
            ),
        )

        part2 = PagePart.objects.create(page=page1, part_type=PagePartType.CONVERSATION, order=1)
        conv = ConversationPart.objects.create(page_part=part2, context="At a hotel reception")
        for i, (speaker, text, translation, is_blank, blank_answer) in enumerate([
            ("Receptionist", "Guten Tag! Wie heißen Sie?", "Good day! What is your name?", False, ""),
            ("Guest", "Ich heiße Anna Müller.", "My name is Anna Müller.", False, ""),
            ("Receptionist", "Können ___ mir Ihren Ausweis zeigen?", "Can you show me your ID?", True, "Sie"),
            ("Guest", "Ja, natürlich. Hier bitte.", "Yes, of course. Here you go.", False, ""),
        ]):
            ConversationLine.objects.create(
                conversation=conv, order=i, speaker=speaker,
                text=text, translation=translation,
                is_blank=is_blank, blank_answer=blank_answer,
            )

        part3 = PagePart.objects.create(page=page1, part_type=PagePartType.FILL_BLANK, order=2)
        FillBlankPart.objects.create(
            page_part=part3,
            text_before="Können",
            text_after="mir helfen?",
            answer="Sie",
            hint="Use the formal form of 'you'",
        )

        # --- Page 2: Basic Greetings ---
        page2 = Page.objects.create(pack=pack, title="Basic Greetings", order=1)

        for i, item in enumerate(items[3:5]):
            PageLexicalItem.objects.create(page=page2, item=item, order=i)

        part4 = PagePart.objects.create(page=page2, part_type=PagePartType.NOTE, order=0)
        TeachingNotePart.objects.create(
            page_part=part4,
            content=(
                "Germans greet differently depending on the time of day. "
                "'Guten Morgen' (good morning), 'Guten Tag' (good day), "
                "'Guten Abend' (good evening). 'Hallo' works anytime informally."
            ),
        )

        part5 = PagePart.objects.create(page=page2, part_type=PagePartType.FILL_BLANK, order=1)
        FillBlankPart.objects.create(
            page_part=part5,
            text_before="Guten",
            text_after=", wie geht es Ihnen?",
            answer="Tag",
            hint="The standard daytime greeting",
        )

        # --- Seed exercises for bound items ---
        item0, item1, item2 = items[0], items[1], items[2]

        ex1 = Exercise.objects.create(
            pack=pack, item=item0, page=page1,
            exercise_type=ExerciseType.FLASHCARD,
            source=ExerciseSource.ENGINE,
        )
        FlashcardExercise.objects.create(
            exercise=ex1,
            front_text=item0.text, back_text=item0.translation,
            front_context="Formal address", back_context="",
        )

        ex2 = Exercise.objects.create(
            pack=pack, item=item1, page=page1,
            exercise_type=ExerciseType.MCQ_RECOGNITION,
            source=ExerciseSource.ENGINE,
        )
        mcq = MCQExercise.objects.create(exercise=ex2, question=f"What does '{item1.text}' mean?")
        MCQChoice.objects.create(mcq=mcq, text=item1.translation, is_correct=True, order=0)
        MCQChoice.objects.create(mcq=mcq, text="Goodbye", is_correct=False, order=1)
        MCQChoice.objects.create(mcq=mcq, text="Thank you", is_correct=False, order=2)
        MCQChoice.objects.create(mcq=mcq, text="Please", is_correct=False, order=3)

        ex3 = Exercise.objects.create(
            pack=pack, item=item2, page=page1,
            exercise_type=ExerciseType.FILL_BLANK,
            source=ExerciseSource.ENGINE,
        )
        FillBlankExercise.objects.create(
            exercise=ex3,
            text_before="Können", text_after="mir helfen?",
            answer="Sie", accept_alternatives=["sie"],
            hint="Formal 'you'",
        )

        ex4 = Exercise.objects.create(
            pack=pack, item=item0, page=page1,
            exercise_type=ExerciseType.SENTENCE_ORDER,
            source=ExerciseSource.ENGINE,
        )
        SentenceOrderExercise.objects.create(
            exercise=ex4,
            jumbled_words=["heißen", "Sie", "wie"],
            correct_answers=[["Wie", "heißen", "Sie"]],
            hint="Verb in second position",
        )

        self.stdout.write(self.style.SUCCESS(
            f"Created 2 pages with parts and 4 exercises for pack '{pack.title}'"
        ))
