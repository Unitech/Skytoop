# -*- coding: utf-8 -*- 

#########################################################################
## This is a samples controller
## - index is the default action of any application
## - user is required for authentication and authorization
## - download is for downloading files uploaded in the db (does streaming)
## - call exposes all registered services (none by default)
#########################################################################  
from __future__ import with_statement # This isn't required in Python 2.6     
__metaclass__ = type
import os
import sys
import time
import logging
from PIL import Image
from gluon.contrib import simplejson as json
import urllib
import datetime

iconfolder='static/filemanager/images/fileicons/'
iconlocation='/'+request.application+'/'+iconfolder
    
now=datetime.datetime.now()
split_path = os.path.split
split_ext = os.path.splitext
path_exists = os.path.exists
normalize_path = os.path.normpath
absolute_path = os.path.abspath 
encode_urlpath = urllib.quote_plus
output=os.path.join(request.folder,'static','test.txt')

@auth.requires_login()
def index():
    appname=request.application
# LIMIT SIZE
    row_user = db(db.auth_settings.user_id==auth.user.id) \
               .select(db.auth_settings.stored_data_size,
                       db.auth_settings.limit_stored_data_size).first()
    session.data_size = int(row_user['stored_data_size'])
    session.max_size = int(row_user['limit_stored_data_size'])
    return dict(appname=appname)


###################################################
#
#            File listing
#
###################################################

@service.json
def getfolder():
    path=request.vars.path
    rows=db((db.allfiles.parentpath==path)&(db.allfiles.user_file==me)) \
          .select(db.allfiles.filepath,
                  db.allfiles.filesize,
                  db.allfiles.filetype,
                  db.allfiles.file,
                  db.allfiles.filename)    
    result = {}
    for row in rows:
        result[row.filepath]=getinfo(row)
    return result

@service.json
def getinfo(row):
    if row.filepath=='True':
        path=request.vars.path
    else:
        path=row.filepath
    absiconlocation = request.folder+iconfolder
    
    filename = row.filename
    filetype = row.filetype
    filesize = row.filesize
    
    thefile = {
        'Filename' : filename,
        'FileType' : '',
        'Preview' : iconlocation+'_Open.png' if filetype=='dir' else '' ,
        'FilePreview':'',
        'Path' : path,
        'Size' : filesize
        }

    if filetype=='dir':
        thefile['FileType'] = 'Directory'
    else:
        previewPath = iconlocation + filetype.lower() + '.png'
        abspreviewPath=absiconlocation+filetype.lower()+'.png'
        thefile['Preview'] = previewPath if os.path.exists(abspreviewPath) else iconlocation+'default.png'
    return thefile

@service.json
def getFileInfo():
    path = request.vars.path
    file_ret = db((db.allfiles.filepath==path)&
                  (db.allfiles.user_file==me)).select(db.allfiles.filename,
                                                      db.allfiles.filesize,
                                                      db.allfiles.file,
                                                      db.allfiles.filetype).first()
    file_type = file_ret.filetype
    file_details = {
        'Filename' : file_ret.filename,
        'Preview' : '',
        'Path' : path,
        'Size' : file_ret.filesize
        }
    if file_type in imagetypes :
        file_details['Preview'] = '/'+request.application+'/filemanager/download/'+file_ret.file
    else:
        absiconlocation = request.folder+iconfolder
        iconlocation = '/'+request.application+'/'+iconfolder
        previewPath = iconlocation + file_type.lower() + '.png'
        abspreviewPath = absiconlocation+file_type.lower()+'.png'
        file_details['Preview'] = previewPath if os.path.exists(abspreviewPath) else iconlocation+'default.png'
    return file_details

###################################################
#
#            Get data ?
#
###################################################

@service.json   
def getdata():
    path=request.vars.path
    data=db((db.allfiles.filepath==path)&(db.allfiles.user_file==me)) \
          .select(db.allfiles.content)[0]
    textdata=data.content
    return textdata

