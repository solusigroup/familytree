import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Users, TreesIcon, Images, BookOpen, Shield, UserCog, Grid3X3, MessagesSquare } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { PwaInstallButton } from '@/components/pwa-install-button';
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
        title: 'Mozaik Foto',
        href: '/mosaic',
        icon: Grid3X3,
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
    
    // Check superadmin status from server-side flag
    const isSuperadmin = auth?.user?.is_superadmin === true;
    const canChat = auth?.user?.can_chat === true || isSuperadmin || auth?.user?.role === 'editor';

    // Build the nav list
    const navItems = [];
    
    // Show admin menu items for superadmin users
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

    // Chat for min. role editor (Editor & Superadmin)
    if (canChat) {
        navItems.push({
            title: 'Chat Tim',
            href: '/chat',
            icon: MessagesSquare,
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
                <div className="px-2 pt-1 group-data-[collapsible=icon]:hidden">
                    <PwaInstallButton variant="sidebar" />
                </div>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
