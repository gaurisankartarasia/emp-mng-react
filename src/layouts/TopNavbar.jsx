import { UserNav } from './TopNavUserMenu';
import { ModeToggle } from '@/components/ThemeToggle';

export function TopNavbar() {
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <div className="w-full flex-1">
                {/* mobile nav toggle or search bar  */}
            </div>
            <ModeToggle/>
            <UserNav />
        </header>
    );}