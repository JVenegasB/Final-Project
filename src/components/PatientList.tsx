import { useEffect, useMemo, useState } from "react";
import { TableColumnDefinition,Menu, createTableColumn, useTableFeatures, useTableSort, TableColumnId, Table, TableHeader, TableHeaderCell, TableRow, TableBody, TableCell, TableCellLayout, Button, Avatar, Label, Select, Input, MenuButton, MenuItem, MenuList, MenuPopover, MenuTrigger } from "@fluentui/react-components";
import { PatientMainData } from '../types/types.ts';
import { ArrowDownload28Regular, DocumentAdd28Regular, Eye28Regular } from '@fluentui/react-icons';

interface Props {
    patientData: PatientMainData[];
    setAddEvolutionComponent: (value: string) => void;
    fatherSetSelectedPatient: (value: number) => void;
    setExportType: (value: string) => void;
    setSelectedPatient: (value: PatientMainData) => void;
    fetchPatientAndExport: (patient_id: number) => void;
}

const columns: TableColumnDefinition<PatientMainData>[] = [
    createTableColumn<PatientMainData>({
        columnId: 'name',
        compare: (a, b) => a.name.localeCompare(b.name),
    }),
    createTableColumn<PatientMainData>({
        columnId: 'identification',
        compare: (a, b) => a.id.localeCompare(b.id),
    }),
    createTableColumn<PatientMainData>({
        columnId: 'lastSession',
        compare: (a, b) => a.last_session.localeCompare(b.last_session),
    }),
    createTableColumn<PatientMainData>({
        columnId: 'firstSession',
        compare: (a, b) => a.first_session.localeCompare(b.first_session),
    }),
];

