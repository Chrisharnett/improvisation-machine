const getCognitoUrl = () => {
  return `${process.env.REACT_APP_COGNITO_DOMAIN}/login?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_COGNITO_CALLBACK}`;
  // return `https://a5tral8og.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=dbpm7i1t2je99d6gk9f7vffma&redirect_uri=http://localhost:3000`;
};

export default getCognitoUrl;
