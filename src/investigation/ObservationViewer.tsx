import {useEffect,useMemo,useRef,useState} from 'react';
import {samplePixel} from './model';
import {flaggedCorePixel,usableReferencePixel} from './interpretation';
import type {Observation,ObservationData} from './model';
import {clampView,renderPresentation} from '../display';

export interface DisplayState {quality:boolean;smooth:boolean;zoom:number;panNative:{x:number;y:number};devicePixelRatio:number}
export default function ObservationViewer({observation,data,selected,inspected=false,onSelect,onDisplay}:{observation:Observation;data:ObservationData;selected:{x:number;y:number};inspected?:boolean;onSelect:(x:number,y:number)=>void;onDisplay?:(state:DisplayState)=>void}){
 const canvas=useRef<HTMLCanvasElement>(null),host=useRef<HTMLDivElement>(null);
 const [size,setSize]=useState(400),[zoom,setZoom]=useState(1),[pan,setPan]=useState({x:0,y:0}),[quality,setQuality]=useState(true),[smooth,setSmooth]=useState(false);
 const rasterCache=useRef<{data:ObservationData;resolution:number;smooth:boolean;canvas:HTMLCanvasElement}|null>(null);
 const drag=useRef<{x:number;y:number;px:number;py:number;moved:boolean}|null>(null);
 const [height,width]=observation.dimensions;
 const sample=samplePixel(observation,data,selected.x,selected.y);
 const core=useMemo(()=>flaggedCorePixel(observation,data),[observation,data]);
 const acceptedReference=useMemo(()=>usableReferencePixel(observation,data),[observation,data]);
 useEffect(()=>{const element=host.current;if(!element)return;const observer=new ResizeObserver(entries=>setSize(Math.max(1,entries[0].contentRect.width)));observer.observe(element);return()=>observer.disconnect()},[]);
 useEffect(()=>{onDisplay?.({quality,smooth,zoom,panNative:{x:pan.x/(size*zoom)*width,y:pan.y/(size*zoom)*height},devicePixelRatio:window.devicePixelRatio||1})},[quality,smooth,zoom,pan.x,pan.y,size,width,height,onDisplay]);
 useEffect(()=>{setPan({x:0,y:0});setZoom(1)},[observation.id]);
 useEffect(()=>{setPan(p=>clampView(p,zoom,size))},[size,zoom]);
 useEffect(()=>{const c=canvas.current;if(!c)return;const dpr=window.devicePixelRatio||1,n=Math.max(1,Math.round(size*dpr));c.width=n;c.height=n;const ctx=c.getContext('2d');if(!ctx)return;
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#080b0c';ctx.fillRect(0,0,size,size);
  const resolution=smooth?Math.min(1400,Math.ceil(n*zoom)):width;
  let cached=rasterCache.current;
  if(!cached||cached.data!==data||cached.resolution!==resolution||cached.smooth!==smooth){
   const raster=document.createElement('canvas');raster.width=resolution;raster.height=resolution;
   const accepted=Uint8Array.from(data.mask,v=>v===0?1:0);
   const range=observation.render,low=Number(range.min),high=Number(range.max),soft=(high-low)/Number(range.asinhSoftening);
   const rgba=renderPresentation({image:data.image,mask:accepted},width,height,resolution,smooth,{low,high,soft});
   const rasterContext=raster.getContext('2d');if(rasterContext){const imageData=rasterContext.createImageData(resolution,resolution);imageData.data.set(rgba);rasterContext.putImageData(imageData,0,0)}
   cached={data,resolution,smooth,canvas:raster};rasterCache.current=cached;
  }
  const raster=cached.canvas;
  const side=size*zoom,left=(size-side)/2+pan.x,top=(size-side)/2+pan.y,cell=side/width;
  ctx.imageSmoothingEnabled=false;ctx.drawImage(raster,left,top,side,side);
  if(quality){ctx.fillStyle='rgba(244,178,88,.66)';for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(data.mask[y*width+x]===1)ctx.fillRect(left+x*cell,top+(height-1-y)*cell,cell,cell)}
  ctx.strokeStyle='#dcff97';ctx.lineWidth=1.5;ctx.strokeRect(left+selected.x*cell,top+(height-1-selected.y)*cell,cell,cell);
 },[data,observation,size,zoom,pan,quality,smooth,selected,width,height]);
 function changeZoom(next:number){const z=Math.min(8,Math.max(1,next));setZoom(z);setPan(p=>clampView(p,z,size))}
 function pick(clientX:number,clientY:number){const r=canvas.current!.getBoundingClientRect(),side=size*zoom,left=(size-side)/2+pan.x,top=(size-side)/2+pan.y;const x=Math.floor((clientX-r.left-left)/side*width),y=height-1-Math.floor((clientY-r.top-top)/side*height);if(x>=0&&x<width&&y>=0&&y<height)onSelect(x,y)}
 return <article className="inv-observation">
  <header><div><span className="inv-eyebrow">Observed · SPHEREx</span><h3>{observation.label}</h3></div><span className="inv-native">{width} × {height} native pixels</span></header>
  <div ref={host} className="inv-image-wrap"><canvas ref={canvas} style={{touchAction:zoom===1?'pan-y':'none'}} tabIndex={0} aria-label={`Native observation ${observation.label}. Click a pixel to inspect. Arrow keys inspect adjacent pixels; Enter inspects the current pixel; plus and minus zoom.`}
   onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);drag.current={x:e.clientX,y:e.clientY,px:pan.x,py:pan.y,moved:false}}}
   onPointerMove={e=>{const d=drag.current;if(!d)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;if(Math.abs(dx)+Math.abs(dy)>4)d.moved=true;if(d.moved)setPan(clampView({x:d.px+dx,y:d.py+dy},zoom,size))}}
   onPointerUp={e=>{if(drag.current&&!drag.current.moved)pick(e.clientX,e.clientY);drag.current=null}}
   onPointerCancel={()=>{drag.current=null}}
   onKeyDown={e=>{const moves:Record<string,[number,number]>={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]};if(moves[e.key]){e.preventDefault();const [dx,dy]=moves[e.key];onSelect(Math.max(0,Math.min(width-1,selected.x+dx)),Math.max(0,Math.min(height-1,selected.y+dy)))}if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(selected.x,selected.y)}if(e.key==='+'||e.key==='=')changeZoom(zoom*1.5);if(e.key==='-')changeZoom(zoom/1.5)}} />
   <span className="inv-image-caption">Native detector orientation · not north-up</span>
  </div>
  <div className="inv-control-rail"><div className="inv-inspect-actions"><p>{inspected?'Choose another pixel to compare its quality status.':'Click or tap the image, use the arrow keys, or start with a reference below.'}</p><div className="inv-guided-actions" role="group" aria-label="Compare two quality outcomes">{acceptedReference&&<button aria-pressed={inspected&&selected.x===acceptedReference.x&&selected.y===acceptedReference.y} onClick={()=>{changeZoom(1);setPan({x:0,y:0});onSelect(acceptedReference.x,acceptedReference.y)}}><strong>1. Inspect a usable pixel</strong><span>x {acceptedReference.x}, y {acceptedReference.y} · {observation.label}</span></button>}{core&&<button className="inv-core-action" aria-pressed={inspected&&selected.x===core.x&&selected.y===core.y} onClick={()=>{changeZoom(1);setPan({x:0,y:0});onSelect(core.x,core.y)}}><strong>2. Examine the excluded core</strong><span>x {core.x}, y {core.y} · {observation.label}</span></button>}</div></div><div className="inv-pixel-readout" role="status" aria-live="polite"><span className="inv-eyebrow">{inspected?'Your inspected pixel':'Reference pixel · not yet inspected'}</span><h3>x {selected.x} / y {selected.y}</h3><p className={sample.accepted?'inv-pixel-accepted':'inv-pixel-excluded'}>{sample.accepted?'Accepted under current quality policy':'Excluded from measurements'}</p><dl><div><dt>IMAGE · MJy/sr</dt><dd>{sample.value===null?'Unavailable':sample.value.toPrecision(6)}</dd></div><div><dt>Statistical uncertainty · MJy/sr</dt><dd>{sample.sigma===null?'Unavailable':sample.sigma.toPrecision(4)}</dd></div><div><dt>Quality flags · SOURCE alone is retained</dt><dd>{sample.flagNames.join(' · ')||'No flags set'}</dd></div></dl></div><div className="inv-view-tools"><div className="inv-zoom"><button aria-label="Zoom out" disabled={zoom<=1} onClick={()=>changeZoom(zoom/1.5)}>−</button><span>{zoom.toFixed(1)}×</span><button aria-label="Zoom in" disabled={zoom>=8} onClick={()=>changeZoom(zoom*1.5)}>+</button><button onClick={()=>{changeZoom(1);setPan({x:0,y:0})}}>Reset</button></div><label><input type="checkbox" checked={quality} onChange={e=>setQuality(e.target.checked)}/> Quality mask</label><label><input type="checkbox" checked={smooth} onChange={e=>setSmooth(e.target.checked)}/> Smooth display</label></div>
  <p className="inv-caption">{quality?'Amber = excluded pixels. ':'Excluded pixels are black. '}{smooth?'Interpolated display only; masked regions remain empty.':'Nearest native pixels; no added resolution.'} Drag to pan when zoomed. Select a pixel to inspect its evidence.</p><a className="inv-text-link" href="#investigation-verify">Understand what this means ↓</a></div>
 </article>
}
