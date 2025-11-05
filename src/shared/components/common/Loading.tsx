export const Loading = () => (
  <div className="flex h-96 items-center justify-center">
    <div className="flex flex-col items-center text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="mt-4 text-sm text-muted-foreground">Carregando</p>
    </div>
  </div>
);
