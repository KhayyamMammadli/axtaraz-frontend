import { proxyBusinessCreate } from "@/features/ownerships/create-proxy";
export function POST(request: Request) { return proxyBusinessCreate(request, "/uploads/traces"); }
