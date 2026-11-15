"""Deterministic exploratory comparisons; never writes scientific source assets."""
import hashlib,itertools,json
from pathlib import Path
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'public/dataset'
manifest=json.loads((DATA/'image_manifest.json').read_text())
y,x=np.indices((267,267)); radius=np.hypot(x-133,y-133)
region=radius<=45; core=radius<=8; ann=(radius>=27)&(radius<=40)
source_hashes={}; channels=[]
for c in manifest['channels']:
    arrays={}
    for name,meta in c['numerical'].items():
        path=DATA/meta['path']; raw=path.read_bytes(); digest=hashlib.sha256(raw).hexdigest()
        assert digest==meta['sha256'],str(path)
        source_hashes[meta['path']]=digest
        arrays[name]=np.frombuffer(raw,dtype=meta['dtype']).reshape(meta['shape'])
    v=arrays['IMAGE']; flags=arrays['FLAGS']; hits=arrays['NHITS']
    ok=(arrays['VISUALIZATION_MASK']!=0)&np.isfinite(v)&(hits>0)&((flags&524290)==0)&((flags&~2621442)==0)
    assert np.array_equal(ok,arrays['VISUALIZATION_MASK']!=0)
    channels.append((c,v,ok,hits,flags))
# Screen isolated surrounding-level jumps against +/-2 channel neighborhoods.
# This is an artifact-risk screen, not an astrophysical interpretation.
annular_levels=[float(v[ok&ann].mean()) for c,v,ok,hits,flags in channels]
unstable_channels=[]
for i,level in enumerate(annular_levels):
    neighborhood=[annular_levels[j] for j in range(max(0,i-2),min(102,i+3)) if j!=i]
    if level/np.median(neighborhood)>1.4 or level/np.median(neighborhood)<1/1.4:
        unstable_channels.append(i+1)
def number(v): return float(v)
def noise(v,mask):
    valid=mask[1:]&mask[:-1]; d=(v[1:]-v[:-1])[valid]
    return number(np.median(abs(d-np.median(d)))/.67448975/np.sqrt(2))
def blocks(a,b,m):
    # Native 4x4 means; identical accepted members, no interpolation.
    def tiled(v): return v[85:181,85:181].reshape(24,4,24,4).transpose(0,2,1,3).reshape(-1,16)
    mm=tiled(m);n=mm.sum(axis=1);good=n>=12
    aa=np.sum(np.where(mm,tiled(a),0),axis=1)[good]/n[good]
    bb=np.sum(np.where(mm,tiled(b),0),axis=1)[good]/n[good]
    return aa,bb

def norm(a):
    lo,hi=np.percentile(a,[10,90]);return (a-lo)/max(hi-lo,1e-12)
