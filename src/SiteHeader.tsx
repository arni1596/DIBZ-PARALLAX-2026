import {useEffect,useRef,useState} from 'react';
import type {AtlasObservation} from './investigation/atlas';

/*
  One header for every page, with the "Sources & Methods" hamburger menu.

  - Chapter pages (variant "chapters"): logo + menu. They keep their own
    01–06 chapter steps below the header.
  - Explorer and 3I/ATLAS pages (variant "explorer"): logo + page tabs +
    menu. The tabs are buttons with fixed names ("Investigation",
    "M101 wavelengths", "M101 dates"); e2e tests click them by name.
  - The menu keeps the class `.observatory-tools` and its <summary>; the
    protected P0 test opens it that way on the chapter pages.
*/

export type PageTab='atlas'|'investigation'|'spectral'|'time';

type Props={
 variant:'chapters'|'explorer';
 /** Highlighted tab (explorer variant). */
 current?:PageTab;
 /** Small label after the logo, e.g. "SPECTRAL REVEAL / M101". */
 purpose?:string;
 /** Page-specific tab handler; defaults to changing the URL hash. */
 onNavigate?:(tab:PageTab)=>void;
 /** "The evidence ↗" shortcut, only on pages that have an evidence section. */
 evidence?:{href:string;onClick?:()=>void};
 /** Optional, page-dependent source links shown in the menu. */
 m101SourceUrl?:string;
 atlasObservation?:AtlasObservation;
};

const hashFor:Record<PageTab,string>={atlas:'atlas',investigation:'investigation-find',spectral:'spectral',time:'time'};

export function SiteHeader({variant,current,purpose,onNavigate,evidence,m101SourceUrl,atlasObservation}:Props){
 const go=(tab:PageTab)=>onNavigate?onNavigate(tab):(location.hash=hashFor[tab]);
 const menu=<SourcesMenu m101SourceUrl={m101SourceUrl} atlasObservation={atlasObservation}/>;
 if(variant==='chapters')return <header className="observatory-header"><a href="#journey=0" className="brand">PARALLAX <small>FIND → SEE → VERIFY</small></a>{menu}</header>;
 return <header className="site-header shared-header"><a className="brand" href="/" aria-label="PARALLAX home"><span>◈</span> PARALLAX</a>{purpose&&<span className="site-purpose">{purpose}</span>}<nav aria-label="Main navigation"><button aria-pressed={current==='atlas'} onClick={()=>go('atlas')}>3I / ATLAS</button>
  <button aria-pressed={current==='investigation'} onClick={()=>go('investigation')}>Investigation</button>
  <button aria-pressed={current==='spectral'} onClick={()=>go('spectral')}>M101 wavelengths</button>
  <button className="time-mode-nav" aria-pressed={current==='time'} onClick={()=>go('time')}>M101 dates</button>
  {evidence&&<a onClick={evidence.onClick} href={evidence.href}>The evidence ↗</a>}</nav>{menu}</header>;
}

/** "Sources & Methods" drawer: closes on outside click/tap, Escape, the close button, or choosing a link. */
function SourcesMenu({m101SourceUrl,atlasObservation:observation}:{m101SourceUrl?:string;atlasObservation?:AtlasObservation}){
 const [open,setOpen]=useState(false);const menu=useRef<HTMLDetailsElement>(null);
 function close(returnFocus=false){setOpen(false);if(returnFocus)menu.current?.querySelector('summary')?.focus()}
 useEffect(()=>{if(!open)return;
  const outside=(e:PointerEvent)=>{const el=menu.current;if(!el)return;const t=e.target as Node;
   // The dimmed backdrop is part of <details> itself, so a click landing on it (not inside the panel) also closes.
   if(!el.contains(t)||t===el)close()};
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.preventDefault();close(true)}};
  document.addEventListener('pointerdown',outside);document.addEventListener('keydown',key);
  return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',key)}},[open]);
 return <details className="observatory-tools" ref={menu} open={open} onToggle={e=>setOpen(e.currentTarget.open)}><summary><span className="menu-icon" aria-hidden="true"><i/><i/><i/></span><span className="menu-text">Sources &amp; Methods</span></summary><div className="menu-panel" role="navigation" aria-label="Tools and source references" onClick={e=>{if((e.target as HTMLElement).closest('a'))close()}}><button type="button" className="menu-close" aria-label="Close menu" onClick={()=>close(true)}><span className="close-icon" aria-hidden="true"><i/><i/></span></button><p className="menu-label">Explore</p><a href="#spectral">Spectral comparison</a><a href="#single">Single wavelength</a><a href="#atlas">3I/ATLAS archive</a><a href="#time">M101 dated archive</a><a href="#investigation-find">Native pixel investigation</a><h2>Sources &amp; Methods</h2><p>SPHEREx · NASA/IPAC IRSA. Independent application; no NASA endorsement claimed.</p><p>M101: the public NASA/IPAC IRSA demonstration FITS file was independently byte-matched to the retained original. Its 102 layers represent wavelengths, not dates. The mosaic's data-release DOI and contributing calibration lineage remain unverified.</p>{m101SourceUrl&&<a href={m101SourceUrl} target="_blank" rel="noreferrer">Original M101 FITS source ↗</a>}<a href="/dataset/science_metadata.json" target="_blank" rel="noreferrer">M101 source metadata ↗</a><p>Atlas / R Draconis: existing QR2 cutouts, independent native grids. Dated images do not establish motion or brightness change.</p>{observation&&<><a href={observation.source.archiveUrl} target="_blank" rel="noreferrer">Selected Atlas IRSA product ↗</a><p>Release: {observation.source.archiveRelease}. Product: {observation.id}. Display: {observation.render.algorithm}; independent limits recorded in the manifest.</p></>}<a href="/investigations/rdra-v1/manifest.json" target="_blank" rel="noreferrer">R Draconis source / quality record ↗</a><a href="/investigations/atlas-v1/manifest.json" target="_blank" rel="noreferrer">Atlas source / processing record ↗</a><p>Spectral comparison: shared asinh or linear display, with the active preset and limits in Display settings. Archived audit PNGs use the recorded shared linear scaling. Interpolation is display only; excluded pixels stay excluded.</p><p>QR2 cutouts: collection DOI 10.26131/IRSA652, supported by recorded QR2 product paths and official archive documentation. DOI unresolved for the M101 mosaic. QR3 and DR1 DOIs are not assigned to it.</p><a href="https://irsa.ipac.caltech.edu/data/SPHEREx/docs/overview_qr.html" target="_blank" rel="noreferrer">Official QR release / citation documentation ↗</a><a href="https://doi.org/10.26131/IRSA652" target="_blank" rel="noreferrer">QR2 collection DOI ↗</a><p>M101 source identity is verified. Calibration lineage and contributing exposures remain unverified.</p><p>SPHEREx is a joint JPL and Caltech mission funded by NASA. Mission data and IRSA archive acknowledgments follow the linked publisher guidance.</p><p>AI-assisted code and test development. Existing pre-event application reused; competition reuse eligibility remains unresolved.</p><p>Open source: React / React DOM (MIT), Vite (MIT), TypeScript (Apache-2.0). Installed package LICENSE files retain the full notices. Project-wide licensing and data redistribution clearance are not certified here.</p></div></details>;
}
