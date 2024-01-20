//warp for all pages - add UIs
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import { UserContext } from "../lib/context";
import { useUserData } from "../lib/hooks";

export default function App({ Component, pageProps }) {
  const userData = useUserData();
  return (
    <>
      <UserContext.Provider value={userData}>
        {/* <UserContext.Provider value={{ user: null, username: "jeff" }}> */}
        <Navbar />
        <Component {...pageProps} />
        <Toaster />
      </UserContext.Provider>
    </>
  );
}
