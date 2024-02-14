const updateFigmaUrl = (url, nodeId) => {
  const basePattern =
    /(https:\/\/www\.figma\.com\/file\/[\w-]+\/[\w-%+]+\?type=design&node-id=)/;
  const match = url.match(basePattern);

  const modifiedNodeId = nodeId.replace(":", "-");
  const newUrl = `${match[0]}${modifiedNodeId}&mode=design`;

  return newUrl;
};

export default updateFigmaUrl;
