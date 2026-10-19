import { defineRailway, github, project, service } from "railway/iac";

export default defineRailway(() => {
  // Root directory stays empty: the image COPYs ../src/data and ../src/types.
  const mcp = service("mcp", {
    source: github("laikahkeen/laikahkeen", { branch: "master" }),
    build: {
      builder: "DOCKERFILE",
      dockerfilePath: "mcp/Dockerfile",
      // src/data changes what the tools return, so it redeploys the server too.
      watchPatterns: ["/mcp/**", "/src/data/**", "/src/types/**"],
    },
    deploy: { restartPolicyType: "ALWAYS" },
    env: { PORT: "8080" },
  });

  return project("laikahkeen", { resources: [mcp] });
});
