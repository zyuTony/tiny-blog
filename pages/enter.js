import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useEffect, useState, useCallback, useContext, useRef } from "react";
import { UserContext } from "../lib/context";
import { doc, writeBatch, getDoc, getFirestore } from "firebase/firestore";
import debounce from "lodash.debounce";

export default function EnterPage() {
  const { user, username } = useContext(UserContext);
  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

function SignInButton() {
  const signInWithGoogle = async () => {
    try {
      console.log("start auth");
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={"/google.png"} /> Sign in with Google
    </button>
  );
}

function SignOutButton() {
  return (
    <button className="" onClick={() => auth.signOut()}>
      Sign Out
    </button>
  );
}

function UsernameForm() {
  const [isValid, setIsValid] = useState(false);
  const [formValue, setFormValue] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    // after choosing name, submit and save to database
    e.preventDafault();

    const userDoc = doc(firestore, `users/${user.uid}`);
    const usernameDoc = doc(firestore, `usernames/${formValue}`);

    const batch = writeBatch(firestore);
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };
  const onChange = async (e) => {
    //check whether name is available
    //1.update UsernameMessage
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = doc(firestore, `usernames/${username}`);
        const docSnap = await getDoc(ref);
        console.log("firestore read executed");
        setIsValid(!docSnap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section>
        <h3>Pick your name</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="dick son"
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button type="submit" className="btn-green" disable={!isValid}>
            Go Pokemon!
          </button>
          <h3>Debug</h3>
          <div>
            Username: {formValue} <br />
            Loading: {loading.toString()} <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
