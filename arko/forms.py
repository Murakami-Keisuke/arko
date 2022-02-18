from dataclasses import field, fields
from tkinter import Widget
from turtle import textinput
from django import forms
from django.forms import ModelForm, BaseModelFormSet
from .models import Arkogroup, Arkouser,Block,Card,Room,Status
from django.contrib.auth.models import User,Group
from django.db.models import Q

class Signin_form(forms.Form):
    username = forms.CharField(
        label='あなたのユーザー名',
        max_length=30,
        required=True,
        disabled=False,
        widget=forms.TextInput(attrs={
            'class':'form-control',})
        )
    password = forms.CharField(
        label='パスワード',
        max_length=30,
        min_length=8,
        required=True,
        disabled=False,
        widget=forms.PasswordInput(attrs={
            'class':'form-control',
            'data-toggle':'password',
            'pattern':'^[A-Za-z0-9_@-]+$'})
        )


class Create_group_form(forms.Form):
    groupname = forms.CharField(
        label='新規グループ名',
        max_length=30,
        required=True,
        disabled=False,
        widget=forms.TextInput(attrs={
            'class':'form-control',})
        )
    raw_password = forms.CharField(
        label='新規パスワード(8文字以上30文字以内)',
        max_length=30,
        min_length=8,
        required=True,
        disabled=False,
        widget=forms.PasswordInput(attrs={
            'class':'form-control',
            'data-toggle':'password',
            'pattern':'^[A-Za-z0-9_@-]+$'})
        )




class Add_newone(forms.Form):
    sort_no = forms.IntegerField(
        widget=forms.HiddenInput(attrs={
                'class':'sort_no ',}),
        initial='1'
        )




class Block_forms(ModelForm):
    class Meta:
        model=Block
        fields=('id','name','comment',"sort_no")
        widgets= {
            'comment': forms.TextInput(attrs={
                'placeholder':'コメント',
                'class':'form-control form-control-sm ',
                'disabled':"true"}),
            'name':forms.TextInput(attrs={
                'class':'form-control float-start titlefield',
                'disabled':"true"}),
            "sort_no":forms.HiddenInput(attrs={
                'class':"sort_no"}),
        }

        

class Card_forms(ModelForm):
    class Meta:
        model=Card
        fields=('id','name','comment', 'address' ,"sort_no")
        widgets= {
            'name':forms.TextInput(attrs={
                'class':'form-control float-start titlefield',
                'disabled':"true"}),
            'comment': forms.TextInput(attrs={
                'placeholder':'コメント',
                'class':'form-control form-control-sm ',
                'disabled':"true"}),
            'address': forms.TextInput(attrs={
                'placeholder':'住所',
                'class':'form-control form-control-sm ',
                'disabled':"true"}),
            "sort_no":forms.HiddenInput(attrs={
                'class':"sort_no"}),
        }