def updatedata():
    data=request.vars.senddata
    path=request.vars.getpath
    db((db.allfiles.filepath==path)&(db.allfiles.user_file==me)).update(content=data)
    return 'Updated!!!'

def browsefiles():
    files=db((db.allfiles.user_file==me)&(db.allfiles.filetype !='dir')) \
           .select(db.allfiles.filepath)
    result={}
    filetypes= set(['gif','jpg','png','bmp','swf'])
    for rfile in files:
        if rfile.filepath[-3:] in filetypes:
            result[rfile.filepath]=getfileinfo(rfile.filepath)
    return dict(result=result,cknum=request.vars.CKEditorFuncNum)


###################################################
#
# Get file info (when click on a file)
#
###################################################

def getfileinfo(path):
    """ LOL a alleger fortement -> virer les infos inutiles """
    logger.debug('lolz?')
    row=db((db.allfiles.filepath==path)&(db.allfiles.user_file==me)).select()[0]
    abspath=request.folder+path
    iconfolder='static/images/fileicons/'
    absiconlocation=request.folder+iconfolder
    iconlocation='/'+request.application+'/'+iconfolder
    filename=row.filename
    filetype=row.filetype
    filesize=row.filesize
    thefile = {
            'Filename' : filename,
            'FileType' : '',
            'Preview' : iconlocation+'_Open.png' if filetype=='dir' else '' ,
            'FilePreview':'',
            'Path' : path,
            'Error' : '',
            'Code' : 0,
            'Properties' : {
                    'Width' : '',
                    'Height' : '',
                    'Size' : ''
             }
            }
            
    imagetypes = set(['gif','jpg','jpeg','png','bmp'])      
        
    if filetype=='dir':
        thefile['FileType'] = 'Directory'
    else:
        thefile['FileType'] = filetype  
        if filetype in imagetypes:
            thefile['Preview']='/'+request.application+'/filemanager/download/'+row.file
        elif filetype=="mp3" or filetype=="flv":
            thefile['FileType']='media'
            embedfile='/'+request.application+'/filemanager/download/'+row.file          
            thefile['FilePreview']=str(plugin_mediaplayer(embedfile,400,300))
            previewPath = iconlocation + filetype.lower() + '.png'
            abspreviewPath=absiconlocation+filetype.lower()+'.png'
            thefile['Preview'] = previewPath if os.path.exists(abspreviewPath) else iconlocation+'default.png'
        else:
            previewPath = iconlocation + filetype.lower() + '.png'
            abspreviewPath=absiconlocation+filetype.lower()+'.png'
            thefile['Preview'] = previewPath if os.path.exists(abspreviewPath) else iconlocation+'default.png'        
    thefile['Properties']['Size'] = filesize
    return thefile

###################################################
#
# Used for left listing on filemanager
#
###################################################

def dirlist():
   import re
   r=['<ul class="jqueryFileTree" style="display: none;">']
   path=request.post_vars.dir
   # Deported to function first_login in desk.py
   # 
   # rows=db((db.allfiles.parentpath==path)&(db.allfiles.user_file==me))\
   #       .select()
   # if len(rows)==0 and path=='/':
   #      Directories=['Documents','Audios','Other']
   #      parentpath='/'
   #      for directory in Directories:
   #          filename=directory
   #          filepath='/'+filename+'/'
   #          db.allfiles.insert(filename=filename,filepath=filepath,parentpath=parentpath,filetype='dir',datecreated=now,user_file=me)
   rows=db((db.allfiles.parentpath==path)&(db.allfiles.user_file==me))\
         .select(db.allfiles.filepath,
                 db.allfiles.filename,
                 db.allfiles.filetype)
   for row in rows:
       if row.filetype=='dir':
          r.append('<li class="directory collapsed"><a href="#" rel="%s">%s</a></li>' % (row.filepath,row.filename))    
   r.append('</ul>')
   return r

