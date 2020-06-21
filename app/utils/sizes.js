import { compact, sortBy, uniq, filter } from 'lodash';

export const SIZE_TYPES = {
  SMALLER: '--',
  SMALL: '-',
  STANDARD: 'true',
  LARGE: '+',
  LARGER: '++',
};

export const SW_SIZES = [
  {
    SWSIZE_ID: 'MB01',
    SWSIZE_CONST: '27',
    VALUES: []
  },
  {
    SWSIZE_ID: 'MB02',
    SWSIZE_CONST: '28',
    VALUES: []
  },
  {
    SWSIZE_ID: 'MB03',
    SWSIZE_CONST: '29',
    VALUES: []
  },
  {
    SWSIZE_ID: 'MB04',
    SWSIZE_CONST: '30',
    VALUES: []
  },
  {
    SWSIZE_ID: 'MB05',
    SWSIZE_CONST: '31',
    VALUES: []
  },
  {
    SWSIZE_ID: 'MB06',
    SWSIZE_CONST: '32',
    VALUES: []
  },
  {
    SWSIZE_ID: 'MB07',
    SWSIZE_CONST: '33',
    VALUES: []
  },
  {
    SWSIZE_ID: 'MB08',
    SWSIZE_CONST: '34',
    VALUES: []
  },
  {
    SWSIZE_ID: 'MB09',
    SWSIZE_CONST: '35',
    VALUES: []
  },
  {
    SWSIZE_ID: 'MB10',
    SWSIZE_CONST: '36',
    VALUES: []
  },
  {
    SWSIZE_ID: 'MB11',
    SWSIZE_CONST: '37',
    VALUES: []
  },
  {
    SWSIZE_ID: 'MB12',
    SWSIZE_CONST: '38',
    VALUES: []
  },
  {
    SWSIZE_ID: 'MB13',
    SWSIZE_CONST: '39',
    VALUES: []
  },
  {
    SWSIZE_ID: 'MB14',
    SWSIZE_CONST: '40',
    VALUES: []
  },
];

export const getSortedSizes = (unsortedSizes) => {
  let sizes = uniq(compact(unsortedSizes));

  sizes = filter(sizes, (size) => {
      return !size.includes('/')
  })

  const sizeObjects = sizes.reduce((acc, size) => {
    return acc.concat([
      {
        SWSIZE_ID: null,
        SWSIZE_CONST: null,
        SWSIZE_TYPE: SIZE_TYPES.STANDARD,
        SWSIZE_CAT: 'euro',
        ID: 2,
        VALUE: size,
      },
    ]);
  }, []);

  const result = sortBy(sizeObjects, ['VALUE', 'ID']);

  return result
}
