import Link from "next/link";
import type { ReactNode } from "react";

import { Badge, Icon } from "@/components/ui";
import type { RouteMeta } from "./navigation";

type PageHeaderProps = {
  meta: RouteMeta;
  actions?: ReactNode;
  badge?: ReactNode;
};

export function PageHeader({ actions, badge, meta }: PageHeaderProps) {
  return (
    <header className="app-page-header">
      <div className="app-page-header__copy">
        <div className="app-page-header__eyebrow-row">
          <span className="app-page-header__eyebrow">{meta.area}</span>
          {badge}
        </div>
        <h1 className="app-page-header__title">{meta.title}</h1>
        <p className="app-page-header__description">{meta.description}</p>
      </div>
      {actions ? <div className="app-page-header__actions">{actions}</div> : null}
    </header>
  );
}

export function RoutePlaceholder({ meta, pathname }: { meta: RouteMeta; pathname: string }) {
  return (
    <div className={meta.workspace ? "app-page app-page--workspace" : "app-page"}>
      <PageHeader badge={<Badge tone="info">Shell ready</Badge>} meta={meta} />
      <section
        className="app-route-placeholder"
        aria-label={`${meta.title} frontend surface status`}
      >
        <div className="app-route-placeholder__icon" aria-hidden="true">
          <Icon name="panel-left" size={24} />
        </div>
        <div className="app-route-placeholder__copy">
          <h2>Application shell active</h2>
          <p>
            Route <code>{pathname}</code> sudah berada di frame final WP-F02. High-fidelity product
            surface dan typed fixture untuk area ini tetap dikerjakan pada WP-F03.
          </p>
        </div>
        <div className="app-route-placeholder__meta">
          <span>Desktop + tablet + mobile shell</span>
          <span>Light + Dark semantic parity</span>
          <span>Canonical route preserved</span>
        </div>
      </section>
    </div>
  );
}

type ShellStateProps = {
  title: string;
  description: string;
  icon?: "alert" | "info" | "warning";
  action?: ReactNode;
};

export function ShellState({ action, description, icon = "info", title }: ShellStateProps) {
  return (
    <div className="app-state-page">
      <div className="app-state-page__icon" aria-hidden="true">
        <Icon name={icon} size={24} />
      </div>
      <h1>{title}</h1>
      <p>{description}</p>
      {action ? <div className="app-state-page__action">{action}</div> : null}
    </div>
  );
}

export function PermissionDeniedState() {
  return (
    <ShellState
      action={<Link href="/dashboard">Kembali ke Dashboard</Link>}
      description="Akun aktif tidak otomatis memperoleh mutation capability. Minta akses yang sesuai jika pekerjaan ini memang diperlukan."
      icon="warning"
      title="Akses tidak tersedia"
    />
  );
}