rows=[]
for ca,cb in itertools.combinations(channels,2):
    ac,a,am,ah,af=ca;bc,b,bm,bh,bf=cb;m=am&bm&region
    cov=number(m.sum()/region.sum()); cm=m&core; an=m&ann
    reasons=[]
    if ac['global_channel'] in unstable_channels or bc['global_channel'] in unstable_channels: reasons.append('isolated annular-level jump >1.4 versus neighboring channels; artifact risk')
    if cov<.8 or cm.sum()/core.sum()<.8 or an.sum()/ann.sum()<.8: reasons.append('common coverage below 80% in region, core or annulus')
    if cm.sum()==0 or an.sum()==0: continue
    av,bv=blocks(a,b,m)
    if len(av)<100: reasons.append('fewer than 100 shared well-covered blocks')
    acore,bcore=number(a[cm].mean()),number(b[cm].mean()); asur,bsur=number(a[an].mean()),number(b[an].mean())
    na,nb=noise(a,m),noise(b,m)
    contrast_a=(acore-asur)/max(na,1e-12);contrast_b=(bcore-bsur)/max(nb,1e-12)
    if min(contrast_a,contrast_b)<20: reasons.append('core excess / neighbor-difference noise proxy below 20')
    corr=number(np.corrcoef(av,bv)[0,1]); structure=number(np.mean(abs(norm(av)-norm(bv))))
    if corr<.7: reasons.append('weak shared block structure (correlation below 0.7)')
    if min(asur,bsur)<=0: reasons.append('nonpositive surrounding mean')
    ratios=[acore/asur if asur>0 else 0,bcore/bsur if bsur>0 else 0]
    ratio_change=abs(np.log(max(ratios[0],1e-12)/max(ratios[1],1e-12)))
    pooled=np.r_[a[m],b[m]];display=[]
    for lowq,highq in [(1,99),(2,98),(5,99.5)]:
        lo,hi=np.percentile(pooled,[lowq,highq]); u=np.clip((av-lo)/(hi-lo),0,1);v=np.clip((bv-lo)/(hi-lo),0,1)
        for k in [0,3,10]:
            f=lambda t: t if k==0 else np.arcsinh(k*t)/np.arcsinh(k)
            display.append({'percentiles':[lowq,highq],'asinhStrength':k,'low':number(lo),'high':number(hi),'blockMeanAbsoluteDifference':number(np.mean(abs(f(u)-f(v))))})
    robust=min(t['blockMeanAbsoluteDifference'] for t in display)
    if robust<.035: reasons.append('difference below 0.035 at one common display setting')
    # Require relative morphology/central concentration evidence beyond global brightness.
    if structure<.04 or ratio_change<.12: reasons.append('weak relative structure or core/surround ratio difference')
    metrics={'commonCoverage':cov,'commonValidPixels':int(m.sum()),'regionPixels':int(region.sum()),'coreValidPixels':int(cm.sum()),'corePixels':int(core.sum()),'annulusValidPixels':int(an.sum()),'annulusPixels':int(ann.sum()),'coreMeanA':acore,'coreMeanB':bcore,'surroundMeanA':asur,'surroundMeanB':bsur,'coreSurroundRatioA':ratios[0],'coreSurroundRatioB':ratios[1],'coreSurroundLogRatioDifference':number(ratio_change),'neighborNoiseProxyA':na,'neighborNoiseProxyB':nb,'coreExcessNoiseProxyA':contrast_a,'coreExcessNoiseProxyB':contrast_b,'blockCorrelation':corr,'normalizedStructureMAE':structure,'commonBlockCount':len(av),'minimumDisplayDifference':robust,'displayTrials':display,'minimumNHITSA':int(ah[m].min()),'minimumNHITSB':int(bh[m].min()),'sourceFlagFractionA':number(np.mean((af[m]&(1<<21))!=0)),'sourceFlagFractionB':number(np.mean((bf[m]&(1<<21))!=0))}
    score=cov*(structure+ratio_change)*robust
    rows.append({'a':ac['global_channel'],'b':bc['global_channel'],'wavelengthA':ac['wavelength_um'],'wavelengthB':bc['wavelength_um'],'score':number(score),'metrics':metrics,'rejections':reasons})
rows.sort(key=lambda t:(-t['score'],t['a'],t['b']))
selected=[]
for row in rows:
    if row['rejections']:continue
    if any(min(abs(row['a']-s['a']),abs(row['a']-s['b']),abs(row['b']-s['a']),abs(row['b']-s['b']))<10 for s in selected):continue
    selected.append(row)
    if len(selected)==3:break
limitations=['Exploratory numerical summaries; calibration provenance remains UNVERIFIED and scientific measurement suitability is not established.','Shared native mosaic grid and WCS, not independently certified astrometry; no PSF matching or effective-bandpass correction.','No variance extension; neighbor-difference MAD is a descriptive noise proxy, not uncertainty or significance. Correlated noise and unresolved structure can affect it.','Common masks remove missing/rejected pixels, but holes remain visible and the retained sample is not a complete aperture. SOURCE flag is retained; other source-level flags were not propagated.','Core and surrounding annulus are analyst geometry, not validated photometry or blank sky; ratios are not physical flux ratios.','Common display transforms are tested; normalized block structure is a separate diagnostic and is never used to rescale the viewer. No specific physical process, discovery or temporal change is inferred.']
for i,s in enumerate(selected):
    s.update(id=f'reveal-{i+1}',title=['Central concentration across wavelengths','A second spectral perspective','A further common-grid comparison'][i],region={'x':133,'y':133,'radius':45},crop={'x0':85,'y0':85,'x1':181,'y1':181},explanation=f"On identical valid native pixels, the core/surround mean ratio changes from {s['metrics']['coreSurroundRatioA']:.2f} to {s['metrics']['coreSurroundRatioB']:.2f}. Shared block structure remains correlated ({s['metrics']['blockCorrelation']:.3f}); the visual difference survives all nine common contrast settings. These are wavelength-dependent image differences with no assigned physical cause.",limitations=limitations)
