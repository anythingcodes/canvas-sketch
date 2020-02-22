import * as React from 'react';
import * as PropTypes from 'prop-types';
import styled from 'styled-components/primitives';
import { render, Text, Document, Page } from 'react-sketchapp';
import chroma from 'chroma-js';
import { colorsPrimary, getColorByName } from './tokens/colors';

const tileWidth = 275;
const fontFamily = 'Avenir Next';

const textColor = hex => {
  const vsWhite = chroma.contrast(hex, 'white');
  if (vsWhite > 2) {
    return '#FFF';
  }
  return chroma(hex)
    .darken(3)
    .hex();
};

const SwatchTile = styled.View`
  width: ${tileWidth}px;
  padding: 20px;
  background-color: ${props => props.hex};
`;

// const SwatchTileChild = styled(SwatchTile)`
//   height: 56px;
// `;

const SwatchName = styled.Text`
  color: ${props => textColor(props.hex)};
  text-transform: uppercase;
  font-family: '${fontFamily} Demi Bold';
`;

const Heading = styled.Text`
  font-family: '${fontFamily}';
  color: ${colorsPrimary.Eerie};
  width: 100%;
  margin-bottom: 100px;
  font-size: 250px;
  line-height: 250px;
  font-weight: bold;
`;

const Subheading = styled.Text`
  font-family: '${fontFamily}';
  color: ${colorsPrimary.Eerie};
  width: 100%;
  font-size: 18px;
  line-height: 18px;
  text-transform: uppercase;
  margin-bottom: 20px;
`;

const SwatchHex = styled.Text`
  font-weight: normal;
`;

const Swatch = ({ name, hex, isParent }) => (
  <SwatchTile name={`Swatch ${name}`} hex={hex}>
    <SwatchName name="Swatch Name" hex={hex}>
      <Text>{name}</Text>
      {isParent && <SwatchHex>{hex}</SwatchHex>}
    </SwatchName>
  </SwatchTile>
);

const Color = {
  hex: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

Swatch.propTypes = Color;

const Artboard = styled.View`
  display: flex;
  flex-flow: column wrap;
  align-content: flex-start;
  overflow: auto;
  width: 600px;
`;

const ColorsDocument = ({ colors }) => (
  <Artboard name="Colors">
    <Heading>Web</Heading>
    <Subheading>Primary Colors</Subheading>
    {Object.keys(colors).map(color => (
      <Swatch name={color} hex={colors[color]} key={color} isParent={color.indexOf('_') === -1} />
    ))}
  </Artboard>
);

const ComponentsDocument = ({ colors }) => (
  <Artboard name="Components">
    <Heading>Something</Heading>
  </Artboard>
);

ColorsDocument.propTypes = {
  colors: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default () => {
  render(
    <Document>
      <Page name="Colors">
        <ColorsDocument colors={colorsPrimary} />
      </Page>
      {/* <Page>
        <ComponentsDocument />
      </Page> */}
    </Document>,
    require('sketch/dom').getSelectedDocument(),
  );
};
