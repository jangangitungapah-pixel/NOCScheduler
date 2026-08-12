import Link from "next/link";

import { Badge, Icon, Surface } from "@/components/ui";

export default function LoginPage() {
  return (
    <main className="app-login-page">
      <Surface className="app-login-card" elevation="e2">
        <div className="app-login-card__brand">
          <span className="app-brand-mark" aria-hidden="true">
            N
          </span>
          <span>
            <strong>NOCScheduler</strong>
            <small>Internal operations workspace</small>
          </span>
        </div>
        <div className="app-login-card__copy">
          <Badge tone="info">WP-F02 route shell</Badge>
          <h1>Authentication masuk pada WP-F05.</h1>
          <p>
            Route login sengaja tidak memakai application shell. Untuk review F02, gunakan temporary
            authenticated fixture menuju Dashboard.
          </p>
        </div>
        <Link className="app-login-card__continue" href="/dashboard">
          Masuk ke shell demo
          <Icon name="chevron-right" size={17} />
        </Link>
      </Surface>
    </main>
  );
}
