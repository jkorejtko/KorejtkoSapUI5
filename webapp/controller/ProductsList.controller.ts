import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import { SearchField$SearchEvent } from "sap/m/SearchField";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import ListBinding from "sap/ui/model/ListBinding";

/**
 * @namespace ui5.walkthrough.controller
 */
export default class App extends Controller {
    onInit(): void {
        // this is strange, why does'not working params in manifest???
        var sServiceUrl = "/V2/(S(op5lz2kfg5tcccygwkyi0lhy))/OData/OData.svc/";
        var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, {
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

};