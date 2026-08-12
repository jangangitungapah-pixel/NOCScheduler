"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type MouseEvent, type ReactNode } from "react";

import {
  BottomSheet,
  Button,
  Dialog,
  Icon,
  Popover,
  ThemeToggle,
} from "@/components/ui";
import {
  DESKTOP_NAVIGATION,
  MOBILE_MORE_NAVIGATION,
  MOBILE_PRIMARY_NAVIGATION,
  SHELL_DEMO_CAPABILITIES,
  filterNavigationGroups,
  filterNavigationItems,
  getRouteMeta,
  isNavigationItemActive,
  type NavigationItem,
} from "./navigation";

const notificationFixtures = [
  {
    id: "schedule-published",
    title: "Jadwal September dipublikasikan",
    body: "Published schedule tersedia untuk seluruh tim.",
    href: "/schedule/me",
    time: "5 menit lalu",
  },
  {
    id: "request-approved",
    title: "Request disetujui",
    body: "Shift swap 18 Agustus sudah disetujui.",
    href: "/schedule/requests",
    time: "38 menit lalu",
  },
] as const;

function closeClosestDetails(event: MouseEvent<HTMLElement>) {
  event.currentTarget.closest("details")?.removeAttribute("open");
}

function SidebarLink({ collapsed, item, pathname }: { collapsed: boolean; item: NavigationItem; pathname: string }) {
  const active = isNavigationItemActive(pathname, item);

  return (
    <Link
      aria-current={active ? "page" : undefined}
      className="app-sidebar__link"
      data-active={active || undefined}
      href={item.href}
      title={collapsed ? item.label : undefined}
    >
      <Icon name={item.icon} size={18} />
      <span className="app-sidebar__link-label">{item.label}</span>
    </Link>
  );
}

function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState("");
  const commandItems = useMemo(() => {
    const source = [
      ...filterNavigationGroups(DESKTOP_NAVIGATION, SHELL_DEMO_CAPABILITIES).flatMap(
        (group) => group.items,
      ),
      ...filterNavigationItems(MOBILE_MORE_NAVIGATION, SHELL_DEMO_CAPABILITIES),
    ];

    return Array.from(new Map(source.map((item) => [item.href, item])).values());
  }, []);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("id-ID");
    if (!normalized) return commandItems;
    return commandItems.filter((item) =>
      `${item.label} ${item.href}`.toLocaleLowerCase("id-ID").includes(normalized),
    );
  }, [commandItems, query]);

  return (
    <Dialog
      description="Pindah cepat ke halaman canonical tanpa kehilangan mental model aplikasi."
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) setQuery("");
      }}
      open={open}
      title="Cari halaman"
    >
      <div className="app-command">
        <div className="app-command__search">
          <Icon name="search" size={18} />
          <input
            autoFocus
            aria-label="Cari halaman atau perintah"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari Dashboard, Payroll, Settings…"
            type="search"
            value={query}
          />
          <kbd>Esc</kbd>
        </div>
        <div className="app-command__results" role="list">
          {filteredItems.length ? (
            filteredItems.map((item) => (
              <Link
                className="app-command__item"
                href={item.href}
                key={item.href}
                onClick={() => onOpenChange(false)}
                role="listitem"
              >
                <span className="app-command__icon">
                  <Icon name={item.icon} size={18} />
                </span>
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.href}</small>
                </span>
                <span className="app-command__enter">↵</span>
              </Link>
            ))
          ) : (
            <p className="app-command__empty">Tidak ada halaman yang cocok.</p>
          )}
        </div>
      </div>
    </Dialog>
  );
}

function NotificationCenterPreview() {
  return (
    <Popover
      className="app-topbar__popover"
      trigger={
        <span className="app-icon-trigger">
          <Icon name="bell" size={18} />
          <span className="app-icon-trigger__badge">2</span>
          <span className="ui-visually-hidden">Notifikasi, 2 belum dibaca</span>
        </span>
      }
    >
      <div className="app-popover-heading">
        <div>
          <strong>Notifications</strong>
          <span>Operational awareness</span>
        </div>
        <span className="app-unread-pill">2 unread</span>
      </div>
      <div className="app-notification-list">
        {notificationFixtures.map((notification) => (
          <Link
            className="app-notification-item"
            href={notification.href}
            key={notification.id}
            onClick={closeClosestDetails}
          >
            <span className="app-notification-item__dot" aria-hidden="true" />
            <span>
              <strong>{notification.title}</strong>
              <small>{notification.body}</small>
              <time>{notification.time}</time>
            </span>
          </Link>
        ))}
      </div>
      <Link className="app-popover-footer-link" href="/notifications" onClick={closeClosestDetails}>
        Lihat semua notifikasi
        <Icon name="chevron-right" size={16} />
      </Link>
    </Popover>
  );
}

