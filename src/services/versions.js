import generateApiUri from "../components/utils/generateURI";

const baseURI = import.meta.env.VITE_BACKEND_BASE_API_URI;

const getVersions = async projectsId => {
  const token = JSON.parse(localStorage.getItem("FigmaToken")).access_token;

  const API_URI = generateApiUri(baseURI, `projects/${projectsId}/versions`);

  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      authorization: token,
    },
  });

  const responseJson = await response.json();
  const { versions } = responseJson;

  return versions;
};

export default getVersions;
