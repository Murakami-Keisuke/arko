from multiprocessing import context
from urllib.parse import urlencode
from django.shortcuts import render,redirect
from django.http import HttpResponse,HttpRequest
from django.http.response import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin,UserPassesTestMixin
from django.contrib.auth import authenticate, login
from .models import Arkogroup,Arkouser,Block,Card,Status,Room,History,Mission
from .forms import Status_forms,Status_namage
from django.views import View
from django.forms import formset_factory, modelformset_factory
from django import forms
from django.contrib.auth.models import User,Group
from django.views.generic.list import ListView
from datetime import timedelta,datetime
from django.utils import timezone
import json
from django.core import serializers
from django.middleware.csrf import get_token
from django.http import QueryDict
from django.core import serializers


class Dashboard(LoginRequiredMixin, View):
    login_url = 'top'

    def get(self, request):
        arkouser= Arkouser.objects.get(id=request.user.id)
        arkogroup_obj=arkouser.arkogroup

        history = History.objects.filter(room__card__block__arkogroup=arkouser.arkogroup)
        history = history.filter(create_at__lte=timezone.now()-timedelta(days=30))
        history.delete()

        hist_qset= arkouser.history_set.all().order_by('create_at').reverse()[:7]
        valueset =[]
        if len(hist_qset):
            for i in hist_qset:
                room =i.room
                card = room.card
                block = card.block
                string1= f'{block} >> {card} >> {room}'
                string2= f"{timezone.localtime(i.create_at).strftime('%y-%m-%d %H:%M')} /{i.choice_stat} "
                elm = {'content':string1,'value':string2}
                valueset.append(elm)

        statset = arkogroup_obj.status_set.all().order_by('sort_no')
        context={
            'current':'.dashboard',
            'history':valueset,
            'statset':statset,
            }
        return render(request,"arko/main/dashboard.html",context)


class Project(LoginRequiredMixin, View):
    def get(self, request):

        arkogroup=Arkouser.objects.get(id=request.user.id).arkogroup
        blocks= arkogroup.block_set.all().order_by('sort_no')
        status = arkogroup.status_set.all().order_by('sort_no')
        # status = status.exclude(is_ban=True)
        context={
            'current':'.activity',
            'blocks':blocks,
            'status':status}
        # print(context)
        return render(request,"arko/main/project.html",context)

def card_api(request,id):
    block = Block.objects.get(id=int(id))
    cards = block.card_set.all().order_by('sort_no')
    context= {
        "block":block.name ,
        "card":list(cards.values()),
        }

    # print(context)
    return JsonResponse(context)

def room_api(request,id):
    card = Card.objects.get(id=int(id))
    block = card.block
    rooms = card.room_set.all().order_by('sort_no')

    context = {
        "block":block.name,
        "card":card.name,
        "room":list(rooms.values())
        }
    # print(context)
    return JsonResponse(context)

def CsrfView(request):
    return JsonResponse({'token': get_token(request)})

def history_api(request):
    context={}
    if request.method == 'POST':
        data=json.loads(request.body)
        print(data)
        room= Room.objects.get(id=data['room_id'])
        username = Arkouser.objects.get(id=data['user_id'])
        if data['stat_id']=='None':
            choice_stat=None
            choice_stat_name='クリア'
        else:
            choice_stat =Status.objects.get(id=data['stat_id'])
            choice_stat_name =Status.objects.get(id=data['stat_id']).name

        if choice_stat!=room.stat:
            try:
                History.objects.create(room=room, username=username, choice_stat=choice_stat_name)
                room.stat=choice_stat
                room.save()
            except:
                pass
            else:
                context={'flag':'True'}
    
    return JsonResponse(context)

def history_modal_api(request,id):
    room =Room.objects.get(id=int(id))
    history= room.history_set.all().order_by('create_at').reverse()[:10]
    context={'history':'','room':room.name}
    list1=[]
    if len(history):
        for i in history:
            # print(str(i))
            elm = {'id':i.id,'string':str(i)}
            list1.append(elm)
        context['history']=list1

    return JsonResponse(context)

def mission_api(request,id):
    context={}
    block = Block.objects.get(id=int(id))
    rooms = Room.objects.filter(card__block =block).order_by('update_at')
    roomsprint = rooms[:10]
    # print(block)
    # for i in roomsprint:
    #     print(i.card,i,i.update_at)
    # # model Mission =[block, create_at, room, ]
    stored = block.mission_set.all()
    stored_old=stored.filter(create_at__lte=timezone.now()-timedelta(days=1))
    stored_old.delete()
    stored = stored.filter(create_at__gt=timezone.now()-timedelta(days=1))

    for room in rooms:
        if room.stat:
            if room.stat.is_ban == True:
                continue

        if not stored.filter(room=room).exists():
            Mission.objects.create(block=block,room=room)
            card= room.card.__dict__
            del card['_state']
            room =room.__dict__
            del room['_state']

            context['block']=block.name
            context['card']=card
            context['room']=room
            break
    # print(context)

    return JsonResponse(context)
