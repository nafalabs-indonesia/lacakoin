"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

type LayoutContextType = {
    isFooterVisible: boolean;
    isNavbarVisible: boolean;
};

const LayoutContext = createContext<LayoutContextType>({
    isFooterVisible: true,
    isNavbarVisible: true,
});

export function LayoutProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isFooterVisible, setIsFooterVisible] = useState(true);
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);

    useEffect(() => {
        // Sembunyikan footer di halaman trade
        const isTradePage = pathname.startsWith("/trade");
        setIsFooterVisible(!isTradePage);
        setIsNavbarVisible(true);
    }, [pathname]);

    return (
        <LayoutContext.Provider value={{ isFooterVisible, isNavbarVisible }}>
            {children}
        </LayoutContext.Provider>
    );
}

export const useLayout = () => useContext(LayoutContext);