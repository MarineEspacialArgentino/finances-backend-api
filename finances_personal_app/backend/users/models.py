from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    
    # el AbstractUser ya tiene campos como username, password, etc.
    
    def __str__(self):
        return self.username
