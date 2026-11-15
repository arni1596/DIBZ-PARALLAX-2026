/**
 * Generate optional reviewed story narration using Azure AI Speech REST API.
 * Run locally with AZURE_SPEECH_REGION and AZURE_SPEECH_KEY environment vars.
 * Never commit API keys. Never call Azure from the browser.
 * Reads the exact text displayed in GuidedStory.tsx to prevent drift.
 */
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
const region=process.env.AZURE_SPEECH_REGION;
const key=process.env.AZURE_SPEECH_KEY;
const voice=process.env.AZURE_SPEECH_VOICE||'en-US-JennyNeural';
if(!region||!key){console.error('Set AZURE_SPEECH_REGION and AZURE_SPEECH_KEY in your local shell. Do not commit them.');process.exit(1)}
if(!/^[a-z0-9-]+$/.test(region)){console.error('Invalid Speech region identifier');process.exit(1)}
if(!/^en-US-[A-Za-z0-9:]+$/.test(voice)){console.error('Specify a valid supported en-US voice name');process.exit(1)}
const source=await readFile(new URL('../src/GuidedStory.tsx',import.meta.url),'utf8');
const snippets=[...source.matchAll(/\bbody:'((?:\\.|[^'\\])*)'/g)].map(m=>m[1].replace(/\\'/g,"'").replace(/\\\\/g,'\\'));
if(snippets.length!==6)throw Error(`Expected 6 reviewed story chapters; found ${snippets.length}. Refusing partial generation.`);
const escapeXml=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
const target=new URL('../public/narration/',import.meta.url);
await mkdir(target,{recursive:true});
for(let i=0;i<snippets.length;i++){
 const ssml=`<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US"><voice name="${escapeXml(voice)}"><prosody rate="-10%" pitch="-2%">${escapeXml(snippets[i])}</prosody></voice></speak>`;
 const resp=await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,{method:'POST',headers:{'Ocp-Apim-Subscription-Key':key,'Content-Type':'application/ssml+xml','X-Microsoft-OutputFormat':'audio-24khz-96kbitrate-mono-mp3','User-Agent':'PARALLAX-GuidedEvidence'},body:ssml});
 if(!resp.ok)throw Error(`Azure Speech HTTP ${resp.status} at chapter ${i+1}: ${(await resp.text()).slice(0,300)}`);
 const bytes=Buffer.from(await resp.arrayBuffer());
 if(bytes.length<1000||!(bytes.toString('ascii',0,3)==='ID3'||bytes[0]===0xff)){throw Error(`Invalid audio response for chapter ${i+1}`)}
 const name=`chapter-${String(i+1).padStart(2,'0')}.mp3`;
 await writeFile(new URL(name,target),bytes);
 console.log(`Wrote public/narration/${name} (${bytes.length} bytes)`);
}
console.log('Azure narration generated locally. Verify license, playback and project costs before committing audio.');
