import React from 'react';
import Navbar from './Navbar/Navbar';
import TopNavBar from './TopNav/TopNavBar';
;
var HeaderWrapper = function (_a) {
    var children = _a.children;
    return (<div>
        <TopNavBar />
        <Navbar />
       <main>
         {children}
       </main>
    </div>);
};
export default HeaderWrapper;
//# sourceMappingURL=HeaderWrapper.jsx.map