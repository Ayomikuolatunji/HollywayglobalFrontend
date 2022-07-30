export interface subNavItem {
    name: string;
    link: string;
  }
  
 export  interface CategoryProps {
    name: string;
    link: string;
    subNav: subNavItem[] | [];
  }