function UserMenu() {
  return (
    <Popover
      className="app-topbar__popover"
      trigger={
        <span className="app-avatar-trigger">
          <span aria-hidden="true">HN</span>
          <span className="ui-visually-hidden">Buka menu user</span>
        </span>
      }
    >
      <div className="app-user-card">
        <span className="app-user-card__avatar" aria-hidden="true">
          HN
        </span>
        <span>
          <strong>Hazel NOC</strong>
          <small>Administrator fixture</small>
        </span>
      </div>
      <div className="app-user-links">
        <Link href="/profile" onClick={closeClosestDetails}>
          <Icon name="user" size={16} /> Profile
        </Link>
        <Link href="/settings" onClick={closeClosestDetails}>
          <Icon name="settings" size={16} /> Settings
        </Link>
      </div>
    </Popover>
  );
}

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const groups = filterNavigationGroups(DESKTOP_NAVIGATION, SHELL_DEMO_CAPABILITIES);
  const mobileItems = filterNavigationItems(MOBILE_PRIMARY_NAVIGATION, SHELL_DEMO_CAPABILITIES);
  const moreItems = filterNavigationItems(MOBILE_MORE_NAVIGATION, SHELL_DEMO_CAPABILITIES);
  const routeMeta = getRouteMeta(pathname);
  const moreActive = moreItems.some((item) => isNavigationItemActive(pathname, item));

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase("en-US") === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="app-shell" data-sidebar={sidebarCollapsed ? "collapsed" : "expanded"}>
      <a className="app-skip-link" href="#app-main-content">
        Lewati navigasi
      </a>

      <aside className="app-sidebar" aria-label="Sidebar aplikasi">
        <Link className="app-sidebar__brand" href="/dashboard">
          <span className="app-brand-mark" aria-hidden="true">
            N
          </span>
          <span className="app-sidebar__brand-copy">
            <strong>NOCScheduler</strong>
            <small>Operations workspace</small>
          </span>
        </Link>

        <nav className="app-sidebar__nav" aria-label="Navigasi utama">
          {groups.map((group) => (
            <div className="app-sidebar__group" key={group.id}>
              <span className="app-sidebar__group-label">{group.label}</span>
              <div className="app-sidebar__group-items">
                {group.items.map((item) => (
                  <SidebarLink collapsed={sidebarCollapsed} item={item} key={item.id} pathname={pathname} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="app-sidebar__footer">
          <Button
            aria-label={sidebarCollapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
            className="app-sidebar__collapse"
            leadingIcon={<Icon name="panel-left" size={17} />}
            onClick={() => setSidebarCollapsed((value) => !value)}
            size="sm"
            variant="ghost"
          >
            <span className="app-sidebar__collapse-label">
              {sidebarCollapsed ? "Perluas" : "Ciutkan sidebar"}
            </span>
          </Button>
        </div>
      </aside>

      <div className="app-shell__body">
        <header className="app-topbar">
          <Link className="app-topbar__mobile-brand" href="/dashboard">
            <span className="app-brand-mark" aria-hidden="true">
              N
            </span>
            <span>
              <strong>NOCScheduler</strong>
              <small>{routeMeta?.area ?? "Workspace"}</small>
            </span>
          </Link>

          <div className="app-topbar__context">
            <span>{routeMeta?.area ?? "Workspace"}</span>
            <strong>{routeMeta?.title ?? "NOCScheduler"}</strong>
          </div>

          <div className="app-topbar__actions" aria-label="Aksi global">
            <Button
              className="app-command-trigger"
              leadingIcon={<Icon name="search" size={17} />}
              onClick={() => setCommandOpen(true)}
              size="sm"
              variant="secondary"
            >
              <span className="app-command-trigger__label">Cari</span>
              <kbd>⌘K</kbd>
            </Button>
            <NotificationCenterPreview />
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>

        <main className="app-main" id="app-main-content" tabIndex={-1}>
          {children}
        </main>
      </div>

      <nav className="app-bottom-nav" aria-label="Navigasi mobile">
        {mobileItems.map((item) => {
          const active = isNavigationItemActive(pathname, item);
          return (
            <Link
              aria-current={active ? "page" : undefined}
              className="app-bottom-nav__item"
              data-active={active || undefined}
              href={item.href}
              key={item.id}
            >
              <Icon name={item.icon} size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button
          aria-expanded={moreOpen}
          className="app-bottom-nav__item"
          data-active={moreActive || undefined}
          onClick={() => setMoreOpen(true)}
          type="button"
        >
          <Icon name="more" size={20} />
          <span>More</span>
        </button>
      </nav>

      <CommandPalette onOpenChange={setCommandOpen} open={commandOpen} />
      <BottomSheet
        description="Secondary navigation dan account utilities."
        onOpenChange={setMoreOpen}
        open={moreOpen}
        title="Lainnya"
      >
        <nav className="app-more-nav" aria-label="Navigasi lainnya">
          {moreItems.map((item) => (
            <Link className="app-more-nav__item" href={item.href} key={item.id} onClick={() => setMoreOpen(false)}>
              <span className="app-more-nav__icon">
                <Icon name={item.icon} size={18} />
              </span>
              <span>{item.label}</span>
              <Icon name="chevron-right" size={16} />
            </Link>
          ))}
          <div className="app-more-nav__theme">
            <span>
              <strong>Appearance</strong>
              <small>Light / Dark</small>
            </span>
            <ThemeToggle />
          </div>
        </nav>
      </BottomSheet>
    </div>
  );
}
