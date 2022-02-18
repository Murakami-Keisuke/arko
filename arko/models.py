# from email.policy import default
# from tkinter import E
# from tokenize import group
from django.db import models
from django.contrib.auth.models import User,Group,AbstractUser
from django.contrib.auth.hashers import make_password, check_password
import string
import random
from django.db import IntegrityError
from django.utils import timezone


# カスタムモデルマネージャー
class BaseManager(models.Manager):
   def get_or_none(self, **kwargs):
       """
       検索にヒットすればそのモデルを、しなければNoneを返します。
       """
       try:
           return self.get_queryset().get(**kwargs)
       except self.model.DoesNotExist:
           return None


# Create your models here.
class Arkogroup(Group):
    password= models.CharField(max_length=200)
    key= models.CharField(max_length=200 , blank=True , null=True)

    def __str__(self) -> str:
        return self.name

    @classmethod
    def create_group(self,groupname,raw_password):
        length_of_string = 12
        key=''.join(random.choice(string.ascii_letters + string.digits) for _ in range(length_of_string))
        password=make_password(raw_password)
        try:
            group= Arkogroup.objects.create(name=groupname,password=password,key=key)
        except IntegrityError as e:
            return 'unique'
        except:
            e='some_error'
            return e
        return group

    @classmethod
    def check_signup(self,groupname,raw_password):
        grouppassword=Arkogroup.objects.get(name=groupname).password
        check=check_password(raw_password,grouppassword)
        # print(check)
        if check:
            return True
        else:
            return False
        


class Arkouser(User):
    
    arkogroup = models.ForeignKey(Arkogroup,on_delete=models.CASCADE,null=True)

    @classmethod
    def create_arkouser(self,arkogroupname,username,perm):
        arkogroup_obj=Arkogroup.objects.get(name=arkogroupname)
        password= arkogroup_obj.password
        new_user= Arkouser(
            username=username,
            password=password,
            arkogroup= arkogroup_obj
            )
        try:
            new_user.save()
            new_user.groups.add(Group.objects.get(name=perm))
            new_user.save()
        except IntegrityError as e:
            return 'unique'
        except:
            return 'some_error'
        return new_user


class Block(models.Model):
    objects = BaseManager()
    arkogroup = models.ForeignKey(Arkogroup,on_delete=models.CASCADE,null=True)
    name = models.CharField(max_length=40,default='NoName')
    sort_no = models.IntegerField()
    comment= models.TextField(null=True,blank=True)

    def __str__(self) -> str:
        return self.name


class Card(models.Model):
    objects = BaseManager()
    block = models.ForeignKey(Block,on_delete=models.CASCADE)
    name = models.CharField(max_length=40,default='NoName')
    sort_no = models.IntegerField()
    comment= models.TextField(null=True,blank=True)
    address = models.CharField(max_length=100,null=True,blank=True,default='')

    def __str__(self) -> str:
        return self.name


class Status(models.Model):
    objects = BaseManager()
    group = models.ForeignKey(Arkogroup,on_delete=models.CASCADE)
    name = models.CharField(max_length= 40,default='NoName')
    sort_no = models.IntegerField()
    color = models.CharField(max_length= 20)
    is_ban = models.BooleanField(default= False)
    disable = models.BooleanField(default= False)

    def __str__(self) -> str:
        return self.name


class Room(models.Model):
    objects = BaseManager()
    card= models.ForeignKey(Card,on_delete=models.CASCADE)
    name = models.CharField(max_length=40,default='NoName')
    sort_no = models.IntegerField()
    comment= models.TextField(null=True,blank=True)
    stat= models.ForeignKey(Status, models.SET_NULL,blank=True,null=True,)
    update_at= models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name


class History(models.Model):
    objects = BaseManager()
    room= models.ForeignKey(Room,on_delete=models.CASCADE)
    username=models.ForeignKey(Arkouser, models.SET_NULL,blank=True,null=True,)
    choice_stat=models.CharField(max_length=40)
    create_at = models.DateTimeField(auto_now_add=True)

    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.card=self.room.card
        self.block = self.card.block

    def __str__(self) -> str:
        # if self.choice_stat=='None':
        #     choice_stat_str='クリア'
        # else:
        #     choice_stat_str=self.choice_stat
        t=f"{timezone.localtime(self.create_at).strftime('%m-%d-%y %H:%M')} /{self.choice_stat:12} (ユーザー:{self.username})"
        return  t
