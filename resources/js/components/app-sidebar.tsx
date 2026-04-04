import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Users, TreesIcon, Images, BookOpen, Shield, UserCog } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Galeri Keluarga',
        href: '/gallery',
        icon: Images,
    },
    {
        title: 'Anggota Keluarga',
        href: '/family-members',
        icon: Users,
    },
    {
        title: 'Pohon Keluarga',
        href: '/family-tree',
        icon: TreesIcon,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    
    // Server-side flag + string comparison + explicit name bypass for kurniawan
    const role = (auth?.user?.role || '').toString().toLowerCase();
    const isSuperadmin = auth?.user?.is_superadmin === true || role === 'superadmin' || auth?.user?.name === 'kurniawan';

    // Build the nav list
    const navItems = [];
    
    // Put admin items at the TOP if superadmin to confirm they work
    if (isSuperadmin) {
        navItems.push({
            title: 'Kelola Pengguna',
            href: '/admin/users',
            icon: Shield,
        });
        navItems.push({
            title: 'Kelola Role',
            href: '/admin/users?status=active',
            icon: Shield,
        });
    }

    // Then main nav
    navItems.push(...mainNavItems);

    const footerNavItems: NavItem[] = [
        {
            title: 'Panduan',
            href: '/panduan.html',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} label={isSuperadmin ? "Menu Admin" : "Menu"} />
            </SidebarContent>






            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
