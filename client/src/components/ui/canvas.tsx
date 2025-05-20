import * as React from "react";
import { cn } from "@/lib/utils";

type CanvasProps = React.HTMLAttributes<HTMLCanvasElement> & {
  ref?: React.RefObject<HTMLCanvasElement>;
};

const Canvas = React.forwardRef<HTMLCanvasElement, CanvasProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <canvas
        ref={ref}
        className={cn("block w-full h-full", className)}
        {...props}
      />
    );
  }
);

Canvas.displayName = "Canvas";

export { Canvas };
