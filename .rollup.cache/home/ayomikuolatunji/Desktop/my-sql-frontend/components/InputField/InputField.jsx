import React from 'react';
var InputField = function (_a) {
    var type = _a.type, className = _a.className, placeholder = _a.placeholder, isHookForm = _a.isHookForm, label = _a.label, register = _a.register, required = _a.required, value = _a.value, name = _a.name, onChange = _a.onChange;
    return (isHookForm ?
        <input {...register(label, { required: required })} type={type} className={"".concat(className)} placeholder={placeholder}/>
        : <input type={type || "text"} value={value} name={name} className={"".concat(className)} placeholder={placeholder || ""} onChange={onChange}/>);
};
export default InputField;
//# sourceMappingURL=InputField.jsx.map