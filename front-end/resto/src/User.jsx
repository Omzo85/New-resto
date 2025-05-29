import { useParams } from 'react-router-dom';

function User() {
  const { id } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Profil Utilisateur</h1>
      <p className="text-lg">ID de l'utilisateur : {id}</p>
    </div>
  );
}

export default User;