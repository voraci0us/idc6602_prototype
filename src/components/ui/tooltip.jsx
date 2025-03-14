import * as Tooltip from "@radix-ui/react-tooltip";

export function TooltipProvider({ children }) {
  return <Tooltip.Provider>{children}</Tooltip.Provider>;
}

export function TooltipTrigger({ children, ...props }) {
  return <Tooltip.Trigger {...props}>{children}</Tooltip.Trigger>;
}

export function TooltipContent({ children }) {
  return (
    <Tooltip.Portal>
      <Tooltip.Content className="bg-gray-900 text-white text-sm px-3 py-2 rounded-md shadow-lg">
        {children}
      </Tooltip.Content>
    </Tooltip.Portal>
  );
}

