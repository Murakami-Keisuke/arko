from dataclasses import fields
from re import template
from urllib.parse import urlencode
from django.shortcuts import render,redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout
from .models import Arkogroup,Arkouser,Block,Card,Status,Room,History
from django.urls import reverse
from .forms import Signin_form,Create_group_form,Group_account_form
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password, check_password
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin,PermissionRequiredMixin,UserPassesTestMixin
from django.views.generic import ListView, DetailView, CreateView, UpdateView
from django.urls import reverse_lazy
from django.contrib.auth.decorators import user_passes_test
from django.db import IntegrityError
from django.contrib.auth.models import User,Group

# Create your views here.
def top(request):
    form = Signin_form()
    alart=None
    if request.method == "POST":
        form=Signin_form(request.POST)
        if not form.is_valid():
            alart='入力された値が間違っています。もう一度確認して下さい。'
        username = form.cleaned_data['username']
        password = form.cleaned_data['password']
        user = authenticate(request, username=username, password=password)
        if user == None:
            alart='ユーザー名かパスワードが間違っています。もう一度確認して下さい。'
        else:
            login(request, user)
            # username=request.user.username
            # url = reverse('dashboard', kwargs=dict(username=username))
            # return redirect(url)

    if request.user.is_authenticated:
        username=request.user.username
        url = reverse('dashboard')
        return redirect(url)
    else:
        context = {'form':form,'alart':alart}
        return render(request,"arko/auth/top.html",context)


def create_group(request):
    alart = None
    form = Create_group_form()
    if request.method == "POST":
        form = Create_group_form(request.POST)
        if not form.is_valid():
            alart='入力された値が使用できません。もう一度正しい値を入力してください。'
        else:
            name = form.cleaned_data['groupname']
            raw_password = form.cleaned_data['raw_password']
            password=make_password(raw_password)
            group = Arkogroup.create_group(name,raw_password)
            if group == 'unique':
                alart='グループ名が既に使用されています。他の名前を設定してください。'
            elif group == 'some_error':
                alart='グループを作成できませんでした。'
            else:
                key = group.key
                redirect_url = reverse('sign_up', kwargs=dict(arkogroup=group))
                context = urlencode({'key':key,'perm':'staff','first':'Ture'})
                url = f'{redirect_url}?{context}'
                return redirect(url)

    context={'form':form ,'alart':alart}
    return render(request,'arko/auth/create_group.html',context)


def sign_up(request,arkogroup):
    alart=None
    if request.method == "POST":
        username=request.POST['username']
        raw_password=request.POST['password']
        perm=request.POST['perm']
        # perm = Group.objects.get(name=perm)
        # arkogroup_obj= Arkogroup.objects.get(name=arkogroup)


        
        first=request.POST.get(key="first", default=None)

        check=Arkogroup.check_signup(arkogroup,raw_password)
  
        if not check:
            alart='パスワードが違います'
        else:
            if username is not None:
                res=Arkouser.create_arkouser(arkogroup,username,perm)
                if res == 'unique':
                    alart='名前がすでに使用されています。他の名前を設定してください。'
                elif res == 'some_erroe' :
                    alart = 'ユーザーを登録できませんでした。'
                else:
                    # print(type(request),type(res))
                    login(request, res)
                    username=res.username
                    url = reverse('dashboard')
                    return redirect(url) 
                    

    if request.method == "GET":
        # arkogroup=request.GET['arkogroup']
        getkey=request.GET.get(key="key", default=None)
        perm=request.GET.get(key="perm", default='member')
        first=request.GET.get(key="first", default=None)
        groupkey=Arkogroup.objects.get(name=arkogroup).key
        if getkey != groupkey:
            return  HttpResponse(f'<h1>不正なURLです。アクセスに失敗しました。</h1>')
    context={'arkogroup':arkogroup,'perm':perm,'alart':alart,'first':first}
    print(context)
    return render(request,'arko/auth/sign_up.html',context)
    # return HttpResponse(f'<h1>sign up page</h1>')

def log_out(request):
    logout(request)
    return redirect('top')




def test_func(user):
        return user.groups.filter(name='staff')
    
@user_passes_test(test_func)
def group_account(request,arkogroup):
    alart=''
    alart_ok=''
    arkogroup=Arkouser.objects.get(id=request.user.id).arkogroup

    if request.method == 'POST':
        form= Group_account_form(request.POST)
        print(request.POST)
        if form.is_valid():
            password= form.cleaned_data['password']
            res=check_password(password,arkogroup.password)
            if res:
                name= form.cleaned_data['groupname']
                new_password = form.cleaned_data['new_password']
                try:
                    if arkogroup.name != name:
                        arkogroup.name=name
                    if new_password:
                        new_password=make_password(new_password)
                        arkogroup.password=new_password
                    arkogroup.save()
                    alart_ok='保存しました。'
                    
                except IntegrityError as e:
                    alart='グループ名がすでに使用されています。他の名前を指定してください。'
                except:
                    alart='変更できませんでした。グループ名がすでに使用されているか、新しいパスワードが条件を満たしていない可能性があります。'
                    
            else:
                alart='現在のパスワードが違います。'
                
    form = Group_account_form(arkogroup=arkogroup)
    context= {'form':form,'alart':alart,'alart_ok':alart_ok}
    return render(request,'arko/auth/group_account.html',context)

