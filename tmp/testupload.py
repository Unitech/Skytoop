
import logging
import os

def index():
    return dict(msg="hello world")

def upload():
    for r in request.vars:
        if r=="qqfile":
            filename=request.vars.qqfile
            logger.debug('YEYEYEY : ' + request.vars.path)
            logger.debug('New file uploading : ' + filename)
            #db.upload.insert(file=db.upload.file.store(request.body,filename),
            #                 name=filename,
            #                 ns=session.uuid)
            return response.json({'success':'true'})
