#
# Copyright 2011, Alexandre Strzelewicz
# Licensed under the MIT Version
#


#
#
# For search bar + public Skytoops
#
#

import logging

def month_input():
    return dict()

@service.json
def person_speed_search():
    session.forget(response)
    if not request.vars.name:
        return ''
    user = [row.user_alias for row in db((db.auth_settings.user_alias.like('%' + request.vars.name + '%')) & (db.auth_settings.public_actif==True)).select(cache=(cache.ram,70))]
    logger.debug('user')
    logger.debug(user)
    return DIV(*[DIV(
        k.replace('.', ' '),
        _id='s-u-u',
        _onclick="window.location = '/public/%s'" % k
        )
                 for k in user])

#
# Permits to access to public desktop
#
def index():
    alias = request.args(0) or redirect(URL('search'))
    requested_desktop = db(db.auth_settings.user_alias==alias).select(db.auth_settings.user_id).first()
    if requested_desktop == None:
        redirect(URL('search/' + alias))
    id_user = requested_desktop.user_id
    desktop = db((db.desktop.id==db.entr_user_desktop.desktop_link)
                 & (db.auth_user.id==db.entr_user_desktop.user_link)
                 & (db.auth_user.id==id_user)
                 & (db.desktop.is_default==False))\
                 .select(db.desktop.desk_name,
                         db.desktop.wallpaper,
                         db.desktop.back_color,
                         db.desktop.position,
                         db.desktop.id,
                         db.desktop.is_default).first()
    # No public desktop ?
    if desktop == None:
        redirect(URL('public', 'search'))
    # Set desktop id
    session.desktop_id = desktop.id
    
    # It's a public desktop, cant modify items
    if auth.is_logged_in() and id_user == auth.user.id:
        session.can_modify = True
    else:
        session.can_modify = False
    
    # Replace name got in request
    name = alias.replace('.', ' ')
    # Select between display desktop with modification options or not
    if (auth.is_logged_in() and auth.user.id == id_user):
        return dict(auth=name,
                    desktop=desktop,
                    modif=True,
                    public=True)
    else:
        return dict(auth=name,
                    desktop=desktop,
                    modif=False,
                    public=True)


# Send page and search is done by ^
def search():
    request_name = request.args(0)
    return dict(request_name=request_name)
    

def error():
    return dict()
