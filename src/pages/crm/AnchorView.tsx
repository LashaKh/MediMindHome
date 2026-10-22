import React from "react";
import type { Account } from "../../data/crm";
import { AccountDetail, type DetailProps } from "./AccountDetail";

type Props = Omit<DetailProps, "account" | "wide" | "onClose" | "onDirtyChange"> & { anchors: Account[] };

/** Signed anchor customers: onboarding, not new sales. Never counted in the pipeline. */
export const AnchorView: React.FC<Props> = ({ anchors, ...rest }) =>
  anchors.length === 0 ? (
    <div className="crm-empty">
      <p>No anchor customer yet. A signed customer whose rollout you track lives here.</p>
    </div>
  ) : (
    <div className="crm-anchor">
      <p className="crm-section-sub">
        Signed customers being rolled out. Kept out of the pipeline so new-hospital numbers stay honest.
      </p>
      {anchors.map((a) => (
        <section key={a.id} className="crm-anchor-card">
          <AccountDetail account={a} wide {...rest} />
        </section>
      ))}
    </div>
  );
