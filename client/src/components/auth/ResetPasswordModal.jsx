import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Modal from '../common/Modal';
import api from '../../../services/api';
import authService from '../../../services/authService';

const ResetPasswordModal = ({
  isOpen,
  onClose,
  userId,
  onSuccess,
  adminMode = false
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  const isValidPassword = passwordRegex.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword;
  const isFormValid = isValidPassword && passwordsMatch && newPassword.length >= 8;

  const resetPassword = async () => {
    if (!isFormValid) return;

    setLoading(true);
    setError('');
    
    try {
      const payload = adminMode 
        ? { newPassword }
        : { newPassword, currentPassword: '' }; // Backend handles without currentPassword

      await authService.resetPassword(userId, payload);
      
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Success">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-2xl grid place-items-center">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Password Reset Successful</h3>
          <p className="text-slate-600">You can now login with the new password.</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={adminMode ? 'Reset User Password' : 'Reset Your Password'}
      size={adminMode ? 'lg' : 'md'}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={resetPassword}
            disabled={!isFormValid || loading}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {!adminMode && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-900">
              Enter your new password. You won't need your old password for this reset.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`
                  w-full px-4 py-3 pr-12 border rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all
                  ${!isValidPassword && newPassword ? 'border-red-300 bg-red-50/50' : 'border-slate-300 hover:border-slate-400 focus:border-blue-500'}
                `}
                placeholder="Enter new password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            
            {!isValidPassword && newPassword && (
              <p className="mt-1.5 text-xs text-red-600">
                Password must be 8+ characters with uppercase, lowercase, number, and symbol
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1.5">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`
                  w-full px-4 py-3 pr-12 border rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all
                  ${!passwordsMatch && confirmPassword ? 'border-red-300 bg-red-50/50' : 'border-slate-300 hover:border-slate-400 focus:border-blue-500'}
                `}
                placeholder="Confirm new password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            
            {!passwordsMatch && confirmPassword && (
              <p className="mt-1.5 text-xs text-red-600">Passwords do not match</p>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-900">{error}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ResetPasswordModal;

