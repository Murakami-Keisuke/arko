from urllib.parse import urlencode
from django.shortcuts import render,redirect
from django.http import HttpResponse,HttpRequest
from django.contrib.auth.mixins import LoginRequiredMixin,PermissionRequiredMixin,UserPassesTestMixin
from django.contrib.auth import authenticate, login
from .models import Arkogroup,Arkouser,Block,Card,Status,Room,History
from django.urls import reverse
from .forms import Add_newone,Block_forms,Card_forms,Room_forms,Status_forms,Status_namage
from django.views import View
from django.forms import formset_factory, modelformset_factory
from django import forms
from django.contrib.auth.models import User,Group
from django.views.generic.list import ListView
from datetime import timedelta,datetime
from django.utils import timezone






'''------------------------------------------------------------------------------------'''
class Group_top(UserPassesTestMixin,View):

    def test_func(self):
        return self.request.user.groups.filter(name='staff')

    def __init__(self):
        super().__init__()
        self.blockformset= modelformset_factory(Block,form=Block_forms,extra=0,can_delete=True)
        self.cardformset= modelformset_factory(Card,form=Card_forms,extra=0,can_delete=True)
        self.roomformset= modelformset_factory(Room,form=Room_forms,extra=0,can_delete=True)

    def get(self, request, arkogroup,block=0,card=0):
        arkogroup=Arkouser.objects.get(username=request.user).arkogroup
        b_queryset= arkogroup.block_set.all().order_by('sort_no')
        # print(b_queryset.first().id)
        c_queryset= Card.objects.none()
        r_queryset= Room.objects.none()

        if int(block) == 0:
            b_active = b_queryset.first()
            if b_active:
                block = b_active.id

        if int(block):
            b_active = Block.objects.get_or_none(id=block)
            c_queryset= b_active.card_set.all().order_by('sort_no')
        # print('c_queryset:',c_queryset)
        if int(card) == 0:
            c_active = c_queryset.first()
            if c_active:
                card = c_active.id
        print('Group_top.get → block:',block,'   card:',card)

        if int(card):
            # print('card is',int(card))
            c_active = Card.objects.get_or_none(id=card)
            # print("c_active_name:",c_active)
            r_queryset= c_active.room_set.all().order_by('sort_no')
            
        newform= Add_newone()
        blockforms= self.blockformset(queryset=b_queryset)
        cardforms= self.cardformset(queryset=c_queryset)
        roomforms= self.roomformset(queryset=r_queryset,form_kwargs={'arkogroup': arkogroup})

        context={
            'newform':newform,
            'blockforms':blockforms,
            'cardforms':cardforms,
            'roomforms':roomforms,
            'block_id':block,
            'card_id':card,
            'current_page':'.group_top'
            }
        return render(request,"arko/settings/group_top.html",context)


    def post(self,request,arkogroup,block=0,card=0):
        arkogroup_obj=Arkouser.objects.get(username=request.user).arkogroup
        if 'formset_block' in request.POST:
            formset_name = {'formset':self.blockformset, 'model':Block}
        if 'formset_card' in request.POST:
            formset_name = {'formset':self.cardformset, 'model':Card}
        if 'formset_room' in request.POST:
            formset_name = {'formset':self.roomformset, 'model':Room}
        # print("POST:",request.POST)
        
        if "add_newone" in request.POST:
            sort_no= request.POST['sort_no']

            if 'formset_block' in request.POST:
                # arkogroup=request.POST['formset_block']
                # arkogroup_obj= Arkogroup.objects.get(name=arkogroup)
                Block.objects.create(arkogroup=arkogroup_obj,sort_no=sort_no)
            if 'formset_card' in request.POST:
                block= request.POST['formset_card']
                block_obj = Block.objects.get(id=int(block))
                Card.objects.create(block=block_obj,sort_no=sort_no)
            if 'formset_room' in request.POST:
                card= request.POST['formset_room']
                if int(card):
                    card_obj = Card.objects.get(id=card)
                    stat_choise=Status.objects.none()
                    # stat_choise= arkogroup_obj.status_set.all().order_by('sort_no').first()
                    Room.objects.create(card=card_obj,sort_no=sort_no)
            
        if "multiadd_new" in request.POST:
            sort_no= request.POST['sort_no']
            card= request.POST['formset_room']
            array= request.POST.getlist('multiadd[]')
            card_obj = Card.objects.get(id=card)
            add_instance=[]
            for i in array:
                stat_choise= None
                instance= Room(card=card_obj, name= i, sort_no=sort_no, stat=stat_choise)
                add_instance.append(instance)
            Room.objects.bulk_create(add_instance)

        if "savebtn" in request.POST:
            if 'formset_room' in request.POST:
                form=formset_name['formset'](request.POST,form_kwargs={'arkogroup': arkogroup_obj})
            else:
                form=formset_name['formset'](request.POST)
            print("update success")
            if form.is_valid():
                print("saved")
                form.save()
            else:
                print("valid fail")
                print(form.errors)

        print("redirect  block:",block,"   card:",card)
        return redirect('group_top', arkogroup,block,card)



