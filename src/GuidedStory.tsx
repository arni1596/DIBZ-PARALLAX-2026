import {useEffect,useRef,useState} from 'react';
import './guidedStory.css';

/**
 * Curated, factual narration only. No language model or remote interpretation.
 * Plays reviewed, pre-generated audio when present; otherwise uses browser speech.
 * Does not transmit scientific data or credentials to a remote speech service.
 */
const story = [
  {title:'A closer look',body:'This is M101, the Pinwheel Galaxy. The image comes from infrared observations collected by SPHEREx. We can explore what the instrument recorded, one wavelength at a time.',action:'Explore M101',next:1},
  {title:'Seeing beyond visible light',body:'Infrared light gives us another way to observe the same galaxy. Move the divider and choose a wavelength. Brightness can differ between channels. That tells us about the observations, not about a change over time.',action:'Look across dates',next:2},
  {title:'An interstellar visitor',body:'These are archival observations of three I Atlas, an object from beyond our solar system. Choose an exposure and notice its date. The crosshair marks a predicted position. It is not, by itself, a detection.',action:'Inspect the evidence',next:3},
  {title:'Look at the measurements',body:'Select a pixel and examine the recorded value and its quality flags. Some samples cannot be used. Other differences need careful alignment and calibration before we can make a claim about movement or changing brightness.',action:'Why comparisons matter',next:4},
  {title:'A way of looking',body:'In 1930, Clyde Tombaugh compared photographic plates and identified Pluto. The principle still matters: an interesting difference asks for a closer examination. It does not answer the question on its own.',action:'Keep your evidence',next:5},
  {title:'What remains',body:'Your Evidence Passport records the observation you selected, its source, and the pixel you inspected. It also records what the evidence cannot yet establish. You leave with a question you can revisit, and a source you can check.',action:'Explore again',next:1}
] as const;

export default function GuidedStory({act,onNavigate}:{act:number;onNavigate:(next:number)=>void}){
 const [open,setOpen]=useState(false);
 const [speaking,setSpeaking]=useState(false);
 const [available,setAvailable]=useState(false);
 const utterance=useRef<SpeechSynthesisUtterance|null>(null);
 const audio=useRef<HTMLAudioElement|null>(null);
 useEffect(()=>{setAvailable(typeof window!=='undefined'&&'speechSynthesis' in window&&'SpeechSynthesisUtterance' in window);return()=>{if(audio.current){audio.current.pause();audio.current=null}if('speechSynthesis' in window)window.speechSynthesis.cancel()}},[]);
 useEffect(()=>{if(audio.current){audio.current.pause();audio.current=null}if('speechSynthesis' in window)window.speechSynthesis.cancel();utterance.current=null;setSpeaking(false)},[act]);
 function stop(){if(audio.current){audio.current.pause();audio.current=null}if('speechSynthesis' in window)window.speechSynthesis.cancel();utterance.current=null;setSpeaking(false)}
 function speakBrowser(){
  if(!available)return;
  const u=new SpeechSynthesisUtterance(story[act]?.body??story[0].body);
  u.lang='en-US';u.rate=0.88;u.pitch=0.93;
  const voices=window.speechSynthesis.getVoices();
  const preferred=voices.find(v=>v.lang.toLowerCase().startsWith('en')&&/natural|neural|aria|jenny|guy|samantha/i.test(v.name))??voices.find(v=>v.lang.toLowerCase().startsWith('en'));
  if(preferred)u.voice=preferred;
  u.onend=()=>{if(utterance.current===u){utterance.current=null;setSpeaking(false)}};
  u.onerror=()=>{if(utterance.current===u){utterance.current=null;setSpeaking(false)}};
  utterance.current=u;setSpeaking(true);window.speechSynthesis.speak(u);
 }
 function play(){
  stop();
  const track=new Audio(`/narration/editorial-v2/chapter-${String(act+1).padStart(2,'0')}.mp3`);
  audio.current=track;
  let handedOff=false;
  const fallback=()=>{if(handedOff||audio.current!==track)return;handedOff=true;audio.current=null;track.pause();speakBrowser()};
  track.onended=()=>{if(audio.current===track){audio.current=null;setSpeaking(false)}};
  track.onerror=fallback;
  track.play().then(()=>{if(audio.current===track)setSpeaking(true)}).catch(fallback);
 }
 const item=story[act]??story[0];
 return <aside className={'guided-story '+(open?'is-open':'')} aria-label="Optional guided evidence narration">
  {!open?<button className="guided-story-launch" type="button" onClick={()=>setOpen(true)} aria-expanded={false}>Hear the story <span aria-hidden="true">↗</span></button>:
  <div className="guided-story-panel">
   <div className="guided-story-top"><span>PARALLAX / STORY</span><button type="button" aria-label="Close narration" onClick={()=>{stop();setOpen(false)}}>×</button></div>
   <p className="guided-story-count">{String(act+1).padStart(2,'0')} / 06</p>
   <h2>{item.title}</h2>
   <p className="guided-story-script">{item.body}</p>
   <div className="guided-story-controls">
    <button type="button" onClick={speaking?stop:play}>{speaking?'■ Stop narration':'▶ Play narration'}</button>
    <button type="button" className="guided-story-next" onClick={()=>{stop();onNavigate(item.next)}}>{item.action} →</button>
   </div>
   </div>}
 </aside>;
}
