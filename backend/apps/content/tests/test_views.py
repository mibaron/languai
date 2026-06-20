import pytest
from rest_framework.test import APIClient

from apps.knowledge.tests.factories import LexicalItemFactory
from apps.packs.tests.factories import PackFactory, UserFactory

from .factories import (
    ConversationLineFactory,
    ConversationPartFactory,
    FillBlankPartFactory,
    PageFactory,
    PageLexicalItemFactory,
    PagePartFactory,
    TablePartFactory,
    TeachingNotePartFactory,
)


@pytest.fixture
def user():
    return UserFactory()


@pytest.fixture
def auth_client(user):
    client = APIClient()
    client.force_authenticate(user=user)
    return client


@pytest.mark.django_db
class TestPackPageListView:
    def test_unauthenticated(self):
        pack = PackFactory()
        client = APIClient()
        response = client.get(f"/api/v1/packs/{pack.id}/pages/")
        assert response.status_code in (401, 403)

    def test_empty_pack(self, auth_client):
        pack = PackFactory()
        response = auth_client.get(f"/api/v1/packs/{pack.id}/pages/")
        assert response.status_code == 200
        assert response.data["results"] == []

    def test_returns_pages_ordered(self, auth_client):
        pack = PackFactory()
        p2 = PageFactory(pack=pack, title="Second", order=1)
        p1 = PageFactory(pack=pack, title="First", order=0)
        response = auth_client.get(f"/api/v1/packs/{pack.id}/pages/")
        assert response.status_code == 200
        titles = [p["title"] for p in response.data["results"]]
        assert titles == ["First", "Second"]

    def test_includes_part_count(self, auth_client):
        pack = PackFactory()
        page = PageFactory(pack=pack, order=0)
        PagePartFactory(page=page, order=0)
        PagePartFactory(page=page, order=1)
        response = auth_client.get(f"/api/v1/packs/{pack.id}/pages/")
        assert response.data["results"][0]["part_count"] == 2

    def test_is_studied_false_by_default(self, auth_client):
        pack = PackFactory()
        PageFactory(pack=pack, order=0)
        response = auth_client.get(f"/api/v1/packs/{pack.id}/pages/")
        assert response.data["results"][0]["is_studied"] is False

    def test_is_studied_true_after_marking(self, auth_client, user):
        pack = PackFactory()
        page = PageFactory(pack=pack, order=0)
        auth_client.post(f"/api/v1/progress/pages/{page.id}/mark-studied/")
        response = auth_client.get(f"/api/v1/packs/{pack.id}/pages/")
        assert response.data["results"][0]["is_studied"] is True

    def test_does_not_return_other_pack_pages(self, auth_client):
        pack1 = PackFactory()
        pack2 = PackFactory()
        PageFactory(pack=pack1, title="Pack1 Page", order=0)
        PageFactory(pack=pack2, title="Pack2 Page", order=0)
        response = auth_client.get(f"/api/v1/packs/{pack1.id}/pages/")
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["title"] == "Pack1 Page"

    def test_is_studied_per_user(self, auth_client, user):
        pack = PackFactory()
        page = PageFactory(pack=pack, order=0)
        auth_client.post(f"/api/v1/progress/pages/{page.id}/mark-studied/")

        other_user = UserFactory()
        other_client = APIClient()
        other_client.force_authenticate(user=other_user)
        response = other_client.get(f"/api/v1/packs/{pack.id}/pages/")
        assert response.data["results"][0]["is_studied"] is False

    def test_list_includes_description(self, auth_client):
        pack = PackFactory()
        PageFactory(pack=pack, order=0, description="A page about greetings")
        response = auth_client.get(f"/api/v1/packs/{pack.id}/pages/")
        assert response.data["results"][0]["description"] == "A page about greetings"


