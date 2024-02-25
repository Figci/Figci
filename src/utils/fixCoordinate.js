const fixCoordinate = frameSubtree => {
  const { x, y } = frameSubtree.property.absoluteBoundingBox;

  const result = {
    dx: x < 0 ? Math.abs(x) + 50 : -1 * x + 20,
    dy: y < 0 ? Math.abs(y) + 50 : -1 * y + 20,
  };

  return result;
};

export default fixCoordinate;
