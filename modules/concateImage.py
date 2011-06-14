#
# Image compressor v0.1
# Concat images and generate CSS
#
# by Strzelewicz Alexandre
# hemca.com
# 20/12/2010
#
# todo : genrate sample file

import PIL
from PIL import Image
import sys, traceback
import inspect

size = 400,200

def test():
    print "DAKSDL:KASDL:KL:ADKS"

def gen_sample_file(css, image_file):
    output_html = image_file.replace('.png', '.html')
#    print output_html
    f = open(output_html, 'w')
    f.write('<html>')
    f.write('<head>')
    f.write('<title>Sample page rendered</title>')
    f.write(css[0])
    f.write('</head>')
    f.write('<body>')
    f.write('<a href="http://blog.hemca.com/?page_id=2" target="_blank">Service by Strzelewicz Alexandre</a>')
    f.write('<br/>')
    f.write('<p>Only one image is here :<br/>')
    f.write('<br/>')
    f.write('<img src="' + image_file.split('/')[-1] + '"></img>')
    f.write('<br/>')
    f.write('<br/>')
    f.write('Here images splitted :</p>')
    f.write('<br/>')
    for i in range(1,len(css),2):
        f.write('\n')
        f.write(css[i].replace('<!--', '<h3>').replace('-->', '</h3>'))
        i += 1
        f.write('\n')
        f.write(css[i])
        f.write('\n')
        f.write('<br/>')
        f.write('<br/>')
    f.write('</body>')
    f.write('</html>')
    f.close()
#    print "Sample file generated"
    return output_html
    
def concate_image(file_final, files, files_raw, logger):
    css = []
#    logger.debug('Importing concateImagesdasd')
    try:
        images = map(Image.open, files)
    except:
        #traceback.print_exc(file=sys.stdout)
        raise IOError("Wrong file type")
    css_template = '<div class="wsa" style="background-position : -%dpx 0px; width : %dpx; height : %dpx;"></div>'
    w = sum(i.size[0] for i in images)
    mh = max(i.size[1] for i in images)
    result = Image.new("RGBA", (w, mh))
    css.append('<style type="text/css">\n.wsa{\nbackground-image : url("'+ file_final.split('/')[-1] + '");\n}\n</style>')
    x = 0
    j = 0
    for i in images:
        result.paste(i, (x, 0))
        css.append('<!-- File : ' + files_raw[j] + ' -->')
        css.append(css_template % (x, i.size[0], i.size[1]))
        j += 1
        x += i.size[0]
    logger.debug("Saving render to : " + file_final)
    result.save(file_final)

    # Creating thumb
    outfile = file_final.replace('.png', '-thumb.png')
    img = Image.open(file_final)
    img.thumbnail(size, Image.ANTIALIAS)
    logger.debug("Saving thumb to : " + outfile)
    img.save(outfile, "PNG")
    
    # Generate sample file
    output_html = gen_sample_file(css, file_final)
    
    return css, output_html
