
import React from 'react';
import { UserRole } from '../types';
import { UserIcon } from './icons';

interface HeaderProps {
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
}

const Header: React.FC<HeaderProps> = ({ currentUserRole, setCurrentUserRole }) => {
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentUserRole(e.target.value as UserRole);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8">
      <div className="flex items-center space-x-4">
        <UserIcon className="w-6 h-6 text-slate-500" />
        <div className="relative">
          <select
            value={currentUserRole}
            onChange={handleRoleChange}
            className="appearance-none bg-slate-100 border border-slate-300 rounded-md py-2 pl-3 pr-8 text-sm font-medium text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
          >
            <option value={UserRole.ADMIN}>Admin</option>
            <option value={UserRole.STAFF}>Staff</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
