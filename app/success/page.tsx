export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <main className="shadow-md p-4 w-full max-w-xl  border-2 border-gray-100 flex flex-col gap-2">
        <h1 className="text-4xl text-center font-bold">Register</h1>
        <div>
          <p>Name : {searchParams.name}</p>
          <p>Email : {searchParams.email}</p>
          <p>Password : {searchParams.password}</p>
          <p>Accept newsletter : {searchParams.newsletter}</p>
          <p>Accept CGV : {searchParams.cgv}</p>
        </div>
      </main>
    </div>
  );
}
