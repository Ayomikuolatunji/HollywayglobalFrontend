import React from 'react';
var DropDown = function (_a) {
    var apperance = _a.apperance, className = _a.className, items = _a.items, onChange = _a.onChange, value = _a.value;
    return (<div>
            {apperance ?
            <select className={"appearance-none ".concat(className)} onChange={function (e) { return onChange(e.target.value); }} value={value}>
                    {items.map(function (item, index) {
                    return <option key={index}>{item.text}</option>;
                })}
                </select>
            :
                <select className={"".concat(className)} onChange={function (e) { return onChange(e.target.value); }} value={value}>
                    {items.map(function (item, index) {
                        return <option key={index}>{item.text}</option>;
                    })}
                </select>}
        </div>);
};
export default DropDown;
//# sourceMappingURL=DropDown.jsx.map