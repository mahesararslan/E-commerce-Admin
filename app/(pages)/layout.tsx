import Outline from "@/components/Outline"
import authOptions from "../lib/auth"
import { getServerSession } from "next-auth"

export default async function layout({children}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions);

    if(session) {
        console.log(session); // logs user details
        return ( // @ts-ignore
            <Outline userDetails={session} >
                {children}
            </Outline>
        )
    }

    return <div></div>
    
}