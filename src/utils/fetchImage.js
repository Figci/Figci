const fetchImageUrl = async (projectKey, setToast) => {
  const PROXY = window.location.hostname === "localhost" ? "" : "/proxy";

  const baseFigmaURL = `${PROXY}/v1/files/${projectKey}/images`;

  const token = JSON.parse(localStorage.getItem("FigmaToken")).access_token;

  try {
    if (!token) {
      setToast({ status: true, message: "The Figma token is invalid." });

      return;
    }

    const fetchFrameImageURLs = async () => {
      const fetchData = await fetch(baseFigmaURL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!fetchData.ok) {
        setToast({ status: true, message: "Failed to call the Figma API." });

        return;
      }

      const fetchJson = await fetchData.json();

      return fetchJson.meta.images;
    };

    const imageURLs = await fetchFrameImageURLs();

    return imageURLs;
  } catch (error) {
    setToast({ status: true, message: error.message });
  }
};

export default fetchImageUrl;
