import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

export default function Home() {
  return (
    <div>
      <Link href="/admin">CLick</Link>
      <Loader show />
      <button onClick={() => toast.success("vivian")}>veronica</button>
    </div>
  );
}
