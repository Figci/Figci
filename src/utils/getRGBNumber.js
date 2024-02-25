const getRGBNumber = rgbaString => {
  const values = rgbaString.split(",");

  const red = parseInt(values[0].replace(/\D/g, ""), 10);
  const green = parseInt(values[1].replace(/\D/g, ""), 10);
  const blue = parseInt(values[2].replace(/\D/g, ""), 10);
  const alpha = parseFloat(values[3].replace(/[^\d.]/g, ""));

  return [red, green, blue, alpha];
};

export default getRGBNumber;
