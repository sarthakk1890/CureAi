import { FC } from 'react';
import { AiOutlineHome, AiOutlineCalendar, AiOutlineShoppingCart } from 'react-icons/ai';
import { IconType } from 'react-icons';
import { Link } from 'react-router-dom';

interface NavItem {
    id: 'dashboard' | 'appointments' | 'orders';
    icon: IconType;
    label: string;
}

interface SidebarProps {
    activeTab: NavItem['id'];
    setActiveTab: (tab: NavItem['id']) => void;
}

const Sidebar: FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    const navItems: NavItem[] = [
        { id: 'dashboard', icon: AiOutlineHome, label: 'Dashboard' },
        { id: 'appointments', icon: AiOutlineCalendar, label: 'Appointments' },
        { id: 'orders', icon: AiOutlineShoppingCart, label: 'Orders' }
    ];

    return (
        <div className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-10 w-64`}>
            <div className="h-20 flex items-center justify-center border-b">
                <Link to="/">
                    <div className="text-2xl font-bold">
                        <span className="transition-colors duration-300 text-primary-dark">
                            Cure
                        </span>
                        <span className="transition-colors duration-300 text-secondary">
                            Ai
                        </span>
                    </div>
                </Link>
            </div>

            <nav className="p-4 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center p-3 rounded-lg transition-colors
              ${activeTab === item.id ? 'bg-primary text-white' : 'hover:bg-primary-light text-text-light'}`}
                    >
                        <item.icon size={20} className="mr-3" />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;