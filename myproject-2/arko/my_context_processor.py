from .models import Arkouser
from django.db.models import Q

def common(request):
    try:
        arkouser= Arkouser.objects.get(username=request.user.username)
        arkogroup= arkouser.arkogroup
        perm= request.user.groups.filter(Q(name='staff')|Q(name='member'))[0]
    except:
        return {}
    return {"arkogroup":arkogroup,
        "perm":perm,
        }