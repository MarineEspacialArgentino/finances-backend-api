from rest_framework import status
from rest_framework.test import APITestCase


class TestUsersEndpoints(APITestCase):
    def setUp(self):
        self.register_url = "/api/register/"
        self.token_url = "/api/token/"
        self.users_url = "/api/usuarios/"

    def test_register_and_obtain_token(self):
        payload = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "StrongPass123",
        }
        resp = self.client.post(self.register_url, payload, format="json")
        assert resp.status_code == status.HTTP_201_CREATED

        token_resp = self.client.post(self.token_url, {
            "username": payload["username"],
            "password": payload["password"],
        }, format="json")
        assert token_resp.status_code == status.HTTP_200_OK
        assert "access" in token_resp.data
        assert "refresh" in token_resp.data

    def test_users_requires_auth(self):
        # Sin token -> 401
        resp = self.client.get(self.users_url)
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED

        # Con token -> 200
        self.client.post(self.register_url, {
            "username": "authuser",
            "email": "auth@example.com",
            "password": "StrongPass123",
        }, format="json")
        token = self.client.post(self.token_url, {
            "username": "authuser",
            "password": "StrongPass123",
        }, format="json").data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        resp2 = self.client.get(self.users_url)
        assert resp2.status_code == status.HTTP_200_OK
