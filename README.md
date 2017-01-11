# Module Structure

<a href="https://www.npmjs.com/package/module-structure"><img alt="npm Version" src="https://img.shields.io/npm/v/module-structure.svg"></a>
<a href="https://travis-ci.org/rfruesmer/module-structure"><img alt="Build Status" src="https://travis-ci.org/rfruesmer/module-structure.svg?branch=master"></a>
<a href="https://codecov.io/gh/rfruesmer/module-structure"><img alt="Coverage Status" src="https://codecov.io/gh/rfruesmer/module-structure/master.svg"></a>


Creates levelized structure maps (LSMs) from ECMAScript/JavaScript, TypeScript and AMD module dependencies - 
inspired by <a href="https://structure101.com/blog/2011/03/introducing-levelized-structure-maps-lsm/">structure101's Levelized Structure Maps</a>.

<blockquote>
Items in the LSM are levelized into rows, or levels, so that every item depends on at least one item on the level immediately below it. 
Items in the same row do not depend on each other, and items on the lowest level do not depend on any other items at the same scope.
This arrangement conveys a lot of dependency information so that most of the item-to-item dependency arrows can be hidden without loss of context.
<footer>— <cite>structure101.com</cite></footer>
</blockquote>
<br>
Generated LSMs can be rendered in your browser or exported as JSON files. 

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

## Diagram Viewer

The Diagram Viewer is automatically started in your default browser if invoked without outFile argument (see CLI/API documentation below).

There's no UI like a toolbar or context menu yet (maybe coming for version 2.0).

But for now, it's already possible to influence display of dependencies with the following keyboard shortcuts:

| Shortcut    | Function                                 |
|:------------|:-----------------------------------------|
| Ctrl+Click  | Add/Remove nodes from selection          | 
| Alt+D       | Show all dependencies (default)          |
| Alt+S       | Show dependencies on selected nodes      |
| Alt+B       | Show dependencies between selected nodes |

## Prerequisites

Requires a recent Node.js installation (6.x/7.x).

## CLI 

### Installation

`npm i -g module-structure`

### Usage

`module-structure --rootDir directory`           

Create structure map and display in default browser. Refreshing the browser repeats the structure analysis 
and updates the browser, useful after modifications to the code base.

`module-structure --rootDir directory  --outFile file`           

Create structure map and save as JSON file. Doesn't open structure map in browser.

### Flags 

| Argument    | Alias | Description                                                                                                                                                                  |
|-------------|-------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| --help      | -h    | Show this help.                                                                                                                                  |
| --version   | -v    | Print the version number.                                                                                                                        |
| --rootDir   |       | Specifies the root directory of input files.                                                                                                     |
| --exclude   | -e    | One or more expressions to filter packages and/or modules.                                                                                       |
| --outFile   |       | Path for the JSON output file. If omitted, the file will be created in a temporary directory and displayed as a diagram in your default browser. |
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

### Model Schema

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
      "name": {
        "type": "string",
        "required": true
      },
      "isGroup": {
        "type": "boolean",
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
  },
  "feedbacks": {
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

* `from`: The full qualified name of the dependency's source module.
* `to`: The full qualified name of the dependency's target module.

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
