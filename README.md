# Module Structure

<a href="https://www.npmjs.com/package/module-structure"><img alt="npm Version" src="https://img.shields.io/npm/v/module-structure.svg"></a>
<a href="https://travis-ci.org/rfruesmer/module-structure"><img alt="Build Status" src="https://travis-ci.org/rfruesmer/module-structure.svg?branch=master"></a>
<a href="https://codecov.io/gh/rfruesmer/module-structure"><img alt="Coverage Status" src="https://codecov.io/gh/rfruesmer/module-structure/master.svg"></a>


Creates levelized structure maps from ECMAScript, TypeScript and AMD dependencies - 
inspired by <a href="https://structure101.com/blog/2011/03/introducing-levelized-structure-maps-lsm/">structure101's Levelized Structure Maps</a>.

Generated maps can be rendered in your browser or exported as JSON files. 

## Example Diagram

<img src="https://rfruesmer.github.io/module-structure/doc/example-lsm.png"/>
<br><br>
<ul>
    <li>Green nodes with folder icon show packages (directories)</li>
    <li>Double-click packages to expand them</li>
    <li>Blue nodes with file icon show modules</li>
    <li>Nodes are levelized top-down into rows with upper rows having equal or more dependencies to the rows below</li>
    <li>Nodes inside same row have no dependencies between each other</li>
    <li>White arrows show dependencies</li>
    <li>Orange arrows show cyclic dependencies between rows/packages/modules</li>
    <li>Yellow border highlights currently selected node</li>
    <li>Hover dependency arrows to enlarge them - useful to distinguish overlapping lines</li>
</ul>

## Prerequisites

Requires a recent Node.js installation (6.x/7.x).

## CLI 

### Installation

`npm i -g module-structure`

### Usage

Create structure map for ECMAScript and/or AMD modules and display in default browser. Refreshing the browser repeats the structure analysis 
and updates the browser, useful after modifications to the code base:

`module-structure --rootDir directory`           

Same as above, but for TypeScript modules:

`module-structure --rootDir directory --ts`           

Create structure map for ECMAScript and/or AMD modules and save as JSON file. Doesn't open structure map in browser.

`module-structure --rootDir directory  --outFile file`           

Same as above, but for TypeScript modules:

`module-structure --rootDir directory  --ts --outFile file`           

### Flags 

| Argument    | Alias | Description                                                                                                                                                                  |
|-------------|-------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| --help      | -h    | Show this help.                                                                                                                                  |
| --version   | -v    | Print the version number.                                                                                                                        |
| --rootDir   |       | Specifies the root directory of input files.                                                                                                     |
| --ts        |       | Only required when analyzing TypeScript modules instead of ECMAScript or AMD modules.                                                            |
| --outFile   |       | Path for the JSON output file. If omitted, the file will be created in a temporary directory and displayed as a diagram in your default browser. |
| --exclude   | -e    | One or more expressions to filter packages and/or modules.                                                                                       |
| --pretty    |       | Pretty-print the JSON output file. Only used if --outFile is specified.                                                                          |
| --port      | -p    | Port for serving the included viewer web-app (defaults to 3000). Omitted if --outFile is specified.                                              |

## API 

### Installation

`npm i --save module-structure`

### Usage

### `moduleStructure(configuration)`

### Configuration

| Field       | Type      | Required | Default   | Description                                                                                                |
|-------------|-----------|----------|-----------|:-----------------------------------------------------------------------------------------------------------|
| rootDir     | string    | yes      | -         | Specifies the root directory of input files.                                                               |
| ts          | boolean   | depends  | false     | Only required when analyzing TypeScript modules instead of ECMAScript or AMD modules.                      |
| exclude     | string[]  | no       | []        | One or more expressions to filter packages and/or modules.                                                 |
| outFile     | string    | no       | undefined | Exports the structure model as JSON to the file path specified by outFile.                                 |
| pretty      | boolean   | no       | false     | Pretty-print the JSON output file. Only used in combination with outFile.                                  |
| open        | boolean   | no       | false     | Opens the structure map in default browser.                                                                |
| port        | number    | no       | 3000      | Port for serving the included viewer web-app (defaults to 3000). Only used in combination with open.       |
| logging     | boolean   | no       | false     | Enable/disable logging.                                                                                    |


  
### Example

