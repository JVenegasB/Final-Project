import { useEffect, useMemo, useState } from "react";
import { TableColumnDefinition,Menu, createTableColumn, useTableFeatures, useTableSort, TableColumnId, Table, TableHeader, TableHeaderCell, TableRow, TableBody, TableCell, TableCellLayout, Button, Avatar, Label, Select, Input, MenuButton, MenuItem, MenuList, MenuPopover, MenuTrigger } from "@fluentui/react-components";
import { PatientSummary } from '../types/types.ts';
import PatientHistory from "./PatientHistory.tsx";
import { ArrowDownload28Regular, DocumentAdd28Regular, Eye28Regular } from '@fluentui/react-icons';
// import { useThemeContext } from "../context/themeContext.ts";

interface Props {
    patientData: PatientSummary[];
    setAddEvolutionComponent: (value: string) => void;
    fatherSetSelectedPatient: (value: PatientSummary | null) => void;
    setExportType: (value: string) => void;
}

const columns: TableColumnDefinition<PatientSummary>[] = [
    createTableColumn<PatientSummary>({
        columnId: 'name',
        compare: (a, b) => a.personalData.name.localeCompare(b.personalData.name),
    }),
    createTableColumn<PatientSummary>({
        columnId: 'identification',
        compare: (a, b) => a.personalData.identification.localeCompare(b.personalData.identification),
    }),
    createTableColumn<PatientSummary>({
        columnId: 'lastSession',
        compare: (a, b) => a.personalData.lastSession.localeCompare(b.personalData.lastSession),
    }),
    createTableColumn<PatientSummary>({
        columnId: 'firstSession',
        compare: (a, b) => a.personalData.firstSession.localeCompare(b.personalData.firstSession),
    }),
];

export default function PatientList({ patientData,setAddEvolutionComponent,fatherSetSelectedPatient,setExportType }: Props) {
    // const { isDarkMode } = useThemeContext();
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
                return patient.personalData.name.toLowerCase().includes(searchElement.toLowerCase());
            } else if (handleFilter === 'personalId') {
                return patient.personalData.identification.toLowerCase().includes(searchElement.toLowerCase());
            } else if (handleFilter === 'firstSession') {
                return patient.personalData.firstSession.split("-")[1].includes(searchElement.split("-")[1]);
            } else if (handleFilter === 'lastSession') {
                return patient.personalData.lastSession.split("-")[1].includes(searchElement.split("-")[1]);
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

    const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const handlePatientSelection = (patient: PatientSummary) => {
        setSelectedPatient(patient);
        setOpenDialog(true);
    }
    const handleAddEvolution = (patient: PatientSummary) => {
        setAddEvolutionComponent("evolution");
        fatherSetSelectedPatient(patient);
    }
    const handleExportPdfSummary = (patient: PatientSummary) => {
        setAddEvolutionComponent("export");
        fatherSetSelectedPatient(patient);
        setExportType("resumen");
    }
    const handleExportPdfComplete = (patient: PatientSummary) => {
        setAddEvolutionComponent("export");
        fatherSetSelectedPatient(patient);
        setExportType("completo");
    }
    return (
        <div className="flex flex-col h-full">
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
            <div className="flex-grow">
                <PatientHistory open={openDialog} setOpen={setOpenDialog} selectedPatient={selectedPatient} />
                <Table sortable className="mt-5 min-w-full overflow-x-auto">
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
                            <TableHeaderCell className="w-60">

                            </TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="font-openSans">
                        {rows.map(({ item }, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <div className="flex items-center justify-center">
                                        <Avatar name={item.personalData.name} />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <TableCellLayout>
                                        {item.personalData.name}
                                    </TableCellLayout>
                                </TableCell>
                                <TableCell>
                                    {item.personalData.identification}
                                </TableCell>
                                <TableCell>
                                    {item.personalData.firstSession}
                                </TableCell>
                                <TableCell>
                                    {item.personalData.lastSession}
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <Button
                                            onClick={() => handlePatientSelection(item)}
                                            icon={<Eye28Regular />}
                                        >
                                            Ver mas
                                        </Button>
                                        <Button
                                            icon={<DocumentAdd28Regular />}
                                            onClick={() => handleAddEvolution(item)}
                                        >
                                            Agregar
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
