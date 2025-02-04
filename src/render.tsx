import * as React from 'react';
import { fromSJSON } from './jsonUtils/sketchImpl/json-to-sketch';
import { FileFormat1 as FileFormat } from '@sketch-hq/sketch-file-format-ts';
import buildTree from './buildTree';
import flexToSketchJSON from './flexToSketchJSON';
import { resetLayer, resetDocument } from './resets';
import { injectSymbols } from './symbol';
import { SketchDocumentData, SketchLayer, SketchPage, TreeNode, WrappedSketchLayer } from './types';
import RedBox from './components/RedBox';
import { getDocumentDataFromContainer, getDocumentDataFromContext } from './utils/getDocument';
import isNativeDocument from './utils/isNativeDocument';
import isNativePage from './utils/isNativePage';
import isNativeSymbolsPage from './utils/isNativeSymbolsPage';
import { getSketchVersion } from './utils/getSketchVersion';

export const renderToJSON = (element: React.ReactElement): FileFormat.AnyLayer => {
  const tree = buildTree(element);
  return flexToSketchJSON(tree);
};

export const renderLayers = (layers: Array<any>, container: SketchLayer): SketchLayer => {
  if (container.addLayers === undefined) {
    throw new Error(
      ` React SketchApp cannot render into this layer. You may be trying to render into a layer that does not take children. Try rendering into a LayerGroup, Artboard, or Page.`,
    );
  }

  container.addLayers(layers);
  return container;
};

const getDefaultPage = (): SketchLayer => {
  const doc = getDocumentDataFromContext(context);
  const currentPage = doc.currentPage();

  return isNativeSymbolsPage(currentPage) ? doc.addBlankPage() : currentPage;
};

const renderContents = (tree: TreeNode | string, container: SketchLayer): SketchLayer => {
  const json = flexToSketchJSON(tree);
  const layer = fromSJSON(json, '119');

  return renderLayers([layer], container);
};

const renderPage = (tree: TreeNode, page: SketchPage): Array<SketchLayer> => {
  const children = tree.children || [];

  // assume if name is set on this nested page, the intent is to overwrite
  // the name of the page it is getting rendered into
  if (tree.props.name) {
    page.setName(tree.props.name);
  }

  return children.map(child => renderContents(child, page));
};

const renderDocument = (tree: TreeNode, documentData: SketchDocumentData): Array<SketchLayer> => {
  if (!isNativeDocument(documentData)) {
    throw new Error('Cannot render a Document into a child of Document');
  }

  const initialPage = documentData.currentPage();
  const shouldRenderInitialPage = !isNativeSymbolsPage(initialPage);
  const children = tree.children || [];

  return children.map((child, i) => {
    if (typeof child === 'string' || child.type !== 'sketch_page') {
      throw new Error('Document children must be of type Page');
    }

    const page = i === 0 && shouldRenderInitialPage ? initialPage : documentData.addBlankPage();
    return renderPage(child, page);
  });
};

const renderTree = (tree: TreeNode, _container?: SketchLayer): SketchLayer | Array<SketchLayer> => {
  if (isNativeDocument(_container) && tree.type !== 'sketch_document') {
    throw new Error('You need to render a Document into Document');
  }

  if (!isNativePage(_container) && tree.type === 'sketch_page') {
    throw new Error('You need to render a Page into Page');
  }

  if (tree.type === 'sketch_document') {
    const doc = _container || getDocumentDataFromContext(context);

    resetDocument(doc);
    return renderDocument(tree, doc);
  }

  const container = _container || getDefaultPage();

  resetLayer(container);
  return tree.type === 'sketch_page'
    ? renderPage(tree, container)
    : renderContents(tree, container);
};

export const render = (
  element: React.ReactElement,
  container?: SketchLayer | WrappedSketchLayer,
): SketchLayer | Array<SketchLayer> => {
  if (getSketchVersion() === 'NodeJS') {
    return renderToJSON(element);
  }

  let nativeContainer: SketchLayer | undefined;
  if (container && container.sketchObject) {
    nativeContainer = container.sketchObject;
  } else if (container) {
    nativeContainer = container;
  }

  // The Symbols page holds a special meaning within Sketch / react-sketchapp
  // and due to how `makeSymbol` works, we cannot render into it
  if (isNativeSymbolsPage(nativeContainer)) {
    throw Error('Cannot render into Symbols page');
  }

  try {
    const tree = buildTree(element);

    injectSymbols(getDocumentDataFromContainer(nativeContainer));

    return renderTree(tree, nativeContainer);
  } catch (err) {
    console.error(err);
    const tree = buildTree(<RedBox error={err} />);
    return renderContents(tree, nativeContainer);
  }
};
