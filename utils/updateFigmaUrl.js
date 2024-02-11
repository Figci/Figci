const updateFigmaUrl = (url, NodeId) => {
  const basePattern =
    /(https:\/\/www\.figma\.com\/file\/[\w-]+\/[\w-%+]+\?type=design&node-id=)/;
  const modifiedNodeId = NodeId.replace(":", "-");
  const newUrl = `${basePattern.exec(url)[0]}${modifiedNodeId}&mode=design`;

  return newUrl;
};

export default updateFigmaUrl;
