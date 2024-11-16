import { Textarea, Label } from '@fluentui/react-components';

interface InputFieldToCompleteProps {
    input: string | undefined;
    isComplete: boolean;
    label: string;
    handleDataChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    id?: string;
    placeholder?: string;
}

export default function TextFieldToComplete({ input, isComplete, label, handleDataChange, id,placeholder }: InputFieldToCompleteProps) {
    return (
        <div>
            {isComplete ? (
                <div className='flex lg:flex-row flex-col w-full'>
                    <Label className="mb-2 mr-2 font-semibold">{label}:</Label>
                    <p>{input ?? ''}</p>
                </div>
            ) : (
                <div className='flex flex-col '>
                    <Label className="mb-2 mr-2 font-semibold">{label}</Label>
                    <Textarea 
                        value={input ?? ''} 
                        onChange={handleDataChange} 
                        name={id} 
                        id={id}
                        className='w-full'
                        placeholder={placeholder}
                    />
                </div>
            )}
        </div>
    );
}
