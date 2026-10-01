export interface DropdownItem {
  label: string;
  desc: string;
  href: string;
  isExternal?: boolean;
}

export interface NavigationItem {
  label: string;
  href: string;
  isExternal?: boolean;
  dropdownItems?: DropdownItem[];
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}
