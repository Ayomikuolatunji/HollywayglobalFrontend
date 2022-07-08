import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

const navbarItems = [
    {
        name: "Home",
        link: "/",
    }, {
        name: "Mercedes",
        link: "/mercedes",
        openIcon: <AiOutlinePlus />,
        closeIcon: <AiOutlineMinus />,
        subNav: [
            {
                name: "Spear Part",
                link: "/mercedes/spear-part",
            },
            {
                name: "Engines",
                link: "/mercedes/mercedes-benz/engines",
            }, {
                name: "Transmissions",
                link: "/mercedes/mercedes-benz/transmissions",
            }
        ]
    }, {
        name: "Bmw",
        link: "/bmw",
        openIcon: <AiOutlinePlus />,
        closeIcon: <AiOutlineMinus />,
        subNav: [
            {
                name: "Spear Part",
                link: "/bmw/spear-part",
            },
            {
                name: "Engines",
                link: "/bmw/engines",
            }
        ]
    }, {
        name: "Huyndai",
        link: "/huyndai",
        openIcon: <AiOutlinePlus />,
        closeIcon: <AiOutlineMinus />,
        subNav: [
            {
                name: "Spear Part",
                link: "/huyndai/spear-part",
            },
            {
                name: "Engines",
                link: "/huyndai/engines",
            }
        ]
    }, {
        name: "Toyota",
        link: "/toyota",
        openIcon: <AiOutlinePlus />,
        closeIcon: <AiOutlineMinus />,
        subNav: [
            {
                name: "Spear Part",
                link: "/toyota/spear-part",
            }, {
                name: "Engines",
                link: "/toyota/engines",
            }
        ]

    }, {
        name: "Lamborghini",
        link: "/lamborghini",
        openIcon: <AiOutlinePlus />,
        closeIcon: <AiOutlineMinus />,
        subNav: [
            {
                name: "Spear Part",
                link: "/lamborghini/spear-part",

            }
        ]
    }, {
        name: "Ferrari",
        link: "/ferrari",
        openIcon: <AiOutlinePlus />,
        closeIcon: <AiOutlineMinus />,
        subNav: [
            {
                name: "Spear Part",
                link: "/ferrari/spear-part",
            }, {
                name: "Engines",
                link: "/ferrari/engines",
            }
        ]
    }, {
        name: "Porsche",
        link: "/porsche",
        openIcon: <AiOutlinePlus />,
        closeIcon: <AiOutlineMinus />,
        subNav: [
            {
                name: "Spear Part",
                link: "/porsche/spear-part",
            }, {
                name: "Engines",
                link: "/porsche/engines",
            }
        ]
    }
]


export default navbarItems;