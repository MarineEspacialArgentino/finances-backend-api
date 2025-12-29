from rest_framework import status
from rest_framework.test import APITestCase


class TestExpensesEndpoints(APITestCase):
    def setUp(self):
        # Crear usuario y autenticar
        self.register_url = "/api/register/"
        self.token_url = "/api/token/"
        self.categories_url = "/api/categorias/"
        self.transactions_url = "/api/transacciones/"

        user_payload = {
            "username": "expenseuser",
            "email": "expense@example.com",
            "password": "StrongPass123",
        }
        self.client.post(self.register_url, user_payload, format="json")
        token = self.client.post(self.token_url, {
            "username": user_payload["username"],
            "password": user_payload["password"],
        }, format="json").data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    def test_categories_crud_minimal(self):
        # Crear categoría
        create_resp = self.client.post(self.categories_url, {
            "name": "Alimentos",
            "type": "expense",
        }, format="json")
        assert create_resp.status_code == status.HTTP_201_CREATED
        cat_id = create_resp.data["id"]

        # Listar categorías
        list_resp = self.client.get(self.categories_url)
        assert list_resp.status_code == status.HTTP_200_OK
        assert any(c["id"] == cat_id for c in list_resp.data)

        # Eliminar categoría
        del_resp = self.client.delete(f"{self.categories_url}{cat_id}/")
        assert del_resp.status_code in (status.HTTP_204_NO_CONTENT, status.HTTP_200_OK)

    def test_transactions_crud_minimal(self):
        # Categoria para transacción
        cat_resp = self.client.post(self.categories_url, {
            "name": "Sueldo",
            "type": "income",
        }, format="json")
        assert cat_resp.status_code == status.HTTP_201_CREATED
        cat_id = cat_resp.data["id"]

        # Crear transacción
        tx_resp = self.client.post(self.transactions_url, {
            "amount": "100.50",
            "category": cat_id,
            "description": "Pago"
        }, format="json")
        assert tx_resp.status_code == status.HTTP_201_CREATED
        tx_id = tx_resp.data["id"]

        # Listar transacciones
        list_resp = self.client.get(self.transactions_url)
        assert list_resp.status_code == status.HTTP_200_OK
        assert any(t["id"] == tx_id for t in list_resp.data)

        # Eliminar transacción
        del_resp = self.client.delete(f"{self.transactions_url}{tx_id}/")
        assert del_resp.status_code in (status.HTTP_204_NO_CONTENT, status.HTTP_200_OK)

    def test_unauthorized_returns_401(self):
        # Limpiar autenticación -> esperar 401
        self.client.credentials()
        assert self.client.get(self.categories_url).status_code == status.HTTP_401_UNAUTHORIZED
        assert self.client.get(self.transactions_url).status_code == status.HTTP_401_UNAUTHORIZED
