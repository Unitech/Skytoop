# -*- coding: utf-8 -*- 
#########################################################
#
# Desktop customization controllers
#
#########################################################



def change_wallpaper():
    if not request.vars.path:
        raise HTTP(404)
    row = db((db.allfiles.filepath==request.vars.path)&(db.allfiles.user_file==me)).select()[0]
    if row.filetype in imagetypes :
        path = '/Skytoop/static/wallpapers/' + row.file
        db(db.desktop.id==session.desktop_id).update(wallpaper=path,
                                                     back_color=request.vars.backcol,
                                                     position=request.vars.position)
        return response.json({'success':'true'})
    else:
        return response.json({'success':'false','details':'Not an image'})
    

def set_public():
    db(db.auth_settings.user_id==auth.user.id).update(public_actif=True)
    return response.json({'success':'true'})