export default function PatientList({ patientData,setAddEvolutionComponent,fatherSetSelectedPatient,setExportType,setSelectedPatient,fetchPatientAndExport }: Props) {
    const [handleFilter, setHandleFilter] = useState<string>('name');

    const handleFilterButton = (input: string) => {
        setHandleFilter(input);
    }
    const [searchElement, setSearchElement] = useState<string>('');
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchElement(e.target.value);
    }
    const filterPatients = useMemo(() => {
        if (searchElement === '') {
            return patientData;
        }
        return patientData?.filter((patient) => {
            if (handleFilter === 'name') {
                return patient.name.toLowerCase().includes(searchElement.toLowerCase());
            } else if (handleFilter === 'personalId') {
                return patient.id.toLowerCase().includes(searchElement.toLowerCase());
            } else if (handleFilter === 'firstSession') {
                return patient.first_session.split("-")[1].includes(searchElement.split("-")[1]);
            } else if (handleFilter === 'lastSession') {
                return patient.last_session.split("-")[1].includes(searchElement.split("-")[1]);
            }
        });
    }, [searchElement, handleFilter, patientData]);
    useEffect(() => {
        setSearchElement('');
    }, [handleFilter])
    const {
        getRows,
        sort: { getSortDirection, toggleColumnSort, sort },
    } = useTableFeatures(
        {
            columns,
            items: filterPatients,
        },
        [
            useTableSort({
                defaultSortState: { sortColumn: "name", sortDirection: "ascending" },
            }),
        ]
    );

    const headerSortProps = (columnId: TableColumnId) => ({
        onClick: (e: React.MouseEvent) => {
            toggleColumnSort(e, columnId);
        },
        sortDirection: getSortDirection(columnId),
    });

    const rows = sort(getRows());

    const handlePatientSelection = (patient: PatientMainData) => {
        console.log("Oacuebte sekeccuibadi", patient);
        fatherSetSelectedPatient(patient.patient_id);
    }
    const handleAddEvolution = (patient: PatientMainData) => {
        setAddEvolutionComponent("evolution");
        setSelectedPatient(patient);
    }
    const handleExportPdfSummary = (patient: PatientMainData) => {
        setAddEvolutionComponent("export");
        fetchPatientAndExport(patient.patient_id);
        setExportType("resumen");
    }
    const handleExportPdfComplete = (patient: PatientMainData) => {
        setAddEvolutionComponent("export");
        fetchPatientAndExport(patient.patient_id);
        setExportType("completo");
    }
    return (
        <div className='flex flex-col h-full w-full px-5'>
            <div className="flex lg:flex-row flex-col w-full">
                <div className="flex flex-row items-center my-3">
                    <Label htmlFor="searchBy" className="mr-2 font-roboto">Buscar por: </Label>
                    <Select
                        id="searchBy"
                        onChange={(e) => handleFilterButton(e.target.value)}
                        value={handleFilter}
                        className="font-lato"
                    >
                        <option value="name">Nombre</option>
                        <option value="personalId">Cedula</option>
                        <option value="firstSession">Fecha de primera consulta</option>
                        <option value="lastSession">Fecha de ultima consulta</option>
                    </Select>
                </div>
                <div className="flex items-center lg:ml-5 font-lato">
                    {(handleFilter === 'firstSession' || handleFilter === 'lastSession') ? (
                        <div className="flex flex-row w-full">
                            <Input
                                className="rounded-md p-2 w-60"
                                type='date'
                                placeholder="Buscar paciente..."
                                onChange={handleSearch}
                                value={searchElement}
                            />
                        </div>
                    ) : (
                        <Input
                            className="rounded-md p-2 w-72"
                            type='text'
                            placeholder={`Buscar paciente ...`}
                            value={searchElement}
                            onChange={handleSearch}
                        />
                    )}
                </div>
            </div>
            
            <div className="flex-grow overflow-x-auto">
                <Table sortable className="mt-5 min-w-full">
                    <TableHeader className="font-roboto font-semibold">
                        <TableRow appearance="neutral">
                            <TableHeaderCell className="w-16"></TableHeaderCell>
                            <TableHeaderCell className="w-44" {...headerSortProps("name")}>
                                Nombre
                            </TableHeaderCell>
                            <TableHeaderCell className="w-36" {...headerSortProps("identification")}>
                                Cedula
                            </TableHeaderCell>
                            <TableHeaderCell className="w-48" {...headerSortProps("firstSession")}>
                                Fecha de primera consulta
                            </TableHeaderCell>
                            <TableHeaderCell className="w-48" {...headerSortProps("lastSession")}>
                                Fecha de ultima consulta
                            </TableHeaderCell>
                            <TableHeaderCell className="w-36">

                            </TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="font-openSans">
                        {rows.map(({ item }, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <div className="flex items-center justify-center">
                                        <Avatar name={item.name} />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <TableCellLayout>
                                        {item.name}
                                    </TableCellLayout>
                                </TableCell>
                                <TableCell>
                                    {item.id}
                                </TableCell>
                                <TableCell>
                                    {item.first_session}
                                </TableCell>
                                <TableCell>
                                    {item.last_session}
                                </TableCell>
                                <TableCell>
                                    
                                    <div className="flex flex-col py-2">
                                        {/* ver detalles de historia */}
                                        <Button
                                            onClick={() => handlePatientSelection(item)}
                                            icon={<Eye28Regular />}
                                        >
                                            Ver mas
                                        </Button>
                                        {/* Add evolution */}
                                        <Button
                                            icon={<DocumentAdd28Regular />}
                                            onClick={() => handleAddEvolution(item)}
                                        >
                                            Evolucion
                                        </Button>
                                        <Menu>
                                            <MenuTrigger disableButtonEnhancement>
                                                <MenuButton icon={<ArrowDownload28Regular />}>Exportar</MenuButton>
                                            </MenuTrigger>

                                            <MenuPopover>
                                                <MenuList>
                                                    <MenuItem onClick={() => handleExportPdfSummary(item)}>Resumen</MenuItem>
                                                    <MenuItem onClick={() => handleExportPdfComplete(item)}>Completo</MenuItem>
                                                </MenuList>
                                            </MenuPopover>
                                        </Menu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
