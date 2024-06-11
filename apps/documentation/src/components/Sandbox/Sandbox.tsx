import { useState } from "react";

import classes from "./Sandbox.module.css";

type SandboxProps = {
  source: string;
  name: string;
};

export const Sandbox = ({ name, source }: SandboxProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={classes.sandbox}>
      {isLoading && (
        <div className={classes.loaderContainer}>
          <span className={classes.loader} />
        </div>
      )}
      <iframe
        src={source}
        width="100%"
        height="100%"
        onLoad={() => setIsLoading(false)}
        title={name}
      />
    </div>
  );
};
