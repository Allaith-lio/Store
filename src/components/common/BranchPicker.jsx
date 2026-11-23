import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Clock, MapPin } from "lucide-react";
import { useBranch } from "../../context/useBranch";
import { useShoppingCart } from "../../context/useShoppingCart";
import { useToast } from "../../context/useToast";
import { isBranchOpen } from "../../services/branchService";

export default function BranchPicker() {
  const { branches, selectedBranch, selectBranch } = useBranch();
  const { clampCartToBranch } = useShoppingCart();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = async (branch) => {
    selectBranch(branch.id);
    try {
      const cartChanged = await clampCartToBranch(branch.id);
      showToast(
        cartChanged
          ? `Switched to ${branch.name}. Some cart items were adjusted to its stock.`
          : `Switched to ${branch.name}`,
      );
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to update cart.");
    }
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Branch: ${selectedBranch.name}. Change branch`}
        className="inline-flex h-11 max-w-48 shrink-0 cursor-pointer items-center gap-2 rounded-control border border-line bg-page px-3 text-sm font-semibold text-ink transition-colors hover:border-primary"
      >
        <MapPin size={17} className="shrink-0 text-primary" />
        <span className="hidden truncate min-[480px]:inline">
          {selectedBranch.name}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose your branch"
          className="fixed inset-x-4 top-20 z-50 rounded-card border border-line bg-surface p-2 shadow-raised sm:absolute sm:inset-x-auto sm:left-0 sm:top-full sm:mt-2 sm:w-96"
        >
          <p className="px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-wide text-muted">
            Choose your branch
          </p>

          <ul>
            {branches.map((branch) => {
              const active = branch.id === selectedBranch.id;
              const openNow = isBranchOpen(branch);

              return (
                <li key={branch.id}>
                  <button
                    type="button"
                    onClick={() => choose(branch)}
                    className={`flex w-full cursor-pointer items-start gap-3 rounded-control p-3 text-left transition-colors hover:bg-page ${
                      active ? "bg-page ring-1 ring-primary" : ""
                    }`}
                  >
                    <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-ink">
                          {branch.name}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            openNow
                              ? "bg-success/10 text-success-text"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {openNow ? "Open now" : "Closed"}
                        </span>
                      </span>
                      <span className="mt-0.5 block text-xs text-muted">
                        {branch.address}
                      </span>
                      <span className="mt-1 flex items-center gap-1 text-xs text-muted">
                        <Clock className="size-3.5" />
                        {branch.hours}
                      </span>
                    </span>

                    {active && (
                      <Check className="size-5 shrink-0 text-primary" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}