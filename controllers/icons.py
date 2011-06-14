#
# Copyright 2011, Alexandre Strzelewicz
# Licensed under the MIT Version
#

#########################################################
#
# Icons Controllers
#
#########################################################

import urllib2
xss = local_import('xss')
    
def can_modify():
    if session.can_modify == False:
        raise HTTP(404)
    
#
# Test favicon
#
def external_favicon(url):
    if url.find('/', 9) != -1:
        icon_url = url[:url.find('/', 9)] + '/favicon.ico'
    else:
        icon_url = url + '/favicon.ico'
    try:
        f = urllib2.urlopen(urllib2.Request(icon_url))
        return True, icon_url
    except:
        return False, ""

@service.json
def get_icon():
    session.forget(response)
    icons = db((db.icons.desktop_link==session.desktop_id)).select(db.icons.title,
                                                                   db.icons.x,
                                                                   db.icons.y,
                                                                   db.icons.direct_link,
                                                                   db.icons.url,
                                                                   db.icons.logo_link,
                                                                   db.icons.id)
    return dict(icons=icons)

def new_icon():
    can_modify()

    url = xss.xssescape(request.vars.url);
    title = xss.xssescape(request.vars.title);
    
    (state, icon_url) = external_favicon(request.vars.url)
    ids = db.icons.insert(user_link=auth.user.id,
                          desktop_link=session.desktop_id,
                          direct_link=state,
                          logo_link=icon_url,
                          title=title,
                          url=url,
                          x=request.vars.x,
                          y=request.vars.y)
    if state == True:
        return response.json({'success':'true', 'id':ids, 'url':icon_url})
    else:
        return response.json({'success':'true', 'id':ids, 'url': ''})

def delete_icon():
    can_modify()
    db((db.icons.user_link==auth.user.id) &
       (db.icons.desktop_link==session.desktop_id) &
       (db.icons.id==request.vars.id)).delete()
    return response.json({'success':'true'})

def modify_icon():
    can_modify()
    of = db((db.icons.user_link==auth.user.id) &
            (db.icons.desktop_link==session.desktop_id) &
            (db.icons.id==request.vars.id)).update(x=request.vars.x,
                                                   y=request.vars.y)
    return response.json({'success':'true'})
