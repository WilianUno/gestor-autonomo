'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Briefcase, Calendar } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Início', icon: Home },
    { href: '/clientes', label: 'Clientes', icon: Users },
    { href: '/servicos', label: 'Serviços', icon: Briefcase },
    { href: '/agenda', label: 'Agenda', icon: Calendar },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header com logo */}
        <div className="flex items-center justify-between py-4 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-primary-500 text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl">
              AP
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Agenda Pro</h1>
              <p className="text-xs text-gray-500">Sistema para Autônomos</p>
            </div>
          </Link>
        </div>

        {/* Menu de navegação - GRANDE e CLARO */}
        <div className="flex gap-2 py-3 overflow-x-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-base
                  transition-all duration-200 whitespace-nowrap
                  ${isActive 
                    ? 'bg-primary-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <Icon size={20} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}