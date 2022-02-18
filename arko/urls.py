from django.urls import path

from . import views_auth
from .views_setting import Group_top, Invitation,ArkouserList,StatusList,HistoryListView
from .views_main import Dashboard, Project
from . import views_main

# app_name = 'arko'
urlpatterns = [
    path('', views_auth.top, name='top'),
    path('create_group/', views_auth.create_group, name='create_group'),
    path('sign_up/<arkogroup>/', views_auth.sign_up, name='sign_up'),
    path('logout/', views_auth.log_out, name='logout'),
    path('logout/', views_auth.log_out, name='logout'),
    path('<arkogroup>/group_account/', views_auth.group_account, name='group_account'),

    path('<arkogroup>/Group_top/', Group_top.as_view(), name='group_top'),
    path('<arkogroup>/Group_top/<block>/', Group_top.as_view(), name='group_top'),
    path('<arkogroup>/Group_top/<block>/<card>', Group_top.as_view(), name='group_top'),
    path('<arkogroup>/invitation/', Invitation.as_view(), name='invitation'),
    path('<arkogroup>/userlist/', ArkouserList.as_view(), name='userlist'),
    path('<arkogroup>/statuslist/', StatusList.as_view(), name='statuslist'),
    path('<arkogroup>/historylist/', HistoryListView.as_view(), name='historylist'),

    path('dashboard/', Dashboard.as_view(), name='dashboard'),
    path('project/', Project.as_view(), name='project'),
    path('card_api/<id>/', views_main.card_api),
    path('room_api/<id>/', views_main.room_api),
    path('history_api/', views_main.history_api),
    path('get_csrf/', views_main.CsrfView),
    path('history_modal_api/<id>/', views_main.history_modal_api),
]