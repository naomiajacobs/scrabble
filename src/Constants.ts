enum SpecialSquare {
  TRIPLE_LETTER = "tls",
  DOUBLE_LETTER = "dls",
  TRIPLE_WORD = "tws",
  DOUBLE_WORD = "dws",
}

export const TILE_NAME: { [key in SpecialSquare]: string } = {
  [SpecialSquare.TRIPLE_LETTER]: "Triple Letter Score",
  [SpecialSquare.DOUBLE_LETTER]: "Double Letter Score",
  [SpecialSquare.TRIPLE_WORD]: "Triple Word Score",
  [SpecialSquare.DOUBLE_WORD]: "Double Word Score",
};

const SQUARES: { [key in SpecialSquare]: Array<string> } = {
  [SpecialSquare.TRIPLE_WORD]: [
    "0,0",
    "0,7",
    "7,0",
    "14,7",
    "7,14",
    "0,14",
    "14,0",
    "14,14",
  ],
  [SpecialSquare.DOUBLE_WORD]: [
    "1,1",
    "2,2",
    "3,3",
    "4,4",
    "1,13",
    "2,12",
    "3,11",
    "4,10",
    "13,1",
    "12,2",
    "11,3",
    "10,4",
    "10,10",
    "11,11",
    "12,12",
    "13,13",
    "7,7",
  ],
  [SpecialSquare.DOUBLE_LETTER]: [
    "0,3",
    "0,11",
    "3,0",
    "3,14",
    "11,0",
    "14,3",
    "14,11",
    "11,14",
    "2,6",
    "3,7",
    "2,8",
    "6,2",
    "7,3",
    "8,2",
    "12,6",
    "11,7",
    "12,8",
    "6,12",
    "7,11",
    "8,12",
    "6,6",
    "6,8",
    "8,6",
    "8,8",
  ],
  [SpecialSquare.TRIPLE_LETTER]: [
    "1,5",
    "1,9",
    "5,13",
    "9,13",
    "5,1",
    "9,1",
    "13,5",
    "13,9",
    "5,5",
    "5,9",
    "9,5",
    "9,9",
  ],
};

export const SQUARES_BY_LOCATION: { [location: string]: SpecialSquare } = (Object.keys(
  SQUARES
) as Array<SpecialSquare>).reduce(
  (hash: { [location: string]: SpecialSquare }, tileName: SpecialSquare) => {
    const locations = SQUARES[tileName];
    locations.forEach((location) => {
      hash[location] = tileName;
    });
    return hash;
  },
  {}
);

