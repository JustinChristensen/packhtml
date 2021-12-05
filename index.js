const { readFile } = require('fs/promises');
const { dirname, resolve } = require('path');
const { parse: parseHtml, serialize: serializeHtml } = require('parse5');
const { rollup } = require('rollup');
const { minify } = require('terser');
const postcss = require('postcss');
const cssNano = require('cssnano')();

const forEach = (node, predicate, fn) => {
    const _forEach = (node, i) => {
        const promise = Promise.resolve((!predicate || predicate(node)) && fn(node, i));
        return promise.then(() => Promise.all(node.childNodes?.map(_forEach) ?? []));
    };

    return _forEach(node, 0);
};

const getAttr = (attrName, node) => {
    const attr = node.attrs?.find(attr => attr.name === attrName);
    return attr?.value;
};
const hasAttr = (attrName, node) => getAttr(attrName, node) !== undefined;
const hasAttrVal = (attrName, attrVal, node) => getAttr(attrName, node) === attrVal;

const isAssetNode = node =>
    node.tagName === 'script' && hasAttr('src', node) ||
    node.tagName === 'link' && hasAttrVal('rel', 'stylesheet', node) && hasAttr('href', node);

const isUrl = str => /^http|^\/\//.test(str);

const defaultRollupInputOpts = {};
const defaultRollupOutputOpts = {};

const packHtml = async ({
    htmlFile,
    rollupInputOpts = defaultRollupInputOpts,
    rollupOutputOpts = defaultRollupOutputOpts
} = {}) => {
    const contents = await readFile(htmlFile, 'utf8');
    const doc = parseHtml(contents);
    const htmlFileDir = dirname(htmlFile);

    await forEach(doc, isAssetNode, async (node, i) => {
        let tagName = 'script', tagContents;

        if (node.tagName === 'link') {
            const href = getAttr('href', node);
            if (isUrl(href)) return;

            tagName = 'style';

            const cssFile = resolve(htmlFileDir, href);
            tagContents = await readFile(cssFile, 'utf8');
            await postcss(cssNano).process(tagContents, { from: cssFile }).then(result => {
                tagContents = result.css;
            });
        } else {
            const src = getAttr('src', node);
            if (isUrl(src)) return;

            rollupInputOpts.input = resolve(htmlFileDir, src);
            const bundle = await rollup(rollupInputOpts)
            const { output } = await bundle.generate(rollupOutputOpts);
            const terserResult = await minify(output[0].code);
            tagContents = terserResult.code;
        }

        const tag = node.parentNode.childNodes[i] = {
            nodeName: tagName,
            tagName,
            attrs: [],
            childNodes: [],
            parentNode: node.parentNode
        };

        tag.childNodes.push({
            nodeName: '#text',
            value: tagContents,
            parentNode: tag
        });
    });

    console.log(serializeHtml(doc));
};

module.exports = {
    packHtml,
    defaultRollupInputOpts,
    defaultRollupOutputOpts
};
