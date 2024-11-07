import React from 'react'
import {
    Input,
    Button,
    Menu,
    MenuTrigger,
    MenuList,
    MenuGroupHeader,
    MenuPopover,
    MenuItem,
} from '@fluentui/react-components'

interface cie10CodeRequest {
    codigo: string,
    descripcion: string,
}
interface InputFieldCie10Props {
    id: string,
    placeholder: string,
    value: string,
    handleDatachange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleCie10Change: (e: React.ChangeEvent<HTMLInputElement>) => void,
    cieValue: string,
}
export default function InputFieldCie10({ id, placeholder, value, handleDatachange, handleCie10Change, cieValue }: InputFieldCie10Props) {
    const [cie10CodeDescriptions, setCie10CodeDescriptions] = React.useState<cie10CodeRequest[]>([]);

    

    const fetchCie10Codes = async (query: string) => {
        const url = `http://127.0.0.1:54321/functions/v1/getcie10?query=${query}`
        if (cie10CodeDescriptions.length > 0) {
            return
        }
        console.log(url)
        try {
            const res = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            try {
                data.forEach((element: cie10CodeRequest) => {
                    setCie10CodeDescriptions((prev) => [...prev, element])
                })
            } catch (err) {
                console.error('err', err);
                console.log('Error, intente de nuevo o ingrese el codigo a mano')
            }
        } catch (err) {
            console.error('err', err);

        }
    };

    const handlecie10Selected = () =>{
        console.log('cie10 selected')
    }

    return (
        <div className='grid grid-cols-4'>
            <Input
                placeholder={placeholder}
                id={id}
                name={id}
                value={value}
                onChange={handleDatachange}
                className='col-span-2'
            />
            <Menu>
                <MenuTrigger>
                    <Button disabled={value === ''} onClick={() => (cie10CodeDescriptions.length<1 ? fetchCie10Codes(value):console.log('already Fetched'))}>CIE10</Button>
                </MenuTrigger>
                <MenuPopover>
                    <MenuList>

                        {(cie10CodeDescriptions && cie10CodeDescriptions.length > 0) ?
                            <>
                                <MenuGroupHeader>Elige el codigo correcto</MenuGroupHeader>
                                {cie10CodeDescriptions.map((element, index) => {
                                    return (
                                        <div key={index}>

                                            <MenuItem
                                                secondaryContent={element.codigo}
                                                onClick={()=>handlecie10Selected}
                                            >
                                                {element.descripcion}
                                            </MenuItem>
                                        </div>
                                    )
                                })}

                            </> : <MenuGroupHeader>Obteniendo codigos</MenuGroupHeader>}
                    </MenuList>

                </MenuPopover>
            </Menu>
            <Input
                placeholder='Codigo Cie10'
                id={id}
                name={id}
                value={cieValue}
                disabled={value === ''}
                onChange={handleCie10Change}
            />
        </div>
    )
}
