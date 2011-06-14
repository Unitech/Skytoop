# Skytoop, an open source cloud desktop

I did Skytoop to learn Ajax, Web2Py and Jquery intensively.

You can check a demo version on http://www.skytoop.com 
: username = demo@skytoop.com
: password = 123456

## How to use the sources ? 

* Start the server (python web2py.py)
* Go to http://localhost:8000/Skytoop/default/create_user to create a default user
* Now go to http://localhost:8000/Skytoop and login with model@skytoop.com, password = 123456

## Functionnalities

* Filemanager (controllers/filemanager.py + views/filemanager)
* Multi file upload 
* Size limitation on total file uploaded (db/db_tables.py)
* Wallpapers can be set
* Public/Private Skytoop
* Widgets (static/widgets/)
* Widget Draw (static/widgets/drawZone) (the code is ugly)
* Widget Note (static/widgets/notes)
* Icons
* Ajax Search
* Widgets position synchronisation
* Css + Js compression (with pack.py)

## Widgets

The "Parent widget" (this is not a real inheritance, todo) is 
located in static/widgets/widgetsGen/jquery.widgetsGen.js

To add a new widget :

1. Add the name (represented by his name in syncType) of the widget in :

── $.fn.widgetGen.select

The parent widget has a CRUD for child widgets :
    ── $.fn.widgetGen.save
    ── $.fn.widgetGen.update
    ── $.fn.widgetGen.remove
    ── $.fn.widgetGen.send

2. Datas you can syncronize with the server are all fields begining 
with the prefix sync:

     $.fn.widgetGen.defaults = {
	syncType	: '',
	syncX		: 0,
	syncY		: 0,
	syncWidth	: 0,
	syncHeight	: 0,
	syncData1	: '',	 
	syncData2	: '',
	syncData3	: '',
	syncTitle	: '',
	syncId		: 0
    };

3. For an example refer to static/widgets/notes/jquery.stickynote.js 
or static/widgets/widgetsGen/sample-widget.js

## Files

* JS for Desktop design are on static/desk/assets/javascript/*
* JS for the filemanager are on static/filemanager

### Controllers

    controllers/
    ├── appadmin.py       # Appadmin
    ├── custom.py         # To change wallpaper and to switch on a public Skytoop
    ├── default.py        # Desktop main controllers
    ├── filemanager.py    # Filemanager
    ├── get_list.py       # On the index when you click on left bottom Skytoop c, get desktop list
    ├── icons.py          # CRUD for icons + favicon.ico grabbing
    ├── note_log.py       # On the index page for displaying recent changes
    ├── public.py	      # For search bar + public Skytoops 
    ├── vote_log.py	      # Vote log, for voting for features
    └── widget.py         # CRUD widgets

### JS/CSS Files

    static/
    ├── color-picker           # Color picker when customizing wallpaper
    ├── css			   # CSS Files
    ├── desk		   # Main folder for JS/CSS Desktop
    │   └── assets
    │       ├── images
    │       │   ├── gui
    │       │   ├── icons
    │       │   └── misc
    │       ├── javascripts    # @@@ Here are the most important files for Desktop
    │       ├── scroll	   # Customization of the scroll bar
    │       └── stylesheets	   # CSS files
    ├── filemanager		   # For the filemanager
    │   ├── css
    │   ├── images
    │   │   └── fileicons
    │   ├── jquery_contextmenu
    │   │   └── images
    │   ├── jquery_filetree
    │   │   └── images
    │   └── js
    ├── html5
    ├── images
    ├── js
    ├── multifile-upload	  # For the multiple file upload
    ├── pres-images
    ├── speed-bar		  # Images for the "speed bar" at the right of desktops
    ├── svg
    ├── tmp
    ├── vote_log		  # For the vote log
    │   ├── css
    │   └── js
    ├── wallpapers -> ../uploads/  # to avoid downloading wallpaper each time (not very secure)
    └── widgets		  # Widgets
    ├── drawZone	  
    ├── notes
    │   ├── css
    │   └── images
    ├── template
    ├── widgetsGen
    └── winamp


