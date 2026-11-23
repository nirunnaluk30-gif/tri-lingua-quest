# idle animation from one picture: a soft mesh warp, feet stay planted,
# the body breathes and sways, outer parts (wings, cape, claws) flutter a little more
import sys,glob,os,math
from PIL import Image
src,out,H,N=sys.argv[1],sys.argv[2],int(sys.argv[3]),int(sys.argv[4])
CFG={'01':dict(flap=1.0),'02':dict(flap=0.35),'03':dict(flap=0.9),'04':dict(flap=0.3),'05':dict(flap=0.55),'06':dict(flap=0.8)}
def ss(e0,e1,x):
    t=max(0,min(1,(x-e0)/(e1-e0)));return t*t*(3-2*t)
for f in sorted(glob.glob(src+'/0*.png')):
    key=os.path.basename(f)[:2];c=CFG[key]
    im=Image.open(f).convert('RGBA');im=im.crop(im.getbbox())
    pad=12;W0,H0=im.size;base=Image.new('RGBA',(W0+2*pad,H0+2*pad),(0,0,0,0));base.paste(im,(pad,pad));im=base
    s=H/im.size[1];im=im.resize((round(im.size[0]*s),H),Image.LANCZOS);W,Hh=im.size
    cx=W/2;foot=Hh-pad*s;G=16
    frames=[]
    for k in range(N):
        ph=2*math.pi*k/N;br=math.sin(ph);sw=math.sin(ph+0.6)
        def P(x,y):
            h=ss(foot,0,y)                      # 0 at feet, 1 at top
            dy=-1.6*br*h*h*s*2.2                # breathing: upper body rises
            dx=0.9*sw*h*h*s*2.2                 # gentle sway
            side=ss(0.18,0.5,abs(x-cx)/W)       # outer parts
            up=ss(foot,foot*0.25,y)
            dy+=-c['flap']*2.6*br*side*up*s*2.2*(abs(x-cx)/(W/2))
            dx+=c['flap']*0.8*sw*side*up*s*2.2*(1 if x>cx else -1)
            return x-dx,y-dy                    # sample point in source
        mesh=[]
        for gy in range(G):
            for gx in range(G):
                x0,y0=W*gx/G,Hh*gy/G;x1,y1=W*(gx+1)/G,Hh*(gy+1)/G
                q=P(x0,y0)+P(x0,y1)+P(x1,y1)+P(x1,y0)
                mesh.append(((round(x0),round(y0),round(x1),round(y1)),q))
        frames.append(im.transform((W,Hh),Image.MESH,mesh,Image.BICUBIC))
    o=os.path.join(out,os.path.basename(f)[:-4]+'.webp')
    frames[0].save(o,save_all=True,append_images=frames[1:],duration=140,loop=0,quality=80,method=6)
    print(o,(W,Hh),os.path.getsize(o))
