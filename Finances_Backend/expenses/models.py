from django.db import models
from django.conf import settings


class Category(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    type = models.CharField(
        max_length=10,
        choices=[
            ('income','Ingreso'),
            ('expense','Gasto'),         
        ],
        default='expense',
    )

    def __str__(self):
        return f'{self.id} ---- {self.name} ---- {self.type}'
    

class Transactions(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category,on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f'Transacción {self.id} - {self.user} - ({self.category}- {self.amount} - {self.date} - {self.description})'