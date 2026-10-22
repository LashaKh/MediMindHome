import React, { useCallback, useEffect, useRef, useState } from "react";
import { AccountDetail, type DetailProps } from "./AccountDetail";
import { useEscape } from "./useEscape";

type Props = Omit<DetailProps, "wide" | "onDirtyChange" | "onClose"> & { onClose: () => void };

/** Side panel for one hospital. Asks before closing over unsaved typing. */
export const AccountDrawer: React.FC<Props> = ({ onClose, ...rest }) => {
  const [dirty, setDirty] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const panel = useRef<HTMLElement>(null);

  const requestClose = useCallback(() => {
    if (dirty) setConfirming(true);
    else onClose();
  }, [dirty, onClose]);
  useEscape(requestClose);

  useEffect(() => {
    panel.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div
      className="crm-drawer-bg"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      <aside ref={panel} className="crm-drawer" role="dialog" aria-modal="true" aria-label={rest.account.name} tabIndex={-1}>
        {confirming && (
          <div className="crm-discard" role="alert">
            <span>You have unsaved changes on this hospital.</span>
            <button className="adm-btn adm-btn-ghost crm-small" onClick={() => setConfirming(false)}>Keep editing</button>
            <button className="adm-btn crm-small" onClick={onClose}>Discard and close</button>
          </div>
        )}
        <AccountDetail {...rest} onDirtyChange={setDirty} onClose={requestClose} />
      </aside>
    </div>
  );
};
