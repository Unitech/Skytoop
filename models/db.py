# -*- coding: utf-8 -*- 
# by Strzelewicz Alexandre 

#
#
# This file permits to :
# - Distinguish between a production or a development production (You must export PRODUCTION environ variable)
# - Configuring the logger
# - Determining if the action is for write or read only on database (load balancing)
#
#

from gluon.tools import Mail
import logging, logging.handlers

#########################################################
#
# Mailing
#
#########################################################

mail = Mail()

#mail.settings.server = 'logging'

#########################################################
#
# DB definition
#
#########################################################

import os

prod = cache.ram('prod', lambda : bool(os.environ.get('PRODUCTION')), time_expire=5000)

if prod == False:
    #
    # Development environment
    #
    log_level = logging.DEBUG
    migrate=True
    db = DAL('sqlite://storage.sqlite')
    mail.settings.server = 'localhost:24'
    mail.settings.sender = 'strzel_a@hemca.com'
else:
    #
    # Production environment
    #
    log_level = logging.ERROR
    migrate=False
    db = DAL('sqlite://storage.sqlite')
#    db = DAL('mysql://LOGIN:PASS@localhost:3306/skytoop_prod',pool_size=20, migrate=False)
    mail.settings.server = 'localhost:25'
    mail.settings.sender = 'register@skytoop.com'



#########################################################
#
# Global functions
#
#########################################################

imagetypes = set(['gif','jpg','jpeg','png','bmp', 'JPG', 'PNG', 'GIF', 'BMP'])

#
# Logger
#

def get_configured_logger(name):
    logger = logging.getLogger(name)
    if (len(logger.handlers) == 0):
        # Create RotatingFileHandler
        import os
        formatter="%(asctime)s %(levelname)s %(process)s %(thread)s %(funcName)s():%(lineno)d %(message)s"
        handler = logging.handlers.RotatingFileHandler(os.path.join(request.folder,'private/app.log'),maxBytes=1024,backupCount=2)
        handler.setFormatter(logging.Formatter(formatter))
        # setting level
        handler.setLevel(log_level)
        logger.addHandler(handler)
        logger.setLevel(log_level)
        logger.debug(name + ' logger created')
        if str(prod) == True:
            logger.debug('Server launched in production mode')
        else:
            logger.debug('Server launched in developpment mode')
    return logger

logger = cache.ram('once',lambda:get_configured_logger(request.application),time_expire=99999999)



######################################################################################
#
# This permits to distinguish which controlers are for read only or for writting on DB
#
######################################################################################

# req_controller = request.env['path_info'][request.env['path_info'].find('/',2) + 1:]
    
#     read_controller = ('icons/get_icon.json',
#                        'widget/get_widget.json',
#                        'default/index',
#                        'public/person_speed_search',
#                        'public/index/*',
#                        'public/search')

#     write_controller = ('widget/new_widget',
#                         'widget/remove_widget',
#                         'widget/update_widget',
#                         'icons/new_icon',
#                         'icons/delete_icon',
#                         'icons/modify_icon')
    
# if req_controller in read_controller:
#     logger.debug('Request '  + req_controller + ' is in READ')
# else:
#     logger.debug('Request '  + req_controller + ' is in WRITE')





