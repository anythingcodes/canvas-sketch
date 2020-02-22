export const colorsPrimary = {
  Calypso: '#00a4bd',
  Calypso_Dark: '#0091AE',
  Lorax: '#ff7a59',
  Obsidian: '#33475b',
  Eerie: '#7C98B6',
};

const colorMapping = [
  {
    type: 'Primary',
    name: 'Calypso',
    hex: '#00a4bd',
    children: [
      {
        name: 'Calypso Dark',
        hex: '#0091ae',
      },
    ],
  },
];

// const getColorByName = name => {
//   // TODO: memoize
//   return colorMapping[name];
// };

module.exports = {
  colorsPrimary,
  colorMapping,
  //getColorByName,
};

// export const colorsWeb = [
//   (categoryName: 'Primary Colors'),
//   (children: [
//     {
//       name: 'Calypso',
//       hex: '#00a4bd',
//       children: [
//         {
//           name: 'Calypso Dark',
//           hex: '#0091ae',
//         },
//       ],
//     },
//     {
//       name: 'Lorax',
//       hex: '#ff7a59',
//       children: [
//         {
//           name: 'Lorax Dark',
//           hex: 'red',
//         },
//       ],
//     },
//     {
//       name: 'Obsidian',
//       hex: '#33475b',
//     },
//   ]),
// ];
