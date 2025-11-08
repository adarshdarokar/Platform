import { SignedOut, SignedIn, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'
import  toast from 'react-hot-toast'


const HomePage = () => {
   

// //     const {data ,isLoading, error, refetch, ..., ... }= useQuerry({
// //    queryFn: ()=> fetch(
// //     "/api/books"
// //    ).then(res => res.json())
    
   
//     })

  return (
    <div>
        <button className='btn btn-secondary' onClick={()=> toast.success("this is a toast")}>Click me</button>
        <SignedOut>
            <SignInButton mode='modal'>
                <button>Login</button>
            </SignInButton>
        </SignedOut>

        <SignedIn>
            <SignOutButton />
        </SignedIn>
        <UserButton />
            <toast />

    </div>
  )
}

export default HomePage;