@service.json
def addfolder(param):    
    filename=request.vars.name.replace(' ','_')
    parentpath=request.vars.path
    filepath=parentpath+filename+'/'
    rows=db((db.allfiles.filepath==filepath)&(db.allfiles.user_file==me)).select(db.allfiles.id)
    recordexists=len(rows)
    if not recordexists:
        db.allfiles.insert(filename=filename,filepath=filepath,parentpath=parentpath,filetype='dir',datecreated=now,user_file=me)
        result= {
                    'Parent' : parentpath,
                    'Name' : filename,
                    'Error' :'',
                    'Code' :0
                    }
    else:
        result = {
                    'Path' : parentpath,
                    'Name' : filename,
                    'Code' : 1,
                    'Error' : 'Folder already exists'
                }
    return result

###################################################
#
# Need rework (too much queries are sent)
#
###################################################

@service.json
def delete(param):
    path=request.vars.path
    # moche a optimiser (trop de requetes car pb variables session)
    size_min = 0
    row_user = db(db.auth_settings.user_id==auth.user.id) \
               .select(db.auth_settings.stored_data_size,
                       db.auth_settings.limit_stored_data_size).first()
    session.data_size = int(row_user['stored_data_size'])
    filepaths=remove(path,pathset=[])
    for filepath in filepaths:
        if not filepath[-1]=='/':
            row=db((db.allfiles.filepath==filepath )&(db.allfiles.user_file==me)) \
                         .select(db.allfiles.file, db.allfiles.filesize).first()
            # I - Add size to size [...]
            size_min = size_min + row['filesize']
        db((db.allfiles.filepath==filepath)&(db.allfiles.user_file==me)).delete()
    # II - Update size avaible
    logger.debug(size_min)
    db(db.auth_settings.user_id==auth.user.id) \
              .update(stored_data_size=db.auth_settings.stored_data_size-size_min)
    result={
            'Error':'No Error',
            'Code':0,
            'Path': path 
           }        
    return result
     
@service.json
def rename(param):
    """ A remove ou alleger ?? AS """
    #print "<---------rename--------->"
    oldpath=request.vars.old  
    #print "oldpath:",oldpath      
    #print "parentpath:",parentpath
    newname = request.vars.new.replace(' ','_')    
    result={
            'type':'',
            'Old Path':'',
            'New Path':'',
            'Old Name':'',
            'New eName':'',
            'parent':'',
            'Code':0,
            'Error':''
            } 
    if oldpath[-1]=='/':
        oldname=split_path(oldpath[:-1])[-1]
        parentpath=split_path(oldpath[:-1])[0]
        if not parentpath=='/':
            parentpath=parentpath+'/'
        row=db((db.allfiles.parentpath==parentpath)&(db.allfiles.filetype=='dir') \
        &(db.allfiles.filename==newname)&(db.allfiles.user_file==me)).select()
        if len(row)==1:
            result['Code']=1
            result['Error']='Folder already exists'
            return result
        newpath=parentpath+newname+'/'
        result['type']='dir'
        db((db.allfiles.filepath==oldpath)&(db.allfiles.user_file==me)).update(filepath=newpath,filename=newname,datemodified=now)
        renamedir(oldpath,oldname,newname)
    else:   
        oldname = split_path(oldpath)[-1]
        parentpath = split_path(oldpath)[0]
        if not parentpath=='/':
            parentpath=parentpath+'/'        
        newpath = parentpath + newname
        row=db((db.allfiles.parentpath==parentpath)&(db.allfiles.filepath==newpath)&(db.allfiles.user_file==me)).select()
        if len(row)==1:
            result['Code']=1
            result['Error']='File already exists'
            return result
        result['type']='file'
        db((db.allfiles.filepath==oldpath)&(db.allfiles.user_file==me)).update(filepath=newpath,filename=newname,datemodified=now)
    result['parent']=parentpath
    result['Old Path']= oldpath
    result['Old Name']=oldname
    result['New Path']=newpath
    result['New eName']=newname    
    return result 
    
