import { useQuery } from "react-query";
import getDiffingResult from "./getDiffingResult";

function getDiffingResultQuery(
  projectKey,
  beforeVersion,
  afterVersion,
  pageId,
) {
  return useQuery(
    `${beforeVersion}-${afterVersion}-${pageId}`,
    async () => {
      const result = await getDiffingResult(
        projectKey,
        beforeVersion,
        afterVersion,
        pageId,
      );

      return result;
    },
    {
      cacheTime: 300000,
      staleTime: Infinity,
      enabled: !!pageId,
    },
  );
}

export default getDiffingResultQuery;
