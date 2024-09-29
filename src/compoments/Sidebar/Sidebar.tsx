import React from "react";
import "./Sidebar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTachometerAlt, faWarehouse, faBox, faUser, faBarcode, faTruck} from '@fortawesome/free-solid-svg-icons';
import { SidebarItem } from "./compoments/SidebarItem";
import { SidebarNav } from "./compoments/SidebarNav";
import { SidebarLogo } from "./compoments/SidebarLogo";

export const Sidebar: React.FC = () => {
    const logo = "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?t=st=1724652251~exp";

    return (
        <div className={"sidebar"}>
            <SidebarLogo logo={logo} />
            <SidebarNav>
                <SidebarItem
                    href={"/"}
                    icon={<FontAwesomeIcon icon={faTachometerAlt} />}
                    label={"Dashboard"}
                />
                <SidebarItem
                    icon={<FontAwesomeIcon icon={faWarehouse} />}
                    label={"Inventory"}
                    subItems={
                        [
                            { href: "/stock-entry", lable: "Stock Entry" },
                        ]
                    }
                />
                <SidebarItem
                    icon={<FontAwesomeIcon icon={faBox} />}
                    label={"Product"}
                    subItems={
                        [
                            { href: "/product-management", lable: "Manage Product" },
                            { href: "/management-attribute", lable: "Manage Attributes" },
                        ]
                    }
                />
                <SidebarItem
                    href={"/management-supplier"}
                    icon={<FontAwesomeIcon icon={faTruck} />}
                    label={"Supplier"}
                />
                <SidebarItem
                    href={"/management-sku"}
                    icon={<FontAwesomeIcon icon={faBarcode} />}
                    label={"SKU"}
                />
                <SidebarItem
                    href={"/management-user"}
                    icon={<FontAwesomeIcon icon={faUser} />}
                    label={"User"}
                />
            </SidebarNav>
        </div>
    )
}