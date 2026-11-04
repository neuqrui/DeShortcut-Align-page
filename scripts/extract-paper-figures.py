"""Extract the site's original paper figures from arXiv:2609.34896v1."""
from pathlib import Path
import argparse
import subprocess
from PIL import Image
parser=argparse.ArgumentParser()
parser.add_argument('pdf',type=Path)
parser.add_argument('--dpi',type=int,default=260)
args=parser.parse_args()
out=Path(__file__).resolve().parents[1]
work=out/'tmp'/'paper-renders';work.mkdir(parents=True,exist_ok=True)
crops={
 'training-standard':(2,(.516,.562,.832,.707)),
 'ablation':(8,(.174,.146,.826,.354)),
 'attribution-strategies':(8,(.497,.843,.826,.903)),
 'jailbreak-results':(9,(.529,.355,.826,.503)),
 'training-ours':(9,(.51,.578,.828,.727)),
 'extended-baselines':(22,(.174,.163,.826,.359)),
 'multi-seed':(23,(.174,.141,.826,.32)),
 'reasoning-kl':(24,(.30,.101,.699,.279)),
 'optimizer-transfer':(24,(.174,.521,.826,.648)),
 'optimization':(25,(.173,.10,.827,.215)),
 'parameter-sensitivity':(25,(.174,.464,.826,.557)),
 'masking-length':(25,(.288,.851,.712,.923)),
 'validation':(26,(.174,.178,.826,.515)),
 'token-attribution':(32,(.172,.085,.826,.249)),
 'agca-example':(32,(.174,.319,.826,.695))
}
for page in sorted({page for page,_ in crops.values()}):
 dest=work/str(page)
 subprocess.run(['pdftoppm','-f',str(page),'-l',str(page),'-r',str(args.dpi),'-singlefile','-png',str(args.pdf),str(dest)],check=True,capture_output=True)
for name,(page,box) in crops.items():
 im=Image.open(work/f'{page}.png');w,h=im.size
 im.crop(tuple(round(v*(w if i%2==0 else h)) for i,v in enumerate(box))).save(out/'assets'/f'{name}.webp',quality=96)
 print(name)
