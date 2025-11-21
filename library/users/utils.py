import random
import string
from django.contrib.auth import get_user_model

User = get_user_model()



def generate_otp(length=6):
    characters = string.digits
    otp = "".join(random.choice(characters) for _ in range(length))
    return otp


def generate_lib_code():
    encount = int(User.objects.all().order_by('lib_code').last().lib_code) + 1 # тут доработать 
    return "0" * (8 - len(str(encount))) + str(encount)