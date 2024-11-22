import { Label, Input } from '@fluentui/react-components';
interface InputWithLabelProps {
    id: string;
    name: string;
    type?: "text" | "password" | "email" | "number";
    value: string;
    placeholder: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onInvalid?: (e: React.InvalidEvent<HTMLInputElement>) => void;
    contentAfter?: JSX.Element;
    error?: string;
    touched?: boolean;
    autocomplete?: string;
}

export default function InputWithLabel({
    id,
    name,
    type = 'text',
    value,
    placeholder,
    required = false,
    onChange,
    onInvalid,
    contentAfter,
    error,
    touched,
    autocomplete
}: InputWithLabelProps) {
    return (
        <div>
            <Label htmlFor={id} className="sr-only">
                {placeholder}
            </Label>
            <Input
                id={id}
                name={name}
                type={type}
                value={value}
                placeholder={placeholder}
                required={required}
                onChange={onChange}
                onInvalid={onInvalid}
                contentAfter={contentAfter}
                autoComplete={autocomplete}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
            />
            {touched && error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
}
