#
# Copyright 2011, Alexandre Strzelewicz
# Licensed under the MIT Version
#


#
#
# On the index page for displaying recent changes (at the medium right)
#
#

import logging

@auth.requires_membership('Manager')
def index():
    form=SQLFORM(db.note_log)
    if form.accepts(request.vars, session):
        session.flash='record ok'
    elif form.errors:
        session.flash='Nop'
    rows = db(db.note_log.id>0).select(limitby=(0,10))
    return dict(notes=rows,form=form)

@auth.requires_membership('Manager')
def new_note():
    db.note_log.insert(content=request.vars.content)
    return response.json({'success':'true'})

@auth.requires_membership('Manager')
def display_form():
    record = db.note_log(request.args(0)) or redirect(URL('index'))
    form = SQLFORM(db.note_log, record,deletable=True)
    if form.accepts(request.vars, session):
        response.flash = 'form accepted'
    elif form.errors:
        response.flash = 'form has errors'
    return dict(form=form)

def add_remark():
    comment = request.vars.remarks or redirect(URL('index'))
    if auth.user == None:
        db.remarks.insert(content=comment)
    else:
        db.remarks.insert(content=comment,
                          author=auth.user.id)
    return response.json({'success':'true'})

