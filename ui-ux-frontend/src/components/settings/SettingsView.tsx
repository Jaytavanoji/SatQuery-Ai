import React, { useState, useRef } from 'react';
import { 
  User, 
  Camera, 
  Trash2, 
  HardDrive, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Mail, 
  Briefcase, 
  Database,
  LogOut
} from 'lucide-react';
import { UserProfile } from '../../types';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  initialTab?: string;
  onSignOut?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdateProfile, onSignOut }) => {
  const [name, setName] = useState(user.name);
  const [organization, setOrganization] = useState(user.organization);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user.avatarUrl);
  const [profileSaved, setProfileSaved] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5 MB. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name: name.trim() || user.name,
      organization: organization.trim() || user.organization,
      email: email.trim() || user.email,
      role: role.trim() || user.role,
      avatarUrl
    };

    onUpdateProfile(updated);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  // Extract initials for fallback avatar
  const initials = (name || user.name)
    .split(' ')
    .map(n => n[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200 text-white">
      {/* Header */}
      <div className="border-b border-white/10 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono">
          <User className="w-4 h-4 text-cyan-400" />
          <span>User Profile & Account</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
          Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Manage your account details, organization, and cloud storage usage.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Section 1: Avatar Upload Card */}
        <div className="p-6 rounded-2xl bg-gray-900/90 border border-white/10 shadow-2xl backdrop-blur-md space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                Profile Photo
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Upload a photo or team avatar for reports and shared projects.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Active Member
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar Preview */}
            <div className="relative group flex-shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-white/10 shadow-xs"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-blue-950/60 text-cyan-300 font-bold text-2xl flex items-center justify-center border-2 border-cyan-500/30 shadow-xs font-mono">
                  {initials || 'SQ'}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-xs transition-transform duration-150 active:scale-95 cursor-pointer"
                title="Change Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Upload Controls */}
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                onChange={handleAvatarFileChange}
                className="hidden"
              />

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all duration-150 active:scale-95 shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Upload New Photo</span>
                </button>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-rose-950/40 text-gray-300 hover:text-rose-400 border border-white/10 text-xs font-semibold transition-all duration-150 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              <p className="text-[11px] text-gray-500">
                Recommended: Square JPG, PNG, or WebP. Max 5 MB.
              </p>

              {uploadError && (
                <p className="text-xs text-rose-400 pt-1">
                  {uploadError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Identity & Organization Data */}
        <div className="p-6 rounded-2xl bg-gray-900/90 border border-white/10 shadow-2xl backdrop-blur-md space-y-5">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              Account Details
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Your personal details used on reports and shared projects.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-black/50 border border-white/10 text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  placeholder="e.g. Maya Chen"
                  required
                />
                <User className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-black/50 border border-white/10 text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  placeholder="name@example.com"
                  required
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Organization */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Organization / Team
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-black/50 border border-white/10 text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  placeholder="e.g. Earth Observation Lab"
                  required
                />
                <Building2 className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Role / Designation */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Role / Job Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-black/50 border border-white/10 text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  placeholder="e.g. Satellite Research Analyst"
                  required
                />
                <Briefcase className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Tier & Storage Allocation */}
        <div className="p-6 rounded-2xl bg-gray-900/90 border border-white/10 shadow-2xl backdrop-blur-md space-y-4">
          <div className="border-b border-white/10 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                Plan & Cloud Storage
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Storage allocated for your saved satellite imagery and generated maps.
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 font-mono">
              {user.stacTier}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-300 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                Cloud Storage Used
              </span>
              <span className="text-gray-400 font-mono">
                <strong className="text-white">{user.quotaUsedGb} GB</strong> / {user.quotaMaxGb} GB ({Math.round((user.quotaUsedGb / user.quotaMaxGb) * 100)}%)
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((user.quotaUsedGb / user.quotaMaxGb) * 100))}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-gray-400 pt-0.5 font-mono">
              <span>Saved Satellite Images: 410 GB</span>
              <span>Available: {user.quotaMaxGb - user.quotaUsedGb} GB</span>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-2">
          <div>
            {profileSaved && (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-semibold animate-in fade-in font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Profile updated successfully!
              </span>
            )}
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>

      {/* Section 4: Account Session & Sign Out */}
      {onSignOut && (
        <div className="p-6 rounded-2xl bg-gray-900/90 border border-white/10 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <LogOut className="w-4 h-4 text-rose-400" />
              Account Session
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Sign out of your workspace session and return to the main home page.
            </p>
          </div>

          <button
            type="button"
            onClick={onSignOut}
            className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-2 transition-all duration-150 active:scale-95 whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
};
