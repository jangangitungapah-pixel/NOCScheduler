import type {
  HTMLAttributes,
  ReactNode,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

import { cx } from "@/lib/ui/cx";

type Align = "left" | "center" | "right";

type TableProps = TableHTMLAttributes<HTMLTableElement> & {
  caption?: string;
  children: ReactNode;
};

export function DataTable({ caption, children, className, ...props }: TableProps) {
  return (
    <div className="ui-table-wrap">
      <table className={cx("ui-table", className)} {...props}>
        {caption ? <caption>{caption}</caption> : null}
        {children}
      </table>
    </div>
  );
}

type HeadCellProps = ThHTMLAttributes<HTMLTableCellElement> & {
  align?: Align;
  sticky?: boolean;
};

export function HeadCell({ align = "left", sticky, ...props }: HeadCellProps) {
  return <th data-align={align} data-sticky={sticky || undefined} scope="col" {...props} />;
}

type DataCellProps = TdHTMLAttributes<HTMLTableCellElement> & {
  align?: Align;
};

export function DataCell({ align = "left", ...props }: DataCellProps) {
  return <td data-align={align} {...props} />;
}

type DataRowProps = HTMLAttributes<HTMLTableRowElement> & {
  selected?: boolean;
};

export function DataRow({ selected, ...props }: DataRowProps) {
  return <tr data-selected={selected || undefined} {...props} />;
}

export function TableEmpty({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td className="ui-table__empty" colSpan={colSpan}>
        {children}
      </td>
    </tr>
  );
}
