import React from "react";
import { type Flag, initials, STATUS_LABEL, type StatusId } from "../../data/crm";

export const StatusTag: React.FC<{ status: StatusId | null }> = ({ status }) => (
  <span className={`crm-status crm-status--${status ?? "none"}`}>
    <i aria-hidden="true" />
    {status ? STATUS_LABEL[status] : "No status"}
  </span>
);

export const Owner: React.FC<{ name: string | null }> = ({ name }) => (
  <span className={`crm-owner${name ? "" : " crm-owner--none"}`} title={name ? `Owner: ${name}` : "No owner yet"}>
    {name ? initials(name) : "?"}
  </span>
);

export const FlagText: React.FC<{ flag: Flag }> = ({ flag }) => (
  <span className={`crm-flag crm-flag--${flag.tone}`}>{flag.label}</span>
);