@pytest.mark.django_db
class TestPackPageDetailView:
    def test_unauthenticated(self):
        pack = PackFactory()
        page = PageFactory(pack=pack, order=0)
        client = APIClient()
        response = client.get(f"/api/v1/packs/{pack.id}/pages/{page.id}/")
        assert response.status_code in (401, 403)

    def test_returns_page_with_parts(self, auth_client):
        pack = PackFactory()
        page = PageFactory(pack=pack, title="Greetings", order=0)
        note_part = PagePartFactory(page=page, part_type="note", order=0)
        TeachingNotePartFactory(page_part=note_part, content="Learn basic greetings")

        response = auth_client.get(f"/api/v1/packs/{pack.id}/pages/{page.id}/")
        assert response.status_code == 200
        assert response.data["title"] == "Greetings"
        assert len(response.data["parts"]) == 1
        assert response.data["parts"][0]["part_type"] == "note"
        assert response.data["parts"][0]["detail"]["content"] == "Learn basic greetings"

    def test_fill_blank_part(self, auth_client):
        pack = PackFactory()
        page = PageFactory(pack=pack, order=0)
        fb_part = PagePartFactory(page=page, part_type="fill_blank", order=0)
        FillBlankPartFactory(
            page_part=fb_part,
            text_before="Ich",
            text_after="Anna.",
            answer="heiße",
            hint="verb",
        )

        response = auth_client.get(f"/api/v1/packs/{pack.id}/pages/{page.id}/")
        detail = response.data["parts"][0]["detail"]
        assert detail["text_before"] == "Ich"
        assert detail["answer"] == "heiße"
        assert detail["hint"] == "verb"

    def test_conversation_part_with_lines(self, auth_client):
        pack = PackFactory()
        page = PageFactory(pack=pack, order=0)
        conv_part = PagePartFactory(page=page, part_type="conversation", order=0)
        conv = ConversationPartFactory(page_part=conv_part, context="At a café")
        ConversationLineFactory(conversation=conv, order=0, speaker="A", text="Hallo!")
        ConversationLineFactory(conversation=conv, order=1, speaker="B", text="Tag!")

        response = auth_client.get(f"/api/v1/packs/{pack.id}/pages/{page.id}/")
        detail = response.data["parts"][0]["detail"]
        assert detail["context"] == "At a café"
        assert len(detail["lines"]) == 2
        assert detail["lines"][0]["speaker"] == "A"
        assert detail["lines"][1]["speaker"] == "B"

    def test_includes_lexical_items(self, auth_client):
        pack = PackFactory()
        page = PageFactory(pack=pack, order=0)
        pli = PageLexicalItemFactory(page=page, display_label="Custom Label")

        response = auth_client.get(f"/api/v1/packs/{pack.id}/pages/{page.id}/")
        items = response.data["lexical_items"]
        assert len(items) == 1
        assert items[0]["display_label"] == "Custom Label"
        assert items[0]["item_id"] == str(pli.item.id)
        assert items[0]["text"] == pli.item.text

    def test_mixed_parts_ordered(self, auth_client):
        pack = PackFactory()
        page = PageFactory(pack=pack, order=0)
        note_part = PagePartFactory(page=page, part_type="note", order=0)
        TeachingNotePartFactory(page_part=note_part, content="Intro")
        conv_part = PagePartFactory(page=page, part_type="conversation", order=1)
        ConversationPartFactory(page_part=conv_part, context="Dialog")
        fb_part = PagePartFactory(page=page, part_type="fill_blank", order=2)
        FillBlankPartFactory(page_part=fb_part, text_before="A", text_after="B", answer="C")

        response = auth_client.get(f"/api/v1/packs/{pack.id}/pages/{page.id}/")
        parts = response.data["parts"]
        assert len(parts) == 3
        assert [p["part_type"] for p in parts] == ["note", "conversation", "fill_blank"]
        assert [p["order"] for p in parts] == [0, 1, 2]

    def test_fill_blank_with_linked_item(self, auth_client):
        pack = PackFactory()
        page = PageFactory(pack=pack, order=0)
        item = LexicalItemFactory(text="heiße")
        fb_part = PagePartFactory(page=page, part_type="fill_blank", order=0)
        FillBlankPartFactory(page_part=fb_part, answer="heiße", item=item)

        response = auth_client.get(f"/api/v1/packs/{pack.id}/pages/{page.id}/")
        detail = response.data["parts"][0]["detail"]
        assert detail["item_id"] == str(item.id)

    def test_fill_blank_without_item(self, auth_client):
        pack = PackFactory()
        page = PageFactory(pack=pack, order=0)
        fb_part = PagePartFactory(page=page, part_type="fill_blank", order=0)
        FillBlankPartFactory(page_part=fb_part, item=None)

        response = auth_client.get(f"/api/v1/packs/{pack.id}/pages/{page.id}/")
        detail = response.data["parts"][0]["detail"]
        assert detail["item_id"] is None

    def test_conversation_blank_line(self, auth_client):
        pack = PackFactory()
        page = PageFactory(pack=pack, order=0)
        conv_part = PagePartFactory(page=page, part_type="conversation", order=0)
        conv = ConversationPartFactory(page_part=conv_part)
        ConversationLineFactory(
            conversation=conv, order=0, speaker="A",
            text="Können ___ mir helfen?", is_blank=True, blank_answer="Sie",
        )

        response = auth_client.get(f"/api/v1/packs/{pack.id}/pages/{page.id}/")
        line = response.data["parts"][0]["detail"]["lines"][0]
        assert line["is_blank"] is True
        assert line["blank_answer"] == "Sie"

    def test_part_without_detail_returns_null(self, auth_client):
        pack = PackFactory()
        page = PageFactory(pack=pack, order=0)
        PagePartFactory(page=page, part_type="note", order=0)

        response = auth_client.get(f"/api/v1/packs/{pack.id}/pages/{page.id}/")
        assert response.data["parts"][0]["detail"] is None

    def test_multiple_lexical_items_ordered(self, auth_client):
        pack = PackFactory()
        page = PageFactory(pack=pack, order=0)
        item1 = LexicalItemFactory(text="Hund")
        item2 = LexicalItemFactory(text="Katze")
        PageLexicalItemFactory(page=page, item=item1, order=0)
        PageLexicalItemFactory(page=page, item=item2, order=1)

        response = auth_client.get(f"/api/v1/packs/{pack.id}/pages/{page.id}/")
        items = response.data["lexical_items"]
        assert len(items) == 2
        assert items[0]["text"] == "Hund"
        assert items[1]["text"] == "Katze"

    def test_table_part(self, auth_client):
        pack = PackFactory()
        page = PageFactory(pack=pack, order=0)
        table_part = PagePartFactory(page=page, part_type="table", order=0)
        TablePartFactory(
            page_part=table_part,
            headers=["Pronomen", "English"],
            rows=[["ich", "I"], ["du", "you"]],
            note="Subject pronouns",
        )

        response = auth_client.get(f"/api/v1/packs/{pack.id}/pages/{page.id}/")
        assert response.status_code == 200
        detail = response.data["parts"][0]["detail"]
        assert detail["headers"] == ["Pronomen", "English"]
        assert detail["rows"] == [["ich", "I"], ["du", "you"]]
        assert detail["note"] == "Subject pronouns"

    def test_404_for_wrong_pack(self, auth_client):
        pack1 = PackFactory()
        pack2 = PackFactory()
        page = PageFactory(pack=pack1, order=0)
        response = auth_client.get(f"/api/v1/packs/{pack2.id}/pages/{page.id}/")
        assert response.status_code == 404
