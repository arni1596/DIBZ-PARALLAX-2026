import {useEffect,useRef,useState} from 'react';
import './guidedStory.css';

/**
 * Curated, factual narration only. No language model or remote interpretation.
 * Audio uses the visitor's installed browser voices. It never sends astronomical
 * measurements, source files or personal data to a third-party API.
 */
const story = [
  {title:'The invitation',body:'Every image of the universe begins with a question. PARALLAX lets you explore authentic observations and follow the evidence back to its source. Start with M101, the Pinwheel Galaxy.',action:'Begin with M101',next:1},
  {title:'One galaxy. Different light.',body:'You are viewing infrared observations of M101 from NASA and IPAC. Change the wavelengths and move the divider. Two wavelengths can reveal different measured brightness, but they are not two dates and cannot, by themselves, show a change over time.',action:'Explore dated observations',next:2},
  {title:'A visitor from beyond our solar system',body:'Now inspect archived observations of the interstellar object 3I ATLAS. These exposures were recorded at different times. The crosshair is a predicted location, not proof that we independently detected the object.',action:'Examine the evidence',next:3},
  {title:'The real question is what the data supports',body:'Select an observation and inspect a native pixel. Check its quality flags. The data and its source are real, but differences in wavelength, alignment and calibration mean PARALLAX does not claim to have measured motion or changing brightness.',action:'Keep the evidence',next:5},
  {title:'Why we look twice',body:'In 1930, Clyde Tombaugh compared photographic plates to identify Pluto. His story is a reminder: seeing an apparent difference is the start of an investigation, not the end of one.',action:'See the evidence passport',next:5},
  {title:'Evidence you can take with you',body:'Your Evidence Passport records the selected observation, source reference and any pixel you inspected. When a conclusion cannot be supported, it says so. That is the purpose of PARALLAX: to make the evidence accessible and the limits visible.',action:'Return to M101',next:1}
] as const;

export default function GuidedStory({act,onNavigate}:{act:number;onNavigate:(next:number)=>void}){
 const [open,setOpen]=useState(false);
 const [speaking,setSpeaking]=useState(false);
 const [available,setAvailable]=useState(false);
 const utterance=useRef<SpeechSynthesisUtterance|null>(null);
 useEffect(()=>{setAvailable(typeof window!=='undefined'&&'speechSynthesis' in window&&'SpeechSynthesisUtterance' in window);return()=>{if('speechSynthesis' in window)window.speechSynthesis.cancel()}},[]);
 useEffect(()=>{if('speechSynthesis' in window)window.speechSynthesis.cancel();utterance.current=null;setSpeaking(false)},[act]);
 function stop(){if('speechSynthesis' in window)window.speechSynthesis.cancel();utterance.current=null;setSpeaking(false)}
 function play(){
  if(!available)return;
  stop();
  const u=new SpeechSynthesisUtterance(story[act]?.body??story[0].body);
  u.lang='en-US';u.rate=0.88;u.pitch=0.93;
  const voices=window.speechSynthesis.getVoices();
  const preferred=voices.find(v=>v.lang.toLowerCase().startsWith('en')&&/natural|neural|aria|jenny|guy|samantha/i.test(v.name))??voices.find(v=>v.lang.toLowerCase().startsWith('en'));
  if(preferred)u.voice=preferred;
  u.onend=()=>{if(utterance.current===u){utterance.current=null;setSpeaking(false)}};
  u.onerror=()=>{if(utterance.current===u){utterance.current=null;setSpeaking(false)}};
  utterance.current=u;setSpeaking(true);window.speechSynthesis.speak(u);
 }
 const item=story[act]??story[0];
 return <aside className={'guided-story '+(open?'is-open':'')} aria-label="Optional guided evidence narration">
  {!open?<button className="guided-story-launch" type="button" onClick={()=>setOpen(true)} aria-expanded={false}>◉ &nbsp; Hear the story <span aria-hidden="true">↗</span></button>:
  <div className="guided-story-panel">
   <div className="guided-story-top"><span>PARALLAX / GUIDED EVIDENCE</span><button type="button" aria-label="Close narration" onClick={()=>{stop();setOpen(false)}}>×</button></div>
   <p className="guided-story-count">CHAPTER {String(act+1).padStart(2,'0')} / 06</p>
   <h2>{item.title}</h2>
   <p className="guided-story-script">{item.body}</p>
   <div className="guided-story-controls">
    {available?<button type="button" onClick={speaking?stop:play}>{speaking?'■ Stop narration':'▶ Play narration'}</button>:<span className="guided-story-unavailable">Audio unavailable in this browser. Full transcript shown.</span>}
    <button type="button" className="guided-story-next" onClick={()=>{stop();onNavigate(item.next)}}>{item.action} →</button>
   </div>
   <p className="guided-story-note">Optional device-generated narration · Transcript always visible · No synthesized science</p>
  </div>}
 </aside>;
}
