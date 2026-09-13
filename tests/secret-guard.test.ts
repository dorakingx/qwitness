import {afterEach,expect,it,vi} from 'vitest';
import {assertNoServerSecrets} from '../src/core/secret-guard';
afterEach(()=>vi.unstubAllEnvs());
it('blocks provider echo of Graph, LLM and signing credentials before signing',()=>{for(const key of ['GRAPH_API_KEY','OPENAI_API_KEY','QWITNESS_SIGNING_SEED']){vi.stubEnv(key,`test-only-${key}-value`);expect(()=>assertNoServerSecrets({response:{nested:`prefix test-only-${key}-value suffix`}})).toThrow('protected server data');}});
it('allows non-secret public evidence',()=>expect(()=>assertNoServerSecrets({query:'allowed query',values:['100.123456789']})).not.toThrow());
