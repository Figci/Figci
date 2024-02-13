const updateFigmaUrl = (url, nodeId) => {
  const basePattern =
    /(https:\/\/www\.figma\.com\/file\/[\w-]+\/[\w-%+]+\?type=design&node-id=)/;
  const modifiedNodeId = nodeId.replace(":", "-");
  const newUrl = `${basePattern.exec(url)[0]}${modifiedNodeId}&mode=design`;

  return newUrl;
};

export default updateFigmaUrl;
