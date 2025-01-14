import { Input, Label } from '@fluentui/react-components';

interface InputFieldToCompleteProps {
    input: string | undefined;
    isComplete?: boolean;
    type: "text" | "number" | "date";
    label: string;
    handleDataChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id?: string;
}

export default function InputFieldToComplete({ input, isComplete, type, label, handleDataChange, id }: InputFieldToCompleteProps) {
    return (
        <div>
            {/* {(isComplete) ? (
                <div className='flex flex-col '>
                    <Label className="mb-2 mr-2 font-semibold">{label}:</Label>
                    <p >{input ?? ''}</p>
                </div>
            ) : (
                <div className='flex flex-col '>
                    <Label className="mb-2 mr-2 font-semibold">{label}</Label>
                    <Input value={input ?? ''} type={type} onChange={handleDataChange} name={id} id={id} className='w-full'/>
                </div>
            )} */}
            <div className='flex flex-col '>
                <Label className="mb-2 mr-2 font-semibold">{label}</Label>
                <Input value={input ?? ''} type={type} onChange={handleDataChange} name={id} id={id} className='w-full' appearance={`${isComplete ? 'filled-lighter':'outline'}`}/>
            </div>
        </div>
    );
}