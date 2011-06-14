#!/usr/bin/python

#
#
# Run pack.py to autmatically compress CSS (to static/sss.css) and JS (to static/sss.js)
#
#

from StringIO import StringIO
import jsmin

import sys
import os
    
PATH='static/'
OUTJS='sss.js'
OUTCSS='sss.css'

file_js = ('jquery.min.js',
           'js/jquery-ui-1.8.11.js',
           'js/misc-funcs.js',
           'desk/assets/javascripts/skytoopWindow.js',
           'desk/assets/javascripts/skytoopDesktop.js',
           'desk/assets/javascripts/skytoopIcon.js',
           'js/web2py_spe.js',
           'js/main.js',
           'desk/assets/javascripts/jquery.desktop.js',
           'svg/jquery.svg.min.js',
           'widgets/widgetsGen/jquery.widgetsGen.js',
           'widgets/notes/jquery.stickynote.js',
           'widgets/drawZone/jquery.drawZone.js',
           'widgets/winamp/jquery.winamp.js')

file_css = ('desk/assets/stylesheets/desktop.css',
            'desk/assets/scroll/jquery.jscrollpane.css',
            'css/composant.css',
            'css/jquery-ui-1.8.11.custom.css',
            'widgets/notes/css/style.css',
            'widgets/drawZone/drawZone.css')


def compress_css(fd1, out):
    import sys, re
    css = fd1.read()
    #print 'READ ' + css
    # remove comments - this will break a lot of hacks :-P
    css = re.sub( r'\s*/\*\s*\*/', "$$HACK1$$", css ) # preserve IE<6 comment hack
    css = re.sub( r'/\*[\s\S]*?\*/', "", css )
    css = css.replace( "$$HACK1$$", '/**/' ) # preserve IE<6 comment hack
    # url() doesn't need quotes
    css = re.sub( r'url\((["\'])([^)]*)\1\)', r'url(\2)', css )
    # spaces may be safely collapsed as generated content will collapse them anyway
    css = re.sub( r'\s+', ' ', css )
    # shorten collapsable colors: #aabbcc to #abc
    css = re.sub( r'#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3(\s|;)', r'#\1\2\3\4', css )
    # fragment values can loose zeros
    css = re.sub( r':\s*0(\.\d+([cm]m|e[mx]|in|p[ctx]))\s*;', r':\1;', css )
    for rule in re.findall( r'([^{]+){([^}]*)}', css ):
        # we don't need spaces around operators
        selectors = [re.sub( r'(?<=[\[\(>+=])\s+|\s+(?=[=~^$*|>+\]\)])', r'', selector.strip() ) for selector in rule[0].split( ',' )]
        # order is important, but we still want to discard repetitions
        properties = {}
        porder = []
        
        for prop in re.findall( '(.*?):(.*?)(;|$)', rule[1] ):
            key = prop[0].strip().lower()
            if key not in porder: porder.append( key )
            properties[ key ] = prop[1].strip()
            # output rule if it contains any declarations
        if properties:
            out.write("%s{%s}" % ( ','.join( selectors ), ''.join(['%s:%s;' % (key, properties[key]) for key in porder])[:-1] ))
        

def process_js():
    jsm = jsmin.JavascriptMinify()
    try:
        os.remove(PATH + OUTJS)
    except:
        print "delete nop"
        
    out = open(PATH + OUTJS, 'wb')    
    for t in file_js:
        print "Processing " + t
        fd1 = open(PATH + t, 'r')
        jsm.minify(fd1, out)
        fd1.close()
    out.close()
    print "Written in " + PATH + OUTJS

def process_css():
    try:
        os.remove(PATH + OUTCSS)
    except:
        print "delete nop"
    out = open(PATH + OUTCSS, 'wb')
    for t in file_css:
        print "Processing " + t
        fd1 = open(PATH + t, 'r')
        compress_css(fd1, out)
        fd1.close()
    out.close()
    print "Written in " + PATH + OUTCSS


    
    
if __name__ == '__main__':
    process_js()
    process_css()
    
    
    

    
    