```js
const moduleStructure = require("module-structure");

let model = moduleStructure({rootDir: "/path/to/some/codebase"});
```

### Return Value / Model Format

```json
{
  "type": "object",
  "required": true,
  "root": {
    "type": "node",
    "required": true,
    "properties": {
      "id": {
        "type": "string",
        "required": true
      },
      "isGroup": {
        "type": "boolean",
        "required": true
      },
      "name": {
        "type": "string",
        "required": true
      },
      "rows": {
        "type": "array",
        "required": true,
        "items": {
          "type": "array",
          "required": false,
          "items": {
            "type": "node",
            "required": false
          }
        }
      }
    }
  },
  "dependencies": {
    "type": "array",
    "required": true,
    "items": {
      "type": "dependency",
      "required": false,
      "properties": {
        "from": {
          "type": "string",
          "required": true
        },
        "to": {
          "type": "string",
          "required": true
        }
      }
    }
  }
}
```

### Node Type 

* `id`: The node's full qualified name.
* `name`: The node's simple name.
* `isGroup`: Whether the node is a package or a module - maybe a later version will also look inside modules, then a module would also become a group.
* `rows`: Array with rows. Each row in turn is an array of nodes. 
 
### Dependency Type

* `from`: The full qualified name of the dependency source node.
* `to`: The full qualified name of the dependency target node.

## Credits

<table align="center">
    <tr>
        <td>command-line-args</td>
        <td align="right">
            <a href="https://www.npmjs.com/package/command-line-args/">homepage</a>
            &nbsp;-&nbsp;  
            <a href="https://github.com/75lb/command-line-args/blob/master/LICENSE">show license</a>
        </td>
    </tr>
    <tr>
        <td>command-line-usage</td>
        <td align="right">
            <a href="https://www.npmjs.com/package/command-line-usage/">homepage</a>
            &nbsp;-&nbsp;  
            <a href="https://github.com/75lb/command-line-usage/blob/master/LICENSE">show license</a>
        </td>
    </tr>
    <tr>
        <td>dependency-tree</td>
        <td align="right">
            <a href="https://www.npmjs.com/package/dependency-tree/">homepage</a>
            &nbsp;-&nbsp;  
            <a href="http://spdx.org/licenses/MIT">show license</a>
        </td>
    </tr>
    <tr>
        <td>get-installed-path</td>
        <td align="right">
            <a href="https://www.npmjs.com/package/get-installed-path/">homepage</a>
            &nbsp;-&nbsp;  
            <a href="https://github.com/tunnckoCore/get-installed-path/blob/master/LICENSE">show license</a>
        </td>
    </tr>
    <tr>
        <td>Google Material Design Icons</td>
        <td align="right">
            <a href="https://material.io/icons/">homepage</a>
            &nbsp;-&nbsp;  
            <a href="https://github.com/google/material-design-icons/blob/master/LICENSE">show license</a>
        </td>
    </tr>
    <tr>
        <td>http-server</td>
        <td align="right">
            <a href="https://www.npmjs.com/package/http-server/">homepage</a>
            &nbsp;-&nbsp;  
            <a href="https://github.com/indexzero/http-server/blob/master/LICENSE">show license</a>
        </td>
    </tr>
    <tr>
        <td>JQuery</td>
        <td align="right">
            <a href="https://jquery.com/">homepage</a>
            &nbsp;-&nbsp;  
            <a href="https://github.com/jquery/jquery/blob/master/LICENSE.txt">show license</a>
        </td>
    </tr>
    <tr>
        <td>log4js</td>
        <td align="right">
            <a href="https://www.npmjs.com/package/log4js/">homepage</a>
            &nbsp;-&nbsp;  
            <a href="https://github.com/nomiddlename/log4js-node/blob/master/LICENSE">show license</a>
        </td>
    </tr>
    <tr>
        <td>opener</td>
        <td align="right">
            <a href="https://www.npmjs.com/package/opener/">homepage</a>
            &nbsp;-&nbsp;  
            <a href="https://github.com/domenic/opener/blob/master/LICENSE.txt">show license</a>
        </td>
    </tr>
    <tr>
        <td>preconditions</td>
        <td align="right">
            <a href="https://www.npmjs.com/package/preconditions/">homepage</a>
            &nbsp;-&nbsp;  
            <a href="https://spdx.org/licenses/MIT">show license</a>
        </td>
    </tr>
</table>

## License

MIT
