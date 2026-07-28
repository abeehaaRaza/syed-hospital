import ChangePasswordForm from '@/components/shared/ChangePasswordForm';

export const metadata = { title: 'Settings · Syed Hospital' };

export default function ReceptionSettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold font-heading text-[#0F2347]">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account security.</p>
      </div>
      <ChangePasswordForm />
    </div>
  );
}