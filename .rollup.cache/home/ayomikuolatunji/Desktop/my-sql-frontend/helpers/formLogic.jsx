import { __assign } from "tslib";
import { useState } from "react";
var FormLogic = function () {
    var _a = useState({
        firstname: "",
        lastname: "",
        email: "",
        topic: ""
    }), values = _a[0], setValues = _a[1];
    var handleChange = function (event) {
        var _a;
        var _b = event.currentTarget, name = _b.name, value = _b.value;
        setValues(__assign(__assign({}, values), (_a = {}, _a[name] = value, _a)));
    };
    var handleTextarea = function (event) {
        var _a;
        var _b = event.currentTarget, name = _b.name, value = _b.value;
        setValues(__assign(__assign({}, values), (_a = {}, _a[name] = value, _a)));
    };
    return {
        values: values,
        handleChange: handleChange,
        handleTextarea: handleTextarea
    };
};
export default FormLogic;
//# sourceMappingURL=formLogic.jsx.map