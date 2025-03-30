import React, { useEffect, useRef } from 'react'
import { Label, Textarea } from '@fluentui/react-components';

interface TextFieldWithIconProps {
    label?: string;
    id: string;
    placeholder: string;
    handleDatachange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    value: string;
}

export default function TextFieldWithIcon({ label, id, placeholder, handleDatachange, value }: TextFieldWithIconProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto"; 
            textarea.style.height = `${textarea.scrollHeight}px`; 
        }
    }, [value]);
    return (
        <div className='flex flex-col'>
            {label && <Label htmlFor={id}>{label}</Label>}
            <Textarea
                ref={textareaRef}
                id={id}
                name={id}
                value={value}
                placeholder={placeholder}
                onChange={handleDatachange}
                resize='vertical'
                style={{ resize: "none", overflow: "hidden" }} 
            />
        </div>
    )
}
