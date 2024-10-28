import React from 'react';
import { Label, Input } from '@fluentui/react-components';

interface InputFieldWithIconProps {
    label?: string;
    id: string;
    type?: "number" | "text" | 'date'; 
    placeholder:string;
    handleDatachange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: JSX.Element;
    value: string;
    
}

export default function InputFieldWithIcon({ label, id, type = 'text',placeholder,handleDatachange,icon,value }: InputFieldWithIconProps) {
    return (
        <div  className='flex flex-col space-y-1 '>
            {label && <Label htmlFor={id}>{label}</Label>}
            <Input
                id={id}
                name={id}
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={handleDatachange}
                contentBefore={icon ? icon : undefined}
            />
        </div>
    );
}