'''------------------------------------------------------------------------------'''
class Invitation(UserPassesTestMixin,View):

    def test_func(self):
        return self.request.user.groups.filter(name='staff')

    def get(self, request, arkogroup):
        arkogroup_obj=Arkouser.objects.get(username=request.user).arkogroup
        api_domain= 'https://arkoapp.herokuapp.com'
        signup_url=reverse('sign_up', kwargs=dict(arkogroup=arkogroup))
        key= arkogroup_obj.key
        param = urlencode({'key':key})
        url = f'{api_domain}{signup_url}?{param}'
        context={"signup_url":url,'current_page':'.invitation'}
        print(url)
        return render(request,"arko/settings/invitation.html",context)


'''------------------------------------------------------------------------------'''
class ArkouserList(UserPassesTestMixin,ListView):
    model= Arkouser
    template_name="arko/settings/userlist.html"

    def test_func(self):
        return self.request.user.groups.filter(name='staff')

    # def __init__(self):
    #     super().__init__()
    #     self.userformset= modelformset_factory(Arkouser,form=Arkouser_forms,extra=0,can_delete=True)

    def get_queryset(self):
        qset=super().get_queryset()
        print(self.request.user)
        arkogroup= Arkouser.objects.get(username=self.request.user).arkogroup
        qset=qset.filter(arkogroup=arkogroup)
        return qset
    
    def get_context_data(self, **kwargs):
        context= super().get_context_data(**kwargs)
        context['current_page']= '.userlist'
        return context

    def post(self,request,arkogroup):
        arkogroup= Arkouser.objects.get(username=self.request.user).arkogroup
        print(request.POST)
        user= Arkouser.objects.get(id=request.POST['user_id'])
        group_current= Group.objects.get(name=request.POST['group_value'])
        group =  Group.objects.get(name=request.POST['group'])

        if 'delete' in request.POST:
            Arkouser.delete(user)
            return redirect('userlist', arkogroup)

        change = False
        if 'is_active' in request.POST:
            is_active = True
        else:
            is_active = False
        
        if user.is_active != is_active:
            user.is_active= is_active
            change = True
        if group_current != group:
            user.groups.remove(group_current)
            user.groups.add(group)
            change = True
        if(change):
            user.save()

        return redirect('userlist', arkogroup)


