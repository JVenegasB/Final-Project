interface DetailGridRowProps {
    label: string;
    value: string | number | null | undefined;
    customClasses?: string; // To handle unique border configurations
  }
  
export const DetailGridRow: React.FC<DetailGridRowProps> = ({ label, value, customClasses = '' }) => (
    <div className={`grid grid-cols-2 border-2 ${customClasses}`}>
      <div className="font-semibold font-roboto">{label}</div>
      <div>{value !== undefined && value !== null ? value : 'N/A'}</div>
    </div>
  );
  