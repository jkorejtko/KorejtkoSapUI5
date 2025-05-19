import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Controller from "sap/ui/core/mvc/Controller";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

export default  {
    statusText: function (this: Controller, status: string): string | undefined {
        const resourceBundle = (this?.getOwnerComponent()?.getModel("i18n") as ResourceModel)?.getResourceBundle() as ResourceBundle;
        switch (status) {
            case "A":
                return resourceBundle.getText("productsStatusA");
            case "B":
                return resourceBundle.getText("productsStatusB");
            case "C":
                return resourceBundle.getText("productsStatusC");
            default:
                return status;
        }
    }
};