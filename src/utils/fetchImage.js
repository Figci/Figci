const fetchImageUrl = async (projectKey, setToast) => {
  const baseFigmaURL = `/v1/files/${projectKey}/images`;
  const token = JSON.parse(localStorage.getItem("FigmaToken")).access_token;

  try {
    if (!token) {
      setToast({ status: true, message: "Figma 토큰이 유효하지 않습니다." });

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
        setToast({ status: true, message: "Figma API 호출에 실패했습니다" });

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
