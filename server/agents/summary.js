export const summaryAgent = async (inputs) => {
  return {
    claimant: inputs.claimant || "Unknown",
    extracted: inputs.extracted || "",
    missing: inputs.missing,
    fraudRisk: inputs.fraud,
    routing: inputs.routing
  };
};