def renamedir(oldpath,oldname,newname):
    newpath=oldpath.replace(oldname,newname)
    rows=db((db.allfiles.parentpath==oldpath) &
            (db.allfiles.user_file==me)).select()
    for row in rows:
        if row.filepath[-1]=='/':
            db((db.allfiles.parentpath==oldpath) &
               (db.allfiles.user_file==me)).update(parentpath=row.parentpath.replace(oldname,newname),
                                               datemodified=now)
            renamedir(row.filepath,oldname,newname)
            db((db.allfiles.filepath==row.filepath) &
               (db.allfiles.user_file==me)).update(filepath=row.filepath.replace(oldname,newname),
                                              datemodified=now)
        else:
            db((db.allfiles.filepath==row.filepath) &
               (db.allfiles.user_file==me)).update(filepath=row.filepath.replace(oldname,newname),
                                              parentpath=row.parentpath.replace(oldname,newname),
                                              datemodified=now)

###################################################
#
# Used for file upload (with multiple file up) + Need rework (too much queries
#
###################################################

def add():
    for r in request.vars:
        if r=="qqfile":
            try:
                size = 0
                #
                # Differ between web2py server and apache
                #
                if request.env.has_key('http_content_length'):
                    size = int(request.env['http_content_length'])
                else:
                    size = int(request.env['content_length'])
                logger.debug(size)
                if session.data_size + size > session.max_size:
                    raise HTTP(405,'not enough space')
            except:
                logger.error("NO SIZE FOUND IN HEADER in filemanager.py in add()")
                raise HTTP(405,'not enough space')            
                
                
            # LIMIT SIZE
            session.data_size = session.data_size + size

            db(db.auth_settings.user_id==auth.user.id).update(stored_data_size=session.data_size)
            
            
            parentpath=request.vars.path
            file=request.vars.qqfile
            logger.debug('New file uploading : ' + file)
            #
            # Re-arange file
            #
            filename=file.replace(' ','_')
            filepath=parentpath+filename
            filetype=os.path.splitext(filename)[1][1:]
            #
            # Test if file already exists
            #
            # row=db((db.allfiles.parentpath==parentpath)
            #        &(db.allfiles.filepath==filepath)
            #        &(db.allfiles.filename==filename)
            #        &(db.allfiles.user_file==me)).select()
            # if not len(row):
            db.allfiles.insert(filename=filename,
                               filepath=filepath,
                               parentpath=parentpath,
                               filetype=filetype,
                               file=db.allfiles.file.store(request.body,filename),
                               datecreated=now,
                               filesize=size,
                               user_file=me)   
            return response.json({'success':'true'})
            # else:
            #     return response.json({'success':'false'})
    return response.json({'success':'false'})

def downloadurl():
    """
    allows downloading of uploaded files
    http://..../[app]/default/download/[filename]
    """
    filename=request.vars.filename
    file=db((db.allfiles.filename==filename)&(db.allfiles.user_file==me)).select(db.allfiles.file)[0] 
    return file.file

def download():
    return response.download(request,db)

def call():
    """
    exposes services. for example:
    http://..../[app]/default/call/jsonrpc
    decorate with @services.jsonrpc the functions to expose
    supports xml, json, xmlrpc, jsonrpc, amfrpc, rss, csv
    """
    session.forget()
    return service()


def remove(path,pathset):
    if path[-1]=='/':
        pathset.append(path)
        rows=db((db.allfiles.parentpath==path)&(db.allfiles.user_file==me))\
              .select(db.allfiles.filetype,
                      db.allfiles.filepath)
        for row in rows:
            if row.filetype=='dir':
                remove(row.filepath,pathset=pathset)
            else:
                pathset.append(row.filepath)
    else:
        pathset.append(path)
    return pathset
