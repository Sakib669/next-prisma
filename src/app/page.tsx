import Image from "next/image";
import PageClient from "./page-client";

export default function Home() {
  return (
    <div>
      <h1 className="p-4 text-4xl text-green-700">learn prisma + postgre</h1>
      <PageClient/>
    </div>
  );
}
