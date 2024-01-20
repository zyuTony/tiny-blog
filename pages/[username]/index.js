import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import { getUserWithUsername, postToJSON } from "../../lib/firebase";
import {
  query as firestoreQuery,
  collection,
  where,
  getDocs,
  limit,
  orderBy,
} from "firebase/firestore";

export async function getServerSideProps({ query: urlquery }) {
  const { username } = urlquery;
  const userDoc = await getUserWithUsername(username);
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postsRef = collection(userDoc.ref, "posts");
    const postsQuery = firestoreQuery(
      postsRef,
      where("published", "==", true),
      // orderBy("createdAt", "desc"),
      limit(5)
    );

    posts = (await getDocs(postsQuery)).docs.map((doc) => postToJSON(doc));
  }
  return { props: { user, posts } };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}
