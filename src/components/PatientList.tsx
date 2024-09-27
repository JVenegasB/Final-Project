import { useMemo, useState } from "react";
import { DataFunnelRegular } from '@fluentui/react-icons';
import { Avatar, Menu, MenuTrigger, Button, MenuPopover, MenuList, MenuItem, Divider } from "@fluentui/react-components";
import { PatientSummary } from '../types/types.ts';

interface Props {
    setSelectedPatient: (patient: PatientSummary | null) => void;
    patientData: PatientSummary[] | undefined;
}

type Evolution = {
    attendedDate: string,
    motive: string,
    currentIllness: string,
    physicalExam: string,
    diagnosis: string,
    plan: string,
    alternative: {
        isAlternative: boolean,
        therapy: string | null,
    },
}

export default function PatientList({ setSelectedPatient, patientData }: Props) {

    const [handleFilter, setHandleFilter] = useState<string>('Nombre');
    const [handleSelectedFilder, setHandleSelectedFilter] = useState(false);

    const handleFilterButton = (input: string) => {
        setHandleFilter(input);
    }

    const handleOpenChange = (isOpen: boolean) => {
        setHandleSelectedFilter(isOpen);
    };

    const getLastSession = (patient: Evolution[]) => {
        if (patient.length === 0) {
            return 'N/A';
        }

        const latestDate = new Date(
            Math.max(...patient.map(e => new Date(e.attendedDate).getTime()))
        );
        return latestDate.toISOString().split('T')[0];
    };

    const [searchElement, setSearchElement] = useState<string>('');
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchElement(e.target.value);
    }
    const filterPatients = useMemo(() => {
        console.log(searchElement);
        if (searchElement === '') {
            console.log('No search element');
            return patientData;
        }
        return patientData?.filter((patient) => {
            if (handleFilter === 'Nombre') {
                return patient.personalData.name.toLowerCase().includes(searchElement.toLowerCase());
            } else if (handleFilter === 'Cedula') {
                return patient.personalData.identification.toLowerCase().includes(searchElement.toLowerCase());
            } else if (handleFilter === 'fecha') {
                const [year, month] = searchElement.split('-');

                const lastSession = getLastSession(patient.evolution);
                const [lastYear, lastMonth] = lastSession.split('-'); 
                return year === lastYear && month === lastMonth;
            }
        });
    }, [searchElement, handleFilter, patientData]);

    return (
        <div className="border-black border-2 rounded-xl">
            <div className="flex flex-row items-center w-full  border-b-2 border-black h-12">
                <div className="w-2/12 flex justify-center">
                    {handleFilter}
                </div>
                <div className="w-8/12 px-2 py-1 border-x-2 border-black">
                    {handleFilter === 'fecha' ? (
                        <div className="flex flex-row w-full">
                            <input
                                className="w-full bg-customButton rounded-md p-2"
                                type='Date'
                                placeholder="Buscar paciente..."
                                onChange={handleSearch}
                            />
                        </div>
                    ) : (
                        <input
                            className="w-full bg-customButton rounded-md p-2"
                            type='text'
                            placeholder={`Buscar paciente por ${handleFilter} ...`}
                            value={searchElement}
                            onChange={handleSearch}
                        />
                    )}
                </div>
                <div className={`w-2/12 px-2 py-1 rounded-tr-xl border-black flex justify-center items-center h-full font-roboto font-bold text-xl ${handleSelectedFilder ? "bg-blue-600 text-white" : "hover:bg-customHover"}`}>
                    <Menu onOpenChange={(_e, data) => handleOpenChange(data.open)}>
                        <MenuTrigger>
                            <Button className="w-2/12 flex justify-center">
                                <DataFunnelRegular />
                            </Button>
                        </MenuTrigger>
                        <MenuPopover>
                            <MenuList className="bg-customBg border-2 border-black p-2 font-openSans font-semibold">
                                <MenuItem >
                                    <div className="hover:bg-blue-600 hover:text-white" onClick={() => handleFilterButton('Nombre')}>
                                        Nombre
                                    </div>
                                </MenuItem>
                                <Divider className="h-0" />
                                <MenuItem>
                                    <div className="hover:bg-blue-600 hover:text-white" onClick={() => handleFilterButton('Cedula')}>
                                        Cedula
                                    </div>
                                </MenuItem>
                                <Divider style={{ borderWidth: '1px', fontWeight: 'bold' }} />
                                <MenuItem>
                                    <div className="hover:bg-blue-600 hover:text-white" onClick={() => handleFilterButton('fecha')}>
                                        <button>Fecha de ultima consulta</button>
                                    </div>
                                </MenuItem>
                            </MenuList>
                        </MenuPopover>
                    </Menu>
                </div>
            </div>

            <div className="max-h-[79vh] overflow-y-auto">
                {filterPatients !== undefined && filterPatients.map((patient, index) => (
                    <div
                        key={index}
                        className="flex flex-row items-center border-black border-t-2 py-4 justify-around cursor-pointer hover:bg-customHover"
                        onClick={() => setSelectedPatient(patient)}
                    >
                        <div className="w-1/6 flex justify-center items-center">
                            <Avatar className="w-12 h-12" />
                        </div>
                        <div className="flex flex-col justify-start w-3/6 px-4">
                            <div className="text-xl font-semibold">
                                {patient.personalData.name}
                            </div>
                            <div className="text-sm text-gray-600">
                                CI: {patient.personalData.identification}
                            </div>
                        </div>
                        <div className="flex flex-col w-2/6 px-4">
                            <div>
                                Primera consulta: {patient.personalData.firstSession}
                            </div>
                            <div>
                                Última consulta: {getLastSession(patient?.evolution)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
