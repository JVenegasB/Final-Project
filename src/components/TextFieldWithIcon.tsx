import React from 'react'
import { Label, Textarea } from '@fluentui/react-components';

interface TextFieldWithIconProps {
    label?: string;
    id: string;
    placeholder: string;
    handleDatachange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    value: string;
}

export default function TextFieldWithIcon({ label, id, placeholder, handleDatachange, value }: TextFieldWithIconProps) {
    return (
        <div className='flex flex-col'>
            {label && <Label htmlFor={id}>{label}</Label>}
            <Textarea
                id={id}
                name={id}
                value={value}
                placeholder={placeholder}
                onChange={handleDatachange}
                resize='vertical'
            />
        </div>
    )
}
