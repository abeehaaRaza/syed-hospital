import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getPatientsForExport } from '@/lib/data';

function esc(v: unknown) {
  const s = v === null || v === undefined ? '' : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const patients = await getPatientsForExport();

  const headers = [
    'MR Number', 'Full Name', 'Guardian', 'Age', 'Gender', 'CNIC', 'Mobile',
    'Address', 'Department', 'Service', 'Fee', 'Disposal', 'Details',
    'Visit Date', 'Visit Time', 'Status', 'Registered At',
  ];

  const rows = patients.map((p) =>
    [
      p.mrNumber, p.fullName, p.guardianName, p.age, p.gender, p.cnicNumber,
      p.mobile, p.address, p.department, p.serviceRequired, p.fee, p.disposal,
      p.details, new Date(p.visitDate).toLocaleDateString('en-GB', { timeZone: 'Asia/Karachi' }), p.visitTime,
      p.status, new Date(p.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Karachi' }),
    ].map(esc).join(',')
  );

  const csv = [headers.map(esc).join(','), ...rows].join('\n');
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse('\uFEFF' + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="syed-hospital-patients-${stamp}.csv"`,
    },
  });
}