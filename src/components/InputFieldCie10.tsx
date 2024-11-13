import React from 'react';
import {
    Input,
    Button,
    Menu,
    MenuTrigger,
    MenuList,
    MenuGroupHeader,
    MenuPopover,
    MenuItem,
} from '@fluentui/react-components';

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

export default function InputFieldCie10({
    id,
    placeholder,
    value,
    handleDatachange,
    handleCie10Change,
    cieValue,
}: InputFieldCie10Props) {
    const [cie10CodeDescriptions, setCie10CodeDescriptions] = React.useState<cie10CodeRequest[]>([]);

    const fetchCie10Codes = async (query: string) => {
        const url = `http://127.0.0.1:54321/functions/v1/getcie10?query=${query}`;
        if (cie10CodeDescriptions.length > 0) return;

        console.log(url);
        try {
            const res = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            setCie10CodeDescriptions(data);
        } catch (err) {
            console.error('Error fetching CIE10 codes:', err);
            //Manejar error desde aca -> Algo como 'Error, no pudimos obtener las opciones de CIE10'
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
                        onClick={() => (cie10CodeDescriptions.length < 1 ? fetchCie10Codes(value) : console.log('Already fetched'))}
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
