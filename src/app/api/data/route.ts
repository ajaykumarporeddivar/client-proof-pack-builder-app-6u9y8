import { NextResponse } from 'next/server';
import { MOCK_CLIENTS, MOCK_CAMPAIGNS, MOCK_RESULTS, MOCK_PROOF_PACKS, STATS } from '@/lib/data';
import type { Client, Campaign, Result, ProofPack } from '@/lib/types';

export async function GET(): Promise<NextResponse> {
  const data = {
    clients: MOCK_CLIENTS,
    campaigns: MOCK_CAMPAIGNS,
    results: MOCK_RESULTS,
    proofPacks: MOCK_PROOF_PACKS,
    stats: STATS,
    total: {
      clients: MOCK_CLIENTS.length,
      campaigns: MOCK_CAMPAIGNS.length,
      results: MOCK_RESULTS.length,
      proofPacks: MOCK_PROOF_PACKS.length,
    },
  };

  return NextResponse.json({ ok: true, data }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();
  return NextResponse.json(
    { ok: true, message: 'Demo mode — data not persisted', received: body },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    }
  );
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}