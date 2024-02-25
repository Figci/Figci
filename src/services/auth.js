import generateApiUri from "../utils/generateURI";

const clientId = import.meta.env.VITE_FIGMA_CLIENT_ID;
const clientSecret = import.meta.env.VITE_FIGMA_CLIENT_SECRET;
const baseURI = import.meta.env.VITE_FIGMA_BASE_API_URI;
const redirectURI = import.meta.env.VITE_FIGMA_REDIRECT_URI;
const oAuthState = import.meta.env.VITE_FIGMA_OAUTH_STATE;

const getAuth = () => {
  const queryParams = {
    client_id: clientId,
    redirect_uri: redirectURI,
    scope: "files:read",
    state: oAuthState,
    response_type: "code",
  };

  const API_URI = generateApiUri(baseURI, "oauth", queryParams);

  window.location.href = API_URI;
};

const getToken = async authCode => {
  const queryParams = {
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectURI,
    code: authCode,
    grant_type: "authorization_code",
  };

  const API_URI = generateApiUri(baseURI, "api/oauth/token", queryParams);

  const response = await fetch(API_URI, { method: "POST" });
  const responseJson = await response.json();

  return responseJson;
};

const fetchToken = async code => {
  if (code) {
    const accessToken = await getToken(code);

    localStorage.setItem("FigmaToken", JSON.stringify(accessToken));
  }
};

export { getAuth, getToken, fetchToken };
