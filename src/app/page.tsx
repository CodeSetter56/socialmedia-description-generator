"use client";
import { useRouter } from "next/navigation";

function page() {

  const router = useRouter();

  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <h1>Post Generator</h1>
      <button onClick={()=>router.push("/inputs")} className="p-2 rounded-2xl text-white bg-orange-600">redirect</button>
    </div>
  )
}

export default page