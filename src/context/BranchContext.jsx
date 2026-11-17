import { useState } from "react";
import { branches } from "../data/branches";
import {
  getSelectedBranchId,
  saveSelectedBranchId,
} from "../services/branchService";
import { BranchContext } from "./BranchContextValue";

export function BranchProvider({ children }) {
  const [selectedBranchId, setSelectedBranchId] = useState(getSelectedBranchId);
  const selectedBranch =
    branches.find((branch) => branch.id === selectedBranchId) || branches[0];

  const selectBranch = (branchId) => {
    saveSelectedBranchId(branchId);
    setSelectedBranchId(branchId);
  };

  return (
    <BranchContext.Provider
      value={{ branches, selectedBranch, selectBranch }}
    >
      {children}
    </BranchContext.Provider>
  );
}
