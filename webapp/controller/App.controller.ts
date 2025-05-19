import Controller from "sap/ui/core/mvc/Controller";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

/**
 * @name ui5.walkthrough.controller.App
 */
export default class AppController extends Controller {
    /**
     * Event handler for language change
     * @param {sap.ui.base.Event} oEvent - Event object
     */
    onLanguageChange(oEvent: sap.ui.base.Event): void {
      const sSelectedLang = oEvent.getSource().getSelectedKey();

      const oResourceModel = new ResourceModel({
        bundleName: "ui5.walkthrough.i18n.i18n",
        bundleLocale: sSelectedLang
      });

      this.getView()?.setModel(oResourceModel, "i18n");
    }
};