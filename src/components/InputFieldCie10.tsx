import React from 'react';
import { Input, Button, Menu, MenuTrigger, MenuList, MenuGroupHeader, MenuPopover, MenuItem, useToastController, Toast, ToastTitle, ToastBody,  ToastIntent } from '@fluentui/react-components';
import { client } from '../supabase/client';

interface cie10CodeRequest {
    codigo: string;
    descripcion: string;
}

interface InputFieldCie10Props {
    id: string;
    placeholder: string;
    value: string;
    handleDatachange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCie10Change: (e: React.ChangeEvent<HTMLInputElement>) => void;
    cieValue: string;
}

export default function InputFieldCie10({ id, placeholder, value, handleDatachange, handleCie10Change, cieValue, }: InputFieldCie10Props) {
    //Toaster
    const { dispatchToast } = useToastController("global-toaster");
    const showToast = (title: string, description: string, intent: ToastIntent) => {
        dispatchToast(
            <Toast>
                <ToastTitle >{title}</ToastTitle>
                <ToastBody>{description}</ToastBody>

            </Toast>,
            { position: "top-end", intent }
        )
    }
    const [cie10CodeDescriptions, setCie10CodeDescriptions] = React.useState<cie10CodeRequest[]>([]);

    const fetchCie10Codes = async (query: string) => {
        if (cie10CodeDescriptions.length > 0) return;
        try {
            const { data, error } = await client.functions.invoke(`getcie10?query=${query}`, {
                method: 'GET',
            })
            if (error) {
                showToast('Error', 'No pudimos obtener las opciones de CIE10', 'error');
                return;
            }
            setCie10CodeDescriptions(data);
        } catch (err) {
            console.error('Error fetching CIE10 codes:', err);
            showToast('Error', 'No pudimos obtener las opciones de CIE10', 'error');
        }
    };

    // Handles selecting a CIE10 code
    const handleCie10Selected = (code: string, description: string) => {
        handleDatachange({ target: { value: description } } as React.ChangeEvent<HTMLInputElement>);
        handleCie10Change({ target: { value: code } } as React.ChangeEvent<HTMLInputElement>);
    };

    return (
        <div className="grid grid-cols-4">
            <Input
                placeholder={placeholder}
                id={id}
                name={id}
                value={value}
                onChange={handleDatachange}
                className="col-span-2"
            />
            <Menu>
                <MenuTrigger>
                    <Button
                        disabled={value === ''}
                        onClick={() => (cie10CodeDescriptions.length < 1 ? fetchCie10Codes(value) : null)}
                    >
                        CIE10
                    </Button>
                </MenuTrigger>
                <MenuPopover>
                    <MenuList>
                        {cie10CodeDescriptions.length > 0 ? (
                            <>
                                <MenuGroupHeader>Elige el código correcto</MenuGroupHeader>
                                {cie10CodeDescriptions.map((element, index) => (
                                    <MenuItem
                                        key={index}
                                        secondaryContent={element.codigo}
                                        onClick={() => handleCie10Selected(element.codigo, element.descripcion)}
                                    >
                                        {element.descripcion}
                                    </MenuItem>
                                ))}
                            </>
                        ) : (
                            <MenuGroupHeader>Obteniendo códigos</MenuGroupHeader>
                        )}
                    </MenuList>
                </MenuPopover>
            </Menu>
            <Input
                placeholder="Código CIE10"
                id={`${id}-cie10`}
                name={`${id}-cie10`}
                value={cieValue}
                disabled={value === ''}
                onChange={handleCie10Change}
            />
        </div>
    );
}
