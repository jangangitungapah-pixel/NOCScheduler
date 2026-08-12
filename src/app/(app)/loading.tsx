export default function AppLoading() {
  return (
    <div className="app-page" aria-busy="true" aria-label="Memuat halaman">
      <div className="app-loading-header">
        <span className="ui-skeleton" data-variant="line" />
        <span className="ui-skeleton" data-variant="title" />
        <span className="ui-skeleton" data-variant="line" />
      </div>
      <div className="app-loading-surface ui-skeleton" data-variant="block" />
    </div>
  );
}
