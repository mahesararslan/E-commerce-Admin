
// import { getServerSession } from "next-auth"
// import authOptions from "./lib/auth"
// import Image from "next/image"


// export default async function Home() {
//   const session = await getServerSession(authOptions)
//   console.log(session)

//   if(session?.user) { 
//     // redirect to dashboard
//   }
//   else {
//     return 
//      <div className="text-blue-900 flex justify-between">
//         <h2>
//           Hello! <b>{session?.user?.name}</b>
//         </h2>
//         <div className="flex gap-1 bg-gray-300 text-black rounded-lg overflow-hidden">
//           <Image src={session?.user?.image || ""} width={50} height={50} className="rounded-full w-6 h-6" alt="" />
//           <span className="px-2">{session?.user?.name}</span>
//         </div>
//      </div>
//   }
  
// }

import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation'
import authOptions from "./lib/auth"

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect('/dashboard')
  } else {
    redirect('/api/auth/signin')
  }
}