rejected=[r for r in rows if r['rejections']]
result={'schemaVersion':1,'selected':selected,'artifactRiskChannels':unstable_channels,'candidateCount':len(rows),'eligibleCount':len(rows)-len(rejected),'rejectedCount':len(rejected),'rejectedCandidates':rejected,'eligibleRanking':[{'a':r['a'],'b':r['b'],'score':r['score'],'metrics':r['metrics']} for r in rows if not r['rejections']],'geometry':{'origin':'zero-based native FITS lower origin; y=0 at bottom','centerXY':[133,133],'centerRaDecDeg':[210.8022671,54.34895],'region':'pixel-center radius <=45','core':'pixel-center radius <=8','annulus':'27 <= pixel-center radius <=40','crop':'85 <= x <181; 85 <= y <181','block':'4x4 native blocks anchored at (85,85), at least 12/16 common valid pixels, inside radius<=45'},'method':'All 5151 channel pairs. Exact intersection of original visualization masks plus finite IMAGE, NHITS>0, no OVERFLOW/OUTLIER/unknown bits. Reject thresholds in script. Rank coverage*(normalizedStructureMAE+absolute log core/surround ratio change)*minimum display MAE. Greedy diversity: every endpoint must be at least 10 channels from each previously selected endpoint. Isolated annular-level jumps >1.4 relative to median of up to four adjacent channels are excluded as artifact-risk candidates. No per-channel display autoscaling.','limitations':limitations,'sourceCubeSha256':manifest['channels'][0]['source_reference']['cube_sha256'],'sourceHashes':source_hashes}
public_result={k:v for k,v in result.items() if k not in ['rejectedCandidates','eligibleRanking']}
(ROOT/'public/reveals.json').write_text(json.dumps(public_result,indent=2,allow_nan=False)+'\n')
lines=['# Evidence-selected spectral reveals','','Reproduce: `python scripts/select_reveals.py` (NumPy). All original numerical buffers are SHA-256 checked against image_manifest.json before analysis; the script writes only public/reveals.json and this report.','',result['method'],'','## Exact samples','',json.dumps(result['geometry'],indent=2),'','Native means use MJy/sr. Ratios are exploratory means, not calibrated source photometry. Selected pair metrics, nine display trials and all 408 input hashes are in public/reveals.json. Complete candidate metrics and rejections are in the report appendix below; keeping them here avoids a large viewer download.','',f"Pairs: {len(rows)}; eligible: {result['eligibleCount']}; rejected: {len(rejected)}; selected: {len(selected)}.",'']
for s in selected:
    lines += [f"## Channel {s['a']} ({s['wavelengthA']:.6f} um) / {s['b']} ({s['wavelengthB']:.6f} um)",'',s['explanation'],'','```json',json.dumps(s['metrics'],indent=2),'```','']
from collections import Counter
counts=Counter(reason for r in rejected for reason in r['rejections'])
lines+=['## Rejection counts (reasons overlap)','',json.dumps(counts,indent=2),'','## Limitations','']+['- '+s for s in limitations]+['','No scientific-grade spectrum, target-specific physical explanation, temporal comparison or astronomical discovery is supported. The defensible outcome is exploratory visual comparison on documented common samples.','',f"Source cube SHA-256: {result['sourceCubeSha256']}"]
lines+=['','## Complete candidate audit (JSON Lines; score order)','','```json']+[json.dumps(r,allow_nan=False,separators=(',',':')) for r in rows]+['```']
(ROOT/'REVEAL_SELECTION.md').write_text('\n'.join(lines)+'\n')
print(json.dumps({'selected':[{k:s[k] for k in ['a','b','wavelengthA','wavelengthB','score']} for s in selected],'eligible':result['eligibleCount'],'rejected':len(rejected)},indent=2))
