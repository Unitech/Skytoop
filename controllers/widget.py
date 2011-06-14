# -*- coding: utf-8 -*- 

#
# Copyright 2011, Alexandre Strzelewicz
# Licensed under the MIT Version
#


#########################################################
#
# Widget generic controller
#
#########################################################

xss = local_import('xss')

def can_modify():
    if session.can_modify == False:
        raise HTTP(404)

def get_widget():
    session.forget(response)
    widgets = db((db.widgets.desktop_link==session.desktop_id)).select()
    return dict(widgets=widgets)

def new_widget():
    can_modify()
    # Xss prevention
    for req in request.vars:
        request.vars[req] = xss.xssescape(request.vars[req])        
    ids = db.widgets.insert(x=request.vars.x,
                            y=request.vars.y,
                            width=request.vars.width,
                            height=request.vars.height,
                            type=request.vars.type,
                            data1=request.vars.data1,
                            data2=request.vars.data2,
                            data3=request.vars.data3,
                            title=request.vars.title,
                            user_link=auth.user.id,
                            desktop_link=session.desktop_id)
    return response.json({'success':'true', 'id':ids})

def remove_widget():
    can_modify()
    row = db((db.widgets.user_link==auth.user.id)
       & (db.widgets.desktop_link==session.desktop_id)
       & (db.widgets.id==request.vars.id)).delete()
    return response.json({'success':'true'})

#@security.xssremove
def update_widget():
    can_modify()
    # Xss prevention
    for req in request.vars:
        request.vars[req] = xss.xssescape(request.vars[req])        
    db((db.widgets.user_link==auth.user.id)
       & (db.widgets.desktop_link==session.desktop_id)
       & (db.widgets.id==request.vars.id)) \
       .update(x=request.vars.x,
               y=request.vars.y,
               width=request.vars.width,
               height=request.vars.height,
               type=request.vars.type,
               data1=request.vars.data1,
               data2=request.vars.data2,
               data3=request.vars.data3,
               title=request.vars.title)
    return response.json({'success':'true'})


#
# entr widgets to share widget (to put in desk.py)
#
# widgets = db((db.desktop.id==db.entr_desktop_widgets.desktop_link)
#              & (db.widgets_entr.id==db.entr_desktop_widgets.widget_link)
#              & (db.desktop.id==desktop.id))\
#              .select(db.widgets_entr.ALL)
# logger.debug(widgets)

#
#
#
# def new_widget_entr():
#     widget = db.widgets_entr.insert(x=request.vars.x,
#                                     y=request.vars.y,
#                                     width=request.vars.width,
#                                     height=request.vars.height,
#                                     type=request.vars.type,
#                                     data1=request.vars.data1,
#                                     data2=request.vars.data2,
#                                     data3=request.vars.data3,
#                                     title=request.vars.title)
#     db.entr_desktop_widgets.insert(desktop_link=session.desktop_id,
#                                    widget_link=widget.id)
#     return response.json({'success':'true', 'id':widget.id})