'''------------------------------------------------------------------------------'''
class StatusList(UserPassesTestMixin,View):
    def __init__(self):
        super().__init__()
        self.statusforms = modelformset_factory(Status,form=Status_forms,extra=0,can_delete=True)

    def test_func(self):
        return self.request.user.groups.filter(name='staff')

    def get(self, request, arkogroup):
        arkogroup_obj=Arkouser.objects.get(username=request.user).arkogroup
        update_count = request.GET.get(key='update_count',default=0)
        stat_after = request.GET.get(key='stat_after',default=None)
        alart= None

        queryset = arkogroup_obj.status_set.all().order_by('sort_no')
        statusforms= self.statusforms(queryset=queryset)

        if stat_after:
            alart= f'{update_count}個のコンテンツのステータスを{stat_after}に変更しました。'

        status_manage_forms= Status_namage(arkogroup=arkogroup_obj)



        context={
            'statusforms':statusforms,
            'status_manage_forms':status_manage_forms,
            'current_page':'.statuslist',
            'alart':alart}
        return render(request,"arko/settings/statuslist.html",context)

    def post(self, request, arkogroup):
        arkogroup_obj=Arkouser.objects.get(username=request.user).arkogroup
        url='statuslist'
        # print(request.POST)

        
        if 'savebtn' in request.POST:
            statusforms = self.statusforms(request.POST)
            # print(statusforms.errors)
            if statusforms.is_valid():
                statusforms.save()

        if 'addbtn' in request.POST:
            sort_no= request.POST.get(key='addnew_sort_no',default=1)
            Status.objects.create(group=arkogroup_obj,sort_no=sort_no,color='#008000')

        if 'mngbtn' in request.POST:
            # Stat_beforeのオブジェクト取得
            stat_before = request.POST.get(key='stat_FROM',default=None)
            if stat_before:
                stat_before=Status.objects.get(id=stat_before)
            else:
                stat_before=None
            
            # Stat_afterのオブジェクト取得
            stat_after = request.POST.get(key='stat_TO',default=None)
            if stat_after:
                stat_after=Status.objects.get(id=stat_after)
            else:
                stat_after=None

            print('from:',stat_before,'  to:',stat_after)
            date_delta = request.POST.get(key='date_delta',default= 0)

            # block_choise のオブジェクト取得
            block_choice = request.POST.get(key='block_choice',default=None)

            qset= Room.objects.filter(card__block__arkogroup=arkogroup_obj)
            
            if block_choice:
                block_choice= Block.objects.get(id= block_choice)
                qset= qset.filter(card__block=block_choice)
            
            # if not len(qset):
            #     return redirect(url, arkogroup)
            # print('len',len(qset))

            qset=qset.filter(stat=stat_before)
            qset=qset.filter(update_at__lte=timezone.now()-timedelta(days=int(date_delta)))
            print(timezone.now(),'/',datetime.now())

            print('qset:' ,qset)
            update_count = qset.update(stat=stat_after)
            if not stat_after:
                stat_after='クリア'
            param=urlencode({'update_count':update_count,'stat_after':stat_after})
            url=reverse('statuslist', kwargs=dict(arkogroup=arkogroup))+'?'+param
        

        return redirect(url, arkogroup)



class HistoryListView(UserPassesTestMixin,ListView):
    template_name = 'arko/settings/history_list.html'
    model = History
    paginate_by = 20

    def test_func(self):
        return self.request.user.groups.filter(name='staff')

    def get_queryset(self):
        qset=super().get_queryset()
        # print(self.request.user)
        arkogroup= Arkouser.objects.get(username=self.request.user).arkogroup
        qset=qset.filter(username__arkogroup=arkogroup).order_by('-create_at')
        return qset

    def get_context_data(self, **kwargs):
        context= super().get_context_data(**kwargs)
        context['current_page']= '.historylist'
        return context



class Overview(UserPassesTestMixin,View):
    def __init__(self):
        super().__init__()
        self.statusforms = modelformset_factory(Status,form=Status_forms,extra=0,can_delete=True)

    def test_func(self):
        return self.request.user.groups.filter(name='staff')

    def get(self, request, arkogroup):
        arkogroup_obj=Arkouser.objects.get(id=request.user.id).arkogroup

        blocks = arkogroup_obj.block_set.all().order_by('sort_no')
        status = arkogroup_obj.status_set.all().order_by('-sort_no')
        blockdata= []

        for block in blocks:
            card= block.card_set.all()
            rooms = Room.objects.filter(card__block=block)
            room_count = rooms.count()
            
            if rooms:
                delta_list=[]
                count = 0
                for room in rooms:
                    if room.stat:
                        if room.stat.disable==True:
                            continue
                    delta_list.append(timezone.now()-room.update_at)
                    count += 1
                print('count',count)
                # print(delta_list)
                delta_avr= sum(delta_list,timedelta()) / count
                delta_avr = str(delta_avr.days)+'日'
                delta_max=str(max(delta_list).days)+'日'
            else:
                delta_avr='NULL'
                delta_max='NULL'

            statusdata=[]
            for j in status:
                if room_count:
                    stat_count = int(rooms.filter(stat=j).count()/room_count *100)
                else:
                    stat_count =0
                stat_elm ={
                    'count':str(stat_count)+ '%',
                    'color':j.color
                }
                statusdata.append(stat_elm)

            elm={
                'blockname':block.name,
                'card_count':card.count(),
                'room_count':room_count,
                'statusdata':statusdata,
                'timedelta':delta_avr,
                'timedelta_max':delta_max
                }
            blockdata.append(elm)

        context={ 'current_page':'.overview','blockdata':blockdata}
        # print(context)
        return render(request,"arko/settings/overview.html",context)