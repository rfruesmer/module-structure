import {StructureView} from "./app/structure-view";
import "./assets/style.css";
import "./assets/ic_folder_black_24px.svg";
import "./assets/ic_insert_drive_file_black_24px.svg";

if (process.env.ENV !== "production") {
    require("./data/module-structure.json");
}

(function () {
    loadModel()
        .done(model => {
            let structureView = new StructureView();
            structureView.show(model);
        })
        .fail(error => {
            console.error(error);
        });
})();

function loadModel(): JQueryPromise<any> {
    let url = getParam("input");
    return (url.length > 0)
        ? $.ajax({url: url, dataType: "json"})
        : $.Deferred()
            .reject("input parameter is missing in URL - usage example: http://localhost:8080/?input=module-structure.json")
            .promise();
}

function getParam(key: string): string {
    let modelUrl = location.search.split(key + "=")[1];
    return modelUrl ? decodeURIComponent(modelUrl.split("&")[0]) : "";
}
