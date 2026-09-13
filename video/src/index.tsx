import React from 'react';
import {AbsoluteFill, Composition, OffthreadVideo, registerRoot, staticFile, useCurrentFrame} from 'remotion';
import timeline from './timeline.json';

const TechnicalPreview=()=>{
 const frame=useCurrentFrame();
 const seconds=frame/timeline.fps;
 const phase=timeline.phases.find(p=>seconds>=p.start&&seconds<(p.end??timeline.durationSeconds))??timeline.phases[timeline.phases.length-1];
 return <AbsoluteFill style={{background:'#101614',fontFamily:'Arial, sans-serif',color:'#f7f5ec'}}>
   <OffthreadVideo src={staticFile('browser-recording.webm')} muted style={{width:1920,height:1080,objectFit:'contain'}} />
   <div style={{position:'absolute',top:0,left:0,right:0,height:48,background:'#14231fee',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 42px',fontSize:18,fontWeight:700,letterSpacing:1.1}}>
     <span style={{color:'#b7ecd0'}}>QWITNESS / SILENT TECHNICAL PREVIEW</span>
     <span style={{color:'#f0ca93'}}>TEST-ONLY RECEIPT · NO LIVE GRAPH OR LLM EXECUTION</span>
   </div>
   <div style={{position:'absolute',left:0,right:0,bottom:0,height:136,background:'linear-gradient(180deg,#14231fee,#14231f)',padding:'19px 42px 14px',borderTop:'2px solid #9dc9b3'}}>
     <div style={{fontSize:28,fontWeight:700,marginBottom:10}}>{phase.title}</div>
     <div style={{fontSize:24,lineHeight:1.25,color:'#dfebe1',maxWidth:1740}}>{phase.caption}</div>
   </div>
   <div style={{position:'absolute',bottom:0,left:0,height:4,width:`${Math.min(100,frame/timeline.durationInFrames*100)}%`,background:'#b7ecd0'}} />
 </AbsoluteFill>;
};
registerRoot(()=> <Composition id="TechnicalPreview" component={TechnicalPreview} durationInFrames={timeline.durationInFrames} fps={30} width={1920} height={1080} />);
