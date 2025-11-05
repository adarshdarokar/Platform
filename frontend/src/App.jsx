import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  SignOutButton,
} from "@clerk/clerk-react";

function App() {
  return (
    <>
      <h1>Heiii 👋</h1>

      <SignedOut>
        <SignInButton mode="modal" >
          <button className="">
            sign-up
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton />
      </SignedIn>


      <UserButton />
    </>
  );
}

export default App;
