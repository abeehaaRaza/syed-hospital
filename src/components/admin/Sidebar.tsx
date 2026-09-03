'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, UserCog,
  ScrollText, HardDrive, Settings, Shield, Briefcase,
} from 'lucide-react';
import LogoutButton from '@/components/shared/LogoutButton';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'All Patients', href: '/admin/patients', icon: Users },
  { label: 'Staff Accounts', href: '/admin/staff', icon: UserCog },
  { label: 'Hospital Staff', href: '/admin/staff/hire', icon: Briefcase },
  { label: 'HR Portal', href: '/hr/dashboard', icon: Shield },
  { label: 'Audit Log', href: '/admin/audit-log', icon: ScrollText },
  { label: 'Backups', href: '/admin/backups', icon: HardDrive },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-slate-100">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <Image src="/hos.png" alt="Syed Hospital" width={44} height={44} className="object-contain" />
          <div className="flex flex-col leading-none">
            <span className="text-lg font-medium tracking-tight text-[#2B3A4A]" style={{ fontFamily: 'var(--font-jost)' }}>
              SYED
            </span>
            <span className="text-[10px] font-light tracking-[0.3em] text-[#2E5FA3]" style={{ fontFamily: 'var(--font-jost)' }}>
              HOSPITAL
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Administration
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-[#2E5FA3] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-[#1E3A6E]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-4 py-2 mb-2">
          <div className="h-9 w-9 rounded-full bg-[#EFF6FF] flex items-center justify-center text-sm font-semibold text-[#2E5FA3]">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-[#1E3A6E]">{userName}</p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}