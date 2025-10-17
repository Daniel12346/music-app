export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center bg-cover bg-center bg-[url('/background.png')]  w-full">
      {children}
    </div>
  );
}
