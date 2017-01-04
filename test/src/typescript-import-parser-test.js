const describe = require("mocha").describe;
const it = require("mocha").it;
const expect = require("chai").expect;

const TypeScriptImportParser = require("../../src/structure-map/typescript-import-parser.js").TypeScriptImportParser;


describe("typescript-import-parser", function() {

    let source = "";
    let actualImportSources = [];


    it("should find entire content import", function() {
        givenSource("import * as myModule from \"my-module\";");
        whenGettingImportSources();
        thenImportSourcesShouldEqual(["my-module.ts"]);
    });

    function givenSource(s) {
        source = s;
    }

    function whenGettingImportSources() {
        let typeScriptHelper = new TypeScriptImportParser();
        actualImportSources = typeScriptHelper.getImportSourcesFromString(source);
    }

    function thenImportSourcesShouldEqual(expectedImportSources) {
        expect(actualImportSources).to.deep.equal(expectedImportSources);
    }

    it("should find single member import", function() {
        givenSource("import {myMember} from \"my-module\";");
        whenGettingImportSources();
        thenImportSourcesShouldEqual(["my-module.ts"]);
    });

    it("should find multiple member import", function() {
        givenSource("import {foo, bar} from \"my-module\";");
        whenGettingImportSources();
        thenImportSourcesShouldEqual(["my-module.ts"]);
    });

    it("should find aliased member import", function() {
        givenSource("import {reallyReallyLongModuleMemberName as shortName} from \"my-module\";");
        whenGettingImportSources();
        thenImportSourcesShouldEqual(["my-module.ts"]);
    });

    it("should find aliased multi member import", function() {
        givenSource("import {reallyReallyLongModuleMemberName as shortName, anotherLongModuleName as short} from \"my-module\";");
        whenGettingImportSources();
        thenImportSourcesShouldEqual(["my-module.ts"]);
    });

    it("should find namespace default import", function() {
        givenSource("import myDefault, * as myModule from \"my-module\";");
        whenGettingImportSources();
        thenImportSourcesShouldEqual(["my-module.ts"]);
    });

    it("should find specific named default import", function() {
        givenSource("import myDefault, {foo, bar} from \"my-module\";");
        whenGettingImportSources();
        thenImportSourcesShouldEqual(["my-module.ts"]);
    });

    it("should find multiline imports ", function() {
        givenSource("import {\n\tmyMember,\n\t,anotherMember\r\n    someOtherMember\n}\n from \"my-module\";");
        whenGettingImportSources();
        thenImportSourcesShouldEqual(["my-module.ts"]);
    });

    it("should handle whitespace ", function() {
        givenSource("import { myMember }\n from \"my-module\" ;");
        whenGettingImportSources();
        thenImportSourcesShouldEqual(["my-module.ts"]);
    });

    it("should ignore comments", function() {
        givenSource("// some info\n /** ... */ import {myMember} from \"my-module\";\n// end of file");
        whenGettingImportSources();
        thenImportSourcesShouldEqual(["my-module.ts"]);
    });

});

