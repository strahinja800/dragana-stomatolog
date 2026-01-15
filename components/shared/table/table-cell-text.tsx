interface TableCellTextProps {
  value: React.ReactNode;
}

export function TableCellText({ value }: TableCellTextProps) {
  return <span className="font-medium ml-5">{value}</span>;
}
