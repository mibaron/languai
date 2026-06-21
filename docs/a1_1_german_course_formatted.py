from enum import Enum
from typing import Optional, List


class TypeEnum(Enum):
    CONVERSATION = "conversation"
    FILL_BLANK = "fill_blank"
    TEACHING_NOTE = "teaching_note"


class Part:
    order: int
    type: TypeEnum
    content: Optional[str]
    context: Optional[str]
    lines: Optional[List[str]]
    text_before: Optional[str]
    answer: Optional[str]
    text_after: Optional[str]
    hint: Optional[str]

    def __init__(self, order: int, type: TypeEnum, content: Optional[str], context: Optional[str], lines: Optional[List[str]], text_before: Optional[str], answer: Optional[str], text_after: Optional[str], hint: Optional[str]) -> None:
        self.order = order
        self.type = type
        self.content = content
        self.context = context
        self.lines = lines
        self.text_before = text_before
        self.answer = answer
        self.text_after = text_after
        self.hint = hint


class Welcome3Element:
    title: str
    description: str
    parts: List[Part]

    def __init__(self, title: str, description: str, parts: List[Part]) -> None:
        self.title = title
        self.description = description
        self.parts = parts
