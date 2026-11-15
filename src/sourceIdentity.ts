// Presentation evidence, not a rewrite of the frozen scientific metadata.
// Source: release/M101_REMOTE_RECEIPT.json, retrieved 2026-11-14.
const sourceUrl='https://irsa.ipac.caltech.edu/data/demos/notebooks/spherex/M101_irsa.fits';
const sourceSha256='44e89f460c55f46f7e384ba7dfe8927fa8e56163875aba3766499a5646813447';
export function matchedM101Source(sha256:string,url:string):boolean{
 return sha256===sourceSha256&&url===sourceUrl;
}
