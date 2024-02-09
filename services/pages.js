import generateApiUri from "../utils/generateURI";

const getPages = async (projectKey, { beforeVersion, afterVersion }) => {
  const baseURI = import.meta.env.VITE_BACKEND_BASE_API_URI;

  const token = JSON.parse(localStorage.getItem("FigmaToken")).access_token;

  const queryParams = {
    "before-version": beforeVersion,
    "after-version": afterVersion,
  };

  const API_URI = generateApiUri(
    baseURI,
    `projects/${projectKey}/pages`,
    queryParams,
  );

  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      authorization: token,
    },
  });

  const responseResult = await response.json();

  return responseResult;
};

const getDiffingResult = async (projectKey, pageId) => {
  const baseURI = import.meta.env.VITE_BACKEND_BASE_API_URI;

  const token = JSON.parse(localStorage.getItem("FigmaToken")).access_token;

  const API_URL = generateApiUri(
    baseURI,
    `/projects/${projectKey}/pages/${pageId}`,
  );

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      authorization: token,
    },
  });

  const responseJson = await response.json();

  return responseJson;
};

export { getPages, getDiffingResult };
