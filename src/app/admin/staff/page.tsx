import { auth } from '@/lib/auth';
import { getStaff } from '@/lib/data';
import CreateStaffForm from '@/components/admin/CreateStaffForm';
import StaffRowActions from '@/components/admin/StaffRowActions';

export const metadata = { title: 'Staff Accounts · Syed Hospital' };

export default async function StaffPage() {
  const session = await auth();
  const staff = await getStaff();

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold font-heading text-[#0F2347]">Staff Accounts</h1>
        <p className="text-slate-500 mt-1">
          Accounts are created by the hospital. Staff cannot register themselves.
        </p>
      </div>

      <CreateStaffForm />

      <div className="bg-white rounded-2xl ring-1 ring-slate-100 overflow-hidden mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Username</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Last Login</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((u) => (
                <tr key={u.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-6 py-4 font-medium text-slate-800">{u.fullName}</td>
                  <td className="px-6 py-4 font-mono text-slate-600">{u.username}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                      u.role === 'ADMIN' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-[#2E5FA3]'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                      u.isActive ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {u.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {u.lastLogin ? new Date(u.lastLogin).toLocaleString('en-GB') : 'Never'}
                  </td>
                  <td className="px-6 py-4">
                    <StaffRowActions
                      id={u.id}
                      isActive={u.isActive}
                      isSelf={u.id === session?.user?.id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}