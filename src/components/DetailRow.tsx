interface DetailRowProps {
    label: string;
    value?: string | number | null;
    spanFull?: boolean;
  }
  
export default function DetailRow({ label, value, spanFull = false }: DetailRowProps) {
    return (
      <div className={`flex flex-row items-center justify-start ${spanFull ? 'lg:col-span-2' : ''}`}>
        <div className="font-semibold font-roboto mr-2">{label}:</div>
        <span>{value || '-'}</span>
      </div>
    );
  }
  