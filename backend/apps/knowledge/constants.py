from django.db import models


class LexicalItemType(models.TextChoices):
    VOCAB = "vocab", "Vocabulary"
    VERB = "verb", "Verb"
    PHRASE = "phrase", "Phrase"
    GRAMMAR_RULE = "grammar_rule", "Grammar Rule"


class PartOfSpeech(models.TextChoices):
    NOUN = "noun", "Noun"
    VERB = "verb", "Verb"
    ADJECTIVE = "adjective", "Adjective"
    ADVERB = "adverb", "Adverb"
    PREPOSITION = "preposition", "Preposition"
    CONJUNCTION = "conjunction", "Conjunction"
    PRONOUN = "pronoun", "Pronoun"
    ARTICLE = "article", "Article"
    PARTICLE = "particle", "Particle"
    OTHER = "other", "Other"


class RelationshipType(models.TextChoices):
    SYNONYM = "synonym", "Synonym"
    ANTONYM = "antonym", "Antonym"
    CONFUSABLE = "confusable", "Confusable"
    COMPOUND_OF = "compound_of", "Compound Of"
    DERIVATION = "derivation", "Derivation"


class Gender(models.TextChoices):
    MASCULINE = "m", "Masculine (der)"
    FEMININE = "f", "Feminine (die)"
    NEUTER = "n", "Neuter (das)"


class AuxiliaryVerb(models.TextChoices):
    HABEN = "haben", "haben"
    SEIN = "sein", "sein"


class FormalityLevel(models.TextChoices):
    FORMAL = "formal", "Formal"
    NEUTRAL = "neutral", "Neutral"
    INFORMAL = "informal", "Informal"
    COLLOQUIAL = "colloquial", "Colloquial"


class ReferenceSheetType(models.TextChoices):
    TABLE = "table", "Table"
    GRID = "grid", "Grid"
    NOTES = "notes", "Notes"
