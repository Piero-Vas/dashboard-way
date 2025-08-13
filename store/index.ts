import { create } from "zustand";
import { siteConfig } from "@/config/site";
import { persist, createJSONStorage } from "zustand/middleware";
import { em } from "@fullcalendar/core/internal-common";

interface ThemeStoreState {
  theme: string;
  setTheme: (theme: string) => void;
  radius: number;
  setRadius: (value: number) => void;
  layout: string;
  setLayout: (value: string) => void;
  navbarType: string;
  setNavbarType: (value: string) => void;
  footerType: string;
  setFooterType: (value: string) => void;
  isRtl: boolean;
  setRtl: (value: boolean) => void;
}

export const useThemeStore = create<ThemeStoreState>()(
  persist(
    (set) => ({
      theme: siteConfig.theme,
      setTheme: (theme) => set({ theme }),
      radius: siteConfig.radius,
      setRadius: (value) => set({ radius: value }),
      layout: siteConfig.layout,
      setLayout: (value) => {
        set({ layout: value });

        // If the new layout is "semibox," also set the sidebarType to "popover"
        if (value === "semibox") {
          useSidebar.setState({ sidebarType: "popover" });
        }
        if (value === "horizontal") {
          useSidebar.setState({ sidebarType: "classic" });
        }
        //
        if (value === "horizontal") {
          // update  setNavbarType
          useThemeStore.setState({ navbarType: "sticky" });
        }
      },
      navbarType: siteConfig.navbarType,
      setNavbarType: (value) => set({ navbarType: value }),
      footerType: siteConfig.footerType,
      setFooterType: (value) => set({ footerType: value }),
      isRtl: false,
      setRtl: (value) => set({ isRtl: value }),
    }),
    { name: "theme-store", storage: createJSONStorage(() => localStorage) }
  )
);

interface SidebarState {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  sidebarType: string;
  setSidebarType: (value: string) => void;
  subMenu: boolean;
  setSubmenu: (value: boolean) => void;
  // background image
  sidebarBg: string;
  setSidebarBg: (value: string) => void;
  mobileMenu: boolean;
  setMobileMenu: (value: boolean) => void;
}

export const useSidebar = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: false,
      setCollapsed: (value) => set({ collapsed: value }),
      sidebarType:
        siteConfig.layout === "semibox" ? "popover" : siteConfig.sidebarType,
      setSidebarType: (value) => {
        set({ sidebarType: value });
      },
      subMenu: false,
      setSubmenu: (value) => set({ subMenu: value }),
      // background image
      sidebarBg: siteConfig.sidebarBg,
      setSidebarBg: (value) => set({ sidebarBg: value }),
      mobileMenu: false,
      setMobileMenu: (value) => set({ mobileMenu: value }),
    }),
    { name: "sidebar-store", storage: createJSONStorage(() => localStorage) }
  )
);

export const useTextStore = create((set) => ({
  id: "",
  setId: (id: string) => set({ id }),
  name: "",
  setName: (name: string) => set({ name }),
  lastName: "",
  setLastName: (lastName: string) => set({ lastName }),
  identityDocumentUrl: "",
  email: "",
  setEmail: (email: string) => set({ email }),
  setIdentityDocumentUrl: (identityDocumentUrl: string) =>
    set({ identityDocumentUrl }),
  driverLicenseUrl: "",
  setDriverLicenseUrl: (driverLicenseUrl: string) => set({ driverLicenseUrl }),
  criminalRecordUrl: "",
  setCriminalRecordUrl: (criminalRecordUrl: string) =>
    set({ criminalRecordUrl }),
  vehicleId: "",
  setVehicleId: (vehicleId: string) => set({ vehicleId }),
  profilePictureUrl: "",
  setProfilePictureUrl: (profilePictureUrl: string) =>
    set({ profilePictureUrl }),
}));
