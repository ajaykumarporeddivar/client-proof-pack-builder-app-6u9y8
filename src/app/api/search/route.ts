import { NextRequest, NextResponse } from 'next/server';
import { MOCK_CLIENTS, MOCK_CAMPAIGNS, MOCK_RESULTS, MOCK_PROOF_PACKS } from '@/lib/data';
import type { Client, Campaign, Result, ProofPack } from '@/lib/types';

interface SearchResultItem {
  id: string;
  type: 'client' | 'campaign' | 'result' | 'proofpack';
  name: string; // Common field for display
  [key: string]: any; // Allows other properties from original object
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get('q') || '';
  const typeFilter = searchParams.get('type'); // Not explicitly used for filtering entities yet, but available

  const lowerCaseQuery = query.toLowerCase().trim();
  let results: SearchResultItem[] = [];

  // Handle empty query specifically as per prompt: "If q is empty: return first 5 items"
  if (lowerCaseQuery === '') {
    const defaultResults: SearchResultItem[] = MOCK_PROOF_PACKS.slice(0, 5).map(pp => ({
      id: pp.id,
      type: 'proofpack',
      name: pp.name,
      ...pp,
    }));
    return NextResponse.json(
      { ok: true, data: { results: defaultResults, total: defaultResults.length, query: query } },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  // Perform search across entities if query is not empty
  const allSearchableItems: SearchResultItem[] = [];

  // Clients
  MOCK_CLIENTS.forEach(client => {
    if (
      client.name.toLowerCase().includes(lowerCaseQuery) ||
      client.contactEmail.toLowerCase().includes(lowerCaseQuery)
    ) {
      allSearchableItems.push({ id: client.id, type: 'client', name: client.name, ...client });
    }
  });

  // Campaigns
  MOCK_CAMPAIGNS.forEach(campaign => {
    if (
      campaign.name.toLowerCase().includes(lowerCaseQuery) ||
      campaign.objective.toLowerCase().includes(lowerCaseQuery)
    ) {
      allSearchableItems.push({ id: campaign.id, type: 'campaign', name: campaign.name, ...campaign });
    }
  });

  // Results
  MOCK_RESULTS.forEach(result => {
    if (
      result.metricName.toLowerCase().includes(lowerCaseQuery) ||
      (result.notes && result.notes.toLowerCase().includes(lowerCaseQuery))
    ) {
      allSearchableItems.push({ id: result.id, type: 'result', name: result.metricName, ...result });
    }
  });

  // ProofPacks
  MOCK_PROOF_PACKS.forEach(proofpack => {
    if (
      proofpack.name.toLowerCase().includes(lowerCaseQuery) ||
      proofpack.summary.toLowerCase().includes(lowerCaseQuery)
    ) {
      allSearchableItems.push({ id: proofpack.id, type: 'proofpack', name: proofpack.name, ...proofpack });
    }
  });

  // Deduplicate results to avoid duplicates if an item matches multiple criteria
  const uniqueResultsMap = new Map<string, SearchResultItem>();
  for (const item of allSearchableItems) {
    const key = `${item.type}-${item.id}`; // Ensure uniqueness across different entity types
    if (!uniqueResultsMap.has(key)) {
      uniqueResultsMap.set(key, item);
    }
  }

  results = Array.from(uniqueResultsMap.values());

  // Max 20 results
  results = results.slice(0, 20);

  return NextResponse.json(
    { ok: true, data: { results: results, total: results.length, query: query } },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}