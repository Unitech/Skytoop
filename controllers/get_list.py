#
# Copyright 2011, Alexandre Strzelewicz
# Licensed under the MIT Version
#


#
#
# Cf on index left bottom page
# When you click on Skytoop © 2011 you get the list of desktops created
#
#

def index():
    desktops = db((db.auth_settings)).select()#cache=(cache.ram,99999))
    notes_log = db(db.note_log.id>0).select(db.note_log.ALL,
                                            orderby=~db.note_log.date_created,
                                            limitby=(0,10),
                                            cache=(cache.ram,19000))
    return dict(desktops=desktops, notes_log=notes_log)
    
