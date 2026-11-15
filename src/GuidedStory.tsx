import {useEffect,useRef,useState} from 'react';
import './guidedStory.css';

/**
 * Curated, factual narration only. No language model or remote interpretation.
 * Plays reviewed, pre-generated audio when present; otherwise uses browser speech.
 * Does not transmit scientific data or credentials to a remote speech service.
 */
import {story,narrationRevision} from './story';

export default function GuidedStory({act,onNavigate}:{act:number;onNavigate:(next:number)=>void}){
 const [open,setOpen]=useState(false);
 const [speaking,setSpeaking]=useState(false);
 const [available,setAvailable]=useState(false);
 const [notice,setNotice]=useState('');
 const launcher=useRef<HTMLButtonElement>(null);
 const closeButton=useRef<HTMLButtonElement>(null);
 const session=useRef(0);
 useEffect(()=>{if(open)closeButton.current?.focus()},[open]);
 const utterance=useRef<SpeechSynthesisUtterance|null>(null);
 const audio=useRef<HTMLAudioElement|null>(null);
 useEffect(()=>{setAvailable(typeof window!=='undefined'&&'speechSynthesis' in window&&'SpeechSynthesisUtterance' in window);return()=>{session.current++;if(audio.current){audio.current.pause();audio.current=null}if('speechSynthesis' in window)window.speechSynthesis.cancel()}},[]);
 useEffect(()=>{stop();setNotice('')},[act]);
 function stop(){session.current++;if(audio.current){audio.current.pause();audio.current=null}if('speechSynthesis' in window)window.speechSynthesis.cancel();utterance.current=null;setSpeaking(false)}
 function speakBrowser(){
  if(!available){setNotice('Audio is unavailable in this browser. The complete transcript is shown here.');return;}
  const u=new SpeechSynthesisUtterance(story[act]?.body??story[0].body);
  u.lang='en-US';u.rate=0.88;u.pitch=1;
  const voices=window.speechSynthesis.getVoices();
  const preferred=voices.find(v=>v.lang.toLowerCase()==='en-us'&&/natural|neural|aria|jenny|guy|samantha/i.test(v.name))??voices.find(v=>v.lang.toLowerCase()==='en-us');
  if(preferred)u.voice=preferred;
  u.onend=()=>{if(utterance.current===u){utterance.current=null;setSpeaking(false)}};
  u.onerror=()=>{if(utterance.current===u){utterance.current=null;setSpeaking(false);setNotice('Speech could not play. Read the transcript shown here.')}};
  utterance.current=u;setSpeaking(true);setNotice('Using your browser voice.');window.speechSynthesis.speak(u);
 }
 function play(){
  stop();setNotice('');
  const request=session.current;
  const track=new Audio(`/narration/${narrationRevision}/chapter-${String(act+1).padStart(2,'0')}.mp3`);
  audio.current=track;
  let handedOff=false;
  const fallback=()=>{if(handedOff||audio.current!==track||request!==session.current)return;handedOff=true;audio.current=null;track.pause();speakBrowser()};
  track.onended=()=>{if(audio.current===track){audio.current=null;setSpeaking(false)}};
  track.onerror=fallback;
  track.play().then(()=>{if(audio.current===track)setSpeaking(true)}).catch(fallback);
 }
 const item=story[act]??story[0];
 return <aside className={'guided-story '+(open?'is-open':'')} aria-label="Guided narration">
  {!open?<button ref={launcher} className="guided-story-launch" type="button" onClick={()=>setOpen(true)} aria-expanded={false} aria-controls="narration-panel">Listen or read <span aria-hidden="true">+</span></button>:
  <div id="narration-panel" className="guided-story-panel" onKeyDown={event=>{if(event.key==='Escape'){stop();setOpen(false);requestAnimationFrame(()=>launcher.current?.focus())}}}>
   <div className="guided-story-top"><span>GUIDED NARRATION</span><button ref={closeButton} type="button" aria-label="Close narration" onClick={()=>{stop();setOpen(false);requestAnimationFrame(()=>launcher.current?.focus())}}>×</button></div>
   <p className="guided-story-count">CHAPTER {String(act+1).padStart(2,'0')} / 06</p>
   <h2>{item.title}</h2>
   <p className="guided-story-script">{item.body}</p><p className="guided-story-status" role="status">{notice}</p>
   <div className="guided-story-controls">
    <button type="button" onClick={speaking?stop:play}>{speaking?'Stop narration':'Play narration'}</button>
    <button type="button" className="guided-story-next" onClick={()=>{stop();onNavigate(item.next)}}>{item.action} →</button>
   </div>
   </div>}
 </aside>;
}
