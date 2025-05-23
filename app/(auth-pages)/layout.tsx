export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mt-12 flex flex-col gap-12 place-items-center">
      {children}
    </div>
  );
}
