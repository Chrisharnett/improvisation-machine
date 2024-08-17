const getCognitoUrl = () => {
  // console.log(process.env.REACT_APP_COGNITO_DOMAIN);
  return `${process.env.REACT_APP_COGNITO_DOMAIN}/login?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_COGNITO_CALLBACK}`;
};

export default getCognitoUrl;
