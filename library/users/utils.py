import random
import string
from django.contrib.auth import get_user_model
import qrcode
import io


User = get_user_model()



def generate_otp(length=6):
    characters = string.digits
    otp = "".join(random.choice(characters) for _ in range(length))
    return otp


def generate_lib_code():
    last_one = User.objects.all().order_by('lib_code').last().lib_code if User.objects.exists() else 0
    encount = int(last_one) + 1 # тут доработать 
    return "0" * (8 - len(str(encount))) + str(encount)


def form_qr(url):
    qr = qrcode.QRCode(version=1, box_size=18, border=4)
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    buf = io.BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)