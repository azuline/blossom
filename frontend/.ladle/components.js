import { jsx as _jsx } from "react/jsx-runtime";
import { useLadleContext } from "@ladle/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DEFAULT_MOCK_RPC_OUTPUT, mockRPCsWorker } from "@foundation/testing";
import { LayoutPaddingVariableSetter } from "@foundation/layout";
import { ThemeProvider } from "@foundation/theme";
import { View } from "@foundation/ui";
const queryClient = new QueryClient();
// Set up MSW with dummy endpoints.
mockRPCsWorker(DEFAULT_MOCK_RPC_OUTPUT);
export const Provider = ({ children }) => {
    const { globalState } = useLadleContext();
    const theme = globalState.theme === "light" || globalState.theme === "dark"
        ? globalState.theme
        : undefined;
    return (_jsx(ThemeProvider, { force: theme, children: _jsx(LayoutPaddingVariableSetter, { children: _jsx(View, { sx: { display: "flex", h: "full", w: "full", direction: "column" }, children: _jsx(QueryClientProvider, { client: queryClient, children: children }) }) }) }));
};
//# sourceMappingURL=components.js.map