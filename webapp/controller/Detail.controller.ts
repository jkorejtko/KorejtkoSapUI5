import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import JSONModel from "sap/ui/model/json/JSONModel";
import History from "sap/ui/core/routing/History";

/**
 * @namespace ui5.walkthrough.controller
 */
export default class Detail extends Controller {

    onInit(): void {
        const router = UIComponent.getRouterFor(this);
        router.getRoute("detail").attachPatternMatched(this.onObjectMatched, this);

        const viewModel = new JSONModel({
            currency: "EUR"
        });
        this.getView()?.setModel(viewModel, "view");
    }

    onObjectMatched(event: Route$PatternMatchedEvent): void {
        const productPath = "/" + window.decodeURIComponent((event.getParameter("arguments") as any).productPath);

        const sServiceUrl = "/V2/(S(op5lz2kfg5tcccygwkyi0lhy))/OData/OData.svc/";
        const oModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, {
            maxDataServiceVersion: "3.0",
            headers: {
                "MaxDataServiceVersion": "3.0",
                "DataServiceVersion": "3.0"
            },
            useBatch: false
        });

        // detail produtct
        oModel.read(productPath, {
            success: (data) => {
                const jsonModel = new JSONModel(data);
                this.getView().setModel(jsonModel, "product");
                this.getView().setBindingContext(jsonModel.createBindingContext("/"), "product");
            },
            error: (err) => {
                console.error("Chyba při načítání produktu", err);
            }
        });

        // Supplier
        oModel.read(productPath + "/Supplier", {
            success: (data) => {
                const jsonModel = new JSONModel(data);
                this.getView().setModel(jsonModel, "supplier");
                this.getView().setBindingContext(jsonModel.createBindingContext("/"), "supplier");
            }
        });

        // Categories
        oModel.read(productPath + "/Categories", {
            success: (data) => {
                const jsonModel = new JSONModel(data.results);
                this.getView().setModel(jsonModel, "categories");
            }
        });
    }

    onNavBack(): void {
        const history = History.getInstance();
        const previousHash = history.getPreviousHash();

        if (previousHash !== undefined) {
            window.history.go(-1);
        } else {
            const router = UIComponent.getRouterFor(this);
            router.navTo("app", {}, true);
        }
    }
};