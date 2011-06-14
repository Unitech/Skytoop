# -*- coding: utf-8 -*-
#
# Copyright 2011, Alexandre Strzelewicz
# Licensed under the MIT Version
#


#########################################################
#
# Desktop main controllers
#
#########################################################

#
# This function permits
#
def first_login():
    auth_set = db(db.auth_settings.user_id==auth.user.id).select(db.auth_settings.user_id,
                                                                 db.auth_settings.user_alias).first()
    if auth_set == None:
        #
        # Create table settings
        #
        
        import unicodedata
        username_set = auth.user.first_name + '.' + auth.user.last_name
        user_refactored = unicodedata.normalize('NFKD', unicode(username_set, 'utf8')).encode('ASCII', 'ignore').replace(' ', '_')
        
        db.auth_settings.insert(user_id=auth.user.id,
                                user_alias=user_refactored)
        
        logger.debug('New user : ' + auth.user.first_name + '.' + auth.user.last_name)
        #
        # Create default desktop
        #
        #### Public
        desktop_public = db.desktop.insert(desk_name='Private',
                                           is_private=True,
                                           is_default=True,
                                           wallpaper='/Skytoop/static/default-private.jpg')
        db.entr_user_desktop.insert(desktop_link=desktop_public.id,
                                    user_link=auth.user.id)
        #### Private
        desktop = db.desktop.insert(desk_name='Public',
                                    is_private=False,
                                    is_default=False,
                                    wallpaper='/Skytoop/static/default-public.jpg')
        db.entr_user_desktop.insert(desktop_link=desktop.id,
                                    user_link=auth.user.id)
        #
        # Create default data tree
        #
        Directories=['Documents','Audios','Other']
        for directory in Directories:
            db.allfiles.insert(filename=directory,
                               filepath='/'+directory+'/',
                               parentpath='/',
                               filetype='dir',
                               datecreated=now,
                               user_file=me)
        #
        # Copy same desktop as 
        #
        id_user = db((db.auth_user.first_name=='Model') &
                     (db.auth_user.last_name=='Model')).select(db.auth_user.id).first()
        if id_user != None:
            desktop = db((db.desktop.id==db.entr_user_desktop.desktop_link)
                         & (db.auth_user.id==db.entr_user_desktop.user_link)
                         & (db.auth_user.id==id_user.id)
                                        & (db.desktop.is_default==True)) \
                                        .select(db.desktop.id, cache=(cache.ram,99999)).first()
            
            widgets = db((db.widgets.desktop_link==desktop.id)).select(cache=(cache.ram,99999))
            icons = db((db.icons.desktop_link==desktop.id)).select(cache=(cache.ram,99999))
            
            for icon in icons:
                icon['user_link'] = auth.user.id
                icon['desktop_link'] = desktop_public
                db.icons[0] = icon
            for widget in widgets:
                widget['user_link'] = auth.user.id
                widget['desktop_link'] = desktop_public
                db.widgets[0] = widget
        return user_refactored
    return auth_set.user_alias
        
@auth.requires_login()
def index():
    public_name = first_login()
    name = auth.user.first_name + " " + auth.user.last_name
    #
    # Queries
    #
    desktop = db((db.desktop.id==db.entr_user_desktop.desktop_link)
                 & (db.auth_user.id==db.entr_user_desktop.user_link)
                 & (db.auth_user.id==auth.user.id)
                 & (db.desktop.is_default==True))\
                 .select(db.desktop.desk_name,
                         db.desktop.wallpaper,
                         db.desktop.back_color,
                         db.desktop.position,
                         db.desktop.id,
                         db.desktop.is_default).first()
    # No desktop ?
    if desktop == None:
        redirect(URL('default', 'index'))
    # Set desktop session id
    session.desktop_id = desktop.id
    # It's a private desktop
    session.can_modify = True
    return dict(auth=name,
                desktop=desktop,
                desktop_list=desktop,
                modif=True,
                public=False,
                public_name=public_name)

def create_user():
    db(db.auth_user.first_name=='Model').delete()
    db.auth_user.insert(first_name='Model',
                        last_name='Model',
                        email='model@skytoop.com',
                        password=CRYPT(auth.settings.hmac_key)('123456')[0])
    return response.json('User Model created. You can now loggin with model@skytoop.com, password = 123456')

def user():
    # User login page (refer to view/desk/user.html + view/layouts/layout_login.html)
    notes_log = db(db.note_log.id>0).select(db.note_log.ALL,
                                            orderby=~db.note_log.date_created,
                                            limitby=(0,10),
                                            cache=(cache.ram,19000))
    return dict(form=auth(), notes_log=notes_log)
