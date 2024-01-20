export default function UserProfile({ user }) {
  return (
    <div className="box-center">
      <img src={user.photoURL} className="card-img-center" />
      <i>@{user.username}</i>
      <h1>{user.displayName}</h1>
    </div>
  );
}
