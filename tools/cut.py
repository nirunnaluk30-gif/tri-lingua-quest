import sys,glob,os
from rembg import remove,new_session
from PIL import Image
src,out=sys.argv[1],sys.argv[2]
s=new_session('isnet-anime')
for f in sorted(glob.glob(src+'/0*.png')):
    im=Image.open(f).convert('RGB')
    r=remove(im,session=s,post_process_mask=True)
    r.save(os.path.join(out,os.path.basename(f)));print(f,r.getbbox())
