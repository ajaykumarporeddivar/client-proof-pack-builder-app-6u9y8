'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  STATS,
  MOCK_PROOF_PACKS,
  RECENT_ACTIVITY,
  DEMO_USER,
  CHART_DATA,
  SPARKLINE_DATA,
  ProofPack,
  ActivityItem,
  StatCardData
} from '@/lib/data';
import { formatDate, formatCurrency } from '@/lib/utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Avatar,
  Table,
  Button,
  Input,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Pencil,
  Trash2,
  DownloadCloud,
  Search,
  CheckCircle,
  Clock,
  Archive,
  Menu,
  Eye,
  ArrowRight
} from '@/components/ui';
import { BarChart, Sparkline } from '@/components/charts';
import { AppHeader } from '@/components/layout';
import Link from 'next/link';

// Assuming status colors from design system
const getStatusBadgeVariant = (status: ProofPack['status']) => {
  switch (status) {
    case 'Completed':
      return 'success';
    case 'Ready for Review':
      return 'warning';
    case 'Draft':
      return 'secondary';
    case 'Archived':
      return 'muted'; // Muted or a custom gray if available
    default:
      return 'secondary';
  }
};

export default function DashboardPage() {
  const [selectedRow, setSelectedRow] = useState<ProofPack | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => {
        setToastMsg(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  const handleQuickAction = (actionName: string) => {
    setToastMsg(`Action "${actionName}" triggered!`);
  };

  const filteredProofPacks = useMemo(() => {
    let tempPacks = MOCK_PROOF_PACKS.filter(pack =>
      pack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pack.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pack.campaignName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterStatus !== 'All') {
      tempPacks = tempPacks.filter(pack => pack.status === filterStatus);
    }
    return tempPacks;
  }, [searchTerm, filterStatus]);

  const totalPacks = MOCK_PROOF_PACKS.length;
  const draftPacks = MOCK_PROOF_PACKS.filter(p => p.status === 'Draft').length;
  const readyForReviewPacks = MOCK_PROOF_PACKS.filter(p => p.status === 'Ready for Review').length;
  const completedPacks = MOCK_PROOF_PACKS.filter(p => p.status === 'Completed').length;

  const exportCsv = () => {
    const headers = ["ID", "Name", "Client", "Campaign", "Status", "Summary", "Created At", "Last Updated"];
    const rows = filteredProofPacks.map(pack => [
      `"${pack.id}"`,
      `"${pack.name}"`,
      `"${pack.clientName}"`,
      `"${pack.campaignName}"`,
      `"${pack.status}"`,
      `"${pack.summary.replace(/"/g, '""')}"`, // Escape quotes for CSV
      `"${formatDate(pack.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}"`,
      `"${formatDate(pack.updatedAt, { month: 'short', day: 'numeric', year: 'numeric' })}"`,
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'proof_packs_export.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMsg('Proof Packs exported to CSV!');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Section 1: Header */}
      <AppHeader
        title="Dashboard"
        subtitle={`Good morning, ${DEMO_USER.name}`}
        actions={
          <Link href="/dashboard/intake">
            <Button size="sm">+ New Proof Pack</Button>
          </Link>
        }
      />

      {/* Section 2: KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Proof Packs"
          value={totalPacks.toLocaleString()}
          change="+15%"
          changeType="positive"
          sparklineData={SPARKLINE_DATA[0]}
        />
        <StatCard
          title="Drafts"
          value={draftPacks.toLocaleString()}
          change="-2%"
          changeType="negative"
          sparklineData={SPARKLINE_DATA[1]}
        />
        <StatCard
          title="Ready for Review"
          value={readyForReviewPacks.toLocaleString()}
          change="+8%"
          changeType="positive"
          sparklineData={SPARKLINE_DATA[2]}
        />
        <StatCard
          title="Completed"
          value={completedPacks.toLocaleString()}
          change="+12%"
          changeType="positive"
          sparklineData={SPARKLINE_DATA[3]}
        />
      </div>

      {/* Section 3: Chart + Activity Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Proof Pack Overview</CardTitle>
            <p className="text-zinc-600 text-sm mt-1">Last 12 weeks</p>
          </CardHeader>
          <CardContent>
            <BarChart data={CHART_DATA.weekly} labels={CHART_DATA.labels} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              {RECENT_ACTIVITY.slice(0, 5).map((activity: ActivityItem, index: number) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 py-2 border-b border-zinc-200 last:border-0"
                >
                  <Avatar name={activity.user.avatar} className="h-8 w-8 text-xs bg-zinc-100 text-zinc-600" />
                  <div className="flex-1">
                    <p className="text-zinc-700 text-sm">
                      <span className="font-medium">{activity.user.name}</span> {activity.action}
                    </p>
                    <p className="text-zinc-400 text-xs">{formatDate(activity.timestamp, { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 4: Main data table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-bold">All Proof Packs ({filteredProofPacks.length} of {totalPacks})</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                type="text"
                placeholder="Search packs..."
                className="pl-9 pr-3 py-2 text-sm w-48"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm">
                  <span className="mr-2">Status: {filterStatus}</span> <Menu size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterStatus('All')}>All</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterStatus('Draft')}>Draft</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('Ready for Review')}>Ready for Review</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('Completed')}>Completed</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="secondary" size="sm" onClick={exportCsv}>
              <DownloadCloud size={16} className="mr-2" /> Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Name</Table.Head>
                <Table.Head>Client</Table.Head>
                <Table.Head>Campaign</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head>Created At</Table.Head>
                <Table.Head>Last Updated</Table.Head>
                <Table.Head className="text-right">Actions</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredProofPacks.slice(0, 10).map((pack: ProofPack) => (
                <Table.Row
                  key={pack.id}
                  onClick={() => setSelectedRow(pack)}
                  className={selectedRow?.id === pack.id ? 'bg-zinc-100' : ''}
                >
                  <Table.Cell className="font-medium text-zinc-900">{pack.name}</Table.Cell>
                  <Table.Cell>{pack.clientName}</Table.Cell>
                  <Table.Cell>{pack.campaignName}</Table.Cell>
                  <Table.Cell>
                    <Badge variant={getStatusBadgeVariant(pack.status)}>{pack.status}</Badge>
                  </Table.Cell>
                  <Table.Cell>{formatDate(pack.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}</Table.Cell>
                  <Table.Cell>{formatDate(pack.updatedAt, { month: 'short', day: 'numeric', year: 'numeric' })}</Table.Cell>
                  <Table.Cell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <Menu size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedRow(pack); setToastMsg(`Viewing details for ${pack.name}`); }}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setToastMsg(`Editing ${pack.name}`)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit Pack
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setToastMsg(`Marking ${pack.name} as Completed`)}>
                          <CheckCircle className="mr-2 h-4 w-4" /> Mark Complete
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => setToastMsg(`Deleting ${pack.name}`)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <div className="flex items-center justify-between text-sm text-zinc-600 mt-4">
            <span>Showing {Math.min(filteredProofPacks.length, 10)} of {filteredProofPacks.length} results</span>
            {filteredProofPacks.length > 10 && (
              <Button variant="ghost" size="sm">
                View all <ArrowRight size={16} className="ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Quick Actions row */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button onClick={() => handleQuickAction('New Proof Pack')}>
            <PlusSquare size={16} className="mr-2" /> Create New Proof Pack
          </Button>
          <Button variant="secondary" onClick={() => handleQuickAction('Review Ready Packs')}>
            <Eye size={16} className="mr-2" /> Review Ready Packs
          </Button>
          <Button variant="secondary" onClick={() => handleQuickAction('Generate Client Report')}>
            <DownloadCloud size={16} className="mr-2" /> Generate Client Report
          </Button>
          <Button variant="secondary" onClick={() => handleQuickAction('Archive Old Packs')}>
            <Archive size={16} className="mr-2" /> Archive Old Packs
          </Button>
        </CardContent>
      </Card>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm shadow-md z-50 animate-fade-in-up">
          {toastMsg}
        </div>
      )}
    </div>
  );
}

// Minimal StatCard for dashboard page. Assumes a Sparkline component exists in components/charts.
// This is a minimal definition to ensure the dashboard compiles assuming components/ui.tsx and components/charts.tsx exist.
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  sparklineData: number[];
}

function StatCard({ title, value, change, changeType, sparklineData }: StatCardProps) {
  const changeColor =
    changeType === 'positive'
      ? 'text-emerald-600'
      : changeType === 'negative'
        ? 'text-red-600'
        : 'text-zinc-500';

  return (
    <Card>
      <CardHeader className="pb-2">
        <p className="text-sm font-medium text-zinc-600">{title}</p>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">{value}</CardTitle>
          <div className="h-10 w-24">
            <Sparkline data={sparklineData} width={96} height={40} color={changeType === 'positive' ? '#10B981' : '#EF4444'} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className={`text-xs ${changeColor}`}>{change} vs last period</p>
      </CardContent>
    </Card>
  );
}