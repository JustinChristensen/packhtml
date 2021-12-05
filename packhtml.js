#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { packHtml } = require('.');

const argv = yargs(hideBin(process.argv))
    .command('$0 <html-file>', 'Bundle assets into specified HTML file')
    .argv;

packHtml({
    htmlFile: argv.htmlFile
});
