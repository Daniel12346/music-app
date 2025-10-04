export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center bg-linear-90 from-fuchsia-400  to-fuchsia-600  w-full">
      {children}
    </div>
  );
}
