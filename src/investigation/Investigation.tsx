import {useCallback,useEffect,useRef,useState} from 'react';
import {loadInvestigation,loadObservation,loadPreview,samplePixel} from './model';
import type {Manifest,ObservationData} from './model';
import {explainPixel,inspectionMatches,usableReferencePixel} from './interpretation';
import type {InspectionIdentity} from './interpretation';
import ObservationViewer from './ObservationViewer';
import type {DisplayState} from './ObservationViewer';
import VerifyEvidence from './VerifyEvidence';
import './investigation.css';

function focusHeading(id:string){requestAnimationFrame(()=>document.getElementById(id)?.focus({preventScroll:true}));}
export default function Investigation({onExploreM101,onExploreDates}:{onExploreM101:()=>void;onExploreDates:()=>void}){
 const [hero,setHero]=useState<string|null>(null),[heroError,setHeroError]=useState('');
 const [manifest,setManifest]=useState<Manifest|null>(null),[error,setError]=useState(''),[retry,setRetry]=useState(0),[active,setActive]=useState(0),[sideBySide,setSideBySide]=useState(false);
 const [data,setData]=useState<Record<string,ObservationData>>({}),[loadErrors,setLoadErrors]=useState<Record<string,string>>({}),[selectedPixel,setPixel]=useState<{x:number;y:number}|null>(null),[display,setDisplay]=useState<Record<string,unknown>>({});
 const [inspection,setInspection]=useState<InspectionIdentity|null>(null);
 const initialAnchorHandled=useRef(false);
 useEffect(()=>{let live=true;setError('');loadInvestigation().then(m=>{if(live)setManifest(m)}).catch(e=>{if(live)setError(e instanceof Error?e.message:'Unable to read the investigation manifest.')});return()=>{live=false}},[retry]);
 useEffect(()=>{if(!manifest)return;let live=true;for(const o of manifest.observations)loadObservation(o).then(value=>{if(live)setData(d=>({...d,[o.id]:value}))}).catch(e=>{if(live)setLoadErrors(d=>({...d,[o.id]:e instanceof Error?e.message:'Observation assets could not be loaded.'}))});return()=>{live=false}},[manifest,retry]);
 useEffect(()=>{if(!manifest)return;let live=true;setHeroError('');loadPreview(manifest.observations[0]).then(url=>{if(live)setHero(url)}).catch(e=>{if(live)setHeroError(String(e.message??e))});return()=>{live=false}},[manifest,retry]);
 const captureDisplay=useCallback((value:DisplayState)=>setDisplay({...value}),[]);
 const observation=manifest?.observations[active],selectedData=observation?data[observation.id]:undefined;
 const pixel=selectedPixel??(observation&&selectedData?usableReferencePixel(observation,selectedData):null)??{x:0,y:0};
 useEffect(()=>{
  if(!selectedData||initialAnchorHandled.current)return;
  initialAnchorHandled.current=true;
  const ids:Record<string,string>={'#investigation-see':'see-title','#investigation-verify':'verify-title'};
  const id=ids[location.hash];if(!id)return;
  const frame=requestAnimationFrame(()=>{const el=document.getElementById(id);el?.closest('section')?.scrollIntoView({behavior:'instant',block:'start'});el?.focus({preventScroll:true})});
  return()=>cancelAnimationFrame(frame);
 },[selectedData]);
 if(error)return <section className="investigation inv-load" role="alert"><span className="inv-eyebrow">Investigation unavailable</span><h1>The evidence could not be loaded.</h1><p>{error}</p><button onClick={()=>setRetry(v=>v+1)}>Retry loading</button><button onClick={onExploreM101}>Explore M101</button></section>;
 if(!manifest||!observation)return <section className="investigation inv-load" aria-live="polite"><span className="inv-eyebrow">PARALLAX / Observational investigations</span><h1>Opening the observations…</h1><p>Reading the recorded provenance and native data manifest.</p></section>;
 const inspected=inspectionMatches(inspection,observation.id,pixel);
 const sample=selectedData?samplePixel(observation,selectedData,pixel.x,pixel.y):null;
 const explanation=sample?explainPixel(sample):null;
 function inspect(observationId:string,x:number,y:number){
  if(!manifest)return;const index=manifest.observations.findIndex(o=>o.id===observationId);if(index<0)return;
  if(observationId!==observation?.id)setDisplay({});
  setActive(index);setPixel({x,y});setInspection({observationId,x,y});
 }
 function chooseEpoch(index:number){setActive(index);setPixel(null);setDisplay({});setInspection(null);}
 return <section className="investigation">
  <nav className="inv-path" aria-label="Investigation sections"><a href="#investigation-find">01 Find</a><a href="#investigation-see" onClick={()=>focusHeading('see-title')}>02 See</a><a href="#investigation-verify" onClick={()=>focusHeading('verify-title')}>03 Verify</a><button onClick={onExploreM101}>Explore M101 ↗</button></nav>
  <section className="inv-hero" id="investigation-find">
   <div className="inv-hero-copy"><span className="inv-eyebrow">R Draconis search field / an observational investigation</span><h1>What can this patch<br/><em>of sky tell us?</em></h1><p>Two real infrared observations. Explore the pixels, examine the evidence, and discover how much these images can actually tell us.</p><div className="inv-hero-actions"><a className="inv-primary" href="#investigation-see" onClick={()=>focusHeading('see-title')}>Explore the observations <span>↗</span></a><a className="inv-limits-link" href="#investigation-verify" onClick={()=>focusHeading('verify-title')}>Scientific limits &amp; provenance ↓</a></div><div className="inv-hero-facts"><span>SPHEREx / IRSA</span><span>{manifest.observations.length} observations</span><span>{Math.round(manifest.comparison.baselineDays)} days apart</span></div></div>
   <figure className="inv-hero-image">{heroError?<p role="alert">{heroError}</p>:hero?<img src={hero} alt="Processed grayscale preview of the authentic SPHEREx R Draconis search-field observation; native quality exclusions preserved" onError={()=>setHeroError('Verified preview could not be decoded; use the native numerical viewer below.')}/>:<p role="status">Verifying the real image…</p>}<figcaption><span>Observed image / processed display</span><span>{manifest.observations[0].dimensions[1]} × {manifest.observations[0].dimensions[0]} native pixels · {manifest.observations[0].label}</span><strong>Contrast-stretched preview · excluded pixels remain empty</strong></figcaption></figure>
  </section>
  <section className="inv-see" id="investigation-see" aria-labelledby="see-title" data-inspection={inspected?(sample?.accepted?'accepted':'excluded'):'uninspected'}>
   <div className="inv-section-heading"><div><span className="inv-eyebrow">02 / See the observations</span><h2 id="see-title" tabIndex={-1}>Look for yourself.</h2></div><a className="inv-text-link" href="#investigation-verify" onClick={()=>focusHeading('verify-title')}>Go straight to the evidence ↓</a></div><p className="inv-intro">The same search field, recorded at different times. Choose a pixel to see what the instrument recorded.</p>
   <div className="inv-selection"><div className="inv-epochs" aria-label="Select observation">{manifest.observations.map((o,i)=><button key={o.id} aria-pressed={active===i} onClick={()=>chooseEpoch(i)}><span>Epoch 0{i+1}</span>{o.label}</button>)}</div><label className="inv-compare"><input type="checkbox" checked={sideBySide} onChange={e=>setSideBySide(e.target.checked)}/> Side by side</label></div>
   <p className="inv-registration"><span>Unregistered</span> Independent detector views. Not registered for direct comparison. Each has its own display stretch.</p>
   <div className={`inv-viewers ${sideBySide?'is-pair':''}`}>{(sideBySide?manifest.observations:[observation]).map(o=><div key={o.id} className={o.id===observation.id?'inv-viewer-selected':''}>{data[o.id]?<ObservationViewer observation={o} data={data[o.id]} selected={o.id===observation.id?pixel:usableReferencePixel(o,data[o.id])??{x:0,y:0}} inspected={o.id===observation.id&&inspected} onSelect={(x,y)=>inspect(o.id,x,y)} onDisplay={o.id===observation.id?captureDisplay:undefined}/>:<div className="inv-data-state" role={loadErrors[o.id]?'alert':'status'}><h3>{o.label}</h3><p>{loadErrors[o.id]||'Loading native IMAGE, VARIANCE, FLAGS, mask and WCS coordinates…'}</p>{loadErrors[o.id]&&<button onClick={()=>{setLoadErrors({});setRetry(v=>v+1)}}>Retry observation</button>}</div>}</div>)}</div>
   <div className="inv-inspection-slot" aria-live="polite">{inspected&&sample&&explanation?<aside className={`inv-inspection-response ${sample.accepted?'is-accepted':'is-excluded'}`} aria-labelledby="inspection-title"><span className="inv-eyebrow">Your inspection / {observation.label} / x {pixel.x}, y {pixel.y}</span><h3 id="inspection-title">{sample.accepted?'A usable recorded measurement.':"The image is visible. The measurement isn’t usable."}</h3><p>{sample.accepted?'This pixel has a usable recorded value and statistical uncertainty under the current quality checks. That does not make it a complete measurement of the star.':explanation.display}</p>{explanation.reasons.length>0&&<ul>{explanation.reasons.map(reason=><li key={reason}>{reason}</li>)}</ul>}<a className="inv-text-link" href="#investigation-verify" onClick={()=>focusHeading('verify-title')}>What the evidence lets us say ↓</a></aside>:<p className="inv-inspection-prompt">Start with a usable pixel, then examine the excluded core. You can inspect any pixel at any time. The two examples illustrate quality outcomes within this observation, not comparable brightnesses or calibration states.</p>}</div>
   <details className="inv-display-note"><summary>How this display is made · Processed</summary><p>Native {observation.dimensions[1]} × {observation.dimensions[0]} data, vertically flipped so FITS y increases upward. Each observation uses its own accepted-pixel 2–99.5 percentile asinh grayscale. Zoom enlarges existing pixels. Smoothing changes display interpolation only, never measurements or masks. Black or amber excluded pixels are never filled. The field is not north-up.</p><p>Blink and difference are unavailable: registration, response and PSF compatibility have not been validated.</p></details>
  </section>
  {selectedData?<VerifyEvidence manifest={manifest} observation={observation} data={selectedData} x={pixel.x} y={pixel.y} display={display} onSelect={(x,y)=>inspect(observation.id,x,y)} onExploreM101={onExploreM101} onExploreDates={onExploreDates}/>:<section id="investigation-verify" className="inv-data-state"><h2 id="verify-title" tabIndex={-1}>Evidence follows the selected observation.</h2><p>{loadErrors[observation.id]?'Restore the observation assets above to inspect native pixel evidence.':'Waiting for the native observation buffers.'}</p></section>}
  <footer className="inv-footer"><span>PARALLAX / Observations → evidence</span><span>Real data. Documented processing. Qualified conclusions.</span></footer>
 </section>
}
