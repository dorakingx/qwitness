import { it,expect } from 'vitest';
import { validateAnalysis } from '../src/core/analysis';
const valid={claims:[{text:'USDC has higher indexed utilization.',evidenceRefs:['calculations/0']}],limitations:['Indexed data may lag.'],suggestedMonitoring:[{text:'Monitor available liquidity.',evidenceRefs:['calculations/1']}]};
it('accepts bounded grounded qualitative analysis',()=>expect(validateAnalysis(valid,['calculations/0','calculations/1'])).toEqual(valid));
it('rejects unsupported evidence and invented numbers',()=>{expect(()=>validateAnalysis({...valid,claims:[{text:'Utilization is 99%',evidenceRefs:['calculations/0']}]},['calculations/0'])).toThrow();expect(()=>validateAnalysis(valid,[])).toThrow();expect(()=>validateAnalysis({...valid,claims:[{text:'Supply is one million.',evidenceRefs:['calculations/0']}]},['calculations/0'])).toThrow();});
it('rejects unbounded or malformed model output',()=>{expect(()=>validateAnalysis({...valid,extra:'tool_call'},[])).toThrow();expect(()=>validateAnalysis('not JSON',[])).toThrow();});
