import Link from 'next/link';
import { Inter } from 'next/font/google';
import {
  ArrowRight,
  Check,
  Lock,
  Star,
  PlusSquare,
  LayoutDashboard,
  Download,
  Info,
  Zap,
  Users,
  Database,
  CreditCard,
  TrendingUp,
  HardHat,
  ShieldCheck,
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Client Proof Pack Builder — Effortless client proofs. Retainer renewals.',
  description: 'Client Proof Pack Builder helps small digital agencies efficiently turn scattered campaign results into professional, client-ready proof packs that justify retainers and renewals.',
};

function cn(...inputs: Parameters<typeof clsx>): string {
  return twMerge(clsx(inputs));
}

export default function HomePage() {
  const productName = 'Client Proof Pack Builder';
  const tagline = 'Transform messy campaign results into client-ready proof packs.';

  const featureCards = [
    {
      icon: PlusSquare,
      name: 'Structured Data Intake',
      description: 'Transforms messy client inputs and campaign results into organized, project-ready