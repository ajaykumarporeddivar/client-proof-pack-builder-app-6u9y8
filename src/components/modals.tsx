'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ClipboardList,
  Calendar,
  DollarSign,
  Info,
  CheckCircle,
  Archive,
  Trash2,
} from 'lucide-react';
import { Modal, Button, Badge, Input } from '@/components/ui';

interface EntityDetailModalProps {
  item: Record<string, unknown> | null;
  open: boolean;
  onClose: () => void;
  title: string;
}

export function EntityDetailModal({ item, open, onClose, title }: EntityDetailModalProps) {
  if (!item) return null;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatValue = (key: string, value: unknown) => {
    if (typeof value === 'string' && (key.toLowerCase().includes('date') || key.toLowerCase().includes('at'))) {
      return formatDate(value);
    }
    if (typeof value === 'number') {
      if (key.toLowerCase().includes('spend') || key.toLowerCase().includes('value') && item.unit === '$') {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      }
      return new Intl.NumberFormat('en-US').format(value);
    }
    return String(value);
  };

  const handleAction = (action: string) => {
    console.log(`Demo Action: ${action} for item ${item.id}`);
    onClose();
  };

  const status = item.status as string; // Assuming 'status' exists on relevant items

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex justify-end mb-4">
        {status && (
          <Badge
            variant={
              status === 'Completed' || status === 'Active' || status === 'Running' ? 'success' :
              status === 'Ready for Review' || status === 'Draft' || status === 'Paused' ? 'warning' :
              'info'
            }
          >
            {status}
          </Badge>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {Object.entries(item)
          .filter(([key]) => key !== 'id' && key !== 'clientId' && key !== 'campaignId' && key !== 'status' && key !== 'exportUrl')
          .map(([key, value]) => (
            <React.Fragment key={key}>
              <div className="font-medium text-zinc-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="text-zinc-600">
                {formatValue(key, value)}
              </div>
            </React.Fragment>
          ))}
      </div>
      <div className="mt-8 pt-4 border-t border-zinc-200 flex justify-end space-x-2">
        {status === 'Ready for Review' && (
          <Button
            variant="primary"
            onClick={() => handleAction('Approve')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <CheckCircle className="mr-2 h-4 w-4" /> Approve
          </Button>
        )}
        <Button variant="secondary" onClick={() => handleAction('Archive')}>
          <Archive className="mr-2 h-4 w-4" /> Archive
        </Button>
        <Button variant="danger" onClick={() => handleAction('Delete')}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </div>
    </Modal>
  );
}

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmLabel?: string;
  variant?: 'danger' | 'info';
}

export function ConfirmModal({
  open,
  onClose,
  title,
  message,
  onConfirm,
  confirmLabel = 'Confirm',
  variant = 'info',
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-zinc-600 mb-6">{message}</p>
      <div className="flex justify-end space-x-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          onClick={handleConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

interface CommandPaletteItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandPaletteItem[];
}

export function CommandPalette({ open, onClose, items }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setSearch('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50); // Auto-focus input
    }
  }, [open]);

  const filteredItems = items.filter(
    (item) =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[activeIndex]) {
          router.push(filteredItems[activeIndex].href);
          onClose();
        }
      }
    },
    [open, onClose, filteredItems, activeIndex, router]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Modal open={open} onClose={onClose} title="Command Palette" showCloseButton={false} className="max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search commands or navigate..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2 w-full rounded-md border border-zinc-300 focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
        />
      </div>

      {filteredItems.length === 0 && search !== '' && (
        <p className="p-4 text-center text-zinc-500 text-sm">No results found for &quot;{search}&quot;</p>
      )}

      {filteredItems.length > 0 && (
        <ul className="mt-4 max-h-80 overflow-y-auto custom-scrollbar">
          {filteredItems.map((item, index) => (
            <li
              key={item.href}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                index === activeIndex ? 'bg-zinc-100' : 'hover:bg-zinc-50'
              }`}
              onClick={() => {
                router.push(item.href);
                onClose();
              }}
            >
              <div className="flex-shrink-0 text-zinc-500">{item.icon || <ChevronRight className="h-4 w-4" />}</div>
              <div className="flex-grow">
                <p className="font-medium text-zinc-800">{item.label}</p>
                {item.description && <p className="text-sm text-zinc-500">{item.description}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}