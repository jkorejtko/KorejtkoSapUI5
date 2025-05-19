import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import ListBinding from "sap/ui/model/ListBinding";
import Dialog from "sap/m/Dialog";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import MessageToast from "sap/m/MessageToast";

/**
 * @namespace ui5.walkthrough.controller
 */
export default class App extends Controller {
    private dialog: Dialog;

    onInit(): void {
        // this is strange, why does'not working params in manifest???
        const sServiceUrl = "/V2/(S(op5lz2kfg5tcccygwkyi0lhy))/OData/OData.svc/";
        const oModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, {
            maxDataServiceVersion: "3.0",
            defaultBindingMode: "TwoWay",
            headers: {
                "MaxDataServiceVersion": "3.0",
                "DataServiceVersion": "3.0"
            }
        });
        this.getView().setModel(oModel, "products");

    
        const viewModel = new JSONModel({
            currency: "EUR"
        });
        this.getView()?.setModel(viewModel, "view");
    }

    /**
     * ==============
     * FILTER
     */

    onFilterList(event: sap.m.SearchField$SearchEvent): void {
        const filter = [];
        const query = event.getParameter("query");

        if (query) {
            // lowercasify the query
            const lowerQuery = query.toLowerCase();

            // custom filter with case insensitive
            const customFilter = new Filter({
                path: "Name",
                operator: FilterOperator.Contains,
                value1: lowerQuery,
                caseSensitive: false
            });

            filter.push(customFilter);
        }

        // filter binding
        const list = this.byId("productsList");
        const binding = list?.getBinding("items") as ListBinding;
        binding?.filter(filter, "Application");
    }

    /**
     * ==============
     * DIALOG
     */

    async onOpenAddDialog(): Promise<void> {
        this.dialog ??= await this.loadFragment({
            name: "ui5.walkthrough.view.ProductsList"
        }) as Dialog;
        this.dialog.open();
    }

    onAddProductDialog(): void {
        const productName = (this.byId("addProductName") as sap.m.Input)?.getValue();
        const productPrice = (this.byId("addProductPrice") as sap.m.Input)?.getValue();
        const productRating = (this.byId("addProductRating") as sap.m.RatingIndicator)?.getValue();

        // bundle for i18n
        const resourceBundle = (this.getView()?.getModel("i18n") as ResourceModel)?.getResourceBundle() as ResourceBundle;

        const productPayload = {
            "odata.type": "ODataDemo.Product",
            Name: productName,
            Price: productPrice,
            Rating: productRating
        };

        console.log("Product added: ", productPayload);

        const error = [];
        if (!productName) error.push("productName");
        if (!productPrice) error.push("productPrice");
        if (!productRating) error.push("productRating");

        if (error.length > 0) {
            const msg = resourceBundle.getText("dialogAddProductFill", [error.join(", ")]);
            MessageToast.show(msg);
            return;
        }

        try {
            // this is strange, why does'not working like that???
            // const oModel = this.getView().getModel("products");

            const sServiceUrl = "/V2/(S(op5lz2kfg5tcccygwkyi0lhy))/OData/OData.svc/";
            const oModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, {
                maxDataServiceVersion: "3.0",
                defaultBindingMode: "TwoWay",
                useBatch: false,
                headers: {
                    "MaxDataServiceVersion": "3.0",
                    "DataServiceVersion": "3.0"
                }
            });

            oModel.create("/Products", productPayload, {
                success: () => {
                    const msg = resourceBundle.getText("dialogAddProductSuccess");
                    MessageToast.show(msg);
                    this.onCloseDialog();
                },
                error: (oError) => {
                    console.error("Error while creating product:", oError);
                    const msg = resourceBundle.getText("dialogAddProductFailed");
                    MessageToast.show(msg);
                }
            });
        } catch (error) {
            console.error("Error adding product: ", error);
            const msg = resourceBundle.getText("dialogAddProductError");
            MessageToast.show(msg);
            return;
        }
    }

    onCloseDialog(): void {
        (this.byId("addProductDialog") as Dialog)?.close();
    }

};