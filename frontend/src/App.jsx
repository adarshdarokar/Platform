import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  SignOutButton,
  useUser,
} from "@clerk/clerk-react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProblemPage from "./pages/ProblemPage";
import { Toaster } from 'react-hot-toast'

function App() {
   const { isSignedIn } = useUser();


  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/problem" element={isSignedIn ? <ProblemPage  />: <Navigate to={"/"} /> } />

    </Routes>
    <Toaster toastOptions={{ duration: 3000 }}/>
    </>
  );
}

export default App;
