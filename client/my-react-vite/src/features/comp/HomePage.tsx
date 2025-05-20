import { useParams } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { homePageid } = useParams<{ homePageid: string }>();

  // Now you can use the homePageid to fetch user data, etc.
  return (
    <div>
      <h1>Welcome to HomePage of user {homePageid}</h1>
      {/* Additional code to display user information */}
    </div>
  );
};
export default HomePage