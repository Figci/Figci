import generateApiUri from "../utils/generateURI";

const getDiffingResult = async (
  projectKey,
  beforeVersion,
  afterVersion,
  pageId,
) => {
  const baseURI = import.meta.env.VITE_BACKEND_BASE_API_URI;

  const token = JSON.parse(localStorage.getItem("FigmaToken")).access_token;

  const queryParams = {
    "before-version": beforeVersion,
    "after-version": afterVersion,
  };

  const API_URL = generateApiUri(
    baseURI,
    `/projects/${projectKey}/pages/${pageId}`,
    queryParams,
  );

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      authorization: token,
    },
  });

  const responseResult = await response.json();

  return responseResult;
};

export default getDiffingResult;