class Room_forms(ModelForm):
    def __init__(self,arkogroup=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # print('init内での引数:',type(arkogroup))
        choice= arkogroup.status_set.all()
        if choice:
            self.fields['stat'].queryset = choice
            self.fields['stat'].empty_label = 'クリア'

    class Meta:
        model=Room
        fields=('id','name','comment', 'stat' ,"sort_no",)
        widgets= {
            'name':forms.TextInput(attrs={
                'class':'form-control float-start titlefield',
                'disabled':"true"}),
            'comment': forms.TextInput(attrs={
                'placeholder':'コメント',
                'class':'form-control form-control-sm ',
                'disabled':"true"}),
            'stat': forms.Select(attrs={
                'class':'form-select form-select-sm',
                'disabled':"true"}),
            "sort_no":forms.HiddenInput(attrs={
                'class':"sort_no"}),
        }

# class Arkouser_forms(ModelForm):
#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         # print('init内での引数:',type(arkogroup))
#         choice= Group.objects.filter(Q(name='staff')|Q(name='member'))
#         print(choice)
#         if choice:
#             self.fields['groups'].queryset = choice

#     class Meta:
#         model = Arkouser
#         fields = ('id','username','groups','is_active','last_login')
#         widgets= {
#             'id':forms.HiddenInput(attrs={
#                 'name':'user_id'
#             }),

#             'username':forms.TextInput(attrs={
#                 'class':'form-control name_form',
#                 'disabled':"true"
#             }),
#             'groups':forms.Select(attrs={
#                 'class':'form-select group_form',
#                 'name':'groups',
#                 'disabled':"true"
#             }),
#             'is_active':forms.CheckboxInput(attrs={
#                 'class':"form-check-input is_active_form",
#                 'name':'is_active',
#                 'disabled':"true"
#             }),
#             'last_login':forms.DateTimeInput(attrs={
#                 'class':'form-control' ,
#                 'name':'is_active',
#                 'disabled':"true"
#             }),
#         }

class Status_forms(ModelForm):
    class Meta:
        model = Status
        fields = ('id','name','sort_no','color','is_ban','disable')
        labels={
           'name':'',
           'color':'カラー',
           'is_ban':'アクセス禁止'
           }

        widgets = {
            'name':forms.TextInput(attrs={
                'class':'form-control float-start titlefield',
                'disabled':"true"
                }),
            "sort_no":forms.HiddenInput(attrs={
                'class':"sort_no"}),
            'color':forms.TextInput(attrs={
                'class':"color form-control form-control-color",
                'type':"color",
                'style':'margin-left:5px;',
                'disabled':"true",
                }),
            'is_ban':forms.CheckboxInput(attrs={
                'class':"form-check-input is_ban",
                'disabled':"true",
                }),
            'disable':forms.CheckboxInput(attrs={
                'class':"form-check-input is_ban",
                'disabled':"true",
                }),
        }

class Status_namage(forms.Form):
    stat_FROM = forms.ModelChoiceField(
        queryset=Status.objects.none(),
        required=False,
        widget=forms.Select(attrs={
            'class':"form-select"}),
        )
    date_delta= forms.IntegerField(
        min_value=0,
        initial=0,
        widget=forms.NumberInput(attrs={
            'class':'form-control',
            'style':"width:100px;display:inline;"
        }),
        )
    stat_TO = forms.ModelChoiceField(
        queryset=Status.objects.none(),
        required=False,
        widget=forms.Select(attrs={
            'class':"form-select"}),
        )

    def __init__(self,*args,arkogroup=None,**kwargs):
        super().__init__(*args,**kwargs)
        choice= arkogroup.status_set.all()
        if choice:
            self.fields['stat_FROM'].queryset = choice
            self.fields['stat_FROM'].empty_label = 'クリア'
            self.fields['stat_TO'].queryset = choice
            self.fields['stat_TO'].empty_label = 'クリア'

class Group_account_form(forms.Form):
    groupname = forms.CharField(
        label='グループ名',
        max_length=30,
        required=True,
        disabled=False,
        widget=forms.TextInput(attrs={
            'class':'form-control',})
        )
    password = forms.CharField(
        label='現在のパスワード(必須)',
        max_length=30,
        min_length=8,
        required=True,
        disabled=False,
        widget=forms.PasswordInput(attrs={
            'class':'form-control',
            'data-toggle':'password',
            'pattern':'^[A-Za-z0-9_@-]+$'})
        )

    new_password = forms.CharField(
        label='新しいパスワード(変更する場合)',
        max_length=30,
        min_length=8,
        required=False,
        disabled=False,
        widget=forms.PasswordInput(attrs={
            'class':'form-control',
            'data-toggle':'password',
            'pattern':'^[A-Za-z0-9_@-]+$'})
        )

    def __init__(self,*args,arkogroup=None,**kwargs):
        super().__init__(*args,**kwargs)
        self.fields['groupname'].initial=arkogroup
