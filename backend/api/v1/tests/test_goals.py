import pytest
from rest_framework.test import APIClient

from apps.knowledge.tests.factories import LearningGoalFactory


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
class TestGoalsList:
    def test_returns_goals(self, api_client):
        g1 = LearningGoalFactory(name="Exam", order=1)
        g2 = LearningGoalFactory(name="Living", order=2)

        response = api_client.get("/api/v1/goals/")
        assert response.status_code == 200
        names = [g["name"] for g in response.data]
        assert g1.name in names
        assert g2.name in names

    def test_no_auth_required(self, api_client):
        response = api_client.get("/api/v1/goals/")
        assert response.status_code == 200

    def test_no_pagination(self, api_client):
        for i in range(5):
            LearningGoalFactory(order=i + 10)

        response = api_client.get("/api/v1/goals/")
        assert isinstance(response.data, list)
        assert len(response.data) >= 5

    def test_returns_all_fields(self, api_client):
        goal = LearningGoalFactory(
            name="Custom Goal",
            slug="custom-goal",
            description="A custom goal",
            icon="star",
            order=99,
        )
        response = api_client.get("/api/v1/goals/")
        match = next(g for g in response.data if str(g["id"]) == str(goal.id))
        assert match["name"] == "Custom Goal"
        assert match["slug"] == "custom-goal"
        assert match["description"] == "A custom goal"
        assert match["icon"] == "star"
        assert match["order"] == 99
