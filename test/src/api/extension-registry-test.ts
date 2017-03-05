import {suite, test} from "mocha-typescript";
import {assert} from "chai";
import {ExtensionRegistry} from "../../../src/structure-map/extension-registry";

@suite class ExtensionRegistryTest {

    @test "returns empty map if no extensions exist for given extension point"() {
        let extensionRegistry = new ExtensionRegistry();
        let extensions = extensionRegistry.getExtensions("fake-extension-point");
        assert.deepEqual(extensions, {});
    }
}
