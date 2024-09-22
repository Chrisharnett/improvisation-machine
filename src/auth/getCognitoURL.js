const getCognitoUrl = () => {
  // console.log(process.env.REACT_APP_COGNITO_DOMAIN);

  const callback =
    process.env.REACT_APP_ENV === "prod"
      ? process.env.REACT_APP_COGNITO_CALLBACK_PROD
      : process.env.REACT_APP_COGNITO_CALLBACK_LOCAL;

  console.log(process.env.REACT_APP_ENV);
  console.log(callback);
  return `${process.env.REACT_APP_COGNITO_DOMAIN}/login?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${callback}`;
};

export default getCognitoUrl;
