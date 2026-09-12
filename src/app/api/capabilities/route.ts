import { getCapabilities } from '@/core/service';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(){return Response.json(getCapabilities(),{headers:{'Cache-Control':'no-store'}});}
