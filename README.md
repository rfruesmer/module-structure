<a href="https://www.npmjs.com/package/module-structure"><img alt="npm Version" src="http://img.shields.io/npm/v/module-structure.svg"></a>
<a href="https://travis-ci.org/rfruesmer/module-structure"><img alt="Build Status" src="https://travis-ci.org/rfruesmer/module-structure.svg?branch=master"></a>
<a href="https://codecov.io/gh/rfruesmer/module-structure"><img alt="Coverage Status" src="https://codecov.io/gh/rfruesmer/module-structure/master.svg"></a>

# Module Structure

Creates levelized structure maps from ECMAScript, TypeScript and AMD dependencies - inspired by Structure101's Levelized Structure Maps.

Generated structure maps can be directly displayed in default browser or saved as JSON files. 

## Installation

`npm install module-structure -g`

## CLI 

### Usage

Create structure map for ECMAScript and/or AMD modules and display in default browser:

`module-structure --rootDir directory`           

Create structure map for TypeScript modules and display in default browser:

`module-structure --rootDir directory --ts`           

Create structure map for ECMAScript and/or AMD modules and save as JSON file:

`module-structure --rootDir directory  --outFile file`           

Create structure map for TypeScript modules and save as JSON file:

`module-structure --rootDir directory  --ts --outFile file`           

### Flags 

<table>
  <thead>
    <tr>
      <th width="25%">Flag</th>
      <th width="15%">Short Flag</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>--help</td>
      <td>-h</td>
      <td>Show this help.</td>
    </tr>
    <tr>
      <td>--version</td>
      <td>-v</td>
      <td>Print the version number.</td>
    </tr>
    <tr>
      <td>--rootDir</td>
      <td></td>
      <td>Specifies the root directory of input files.</td>
    </tr>
    <tr>
      <td>--ts</td>
      <td></td>
      <td>Must be set for analyzing TypeScript modules instead of ECMAScript or AMD modules.</td>
    </tr>
    <tr>
      <td>--outFile</td>
      <td></td>
      <td>
        Optional: the output path for the structure map JSON-file. 
        If omitted, the file will be created in a temporary directory and displayed as a diagram in your default browser.
        </td>
    </tr>
    <tr>
      <td>--exclude</td>
      <td>-e</td>
      <td>One or more expressions to filter packages and/or modules.</td>
    </tr>
    <tr>
      <td>--pretty</td>
      <td></td>
      <td>Pretty-print the generated structure map JSON-file. Only useful in --outFile mode.</td>
    </tr>
    <tr>
      <td>--port</td>
      <td>-p</td>
      <td>
        Port for serving the included viewer webapp (defaults to 3000). 
        Omitted if --outFile is specified.
      </td>
    </tr>
  </tbody>
</table>

## API 

Not stable yet - breaking changes are not very likely, but may become necessary.

Documentation follows as soon as the API is considered stable.

## Credits

<table align="center">
    <tr>
        <td>color.js</td>
        <td align="right">
            <a href="https://www.npmjs.com/package/colors/">homepage</a>
            &nbsp;-&nbsp;  
            <a href="https://github.com/Marak/colors.js/blob/master/LICENSE">show license</a>
        </td>
    </tr>
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
