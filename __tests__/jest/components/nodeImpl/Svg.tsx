import * as React from 'react';

import ReactSketch from '../../../../src';
import Svg from '../../../../src/components/Svg';

jest.mock('../../../../src/jsonUtils/models', () => ({
  ...require.requireActual('../../../../src/jsonUtils/models'),
  generateID: jest.fn(seed => (seed ? `${seed}mockID` : 'mockID')),
}));

describe('node <Svg />', () => {
  it('generates the json for an svg', () => {
    class SVGElement extends React.Component {
      render() {
        return (
          <Svg xmlns="http://www.w3.org/2000/svg" width="494" height="447" viewBox="0 0 494 447">
            <Svg.Path fill="#FFAE00" d="M247 447L0 160 107 15 247 0l140 15 107 145" />
            <Svg.Path fill="#EC6C00" d="M247 447L0 160h494" />
            <Svg.Path fill="#FFAE00" d="M247 447L100 160h294" />
            <Svg.Path fill="#FFEFB4" d="M247 0L100 160h294" />
            <Svg.Path fill="#FFAE00" d="M107 15L52 88 0 160h101M387 15l55 73 52 72H393" />
            <Svg.Path fill="#FED305" d="M107 15l-7 145L247 0m140 15l7 145L247 0" />
          </Svg>
        );
      }
    }

    expect(ReactSketch.renderToJSON(<SVGElement />)).toMatchSnapshot();
  });
});
