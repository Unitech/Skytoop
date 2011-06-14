# -*- coding: utf-8 -*-
# by Strzelewicz Alexandre 


#########################################################
#
# Model / Database / Mailing / Logger
#
#########################################################

from gluon.tools import *
auth = Auth(globals(),db)               

auth.settings.hmac_key = 'sha512:21e79fb0-0623-4621-8943-37767690d266'
auth.define_tables(migrate=migrate)

auth.settings.mailer = mail
auth.settings.registration_requires_verification = True
auth.settings.registration_requires_approval = False

auth.messages.verify_email = 'Click on the link http://'+request.env.http_host+URL(r=request,c='default',f='user',args=['verify_email'])+'/%(key)s to verify your email'
auth.settings.reset_password_requires_verification = True
auth.messages.reset_password = 'Click on the link http://'+request.env.http_host+URL(r=request,c='default',f='user',args=['reset_password'])+'/%(key)s to reset your password'
auth.settings.create_user_groups = False

crud = Crud(globals(),db)
crud.settings.auth = None
service = Service(globals())                  
plugins = PluginManager()


#########################################################################
#
#
# Table definitions
#
#
#########################################################################

import datetime
now=datetime.datetime.now()
from gluon.tools import prettydate

if auth.is_logged_in():
    me=auth.user.id
else:
    me=None


#
# User setting
#
# Default 50mo max
#
db.define_table('auth_settings',
                # Data settings
                Field('stored_data_size', 'integer', default=0),
                # Max size to store
                Field('limit_stored_data_size', 'integer', default=50000000),
                # User settings
                Field('user_alias', 'string'),
                Field('public_actif', 'boolean', default=False),
                Field('user_id', db.auth_user, requires=IS_IN_DB(db, db.auth_user.id)))

#
# File manager
#
db.define_table('allfiles',
                Field('filename'),
                Field('filepath'),
                Field('parentpath'),
                Field('filetype'),
                Field('file','upload', autodelete=True),
                Field('content','text'),
                Field('datecreated','datetime',default=now),
                Field('datemodified','datetime',default=now),
                Field('filesize','integer'),
                Field('user_file',db.auth_user,default=me,requires=IS_IN_DB(db, db.auth_user.id)))

#########################################################
#
# Desktops
#
#########################################################

db.define_table('desktop',
                Field('desk_name', type='string', length=21, requires=IS_LENGTH(20,1)),
                Field('is_private', type='boolean', default=True),
                Field('is_default', type='boolean', default=True),
                Field('pwd', type='password', default=''),
                Field('wallpaper', length=256, default='/Skytoop/static/cloudy.png'),
                Field('back_color', length=10, default='#333', requires=IS_LENGTH(10,3)),
                Field('position', length=15, default='center center', requires=IS_LENGTH(15,4)))

db.define_table('entr_user_desktop',
                Field('user_link', db.auth_user),
                Field('desktop_link', db.desktop))

#########################################################
#
# Widgets
#
#########################################################

db.define_table('widgets',
                Field('type', type='string', length=21, requires=IS_LENGTH(20,1)),
                Field('x', type='integer'),
                Field('y', type='integer'),
                Field('width', type='integer'),
                Field('height', type='integer'),
                Field('title', type='string', length=128),
                Field('data1', type='string', length=256),
                Field('data2', type='string', length=256),
                Field('data3', type='string', length=256),
                Field('user_link', db.auth_user, notnull=True, requires=IS_NOT_EMPTY()),
                Field('desktop_link', db.desktop, notnull=True, requires=IS_NOT_EMPTY()))


db.define_table('icons',
                Field('title', requires=IS_NOT_EMPTY()),
                Field('x', type='integer'),
                Field('y', type='integer'),
                Field('direct_link', 'boolean'),
                Field('logo_link', type='string', length=128),
                Field('url', type='string', length=128),
                Field('user_link', db.auth_user, requires=IS_IN_DB(db, db.auth_user.id)),
                Field('desktop_link', db.desktop, requires=IS_IN_DB(db, db.desktop.id)))

#
# Shared widgets
#
db.define_table('widgets_entr',
                Field('type', type='string', length=21, requires=IS_LENGTH(20,1)),
                Field('x', type='integer'),
                Field('y', type='integer'),
                Field('width', type='integer'),
                Field('height', type='integer'),
                Field('title', type='string', length=128),
                Field('data1', type='string', length=256),
                Field('data2', type='string', length=256),
                Field('data3', type='string', length=256))

db.define_table('entr_desktop_widgets',
                Field('widget_link', db.widgets_entr),
                Field('desktop_link', db.desktop))

#########################################################
#
# Misc
#
#########################################################
#
# Note log book
#
db.define_table('note_log',
                Field('content', 'text'),
                Field('date_created', 'datetime', default=now))
#
# Vote log
#
db.define_table('vote_log',
                Field('content', 'text'),
                Field('content_full', 'text'),
                Field('author'),
                Field('date_created', 'datetime', default=now),
                Field('votes', 'integer', default=0))

#
# User who votes
# Many to many relation
#
db.define_table('entr_vote_user',
                Field('auth_user', db.auth_user),
                Field('vote_log', db.vote_log))
                


db.define_table('remarks',
                Field('content', type='text', requires=IS_NOT_EMPTY()),
                Field('author', db.auth_user))
